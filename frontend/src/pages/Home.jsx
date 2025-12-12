import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Home() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-5 flex justify-between items-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
            Simple<span className="text-blue-600">LMS</span>
          </h1>

          {user ? (
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm text-gray-500">Welcome back</p>
                <p className="font-semibold text-gray-800">
                  {user.first_name || user.email}
                </p>
              </div>

              <span className="text-xs uppercase tracking-wide bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                {user.role}
              </span>

              <button
                onClick={logout}
                className="ml-2 bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 focus:ring-2 focus:ring-red-300 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-gray-700 font-medium hover:text-blue-600 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 transition"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 py-16">
        <section className="text-center max-w-3xl mx-auto">
          <h2 className="text-5xl font-extrabold text-gray-900 leading-tight mb-6">
            Learn skills that move you forward
          </h2>

          <p className="text-xl text-gray-600 mb-10">
            Explore courses, build expertise, and track your learning journey.
          </p>

          {/* Search */}
          <div className="relative max-w-2xl mx-auto">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
              🔍
            </span>
            <input
              type="text"
              placeholder="Search for a skill, topic, or course…"
              className="w-full pl-14 pr-6 py-4 text-lg rounded-full border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && e.target.value) {
                  window.location.href = `/courses?search=${encodeURIComponent(
                    e.target.value
                  )}`;
                }
              }}
            />
            <p className="text-sm text-gray-500 mt-3">
              Popular: Python · UI/UX · Data · Business
            </p>
          </div>
        </section>

        {/* Categories (for guests) */}
        {!user && (
          <section className="mt-20">
            <h3 className="text-3xl font-bold text-center mb-10">
              Explore by category
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
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
                  className="group bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition transform hover:-translate-y-1 text-center"
                >
                  <div className="text-4xl mb-3 group-hover:scale-110 transition">
                    {cat.icon}
                  </div>
                  <p className="font-semibold text-gray-800">
                    {cat.label}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Quick Actions */}
        <section className="mt-24">
          <div className="bg-white rounded-3xl shadow-xl p-10 max-w-3xl mx-auto">
            {user ? (
              <>
                <h3 className="text-3xl font-bold text-center mb-10">
                  Continue your journey
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Link
                    to="/courses"
                    className="p-6 rounded-2xl bg-blue-50 hover:bg-blue-100 transition shadow-sm hover:shadow-md"
                  >
                    <h4 className="font-bold text-lg mb-1">
                      Browse Courses
                    </h4>
                    <p className="text-gray-600">
                      Discover new skills and topics
                    </p>
                  </Link>

                  {user.role === 'student' && (
                    <Link
                      to="/my-courses"
                      className="p-6 rounded-2xl bg-green-50 hover:bg-green-100 transition shadow-sm hover:shadow-md"
                    >
                      <h4 className="font-bold text-lg mb-1">
                        My Courses
                      </h4>
                      <p className="text-gray-600">
                        Resume where you left off
                      </p>
                    </Link>
                  )}

                  {user.role === 'instructor' && (
                    <Link
                      to="/instructor/dashboard"
                      className="p-6 rounded-2xl bg-purple-50 hover:bg-purple-100 transition shadow-sm hover:shadow-md"
                    >
                      <h4 className="font-bold text-lg mb-1">
                        Instructor Dashboard
                      </h4>
                      <p className="text-gray-600">
                        Manage and publish courses
                      </p>
                    </Link>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center">
                <p className="text-gray-600 mb-8 text-lg">
                  Create an account to track progress and access courses.
                </p>

                <div className="flex justify-center gap-6">
                  <Link
                    to="/login"
                    className="px-6 py-3 rounded-lg border border-gray-300 font-medium hover:bg-gray-50 transition"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-6 py-3 rounded-lg bg-blue-600 text-white font-medium shadow hover:bg-blue-700 transition"
                  >
                    Create Free Account
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;
