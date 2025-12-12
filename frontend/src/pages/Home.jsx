import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Home() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Simple<span className="text-blue-600">LMS</span>
          </h1>

          {user ? (
            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-right">
                <p className="text-xs uppercase tracking-wide text-gray-400">
                  Welcome back
                </p>
                <p className="font-semibold text-gray-800">
                  {user.first_name || user.email}
                </p>
              </div>

              <span className="text-xs uppercase tracking-widest bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                {user.role}
              </span>

              <button
                onClick={logout}
                className="ml-1 px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition focus:ring-2 focus:ring-red-300"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="text-gray-700 font-medium hover:text-blue-600 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-5 py-2 rounded-lg bg-blue-600 text-white font-medium shadow hover:bg-blue-700 transition"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Hero */}
      <main className="max-w-7xl mx-auto px-6 py-24">
        <section className="text-center max-w-4xl mx-auto">
          <p className="uppercase tracking-[0.3em] text-sm text-blue-500 mb-6">
            Learn · Build · Grow
          </p>

          <h2 className="text-5xl md:text-6xl font-semibold text-gray-900 leading-tight mb-8">
            Learn skills that
            <span className="block bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
              move you forward
            </span>
          </h2>

          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-14">
            Explore high-quality courses, build real expertise, and track your
            progress over time.
          </p>

          {/* Search */}
          <div className="relative max-w-2xl mx-auto">
            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
              🔍
            </span>
            <input
              type="text"
              placeholder="What do you want to learn?"
              className="w-full pl-14 pr-6 py-4 text-lg rounded-full border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && e.target.value) {
                  window.location.href = `/courses?search=${encodeURIComponent(
                    e.target.value
                  )}`;
                }
              }}
            />
            <p className="text-sm text-gray-500 mt-4">
              Popular topics: Python · UI/UX · Data · Business
            </p>
          </div>
        </section>

        {/* Categories */}
        {!user && (
          <section className="mt-28">
            <h3 className="text-3xl font-semibold text-center mb-12">
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
                  className="group bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-xl transition hover:-translate-y-1"
                >
                  <div className="text-4xl mb-4 group-hover:scale-110 transition">
                    {cat.icon}
                  </div>
                  <p className="font-medium text-gray-800">
                    {cat.label}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Action Panel */}
        <section className="mt-32">
          <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl p-12">
            {user ? (
              <>
                <h3 className="text-3xl font-semibold text-center mb-12">
                  Continue your journey
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Link
                    to="/courses"
                    className="rounded-2xl p-6 bg-blue-50 hover:bg-blue-100 transition shadow-sm hover:shadow-md"
                  >
                    <h4 className="font-semibold text-lg mb-1">
                      Browse Courses
                    </h4>
                    <p className="text-gray-600">
                      Discover new skills and paths
                    </p>
                  </Link>

                  {user.role === 'student' && (
                    <Link
                      to="/my-courses"
                      className="rounded-2xl p-6 bg-green-50 hover:bg-green-100 transition shadow-sm hover:shadow-md"
                    >
                      <h4 className="font-semibold text-lg mb-1">
                        My Courses
                      </h4>
                      <p className="text-gray-600">
                        Pick up where you left off
                      </p>
                    </Link>
                  )}

                  {user.role === 'instructor' && (
                    <Link
                      to="/instructor/dashboard"
                      className="rounded-2xl p-6 bg-purple-50 hover:bg-purple-100 transition shadow-sm hover:shadow-md"
                    >
                      <h4 className="font-semibold text-lg mb-1">
                        Instructor Dashboard
                      </h4>
                      <p className="text-gray-600">
                        Manage and publish content
                      </p>
                    </Link>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center">
                <p className="text-lg text-gray-600 mb-10">
                  Create an account to track progress and unlock learning.
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
