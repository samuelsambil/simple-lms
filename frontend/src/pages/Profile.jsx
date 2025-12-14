import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { userId } = useParams();
  const { user: currentUser, logout, isStudent, isInstructor } = useAuth();

  // If no userId in params, show current user's profile
  const isOwnProfile = !userId || parseInt(userId) === currentUser?.id;

  // Mock profile data - Replace with API call
  const profileData = isOwnProfile ? {
    id: currentUser?.id || 1,
    firstName: currentUser?.first_name || 'John',
    lastName: currentUser?.last_name || 'Doe',
    email: currentUser?.email || 'john.doe@example.com',
    role: currentUser?.role || 'student',
    avatar: currentUser?.avatar || null,
    bio: 'Passionate about learning new technologies and sharing knowledge with others. Currently focusing on web development and data science.',
    joinDate: 'January 2024',
    location: 'San Francisco, CA',
    website: 'https://johndoe.dev',
    
    // Stats based on role
    stats: currentUser?.role === 'student' ? {
      coursesEnrolled: 8,
      coursesCompleted: 3,
      certificatesEarned: 3,
      hoursLearned: 124
    } : {
      coursesCreated: 4,
      totalStudents: 27600,
      totalRevenue: 1342500,
      avgRating: 4.8
    },
    
    // Recent activity
    recentCourses: currentUser?.role === 'student' ? [
      {
        id: 1,
        title: 'Complete Web Development Bootcamp',
        progress: 45,
        thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop'
      },
      {
        id: 2,
        title: 'Python for Data Science',
        progress: 78,
        thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=300&fit=crop'
      }
    ] : [
      {
        id: 1,
        title: 'Complete Web Development Bootcamp',
        students: 12500,
        thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop'
      },
      {
        id: 2,
        title: 'Advanced React Patterns',
        students: 8400,
        thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop'
      }
    ]
  } : {
    // Viewing another user's profile
    id: parseInt(userId),
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    role: 'instructor',
    avatar: null,
    bio: 'Experienced software engineer and educator with 10+ years in the industry.',
    joinDate: 'March 2023',
    location: 'New York, NY',
    
    stats: {
      coursesCreated: 6,
      totalStudents: 35000,
      avgRating: 4.9
    },
    
    recentCourses: [
      {
        id: 3,
        title: 'Machine Learning A-Z',
        students: 8900,
        thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=300&fit=crop'
      }
    ]
  };

  const getInitials = () => {
    return `${profileData.firstName[0]}${profileData.lastName[0]}`;
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
                Courses
              </Link>
              {currentUser && (
                <>
                  {isStudent && (
                    <Link to="/my-courses" className="text-gray-700 hover:text-indigo-600 font-medium transition">
                      My Courses
                    </Link>
                  )}
                  {isInstructor && (
                    <Link to="/instructor/dashboard" className="text-gray-700 hover:text-indigo-600 font-medium transition">
                      Dashboard
                    </Link>
                  )}
                  <Link to="/profile" className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {currentUser?.first_name?.[0] || 'U'}
                      </span>
                    </div>
                  </Link>
                  <button onClick={logout} className="text-gray-600 hover:text-gray-900 font-medium">
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Profile Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            {/* Avatar */}
            <div className="relative">
              {profileData.avatar ? (
                <img
                  src={profileData.avatar}
                  alt={`${profileData.firstName} ${profileData.lastName}`}
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                />
              ) : (
                <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                  <span className="text-5xl font-bold text-white">{getInitials()}</span>
                </div>
              )}
              <div className={`absolute bottom-2 right-2 w-6 h-6 rounded-full border-2 border-white ${
                profileData.role === 'instructor' ? 'bg-yellow-400' : 'bg-green-400'
              }`}></div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div>
                  <h1 className="text-4xl font-bold mb-2">
                    {profileData.firstName} {profileData.lastName}
                  </h1>
                  <div className="flex items-center justify-center md:justify-start space-x-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      profileData.role === 'instructor' 
                        ? 'bg-yellow-400 text-yellow-900' 
                        : 'bg-green-400 text-green-900'
                    }`}>
                      {profileData.role === 'instructor' ? '👨‍🏫 Instructor' : '🎓 Student'}
                    </span>
                    <span className="text-indigo-100">• Joined {profileData.joinDate}</span>
                  </div>
                </div>

                {isOwnProfile && (
                  <Link
                    to="/profile/edit"
                    className="mt-4 md:mt-0 inline-flex items-center bg-white text-indigo-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit Profile
                  </Link>
                )}
              </div>

              <p className="text-indigo-100 text-lg mb-4 max-w-2xl">
                {profileData.bio}
              </p>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm">
                {profileData.location && (
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {profileData.location}
                  </div>
                )}
                {profileData.website && (
                  <a href={profileData.website} target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-white transition">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                    Website
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {profileData.role === 'student' ? (
            <>
              <div className="bg-white rounded-xl shadow-md p-6">
                <p className="text-gray-600 text-sm font-medium mb-1">Courses Enrolled</p>
                <p className="text-3xl font-bold text-gray-900">{profileData.stats.coursesEnrolled}</p>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6">
                <p className="text-gray-600 text-sm font-medium mb-1">Completed</p>
                <p className="text-3xl font-bold text-gray-900">{profileData.stats.coursesCompleted}</p>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6">
                <p className="text-gray-600 text-sm font-medium mb-1">Certificates</p>
                <p className="text-3xl font-bold text-gray-900">{profileData.stats.certificatesEarned}</p>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6">
                <p className="text-gray-600 text-sm font-medium mb-1">Hours Learned</p>
                <p className="text-3xl font-bold text-gray-900">{profileData.stats.hoursLearned}</p>
              </div>
            </>
          ) : (
            <>
              <div className="bg-white rounded-xl shadow-md p-6">
                <p className="text-gray-600 text-sm font-medium mb-1">Courses Created</p>
                <p className="text-3xl font-bold text-gray-900">{profileData.stats.coursesCreated}</p>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6">
                <p className="text-gray-600 text-sm font-medium mb-1">Total Students</p>
                <p className="text-3xl font-bold text-gray-900">{profileData.stats.totalStudents.toLocaleString()}</p>
              </div>
              {profileData.stats.totalRevenue && (
                <div className="bg-white rounded-xl shadow-md p-6">
                  <p className="text-gray-600 text-sm font-medium mb-1">Total Revenue</p>
                  <p className="text-3xl font-bold text-gray-900">${(profileData.stats.totalRevenue / 1000).toFixed(0)}k</p>
                </div>
              )}
              <div className="bg-white rounded-xl shadow-md p-6">
                <p className="text-gray-600 text-sm font-medium mb-1">Avg Rating</p>
                <p className="text-3xl font-bold text-gray-900">{profileData.stats.avgRating}</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Courses */}
            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {profileData.role === 'student' ? 'Recent Courses' : 'Popular Courses'}
              </h2>
              
              {profileData.recentCourses.length > 0 ? (
                <div className="space-y-4">
                  {profileData.recentCourses.map((course) => (
                    <Link
                      key={course.id}
                      to={`/courses/${course.id}`}
                      className="flex items-center space-x-4 p-4 hover:bg-gray-50 rounded-lg transition"
                    >
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-24 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{course.title}</h3>
                        {profileData.role === 'student' ? (
                          <>
                            <div className="flex items-center text-sm text-gray-600 mb-2">
                              <span>Progress: {course.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full"
                                style={{ width: `${course.progress}%` }}
                              ></div>
                            </div>
                          </>
                        ) : (
                          <p className="text-sm text-gray-600">
                            {course.students.toLocaleString()} students enrolled
                          </p>
                        )}
                      </div>
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No courses yet</p>
              )}
            </div>

            {/* About */}
            {profileData.bio && (
              <div className="bg-white rounded-xl shadow-md p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About</h2>
                <p className="text-gray-700 leading-relaxed">{profileData.bio}</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Links */}
            {isOwnProfile && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
                <div className="space-y-2">
                  {profileData.role === 'student' ? (
                    <>
                      <Link
                        to="/my-courses"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition"
                      >
                        My Courses
                      </Link>
                      <Link
                        to="/courses"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition"
                      >
                        Browse Courses
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/instructor/dashboard"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition"
                      >
                        Dashboard
                      </Link>
                      <Link
                        to="/instructor/create-course"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition"
                      >
                        Create Course
                      </Link>
                    </>
                  )}
                  <Link
                    to="/profile/edit"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition"
                  >
                    Edit Profile
                  </Link>
                </div>
              </div>
            )}

            {/* Contact Info */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-gray-400 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="text-gray-900">{isOwnProfile ? profileData.email : 'Hidden'}</p>
                  </div>
                </div>
                {profileData.location && (
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-gray-400 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                      <p className="text-sm text-gray-600">Location</p>
                      <p className="text-gray-900">{profileData.location}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Member Since */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Member Since</p>
                  <p className="font-semibold text-gray-900">{profileData.joinDate}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;