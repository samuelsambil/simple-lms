import { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';

function Profile() {
  const { userId } = useParams();
  const { user: currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const isOwnProfile = !userId || (currentUser && currentUser.id === parseInt(userId));

  useEffect(() => {
    fetchProfile();
  }, [userId, currentUser]);

  const fetchProfile = async () => {
    try {
      if (isOwnProfile) {
        const response = await api.get('/auth/me/');
        setUser(response.data);
      } else {
        const response = await api.get(`/auth/users/${userId}/`);
        setUser(response.data);
      }
      setLoading(false);
    } catch (err) {
      setError('Failed to load profile');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600 mb-4"></div>
          <div className="text-xl text-gray-600 font-medium">Loading profile...</div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😞</div>
          <div className="text-2xl text-gray-900 font-bold mb-4">{error || 'Profile not found'}</div>
          <Link to="/" className="text-blue-600 hover:text-blue-700 underline text-lg">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-8">
              <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300">
                SimpleLMS
              </Link>
              <nav className="hidden md:flex items-center gap-6">
                <Link to="/courses" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                  Courses
                </Link>
              </nav>
            </div>
            
            {currentUser ? (
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                    {(currentUser.first_name || currentUser.email).charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-gray-900">
                      {currentUser.first_name || currentUser.email}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">{currentUser.role}</p>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-medium hover:shadow-lg hover:shadow-red-500/50 transition-all duration-300 hover:scale-105"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login" className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105">
                Login
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Profile Content */}
      <main className="max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-blue-100">
          {/* Profile Header */}
          <div className="relative h-48 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
            <div className="absolute inset-0 bg-black/10"></div>
          </div>
          
          <div className="px-8 pb-8">
            {/* Avatar Section */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-start -mt-24 mb-8">
              <div className="flex items-end gap-6 mb-4 md:mb-0">
                {user.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={user.first_name || user.email}
                    className="w-40 h-40 rounded-full border-4 border-white shadow-2xl object-cover"
                  />
                ) : (
                  <div className="w-40 h-40 rounded-full border-4 border-white shadow-2xl bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-6xl font-bold text-white">
                    {(user.first_name || user.email).charAt(0).toUpperCase()}
                  </div>
                )}
                
                <div className="mb-4">
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    {user.first_name && user.last_name 
                      ? `${user.first_name} ${user.last_name}`
                      : user.email}
                  </h1>
                  <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${
                    user.role === 'instructor' 
                      ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800'
                      : user.role === 'admin'
                      ? 'bg-gradient-to-r from-red-100 to-orange-100 text-red-800'
                      : 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800'
                  }`}>
                    {user.role === 'instructor' ? '👨‍🏫' : user.role === 'admin' ? '⚡' : '🎓'}
                    <span className="capitalize">{user.role}</span>
                  </span>
                </div>
              </div>

              {isOwnProfile && (
                <Link
                  to="/profile/edit"
                  className="mt-4 px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  Edit Profile
                </Link>
              )}
            </div>

            {/* Profile Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span>📖</span>
                  <span>About</span>
                </h2>
                
                {user.bio ? (
                  <p className="text-gray-700 mb-4 leading-relaxed">{user.bio}</p>
                ) : (
                  <p className="text-gray-400 italic">No bio yet</p>
                )}

                {user.location && (
                  <div className="flex items-center gap-3 text-gray-700 mb-3 bg-white/60 rounded-lg p-3">
                    <span className="text-xl">📍</span>
                    <span className="font-medium">{user.location}</span>
                  </div>
                )}

                {user.website && (
                  <div className="flex items-center gap-3 text-blue-600 mb-3 bg-white/60 rounded-lg p-3">
                    <span className="text-xl">🔗</span>
                    <a 
                      href={user.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:underline font-medium break-all"
                    >
                      {user.website}
                    </a>
                  </div>
                )}

                <div className="text-sm text-gray-600 mt-6 bg-white/60 rounded-lg p-3">
                  <span className="font-semibold">📅 Member since:</span>{' '}
                  {new Date(user.created_at).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl p-6 border border-green-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span>✉️</span>
                  <span>Contact</span>
                </h2>
                <div className="text-gray-700">
                  <div className="mb-4 bg-white/60 rounded-lg p-4">
                    <span className="font-bold text-gray-900 block mb-2">Email</span>
                    <span className="break-all">{user.email}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        {isOwnProfile && currentUser && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentUser.role === 'student' && (
              <Link
                to="/my-courses"
                className="group bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:-translate-y-2"
              >
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="font-bold text-xl mb-2 text-gray-900 group-hover:text-green-600 transition-colors">
                  My Courses
                </h3>
                <p className="text-gray-600">View your enrolled courses and track progress</p>
              </Link>
            )}

            {currentUser.role === 'instructor' && (
              <Link
                to="/instructor/dashboard"
                className="group bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:-translate-y-2"
              >
                <div className="text-4xl mb-4">👨‍🏫</div>
                <h3 className="font-bold text-xl mb-2 text-gray-900 group-hover:text-indigo-600 transition-colors">
                  Instructor Dashboard
                </h3>
                <p className="text-gray-600">Manage your courses and students</p>
              </Link>
            )}

            <Link
              to="/courses"
              className="group bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:-translate-y-2"
            >
              <div className="text-4xl mb-4">📚</div>
              <h3 className="font-bold text-xl mb-2 text-gray-900 group-hover:text-blue-600 transition-colors">
                Browse Courses
              </h3>
              <p className="text-gray-600">Explore available courses and start learning</p>
            </Link>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-20 py-8 border-t border-gray-200 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-600 text-sm">
          <p>© 2024 SimpleLMS. Empowering learners worldwide 🌍</p>
        </div>
      </footer>
    </div>
  );
}

export default Profile;