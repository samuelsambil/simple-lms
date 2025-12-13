import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';

function MyCourses() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (user.role !== 'student') {
      navigate('/');
      return;
    }

    fetchEnrollments();
  }, [user, navigate]);

  const fetchEnrollments = async () => {
    try {
      const response = await api.get('/enrollments/');
      setEnrollments(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load your courses');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-600 mb-4"></div>
          <div className="text-xl text-gray-600 font-medium">Loading your courses...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-8">
              <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300">
                SimpleLMS
              </Link>
              <nav className="hidden md:flex items-center gap-6">
                <Link to="/courses" className="text-gray-600 hover:text-green-600 transition-colors font-medium">
                  Browse Courses
                </Link>
                <Link to="/my-courses" className="text-green-600 font-semibold border-b-2 border-green-600 pb-1">
                  My Courses
                </Link>
              </nav>
            </div>
            
            {user && (
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white font-bold">
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
      <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl">🎯</span>
            <h1 className="text-4xl font-bold text-gray-900">
              My Learning Journey
            </h1>
          </div>
          <p className="text-lg text-gray-600">
            {enrollments.length > 0 
              ? `You're enrolled in ${enrollments.length} course${enrollments.length !== 1 ? 's' : ''}`
              : 'Start your learning journey today'
            }
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg mb-8 flex items-center gap-3">
            <span className="text-2xl">⚠️</span>
            <span className="font-medium">{error}</span>
          </div>
        )}

        {enrollments.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-16 text-center">
            <div className="text-7xl mb-6">📚</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              No courses yet
            </h3>
            <p className="text-gray-600 text-lg mb-8">
              You haven't enrolled in any courses yet. Start learning something new today!
            </p>
            <Link
              to="/courses"
              className="inline-block px-8 py-4 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold shadow-lg shadow-green-500/50 hover:shadow-xl hover:shadow-green-500/60 transition-all duration-300 hover:scale-105"
            >
              Browse Courses
            </Link>
          </div>
        ) : (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-1">
                      Total Courses
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {enrollments.length}
                    </p>
                  </div>
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-3xl">
                    📚
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-1">
                      Completed
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {enrollments.filter(e => e.completed).length}
                    </p>
                  </div>
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center text-3xl">
                    ✓
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-1">
                      In Progress
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {enrollments.filter(e => !e.completed && e.progress_percentage > 0).length}
                    </p>
                  </div>
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-yellow-100 to-yellow-200 flex items-center justify-center text-3xl">
                    ⏳
                  </div>
                </div>
              </div>
            </div>

            {/* Courses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {enrollments.map((enrollment) => (
                <div
                  key={enrollment.id}
                  className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:-translate-y-2"
                >
                  {/* Course Thumbnail */}
                  {enrollment.course.thumbnail_url ? (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={enrollment.course.thumbnail_url}
                        alt={enrollment.course.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center relative overflow-hidden">
                      <span className="text-white text-5xl font-bold group-hover:scale-125 transition-transform duration-300">
                        {enrollment.course.title.charAt(0)}
                      </span>
                    </div>
                  )}

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors line-clamp-2">
                      {enrollment.course.title}
                    </h3>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span className="font-medium">Progress</span>
                        <span className="font-bold text-green-600">
                          {Math.round(enrollment.progress_percentage)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-500 relative overflow-hidden"
                          style={{ width: `${enrollment.progress_percentage}%` }}
                        >
                          <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                        </div>
                      </div>
                    </div>

                    {/* Completion Badge */}
                    {enrollment.completed && (
                      <div className="bg-gradient-to-r from-green-100 to-emerald-100 border border-green-300 text-green-800 px-4 py-2 rounded-lg mb-4 text-sm font-semibold flex items-center gap-2">
                        <span className="text-lg">🎉</span>
                        <span>Completed!</span>
                      </div>
                    )}

                    {/* Enrollment Date */}
                    <div className="text-sm text-gray-600 mb-4 flex items-center gap-2">
                      <span>📅</span>
                      <span>
                        Enrolled {new Date(enrollment.enrolled_date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>

                    {/* Action Button */}
                    <Link
                      to={`/learn/${enrollment.course.id}`}
                      className="block w-full text-center px-6 py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    >
                      {enrollment.progress_percentage === 0 
                        ? '🚀 Start Learning' 
                        : enrollment.completed 
                          ? '📖 Review Course'
                          : '▶️ Continue Learning'
                      }
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Browse More CTA */}
            <div className="mt-12 text-center">
              <Link
                to="/courses"
                className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold text-lg transition-colors"
              >
                <span>Explore More Courses</span>
                <span>→</span>
              </Link>
            </div>
          </>
        )}
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

export default MyCourses;