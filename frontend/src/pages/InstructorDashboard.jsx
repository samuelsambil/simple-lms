import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const InstructorDashboard = () => {
  const { user, logout } = useAuth();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);

  // Mock instructor courses - Replace with API call
  const instructorCourses = [
    {
      id: 1,
      title: 'Complete Web Development Bootcamp',
      image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop',
      students: 12500,
      rating: 4.8,
      reviews: 2300,
      revenue: 612500,
      status: 'published',
      lastUpdated: '2 days ago'
    },
    {
      id: 2,
      title: 'Advanced React Patterns',
      image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=600&fit=crop',
      students: 8400,
      rating: 4.9,
      reviews: 1560,
      revenue: 420000,
      status: 'published',
      lastUpdated: '1 week ago'
    },
    {
      id: 3,
      title: 'JavaScript ES6+ Essentials',
      image: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800&h=600&fit=crop',
      students: 6200,
      rating: 4.7,
      reviews: 980,
      revenue: 310000,
      status: 'published',
      lastUpdated: '3 weeks ago'
    },
    {
      id: 4,
      title: 'Node.js Backend Development',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop',
      students: 0,
      rating: 0,
      reviews: 0,
      revenue: 0,
      status: 'draft',
      lastUpdated: '1 month ago'
    },
  ];

  // Calculate stats
  const stats = {
    totalCourses: instructorCourses.length,
    totalStudents: instructorCourses.reduce((sum, course) => sum + course.students, 0),
    totalRevenue: instructorCourses.reduce((sum, course) => sum + course.revenue, 0),
    avgRating: (instructorCourses.reduce((sum, course) => sum + course.rating, 0) / instructorCourses.filter(c => c.rating > 0).length).toFixed(1),
  };

  const handleDeleteClick = (course) => {
    setCourseToDelete(course);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    // Mock delete - Replace with API call
    console.log('Deleting course:', courseToDelete.id);
    setShowDeleteModal(false);
    setCourseToDelete(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Academe
              </span>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              <Link to="/courses" className="text-gray-700 hover:text-indigo-600 font-medium transition">
                Browse Courses
              </Link>
              <Link to="/instructor/dashboard" className="text-indigo-600 font-medium">
                Dashboard
              </Link>
              <Link to="/profile" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user?.first_name?.[0] || 'U'}
                  </span>
                </div>
                <span className="text-gray-700">{user?.first_name}</span>
              </Link>
              <button onClick={logout} className="text-gray-600 hover:text-gray-900 font-medium">
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Page Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2">Instructor Dashboard</h1>
              <p className="text-indigo-100 text-lg">Manage your courses and track your success</p>
            </div>
            <Link
              to="/instructor/create-course"
              className="hidden md:flex items-center bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition shadow-lg"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create New Course
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Total Courses</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalCourses}</p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Total Students</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalStudents.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900">${(stats.totalRevenue / 1000).toFixed(0)}k</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Avg Rating</p>
                <p className="text-3xl font-bold text-gray-900">{stats.avgRating}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Create Course Button */}
      <div className="md:hidden max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <Link
          to="/instructor/create-course"
          className="flex items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create New Course
        </Link>
      </div>

      {/* Courses List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">My Courses</h2>
          </div>

          {instructorCourses.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {instructorCourses.map((course) => (
                <div key={course.id} className="p-6 hover:bg-gray-50 transition">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Course Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-full md:w-48 h-32 object-cover rounded-lg"
                      />
                    </div>

                    {/* Course Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 mb-1">{course.title}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              course.status === 'published' 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                              {course.status === 'published' ? '✓ Published' : 'Draft'}
                            </span>
                            <span>Updated {course.lastUpdated}</span>
                          </div>
                        </div>
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Students</p>
                          <p className="text-lg font-semibold text-gray-900">{course.students.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Rating</p>
                          <p className="text-lg font-semibold text-gray-900">
                            {course.rating > 0 ? (
                              <span className="flex items-center">
                                {course.rating}
                                <svg className="w-4 h-4 text-yellow-400 ml-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              </span>
                            ) : '-'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Reviews</p>
                          <p className="text-lg font-semibold text-gray-900">{course.reviews.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Revenue</p>
                          <p className="text-lg font-semibold text-gray-900">${(course.revenue / 1000).toFixed(0)}k</p>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2 md:flex-shrink-0">
                      <Link
                        to={`/instructor/courses/${course.id}/analytics`}
                        className="px-4 py-2 bg-indigo-600 text-white text-center rounded-lg hover:bg-indigo-700 transition text-sm font-medium"
                      >
                        Analytics
                      </Link>
                      <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-medium">
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(course)}
                        className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses yet</h3>
              <p className="text-gray-600 mb-6">Create your first course and start teaching</p>
              <Link
                to="/instructor/create-course"
                className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition"
              >
                Create Your First Course
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && courseToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Delete Course?</h3>
              <p className="text-gray-600">
                Are you sure you want to delete "{courseToDelete.title}"? This action cannot be undone.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorDashboard;