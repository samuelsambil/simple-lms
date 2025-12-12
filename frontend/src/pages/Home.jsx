import { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Home() {
  const { user, logout } = useContext(AuthContext);
  const [searchValue, setSearchValue] = useState('');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"
          style={{
            top: '10%',
            left: mousePosition.x * 0.02 + 'px',
            transition: 'all 0.3s ease-out'
          }}
        />
        <div 
          className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"
          style={{
            bottom: '10%',
            right: mousePosition.x * 0.015 + 'px',
            animationDelay: '1s',
            transition: 'all 0.3s ease-out'
          }}
        />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/5 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/50">
              <span className="text-white text-xl">📚</span>
            </div>
            Simple<span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">LMS</span>
          </h1>

          {user ? (
            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-right">
                <p className="text-xs uppercase tracking-wide text-gray-400">
                  Welcome back
                </p>
                <p className="font-semibold text-white">
                  {user.first_name || user.email}
                </p>
              </div>

              <span className="text-xs uppercase tracking-widest bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm text-blue-300 px-4 py-2 rounded-full border border-blue-400/30">
                {user.role}
              </span>

              <button
                onClick={logout}
                className="ml-1 px-5 py-2 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-medium hover:shadow-lg hover:shadow-red-500/50 transition-all duration-300 hover:scale-105"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="text-gray-300 font-medium hover:text-white transition-colors duration-300"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium shadow-lg shadow-blue-500/50 hover:shadow-xl hover:shadow-blue-500/60 transition-all duration-300 hover:scale-105"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Hero */}
      <main className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        <section className="text-center max-w-5xl mx-auto mb-20">
          <div className="inline-block mb-6 px-6 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-400/30 backdrop-blur-sm">
            <p className="uppercase tracking-[0.3em] text-sm bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-semibold">
              Learn · Build · Grow
            </p>
          </div>

          <h2 className="text-6xl md:text-7xl font-bold text-white leading-tight mb-8 tracking-tight">
            Learn skills that
            <span className="block mt-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
              move you forward
            </span>
          </h2>

          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-16 leading-relaxed">
            Explore high-quality courses, build real expertise, and track your
            progress with the most advanced learning platform.
          </p>

          {/* Search */}
          <div className="relative max-w-3xl mx-auto group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
            <div className="relative">
              <span className="absolute left-7 top-1/2 -translate-y-1/2 text-2xl">
                🔍
              </span>
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="What do you want to learn today?"
                className="w-full pl-16 pr-6 py-5 text-lg rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:outline-none focus:bg-white/15 transition-all duration-300 shadow-2xl"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && searchValue) {
                    window.location.href = `/courses?search=${encodeURIComponent(searchValue)}`;
                  }
                }}
              />
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {['Python', 'UI/UX Design', 'Data Science', 'Business', 'AI & ML'].map((topic) => (
                <span
                  key={topic}
                  className="px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-gray-300 text-sm hover:bg-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto mb-28">
          {[
            { value: '10K+', label: 'Active Students' },
            { value: '500+', label: 'Expert Courses' },
            { value: '98%', label: 'Success Rate' },
            { value: '24/7', label: 'Support' },
          ].map((stat, i) => (
            <div
              key={i}
              className="text-center p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:scale-105 transition-all duration-300 group"
            >
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                {stat.value}
              </div>
              <div className="text-gray-400 text-sm uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </section>

        {/* Categories */}
        {!user && (
          <section className="mb-28">
            <h3 className="text-4xl font-bold text-center mb-4 text-white">
              Explore by category
            </h3>
            <p className="text-center text-gray-400 mb-12 text-lg">
              Choose your path and start learning today
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
              {[
                { icon: '💻', label: 'Programming', color: 'from-blue-500 to-cyan-500' },
                { icon: '🎨', label: 'Design', color: 'from-pink-500 to-rose-500' },
                { icon: '💼', label: 'Business', color: 'from-amber-500 to-orange-500' },
                { icon: '📊', label: 'Data Science', color: 'from-green-500 to-emerald-500' },
                { icon: '🌱', label: 'Personal Dev', color: 'from-purple-500 to-indigo-500' },
              ].map((cat) => (
                <Link
                  key={cat.label}
                  to="/courses"
                  className="group relative overflow-hidden"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl`} />
                  <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center hover:bg-white/10 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                    <div className="text-5xl mb-4 group-hover:scale-125 transition-transform duration-500">
                      {cat.icon}
                    </div>
                    <p className="font-semibold text-white text-lg">
                      {cat.label}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Action Panel */}
        <section className="max-w-4xl mx-auto">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500" />
            <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-12 shadow-2xl">
              {user ? (
                <>
                  <h3 className="text-4xl font-bold text-center mb-12 text-white">
                    Continue your journey
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Link
                      to="/courses"
                      className="group/card relative overflow-hidden rounded-2xl p-8 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm border border-blue-400/30 hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/50"
                    >
                      <div className="text-4xl mb-4">📖</div>
                      <h4 className="font-bold text-xl mb-2 text-white">
                        Browse Courses
                      </h4>
                      <p className="text-gray-300">
                        Discover new skills and paths
                      </p>
                      <div className="absolute bottom-4 right-4 text-2xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-300">
                        →
                      </div>
                    </Link>

                    {user.role === 'student' && (
                      <Link
                        to="/my-courses"
                        className="group/card relative overflow-hidden rounded-2xl p-8 bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm border border-green-400/30 hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/50"
                      >
                        <div className="text-4xl mb-4">🎯</div>
                        <h4 className="font-bold text-xl mb-2 text-white">
                          My Courses
                        </h4>
                        <p className="text-gray-300">
                          Pick up where you left off
                        </p>
                        <div className="absolute bottom-4 right-4 text-2xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-300">
                          →
                        </div>
                      </Link>
                    )}

                    {user.role === 'instructor' && (
                      <Link
                        to="/instructor/dashboard"
                        className="group/card relative overflow-hidden rounded-2xl p-8 bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-400/30 hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/50"
                      >
                        <div className="text-4xl mb-4">👨‍🏫</div>
                        <h4 className="font-bold text-xl mb-2 text-white">
                          Instructor Dashboard
                        </h4>
                        <p className="text-gray-300">
                          Manage and publish content
                        </p>
                        <div className="absolute bottom-4 right-4 text-2xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-300">
                          →
                        </div>
                      </Link>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center">
                  <div className="text-6xl mb-6">🚀</div>
                  <h3 className="text-3xl font-bold mb-4 text-white">
                    Ready to start learning?
                  </h3>
                  <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                    Create an account to track progress, earn certificates, and unlock your full potential.
                  </p>

                  <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Link
                      to="/login"
                      className="px-8 py-4 rounded-full border-2 border-white/30 font-semibold text-white hover:bg-white/10 transition-all duration-300 hover:scale-105"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="px-8 py-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow-lg shadow-blue-500/50 hover:shadow-xl hover:shadow-blue-500/60 transition-all duration-300 hover:scale-105"
                    >
                      Create Free Account
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Footer CTA */}
        <section className="mt-32 text-center">
          <p className="text-gray-400 text-sm">
             thousands of learners worldwide 🌍
          </p>
        </section>
      </main>
    </div>
  );
}

export default Home;