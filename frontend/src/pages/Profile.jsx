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

  // Determine if viewing own profile
  const isOwnProfile = !userId || (currentUser && currentUser.id === parseInt(userId));

  useEffect(() => {
    fetchProfile();
  }, [userId, currentUser]);

  const fetchProfile = async () => {
    try {
      if (isOwnProfile) {
        // Get current user's profile
        const response = await api.get('/auth/me/');
        setUser(response.data);
      } else {
        // Get another user's profile
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading profile...</div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-red-600">{error || 'Profile not found'}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-6">
              <Link to="/" className="text-2xl font-bold text-gray-900">
                Simple LMS
              </Link>
              <Link to="/courses" className="text-gray-600 hover:text-gray-900">
                Courses
              </Link>
            </div>
            
            {currentUser ? (
              <div className="flex items-center gap-4">
                <Link to="/profile" className="text-gray-700 hover:text-gray-900">
                  {currentUser.first_name || currentUser.email}
                </Link>
                <button
                  onClick={logout}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Login
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Profile Content */}
      <main className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-32"></div>
          
          <div className="px-8 pb-8">
            {/* Avatar */}
            <div className="flex justify-between items-start -mt-16 mb-6">
              <div className="flex items-end gap-4">
                {user.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={user.first_name || user.email}
                    className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-gray-300 flex items-center justify-center text-4xl font-bold text-gray-600">
                    {(user.first_name || user.email).charAt(0).toUpperCase()}
                  </div>
                )}
                
                <div className="mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {user.first_name && user.last_name 
                      ? `${user.first_name} ${user.last_name}`
                      : user.email}
                  </h1>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${
                    user.role === 'instructor' 
                      ? 'bg-purple-100 text-purple-800'
                      : user.role === 'admin'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {user.role}
                  </span>
                </div>
              </div>

              {isOwnProfile && (
                <Link
                  to="/profile/edit"
                  className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  Edit Profile
                </Link>
              )}
            </div>

            {/* Profile Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">About</h2>
                
                {user.bio ? (
                  <p className="text-gray-600 mb-4">{user.bio}</p>
                ) : (
                  <p className="text-gray-400 italic">No bio yet</p>
                )}

                {user.location && (
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <span>📍</span>
                    <span>{user.location}</span>
                  </div>
                )}

                {user.website && (
                  <div className="flex items-center gap-2 text-blue-600 mb-2">
                    <span>🔗</span>
                    <a 
                      href={user.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {user.website}
                    </a>
                  </div>
                )}

                <div className="text-sm text-gray-500 mt-4">
                  Member since {new Date(user.created_at).toLocaleDateString()}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Contact</h2>
                <div className="text-gray-600">
                  <div className="mb-2">
                    <span className="font-medium">Email:</span> {user.email}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        {isOwnProfile && currentUser && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentUser.role === 'student' && (
              <Link
                to="/my-courses"
                className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
              >
                <h3 className="font-bold text-lg mb-2">My Courses</h3>
                <p className="text-gray-600">View your enrolled courses</p>
              </Link>
            )}

            {currentUser.role === 'instructor' && (
              <Link
                to="/instructor/dashboard"
                className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
              >
                <h3 className="font-bold text-lg mb-2">Instructor Dashboard</h3>
                <p className="text-gray-600">Manage your courses</p>
              </Link>
            )}

            <Link
              to="/courses"
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
            >
              <h3 className="font-bold text-lg mb-2">Browse Courses</h3>
              <p className="text-gray-600">Explore available courses</p>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}

export default Profile;