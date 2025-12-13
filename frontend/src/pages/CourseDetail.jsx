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
      // Show success message
      setTimeout(() => {
        navigate('/my-courses');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to enroll in course');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600 mb-4"></div>
          <div className="text-xl text-gray-600 font-medium">Loading course...</div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <div className="text-2xl text-red-600 font-bold mb-4">Course not found</div>
          <Link to="/courses" className="text-blue-600 hover:underline">
            ← Back to courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-8">
              <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300">
                SimpleLMS
              </Link>
              <nav className="hidden md:flex items-center gap-6">
                <Link to="/courses" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                  Courses
                </Link>
                {user && user.role === 'student' && (
                  <Link to="/my-courses" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                    My Courses
                  </Link>
                )}
              </nav>
            </div>
            
            {user ? (
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
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
            ) : (
              <Link
                to="/login"
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Course Header with Thumbnail */}
      <div className="relative">
        {/* Thumbnail Background */}
        {course.thumbnail_url ? (
          <div className="relative h-96">
            <img
              src={course.thumbnail_url}
              alt={course.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40"></div>
          </div>
        ) : (
          <div className="h-96 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"></div>
        )}

        {/* Course Info Overlay */}
        <div className="absolute inset-0 text-white">
          <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 h-full flex items-center">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
              {/* Left: Course Info */}
              <div className="lg:col-span-2">
                {course.category && (
                  <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4 border border-white/30">
                    <span className="text-xl">{course.category.icon}</span>
                    <span className="font-medium">{course.category.name}</span>
                  </div>
                )}

                <h1 className="text-5xl font-bold mb-4 leading-tight drop-shadow-lg">
                  {course.title}
                </h1>
                
                <p className="text-xl mb-6 text-gray-100 leading-relaxed drop-shadow">
                  {course.description}
                </p>
                
                <div className="flex flex-wrap items-center gap-6 text-base">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">👨‍🏫</span>
                    <span className="font-medium">{course.instructor.first_name || course.instructor.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">📚</span>
                    <span>{course.total_lessons} lessons</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">👥</span>
                    <span>{course.total_students} students</span>
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-4">
                  <span className="bg-white/90 text-blue-600 px-6 py-2 rounded-full font-bold capitalize text-sm">
                    {course.difficulty}
                  </span>
                  {course.average_rating > 0 && (
                    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
                      <div className="flex text-yellow-300">
                        {'★'.repeat(Math.round(course.average_rating))}
                        {'☆'.repeat(5 - Math.round(course.average_rating))}
                      </div>
                      <span className="font-semibold">
                        {course.average_rating.toFixed(1)} ({course.review_count})
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Right: Enrollment Card */}
              <div className="lg:col-span-1">
                <div className="bg-white text-gray-900 rounded-2xl p-8 shadow-2xl border border-gray-100">
                  <h3 className="text-2xl font-bold mb-4">Ready to start?</h3>
                  
                  {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded mb-4 text-sm flex items-start gap-2">
                      <span>⚠️</span>
                      <span>{error}</span>
                    </div>
                  )}

                  {!user ? (
                    <div>
                      <p className="text-gray-600 mb-4">
                        Please log in to enroll in this course
                      </p>
                      <Link
                        to="/login"
                        className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center px-6 py-4 rounded-xl hover:shadow-lg hover:shadow-blue-500/50 font-semibold transition-all duration-300 hover:scale-105"
                      >
                        Login to Enroll
                      </Link>
                    </div>
                  ) : isEnrolled ? (
                    <div>
                      <div className="bg-green-50 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded mb-4 flex items-center gap-2">
                        <span className="text-xl">✓</span>
                        <span className="font-semibold">You're enrolled!</span>
                      </div>
                      
                      <div className="space-y-3">
                        <Link
                          to="/my-courses"
                          className="block w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white text-center px-6 py-4 rounded-xl hover:shadow-lg hover:shadow-green-500/50 font-semibold transition-all duration-300 hover:scale-105"
                        >
                          Go to My Courses
                        </Link>
                        
                        <Link
                          to={`/courses/${id}/discussions`}
                          className="block w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-center px-6 py-4 rounded-xl hover:shadow-lg hover:shadow-purple-500/50 font-semibold transition-all duration-300 hover:scale-105"
                        >
                          💬 Course Discussions
                        </Link>

                        {user.role === 'student' && (
                          <Link
                            to={`/courses/${id}/review`}
                            className="block w-full bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-center px-6 py-4 rounded-xl hover:shadow-lg hover:shadow-yellow-500/50 font-semibold transition-all duration-300 hover:scale-105"
                          >
                            ⭐ Write a Review
                          </Link>
                        )}
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={handleEnroll}
                      disabled={enrolling}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 rounded-xl hover:shadow-lg hover:shadow-blue-500/50 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105"
                    >
                      {enrolling ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="animate-spin">⟳</span>
                          Enrolling...
                        </span>
                      ) : (
                        'Enroll Now - Free'
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Quick Actions for Enrolled Students */}
        {isEnrolled && user && (
          <div className="mb-8 flex flex-wrap gap-4">
            <Link
              to={`/courses/${id}/discussions`}
              className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-purple-500/50"
            >
              💬 Discussions
            </Link>
            {user.role === 'student' && (
              <Link
                to={`/courses/${id}/review`}
                className="px-6 py-3 bg-yellow-500 text-white rounded-xl hover:bg-yellow-600 font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-yellow-500/50"
              >
                ⭐ Write Review
              </Link>
            )}
          </div>
        )}

        {/* Course Lessons */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">Course Content</h2>

          {course.lessons && course.lessons.length > 0 ? (
            <div className="space-y-3">
              {course.lessons.map((lesson, index) => (
                <div
                  key={lesson.id}
                  className="border-2 border-gray-100 rounded-xl p-5 hover:border-blue-400 hover:shadow-md transition-all duration-300 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <span className="bg-gradient-to-br from-blue-500 to-purple-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 group-hover:scale-110 transition-transform duration-300">
                        {index + 1}
                      </span>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">
                          {lesson.title}
                        </h3>
                        {lesson.description && (
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {lesson.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600 shrink-0">
                      <span className="text-2xl">{lesson.lesson_type === 'video' ? '🎥' : '📝'}</span>
                      <span className="font-medium">{lesson.duration} min</span>
                      {lesson.is_free_preview && (
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                          Free Preview
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <div className="text-6xl mb-4">📚</div>
              <p className="text-lg">No lessons available yet.</p>
              <p className="text-sm mt-2">Check back soon for course content!</p>
            </div>
          )}
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Student Reviews</h2>
            {course.average_rating > 0 && (
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-4xl font-bold text-gray-900">
                    {course.average_rating.toFixed(1)}
                  </div>
                  <div className="flex text-yellow-400 text-xl justify-end">
                    {'★'.repeat(Math.round(course.average_rating))}
                    {'☆'.repeat(5 - Math.round(course.average_rating))}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Based on {course.review_count} review{course.review_count !== 1 ? 's' : ''}
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
                        className="w-14 h-14 rounded-full object-cover border-2 border-gray-200"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-2xl font-bold text-white">
                        {review.student_name.charAt(0).toUpperCase()}
                      </div>
                    )}

                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div className="font-bold text-gray-900 text-lg">
                            {review.student_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(review.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </div>
                        </div>
                        <div className="flex text-yellow-400 text-xl">
                          {'★'.repeat(review.rating)}
                          {'☆'.repeat(5 - review.rating)}
                        </div>
                      </div>

                      {review.review_text && (
                        <p className="text-gray-700 leading-relaxed mt-3 bg-gray-50 p-4 rounded-lg">
                          {review.review_text}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <div className="text-6xl mb-4">⭐</div>
              <p className="text-lg font-medium mb-2">No reviews yet</p>
              <p className="text-sm">Be the first to review this course!</p>
            </div>
          )}
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

export default CourseDetail;