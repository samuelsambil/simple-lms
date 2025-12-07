import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';

function WriteReview() {
  const { courseId } = useParams();
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    fetchCourse();
  }, [courseId, user, navigate]);

  const fetchCourse = async () => {
    try {
      const response = await api.get(`/courses/${courseId}/`);
      setCourse(response.data);
    } catch (err) {
      setError('Failed to load course');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await api.post('/reviews/', {
        course: parseInt(courseId),
        rating,
        review_text: reviewText,
      });

      alert('Review submitted successfully! 🎉');
      navigate(`/courses/${courseId}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit review');
      setLoading(false);
    }
  };

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-6">
              <Link to="/" className="text-2xl font-bold text-gray-900">
                Simple LMS
              </Link>
              <Link to={`/courses/${courseId}`} className="text-gray-600 hover:text-gray-900">
                ← Back to Course
              </Link>
            </div>
            
            {user && (
              <div className="flex items-center gap-4">
                <Link to="/profile" className="text-gray-700 hover:text-gray-900">
                  {user.first_name || user.email}
                </Link>
                <button
                  onClick={logout}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Write a Review
          </h1>
          <p className="text-gray-600 mb-6">
            Share your experience with <strong>{course.title}</strong>
          </p>

          {error && (
            <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Star Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Your Rating *
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="text-5xl focus:outline-none transition-transform hover:scale-110"
                  >
                    <span
                      className={
                        star <= (hoverRating || rating)
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }
                    >
                      ★
                    </span>
                  </button>
                ))}
                {rating > 0 && (
                  <span className="ml-4 text-gray-600">
                    {rating === 1 && '1 star - Poor'}
                    {rating === 2 && '2 stars - Fair'}
                    {rating === 3 && '3 stars - Good'}
                    {rating === 4 && '4 stars - Very Good'}
                    {rating === 5 && '5 stars - Excellent'}
                  </span>
                )}
              </div>
            </div>

            {/* Review Text */}
            <div>
              <label htmlFor="review" className="block text-sm font-medium text-gray-700 mb-2">
                Your Review (Optional)
              </label>
              <textarea
                id="review"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                rows="6"
                placeholder="What did you think of this course? How did it help you?"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              ></textarea>
              <p className="text-sm text-gray-500 mt-1">
                Share your honest feedback to help other students
              </p>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading || rating === 0}
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Submit Review'}
              </button>
              
              <Link
                to={`/courses/${courseId}`}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-center"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default WriteReview;