import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';

function InstructorDashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (user.role !== 'instructor') {
      navigate('/');
      return;
    }

    fetchMyCourses();
  }, [user, navigate]);

  const fetchMyCourses = async () => {
    try {
      const response = await api.get('/courses/');
      const myCourses = response.data.filter(
        (course) => course.instructor.id === user.id
      );
      setCourses(myCourses);
      setLoading(false);
    } catch (err) {
      setError('Failed to load your courses');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
          <div className="text-xl text-gray-600 font-medium">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-8">
              <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300">
                SimpleLMS
              </Link>
              <nav className="hidden md:flex items-center gap-6">
                <Link to="/instructor/dashboard" className="text-indigo-600 font-semibold border-b-2 border-indigo-600 pb-1">
                  Dashboard
                </Link>
                <Link to="/courses" className="text-gray-600 hover:text-indigo-600 transition-colors font-medium">
                  Browse Courses
                </Link>
              </nav>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
                  {(user.first_name || user.email).charAt(0).toUpperCase()}
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-900">
                    {user.first_name || user.email}
                  </p>
                  <p className="text-xs bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-bold">
                    Instructor
                  </p>
                </div>
              </div>
              <button
                onClick={logout}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-medium hover:shadow-lg hover:shadow-red-500/50 transition-all duration-300 hover:scale-105"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-10 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-5xl">👨‍🏫</span>
              <h1 className="text-4xl font-bold text-gray-900">
                Instructor Dashboard
              </h1>
            </div>
            <p className="text-lg text-gray-600">
              Manage your courses and track student progress
            </p>
          </div>
          
          <Link
            to="/instructor/create-course"
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2 whitespace-nowrap"
          >
            <span className="text-2xl">+</span>
            <span>Create New Course</span>
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg mb-8 flex items-center gap-3">
            <span className="text-2xl">⚠️</span>
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-2xl shadow-md p-8 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-2">
                  Total Courses
                </div>
                <div className="text-4xl font-bold text-indigo-600">
                  {courses.length}
                </div>
              </div>
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center text-4xl">
                📚
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-8 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-2">
                  Total Students
                </div>
                <div className="text-4xl font-bold text-green-600">
                  {courses.reduce((sum, course) => sum + course.total_students, 0)}
                </div>
              </div>
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center text-4xl">
                👥
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-8 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-2">
                  Total Lessons
                </div>
                <div className="text-4xl font-bold text-purple-600">
                  {courses.reduce((sum, course) => sum + course.total_lessons, 0)}
                </div>
              </div>
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center text-4xl">
                🎓
              </div>
            </div>
          </div>
        </div>

        {/* Courses List */}
        {courses.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-16 text-center">
            <div className="text-7xl mb-6">📝</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              No courses yet
            </h3>
            <p className="text-gray-600 text-lg mb-8">
              Start creating courses and share your knowledge with students worldwide
            </p>
            <Link
              to="/instructor/create-course"
              className="inline-block px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Create Your First Course
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-indigo-100">
            <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <span>📚</span>
                <span>Your Courses</span>
              </h2>
            </div>
            
            <div className="divide-y divide-gray-200">
              {courses.map((course) => (
                <div key={course.id} className="p-8 hover:bg-gray-50 transition-colors duration-300">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                    {/* Course Thumbnail */}
                    <div className="flex-shrink-0">
                      {course.thumbnail_url ? (
                        <img
                          src={course.thumbnail_url}
                          alt={course.title}
                          className="w-32 h-32 rounded-xl object-cover shadow-lg"
                        />
                      ) : (
                        <div className="w-32 h-32 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-5xl font-bold shadow-lg">
                          {course.title.charAt(0)}
                        </div>
                      )}
                    </div>

                    {/* Course Info */}
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {course.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                        {course.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        <span className="flex items-center gap-1 text-gray-600">
                          <span>📚</span>
                          <span className="font-medium">{course.total_lessons} lessons</span>
                        </span>
                        <span className="flex items-center gap-1 text-gray-600">
                          <span>👥</span>
                          <span className="font-medium">{course.total_students} students</span>
                        </span>
                        <span className={`px-3 py-1 rounded-full font-semibold text-xs ${
                          course.status === 'published' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {course.status === 'published' ? '✅ Published' : '📝 Draft'}
                        </span>
                        <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full font-semibold text-xs capitalize">
                          {course.difficulty}
                        </span>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                      <Link
                        to={`/courses/${course.id}`}
                        className="px-6 py-3 text-center rounded-xl text-indigo-600 font-semibold border-2 border-indigo-600 hover:bg-indigo-50 transition-all duration-300 hover:scale-105"
                      >
                        View
                      </Link>
                      <Link
                        to={`/instructor/courses/${course.id}/analytics`}
                        className="px-6 py-3 text-center rounded-xl text-green-600 font-semibold border-2 border-green-600 hover:bg-green-50 transition-all duration-300 hover:scale-105"
                      >
                        Analytics
                      </Link>
                      
                      <a
                        href={`http://127.0.0.1:8000/admin/courses/course/${course.id}/change/`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3 text-center rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105"
                      >
                        Edit
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-20 py-8 border-t border-gray-200 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-600 text-sm">
          <p>© 2024 SimpleLMS. Empowering educators worldwide 👨‍🏫</p>
        </div>
      </footer>
    </div>
  );
}

export default InstructorDashboard;