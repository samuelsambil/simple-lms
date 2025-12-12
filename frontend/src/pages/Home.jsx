import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Home() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Simple LMS
          </h1>

          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-gray-700 font-medium animate-fadeIn">
                Welcome, {user.first_name || user.email}!
              </span>
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {user.role}
              </span>
              <button
                onClick={logout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-400 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-4">
              <Link
                to="/login"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-400 transition"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 animate-fadeIn">
            Welcome to Simple LMS
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            Your journey to learning starts here
          </p>

          {/* Quick Search */}
          <div className="max-w-2xl mx-auto mb-12 relative">
            <input
              type="text"
              placeholder="What do you want to learn today?"
              className="w-full px-6 py-4 pl-14 text-lg border-2 border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-lg placeholder-gray-400 transition"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && e.target.value) {
                  window.location.href = `/courses?search=${encodeURIComponent(
                    e.target.value
                  )}`;
                }
              }}
            />
            <div className="absolute left-5 top-1/2 transform -translate-y-1/2 text-2xl text-gray-400">
              🔍
            </div>
            <p className="text-sm text-gray-500 mt-2">Try: "Python", "Design", "Business"</p>
          </div>

          {/* Browse by Category */}
          {!user && (
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Browse by Category</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                {[
                  { icon: '💻', label: 'Programming' },
                  { icon: '🎨', label: 'Design' },
                  { icon: '💼', label: 'Business' },
                  { icon: '📊', label: 'Data Science' },
                  { icon: '🌱', label: 'Personal Dev' },
                ].map((cat) => (
                  <Link
                    key={cat.label}
                    to="/courses"
                    className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1.5 duration-300 text-center"
                  >
                    <div className="text-4xl mb-2 animate-bounce">{cat.icon}</div>
                    <div className="font-semibold">{cat.label}</div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* User Quick Links */}
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
            {user ? (
              <>
                <h3 className="text-2xl font-bold mb-6">Quick Links</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Link
                    to="/courses"
                    className="bg-blue-50 p-6 rounded-xl hover:bg-blue-100 shadow hover:shadow-md transition transform hover:-translate-y-1"
                  >
                    <h4 className="font-bold text-lg mb-2">Browse Courses</h4>
                    <p className="text-gray-600">Explore available courses</p>
                  </Link>

                  {user.role === 'student' && (
                    <Link
                      to="/my-courses"
                      className="bg-green-50 p-6 rounded-xl hover:bg-green-100 shadow hover:shadow-md transition transform hover:-translate-y-1"
                    >
                      <h4 className="font-bold text-lg mb-2">My Courses</h4>
                      <p className="text-gray-600">View your enrolled courses</p>
                    </Link>
                  )}

                  {user.role === 'instructor' && (
                    <Link
                      to="/instructor/dashboard"
                      className="bg-purple-50 p-6 rounded-xl hover:bg-purple-100 shadow hover:shadow-md transition transform hover:-translate-y-1"
                    >
                      <h4 className="font-bold text-lg mb-2">Instructor Dashboard</h4>
                      <p className="text-gray-600">Manage your courses</p>
                    </Link>
                  )}
                </div>
              </>
            ) : (
              <>
                <p className="text-gray-600 mb-6">
                  Please log in or register to access courses
                </p>
                <div className="flex justify-center gap-6">
                  <Link
                    to="/login"
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 shadow-lg transition transform hover:-translate-y-0.5"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 shadow-lg transition transform hover:-translate-y-0.5"
                  >
                    Register
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;
