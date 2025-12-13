import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';

function EditProfile() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    bio: '',
    location: '',
    website: '',
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    setFormData({
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      bio: user.bio || '',
      location: user.location || '',
      website: user.website || '',
    });

    if (user.avatar_url) {
      setAvatarPreview(user.avatar_url);
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const data = new FormData();
      data.append('first_name', formData.first_name);
      data.append('last_name', formData.last_name);
      data.append('bio', formData.bio);
      data.append('location', formData.location);
      data.append('website', formData.website);

      if (avatarFile) {
        data.append('avatar', avatarFile);
      }

      await api.patch('/auth/me/', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccess(true);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err) {
      setError('Failed to update profile');
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-6">
              <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300">
                SimpleLMS
              </Link>
              <Link 
                to="/profile" 
                className="flex items-center gap-2 text-gray-600 hover:text-teal-600 transition-colors font-medium"
              >
                <span>←</span>
                <span>Back to Profile</span>
              </Link>
            </div>
            
            <button
              onClick={logout}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-medium hover:shadow-lg hover:shadow-red-500/50 transition-all duration-300 hover:scale-105"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-2xl p-10 border border-teal-100">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">👤</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Edit Profile
            </h1>
            <p className="text-lg text-gray-600">
              Update your personal information and avatar
            </p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border-l-4 border-green-500 text-green-700 px-6 py-4 rounded-lg mb-8 flex items-center gap-3 animate-pulse">
              <span className="text-3xl">🎉</span>
              <div>
                <p className="font-bold">Profile updated successfully!</p>
                <p className="text-sm">Refreshing page...</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg mb-8 flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <span className="font-medium">{error}</span>
            </div>
          )}

          <div className="space-y-8">
            {/* Avatar Upload */}
            <div>
              <label className="block text-lg font-bold text-gray-900 mb-4">
                Profile Picture
              </label>
              
              <div className="flex items-center gap-8">
                {avatarPreview ? (
                  <div className="relative group">
                    <img
                      src={avatarPreview}
                      alt="Avatar preview"
                      className="w-32 h-32 rounded-full object-cover border-4 border-teal-200 shadow-lg"
                    />
                    <button
                      onClick={() => {
                        setAvatarFile(null);
                        setAvatarPreview(user.avatar_url || null);
                      }}
                      className="absolute top-0 right-0 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-600"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-teal-400 to-cyan-400 flex items-center justify-center text-5xl font-bold text-white shadow-lg">
                    {(formData.first_name || user.email).charAt(0).toUpperCase()}
                  </div>
                )}

                <div className="flex-1">
                  <label className="cursor-pointer inline-block px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-teal-500/50 transition-all duration-300 hover:scale-105">
                    <span>Choose New Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </label>
                  <p className="text-sm text-gray-500 mt-2">
                    JPG, PNG, or GIF (max 5MB)
                  </p>
                </div>
              </div>
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="first_name" className="block text-lg font-bold text-gray-900 mb-3">
                  First Name
                </label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="John"
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-300 text-gray-900"
                />
              </div>

              <div>
                <label htmlFor="last_name" className="block text-lg font-bold text-gray-900 mb-3">
                  Last Name
                </label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Doe"
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-300 text-gray-900"
                />
              </div>
            </div>

            {/* Bio */}
            <div>
              <label htmlFor="bio" className="block text-lg font-bold text-gray-900 mb-3">
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows="4"
                maxLength="500"
                placeholder="Tell us about yourself..."
                className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-300 text-gray-900 resize-none"
              ></textarea>
              <div className="flex justify-between items-center mt-2">
                <p className="text-sm text-gray-500 flex items-start gap-2">
                  <span>💡</span>
                  <span>Share your learning journey or teaching experience</span>
                </p>
                <p className="text-sm text-gray-500">
                  {formData.bio.length}/500
                </p>
              </div>
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-lg font-bold text-gray-900 mb-3">
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., New York, USA"
                className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-300 text-gray-900"
              />
            </div>

            {/* Website */}
            <div>
              <label htmlFor="website" className="block text-lg font-bold text-gray-900 mb-3">
                Website
              </label>
              <input
                type="url"
                id="website"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://yourwebsite.com"
                className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-300 text-gray-900"
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={handleSubmit}
                disabled={loading || success}
                className="flex-1 px-8 py-4 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin">⟳</span>
                    Saving...
                  </span>
                ) : success ? (
                  <span className="flex items-center justify-center gap-2">
                    <span>✓</span>
                    Saved!
                  </span>
                ) : (
                  'Save Changes'
                )}
              </button>
              
              <Link
                to="/profile"
                className="px-8 py-4 border-2 border-gray-300 rounded-xl hover:bg-gray-50 font-semibold text-center transition-all duration-300 hover:scale-105"
              >
                Cancel
              </Link>
            </div>
          </div>
        </div>
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

export default EditProfile;