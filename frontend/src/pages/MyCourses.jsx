import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const MyCourses = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all'); // all, in-progress, completed

  // Mock enrolled courses - Replace with API call
  const enrolledCourses = [
    {
      id: 1,
      title: 'Complete Web Development Bootcamp',
      instructor: 'Sarah Johnson',
      image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop',
      progress: 45,
      lastAccessed: '2 hours ago',
      totalLessons: 85,
      completedLessons: 38,
      status: 'in-progress',
      category: 'Web Development'
    },
    {
      id: 2,
      title: 'UI/UX Design Masterclass',
      instructor: 'Emily Rodriguez',
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop',
      progress: 100,
      lastAccessed: '1 week ago',
      totalLessons: 45,
      completedLessons: 45,
      status: 'completed',
      category: 'Design',
      certificate: true
    },
    {
      id: 3,
      title: 'Machine Learning A-Z',
      instructor: 'Dr. Michael Chen',
      image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=600&fit=crop',
      progress: 12,
      lastAccessed: '3 days ago',
      totalLessons: 120,
      completedLessons: 14,
      status: 'in-progress',
      category: 'Data Science'
    },
    {
      id: 4,
      title: 'Python for Data Science',
      instructor: 'Lisa Anderson',
      image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=600&fit=crop',
      progress: 78,
      lastAccessed: 'Yesterday',
      totalLessons: 95,
      completedLessons: 74,
      status: 'in-progress',
      category: 'Data Science'
    },
  ];

  // Filter courses based on active tab
  const filteredCourses = enrolledCourses.filter(course => {
    if (activeTab === 'all') return true;
    if (activeTab === 'in-progress') return course.status === 'in-progress';
    if (activeTab === 'completed') return course.status === 'completed';
    return true;
  });

  // Calculate stats
  const stats = {
    totalCourses: enrolledCourses.length,
    inProgress: enrolledCourses.filter(c => c.status === 'in-progress').length,
    completed: enrolledCourses.filter(c => c.status === 'completed').length,
    certificates: enrolledCourses.filter(c => c.certificate).length,
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
              <Link to="/my-courses" className="text-indigo-600 font-medium">
                My Courses
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
          <h1 className="text-4xl font-bold mb-2">My Learning</h1>
          <p className="text-indigo-100 text-lg">Track your progress and continue your learning journey</p>
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
                <p className="text-gray-600 text-sm font-medium mb-1">In Progress</p>
                <p className="text-3xl font-bold text-gray-900">{stats.inProgress}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Completed</p>
                <p className="text-3xl font-bold text-gray-900">{stats.completed}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Certificates</p>
                <p className="text-3xl font-bold text-gray-900">{stats.certificates}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('all')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition ${
                  activeTab === 'all'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                All Courses ({enrolledCourses.length})
              </button>
              <button
                onClick={() => setActiveTab('in-progress')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition ${
                  activeTab === 'in-progress'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                In Progress ({stats.inProgress})
              </button>
              <button
                onClick={() => setActiveTab('completed')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition ${
                  activeTab === 'completed'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Completed ({stats.completed})
              </button>
            </nav>
          </div>
        </div>

        {/* Courses Grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <div key={course.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-48 object-cover"
                  />
                  {course.status === 'completed' && (
                    <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Completed
                    </div>
                  )}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-700">
                    {course.category}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">By {course.instructor}</p>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-semibold text-gray-900">{course.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          course.progress === 100
                            ? 'bg-green-500'
                            : 'bg-gradient-to-r from-indigo-600 to-purple-600'
                        }`}
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      {course.completedLessons} of {course.totalLessons} lessons completed
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4 pb-4 border-b border-gray-100">
                    <span>Last accessed {course.lastAccessed}</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    {course.status === 'completed' ? (
                      <>
                        <Link
                          to={`/learn/${course.id}`}
                          className="flex-1 bg-gray-100 text-gray-700 text-center py-2 rounded-lg font-medium hover:bg-gray-200 transition"
                        >
                          Review
                        </Link>
                        {course.certificate && (
                          <button className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-center py-2 rounded-lg font-medium hover:from-yellow-600 hover:to-orange-600 transition">
                            Certificate
                          </button>
                        )}
                      </>
                    ) : (
                      <Link
                        to={`/learn/${course.id}`}
                        className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-center py-2 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition"
                      >
                        Continue Learning
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No {activeTab === 'all' ? '' : activeTab} courses yet
            </h3>
            <p className="text-gray-600 mb-6">
              {activeTab === 'all'
                ? 'Start learning by enrolling in a course'
                : `You don't have any ${activeTab} courses`}
            </p>
            <Link
              to="/courses"
              className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition"
            >
              Browse Courses
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCourses;