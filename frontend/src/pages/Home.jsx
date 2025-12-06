import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Home() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Simple LMS</h1>
            
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-gray-700">
                  Welcome, {user.first_name || user.email}!
                </span>
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {user.role}
                </span>
                <button
                  onClick={logout}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex gap-4">
                <Link
                  to="/login"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Simple LMS
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Your journey to learning starts here
          </p>

          {user ? (
            <div className="bg-white rounded-lg shadow p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold mb-4">Quick Links</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link
                  to="/courses"
                  className="bg-blue-50 p-6 rounded-lg hover:bg-blue-100 transition"
                >
                  <h4 className="font-bold text-lg mb-2">Browse Courses</h4>
                  <p className="text-gray-600">Explore available courses</p>
                </Link>

                {user.role === 'student' && (
                  <Link
                    to="/my-courses"
                    className="bg-green-50 p-6 rounded-lg hover:bg-green-100 transition"
                  >
                    <h4 className="font-bold text-lg mb-2">My Courses</h4>
                    <p className="text-gray-600">View your enrolled courses</p>
                  </Link>
                )}

                {user.role === 'instructor' && (
                  <Link
                    to="/instructor/dashboard"
                    className="bg-purple-50 p-6 rounded-lg hover:bg-purple-100 transition"
                  >
                    <h4 className="font-bold text-lg mb-2">Instructor Dashboard</h4>
                    <p className="text-gray-600">Manage your courses</p>
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-8 max-w-2xl mx-auto">
              <p className="text-gray-600 mb-4">
                Please log in or register to access courses
              </p>
              <div className="flex justify-center gap-4">
                <Link
                  to="/login"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
                >
                  Register
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Home;