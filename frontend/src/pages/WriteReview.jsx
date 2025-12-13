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
  const [success, setSuccess] = useState(false);

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

      setSuccess(true);
      setTimeout(() => {
        navigate(`/courses/${courseId}`);
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit review');
      setLoading(false);
    }
  };

  const getRatingLabel = (stars) => {
    const labels = {
      1: '1 star - Poor',
      2: '2 stars - Fair',
      3: '3 stars - Good',
      4: '4 stars - Very Good',
      5: '5 stars - Excellent!'
    };
    return labels[stars] || '';
  };

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-600 mb-4"></div>
          <div className="text-xl text-gray-600 font-medium">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-yellow-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-6">
              <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300">
                SimpleLMS
              </Link>
              <Link 
                to={`/courses/${courseId}`} 
                className="flex items-center gap-2 text-gray-600 hover:text-yellow-600 transition-colors font-medium"
              >
                <span>←</span>
                <span>Back to Course</span>
              </Link>
            </div>
            
            {user && (
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-white font-bold">
                    {(user.first_name || user.email).charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-gray-900">
                      {user.first_name || user.email}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-medium hover:shadow-lg hover:shadow-red-500/50 transition-all duration-300 hover:scale-105"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-2xl p-10 border border-yellow-100">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">⭐</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Write a Review
            </h1>
            <p className="text-lg text-gray-600">
              Share your experience with <span className="font-semibold text-gray-900">{course.title}</span>
            </p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border-l-4 border-green-500 text-green-700 px-6 py-4 rounded-lg mb-6 flex items-center gap-3 animate-pulse">
              <span className="text-3xl">🎉</span>
              <div>
                <p className="font-bold">Review submitted successfully!</p>
                <p className="text-sm">Redirecting you back to the course...</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg mb-6 flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <span className="font-medium">{error}</span>
            </div>
          )}

          <div className="space-y-8">
            {/* Star Rating */}
            <div>
              <label className="block text-lg font-bold text-gray-900 mb-4">
                Your Rating *
              </label>
              <div className="flex flex-col items-center gap-4 p-8 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl border-2 border-yellow-200">
                <div className="flex items-center gap-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      disabled={loading || success}
                      className="text-6xl focus:outline-none transition-all duration-200 hover:scale-125 disabled:cursor-not-allowed"
                    >
                      <span
                        className={
                          star <= (hoverRating || rating)
                            ? 'text-yellow-400 drop-shadow-lg'
                            : 'text-gray-300'
                        }
                      >
                        ★
                      </span>
                    </button>
                  ))}
                </div>
                {(rating > 0 || hoverRating > 0) && (
                  <p className="text-lg font-semibold text-gray-700">
                    {getRatingLabel(hoverRating || rating)}
                  </p>
                )}
              </div>
            </div>

            {/* Review Text */}
            <div>
              <label htmlFor="review" className="block text-lg font-bold text-gray-900 mb-3">
                Your Review (Optional)
              </label>
              <textarea
                id="review"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                disabled={loading || success}
                rows="8"
                placeholder="Share your thoughts about this course... What did you like? What could be improved? How has it helped you?"
                className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all duration-300 text-gray-900 disabled:bg-gray-50 disabled:cursor-not-allowed"
              ></textarea>
              <p className="text-sm text-gray-500 mt-2 flex items-start gap-2">
                <span>💡</span>
                <span>Your honest feedback helps other students make informed decisions</span>
              </p>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                onClick={handleSubmit}
                disabled={loading || rating === 0 || success}
                className="flex-1 px-8 py-4 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin">⟳</span>
                    Submitting...
                  </span>
                ) : success ? (
                  <span className="flex items-center justify-center gap-2">
                    <span>✓</span>
                    Submitted!
                  </span>
                ) : (
                  'Submit Review'
                )}
              </button>
              
              <Link
                to={`/courses/${courseId}`}
                className="px-8 py-4 border-2 border-gray-300 rounded-xl hover:bg-gray-50 font-semibold text-center transition-all duration-300 hover:scale-105 flex items-center justify-center"
              >
                Cancel
              </Link>
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-8 bg-blue-50 rounded-2xl p-6 border border-blue-200">
          <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span className="text-2xl">📝</span>
            <span>Tips for writing a great review:</span>
          </h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-green-500 font-bold mt-1">✓</span>
              <span>Be specific about what you liked or didn't like</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 font-bold mt-1">✓</span>
              <span>Mention how the course helped you achieve your goals</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 font-bold mt-1">✓</span>
              <span>Share any suggestions for improvement</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 font-bold mt-1">✓</span>
              <span>Be honest and constructive in your feedback</span>
            </li>
          </ul>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 py-8 border-t border-gray-200 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-600 text-sm">
          <p>© 2024 SimpleLMS. Empowering learners worldwide 🌍</p>
        </div>
      </footer>
    </div>
  );
}

export default WriteReview;