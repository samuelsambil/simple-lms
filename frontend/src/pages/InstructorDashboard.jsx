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
      // Get all courses and filter by instructor
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading dashboard...</div>
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
              <Link to="/instructor/dashboard" className="text-blue-600 font-medium">
                My Courses
              </Link>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-gray-700">
                {user.first_name || user.email}
              </span>
              <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded text-sm">
                Instructor
              </span>
              <button
                onClick={logout}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Instructor Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Manage your courses and track student progress
            </p>
          </div>
          
          <Link
            to="/instructor/create-course"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
          >
            + Create New Course
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {courses.length}
            </div>
            <div className="text-gray-600">Total Courses</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {courses.reduce((sum, course) => sum + course.total_students, 0)}
            </div>
            <div className="text-gray-600">Total Students</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {courses.reduce((sum, course) => sum + course.total_lessons, 0)}
            </div>
            <div className="text-gray-600">Total Lessons</div>
          </div>
        </div>

        {/* Courses List */}
        {courses.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-600 text-lg mb-6">
              You haven't created any courses yet.
            </p>
            <Link
              to="/instructor/create-course"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Create Your First Course
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Your Courses</h2>
            </div>
            
            <div className="divide-y divide-gray-200">
              {courses.map((course) => (
                <div key={course.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {course.title}
                      </h3>
                      <p className="text-gray-600 mb-3 line-clamp-2">
                        {course.description}
                      </p>
                      <div className="flex items-center gap-6 text-sm">
                        <span className="text-gray-600">
                          📚 {course.total_lessons} lessons
                        </span>
                        <span className="text-gray-600">
                          👥 {course.total_students} students
                        </span>
                        <span className={`px-2 py-1 rounded ${
                          course.status === 'published' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {course.status}
                        </span>
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {course.difficulty}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Link
                        to={`/courses/${course.id}`}
                        className="text-blue-600 hover:text-blue-700 px-4 py-2 border border-blue-600 rounded hover:bg-blue-50"
                      >
                        View
                      </Link>
                      <Link
                        to={`/instructor/courses/${course.id}/analytics`}
                        className="text-green-600 hover:text-green-700 px-4 py-2 border border-green-600 rounded hover:bg-green-50"
                      >
                        Analytics
                      </Link>
                      
                      <a
                        href={`http://127.0.0.1:8000/admin/courses/course/${course.id}/change/`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-600 hover:text-purple-700 px-4 py-2 border border-purple-600 rounded hover:bg-purple-50"
                      >
                        Edit in Admin
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default InstructorDashboard;