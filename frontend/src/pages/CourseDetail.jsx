import { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';

function CourseDetail() {
  const { id } = useParams();
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCourse();
    if (user) {
      checkEnrollment();
    }
  }, [id, user]);

  const fetchCourse = async () => {
    try {
      const response = await api.get(`/courses/${id}/`);
      setCourse(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load course');
      setLoading(false);
    }
  };

  const checkEnrollment = async () => {
    try {
      const response = await api.get('/enrollments/');
      const enrolled = response.data.some(
        (enrollment) => enrollment.course.id === parseInt(id)
      );
      setIsEnrolled(enrolled);
    } catch (err) {
      console.error('Failed to check enrollment:', err);
    }
  };

  const handleEnroll = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (user.role !== 'student') {
      setError('Only students can enroll in courses');
      return;
    }

    setEnrolling(true);
    setError('');

    try {
      await api.post('/enrollments/', { course: parseInt(id) });
      setIsEnrolled(true);
      alert('Successfully enrolled in course!');
      navigate('/my-courses');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to enroll in course');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading course...</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-red-600">Course not found</div>
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
              <Link to="/courses" className="text-gray-600 hover:text-gray-900">
                Courses
              </Link>
            </div>
            
            {/* Write Review Button - Add this */}
              {isEnrolled && user && user.role === 'student' && (
                <div className="mb-4">
                  <Link
                    to={`/courses/${id}/review`}
                    className="block w-full bg-yellow-500 text-white text-center px-6 py-3 rounded-lg hover:bg-yellow-600 font-medium"
                  >
                    ⭐ Write a Review
                  </Link>
                </div>
              )}

              {!user ? (
              <div className="flex items-center gap-4">
                <span className="text-gray-700">
                  {user.first_name || user.email}
                </span>
                <button
                  onClick={logout}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Course Header */}
      <div className="relative">
        {/* Thumbnail Background */}
        {course.thumbnail_url ? (
          <div className="relative h-96">
            <img
              src={course.thumbnail_url}
              alt={course.title}
              className="w-full h-full object-cover"
            />
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-black bg-opacity-60"></div>
          </div>
        ) : (
          <div className="h-96 bg-gradient-to-r from-blue-600 to-purple-600"></div>
        )}

        {/* Course Info Overlay */}
        <div className="absolute inset-0 text-white">
          <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 h-full flex items-center">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
              <div>
                <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
                <p className="text-xl mb-6">{course.description}</p>
                
                <div className="flex items-center gap-6 text-sm">
                  <span>
                    👨‍🏫 {course.instructor.first_name || course.instructor.email}
                  </span>
                  <span>📚 {course.total_lessons} lessons</span>
                  <span>👥 {course.total_students} students</span>
                </div>

                <div className="mt-6">
                  <span className="bg-white text-blue-600 px-4 py-2 rounded-full font-medium">
                    {course.difficulty}
                  </span>
                </div>
              </div>

              <div className="bg-white text-gray-900 rounded-lg p-6">
                <h3 className="text-2xl font-bold mb-4">Ready to start learning?</h3>
                
                {error && (
                  <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
                    {error}
                  </div>
                )}

                {/* Write Review Button */}
                {isEnrolled && user && user.role === 'student' && (
                  <div className="mb-4">
                    <Link
                      to={`/courses/${id}/review`}
                      className="block w-full bg-yellow-500 text-white text-center px-6 py-3 rounded-lg hover:bg-yellow-600 font-medium"
                    >
                      ⭐ Write a Review
                    </Link>
                  </div>
                )}

                {!user ? (
                  <div>
                    <p className="text-gray-600 mb-4">
                      Please log in to enroll in this course
                    </p>
                    <Link
                      to="/login"
                      className="block w-full bg-blue-600 text-white text-center px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
                    >
                      Login to Enroll
                    </Link>
                  </div>
                ) : isEnrolled ? (
                  <div>
                    <p className="text-green-600 mb-4 font-medium">
                      ✓ You are enrolled in this course
                    </p>
                    <Link
                      to="/my-courses"
                      className="block w-full bg-green-600 text-white text-center px-6 py-3 rounded-lg hover:bg-green-700 font-medium"
                    >
                      Go to My Courses
                    </Link>
                  </div>
                ) : (
                  <button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
                  >
                    {enrolling ? 'Enrolling...' : 'Enroll Now'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

            {/* Course Content */}
      <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold mb-6">Course Content</h2>

          {course.lessons && course.lessons.length > 0 ? (
            <div className="space-y-4">
              {course.lessons.map((lesson, index) => (
                <div
                  key={lesson.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center font-medium">
                        {index + 1}
                      </span>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {lesson.title}
                        </h3>
                        {lesson.description && (
                          <p className="text-sm text-gray-600 mt-1">
                            {lesson.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>{lesson.lesson_type === 'video' ? '🎥' : '📝'}</span>
                      <span>{lesson.duration} min</span>
                      {lesson.is_free_preview && (
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                          Free Preview
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No lessons available yet.</p>
          )}
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-lg shadow p-8 mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Student Reviews</h2>
            {course.average_rating > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold text-yellow-500">
                  {course.average_rating}
                </span>
                <div>
                  <div className="flex text-yellow-400">
                    {'★'.repeat(Math.round(course.average_rating))}
                    {'☆'.repeat(5 - Math.round(course.average_rating))}
                  </div>
                  <div className="text-sm text-gray-600">
                    {course.review_count} review{course.review_count !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>
            )}
          </div>

          {course.reviews && course.reviews.length > 0 ? (
            <div className="space-y-6">
              {course.reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0">
                  <div className="flex items-start gap-4">
                    {review.student_avatar ? (
                      <img
                        src={review.student_avatar}
                        alt={review.student_name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-xl font-bold text-gray-600">
                        {review.student_name.charAt(0).toUpperCase()}
                      </div>
                    )}

                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div className="font-medium text-gray-900">
                            {review.student_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(review.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex text-yellow-400 text-lg">
                          {'★'.repeat(review.rating)}
                          {'☆'.repeat(5 - review.rating)}
                        </div>
                      </div>

                      {review.review_text && (
                        <p className="text-gray-700">{review.review_text}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-8">
              No reviews yet. Be the first to review this course!
            </p>
          )}
        </div>
      </main>
    </div>
  );
}

export default CourseDetail;