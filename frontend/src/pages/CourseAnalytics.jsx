import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CourseAnalytics = () => {
  const { courseId } = useParams();
  const { user, logout } = useAuth();

  // Mock analytics data - Replace with API call
  const courseData = {
    id: parseInt(courseId),
    title: 'Complete Web Development Bootcamp',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop',
    students: 12500,
    rating: 4.8,
    totalRevenue: 612500,
    enrollmentsThisMonth: 420,
    completionRate: 68,
    avgWatchTime: '32.5 hours',
    totalReviews: 2300,
  };

  const stats = [
    {
      label: 'Total Students',
      value: courseData.students.toLocaleString(),
      change: '+12%',
      positive: true,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      color: 'blue'
    },
    {
      label: 'Total Revenue',
      value: `$${(courseData.totalRevenue / 1000).toFixed(0)}k`,
      change: '+8%',
      positive: true,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'green'
    },
    {
      label: 'Avg Rating',
      value: courseData.rating.toFixed(1),
      change: '+0.2',
      positive: true,
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ),
      color: 'yellow'
    },
    {
      label: 'Completion Rate',
      value: `${courseData.completionRate}%`,
      change: '+5%',
      positive: true,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'indigo'
    }
  ];

  // Mock enrollment data for chart
  const enrollmentData = [
    { month: 'Jan', enrollments: 850 },
    { month: 'Feb', enrollments: 920 },
    { month: 'Mar', enrollments: 1100 },
    { month: 'Apr', enrollments: 980 },
    { month: 'May', enrollments: 1200 },
    { month: 'Jun', enrollments: 1350 },
  ];

  // Mock recent activity
  const recentActivity = [
    {
      id: 1,
      user: 'John Doe',
      avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=6366f1&color=fff',
      action: 'Completed the course',
      time: '2 hours ago'
    },
    {
      id: 2,
      user: 'Sarah Smith',
      avatar: 'https://ui-avatars.com/api/?name=Sarah+Smith&background=ec4899&color=fff',
      action: 'Left a 5-star review',
      time: '5 hours ago'
    },
    {
      id: 3,
      user: 'Mike Johnson',
      avatar: 'https://ui-avatars.com/api/?name=Mike+Johnson&background=10b981&color=fff',
      action: 'Enrolled in the course',
      time: '8 hours ago'
    },
    {
      id: 4,
      user: 'Emily Davis',
      avatar: 'https://ui-avatars.com/api/?name=Emily+Davis&background=f59e0b&color=fff',
      action: 'Started lesson 15',
      time: '12 hours ago'
    },
    {
      id: 5,
      user: 'Alex Brown',
      avatar: 'https://ui-avatars.com/api/?name=Alex+Brown&background=8b5cf6&color=fff',
      action: 'Posted a question in discussions',
      time: '1 day ago'
    }
  ];

  // Mock top performers
  const topPerformers = [
    {
      id: 1,
      name: 'Emma Wilson',
      avatar: 'https://ui-avatars.com/api/?name=Emma+Wilson&background=6366f1&color=fff',
      progress: 100,
      score: 98
    },
    {
      id: 2,
      name: 'James Taylor',
      avatar: 'https://ui-avatars.com/api/?name=James+Taylor&background=ec4899&color=fff',
      progress: 100,
      score: 96
    },
    {
      id: 3,
      name: 'Olivia Martinez',
      avatar: 'https://ui-avatars.com/api/?name=Olivia+Martinez&background=10b981&color=fff',
      progress: 95,
      score: 94
    }
  ];

  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    indigo: 'bg-indigo-100 text-indigo-600'
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
              <Link to="/instructor/dashboard" className="text-gray-700 hover:text-indigo-600 font-medium transition">
                Dashboard
              </Link>
              <Link to="/profile" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user?.first_name?.[0] || 'U'}
                  </span>
                </div>
              </Link>
              <button onClick={logout} className="text-gray-600 hover:text-gray-900 font-medium">
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Page Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/instructor/dashboard"
            className="inline-flex items-center text-indigo-100 hover:text-white mb-4 transition"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </Link>
          <div className="flex items-center space-x-4">
            <img
              src={courseData.image}
              alt={courseData.title}
              className="w-20 h-20 rounded-lg object-cover hidden md:block"
            />
            <div>
              <h1 className="text-3xl font-bold">{courseData.title}</h1>
              <p className="text-indigo-100 mt-1">Course Performance Analytics</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${colorClasses[stat.color]} rounded-lg flex items-center justify-center`}>
                  {stat.icon}
                </div>
                <span className={`text-sm font-medium ${stat.positive ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Enrollment Trend */}
            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Enrollment Trend</h2>
              <div className="space-y-4">
                {enrollmentData.map((data, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">{data.month}</span>
                      <span className="font-semibold text-gray-900">{data.enrollments} students</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 h-3 rounded-full transition-all"
                        style={{ width: `${(data.enrollments / 1500) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-4 p-4 hover:bg-gray-50 rounded-lg transition">
                    <img
                      src={activity.avatar}
                      alt={activity.user}
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="flex-1">
                      <p className="text-gray-900 font-medium">{activity.user}</p>
                      <p className="text-gray-600 text-sm">{activity.action}</p>
                    </div>
                    <span className="text-gray-500 text-sm">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Stats</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                  <span className="text-gray-600">This Month</span>
                  <span className="font-semibold text-gray-900">{courseData.enrollmentsThisMonth} enrollments</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                  <span className="text-gray-600">Avg Watch Time</span>
                  <span className="font-semibold text-gray-900">{courseData.avgWatchTime}</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                  <span className="text-gray-600">Total Reviews</span>
                  <span className="font-semibold text-gray-900">{courseData.totalReviews.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Completion Rate</span>
                  <span className="font-semibold text-gray-900">{courseData.completionRate}%</span>
                </div>
              </div>
            </div>

            {/* Top Performers */}
            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Top Performers</h2>
              <div className="space-y-4">
                {topPerformers.map((student, index) => (
                  <div key={student.id} className="flex items-center space-x-4">
                    <div className="relative">
                      <img
                        src={student.avatar}
                        alt={student.name}
                        className="w-12 h-12 rounded-full"
                      />
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {index + 1}
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900 font-medium">{student.name}</p>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span>{student.progress}% complete</span>
                        <span>•</span>
                        <span className="flex items-center">
                          <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          {student.score}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Export Data */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
              <h3 className="font-semibold text-gray-900 mb-2">Export Analytics</h3>
              <p className="text-sm text-gray-600 mb-4">Download detailed reports for this course</p>
              <button className="w-full bg-white text-indigo-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition border border-indigo-200">
                <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export to CSV
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseAnalytics;