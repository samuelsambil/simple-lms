import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';

function CreateCourse() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty: 'beginner',
    status: 'draft',
  });
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!user || user.role !== 'instructor') {
    navigate('/');
    return null;
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('difficulty', formData.difficulty);
      data.append('status', formData.status);
      
      if (thumbnailFile) {
        data.append('thumbnail', thumbnailFile);
      }

      const response = await api.post('/courses/', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/instructor/dashboard');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create course');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-6">
              <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300">
                SimpleLMS
              </Link>
              <Link 
                to="/instructor/dashboard" 
                className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors font-medium"
              >
                <span>←</span>
                <span>Back to Dashboard</span>
              </Link>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
                  {(user.first_name || user.email).charAt(0).toUpperCase()}
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-900">
                    {user.first_name || user.email}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-medium hover:shadow-lg hover:shadow-red-500/50 transition-all duration-300 hover:scale-105"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-2xl p-10 border border-indigo-100">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">✨</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Create New Course
            </h1>
            <p className="text-lg text-gray-600">
              Start building your course. Add lessons and content after creation.
            </p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border-l-4 border-green-500 text-green-700 px-6 py-4 rounded-lg mb-8 flex items-center gap-3 animate-pulse">
              <span className="text-3xl">🎉</span>
              <div>
                <p className="font-bold">Course created successfully!</p>
                <p className="text-sm">Redirecting to your dashboard...</p>
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
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-lg font-bold text-gray-900 mb-3">
                Course Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Introduction to Python Programming"
                className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 text-gray-900 text-lg"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-lg font-bold text-gray-900 mb-3">
                Course Description *
              </label>
              <textarea
                id="description"
                name="description"
                required
                value={formData.description}
                onChange={handleChange}
                rows="6"
                placeholder="Describe what students will learn in this course..."
                className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 text-gray-900 resize-none"
              ></textarea>
              <p className="text-sm text-gray-500 mt-2 flex items-start gap-2">
                <span>💡</span>
                <span>Be clear and specific about learning outcomes</span>
              </p>
            </div>

            {/* Thumbnail Upload */}
            <div>
              <label className="block text-lg font-bold text-gray-900 mb-3">
                Course Thumbnail (Optional)
              </label>
              
              {thumbnailPreview ? (
                <div className="mb-4 relative group">
                  <img
                    src={thumbnailPreview}
                    alt="Thumbnail preview"
                    className="w-full h-64 object-cover rounded-2xl shadow-lg"
                  />
                  <button
                    onClick={() => {
                      setThumbnailFile(null);
                      setThumbnailPreview(null);
                    }}
                    className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-600"
                  >
                    ✕ Remove
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-indigo-400 transition-colors duration-300">
                  <div className="text-6xl mb-4">🖼️</div>
                  <p className="text-gray-600 mb-4">Upload a course thumbnail</p>
                  <label className="cursor-pointer inline-block px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/50 transition-all duration-300 hover:scale-105">
                    <span>Choose Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailChange}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
              <p className="text-sm text-gray-500 mt-2 flex items-start gap-2">
                <span>📐</span>
                <span>JPG, PNG, or GIF (recommended: 1200x600px, max 5MB)</span>
              </p>
            </div>

            {/* Difficulty & Status Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Difficulty */}
              <div>
                <label htmlFor="difficulty" className="block text-lg font-bold text-gray-900 mb-3">
                  Difficulty Level
                </label>
                <select
                  id="difficulty"
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 text-gray-900 text-lg bg-white"
                >
                  <option value="beginner">🟢 Beginner</option>
                  <option value="intermediate">🟡 Intermediate</option>
                  <option value="advanced">🔴 Advanced</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label htmlFor="status" className="block text-lg font-bold text-gray-900 mb-3">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 text-gray-900 text-lg bg-white"
                >
                  <option value="draft">📝 Draft (not visible)</option>
                  <option value="published">✅ Published (visible)</option>
                </select>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-2xl p-6">
              <h3 className="font-bold text-indigo-900 mb-3 text-lg flex items-center gap-2">
                <span className="text-2xl">📝</span>
                <span>Next Steps</span>
              </h3>
              <p className="text-indigo-800 leading-relaxed">
                After creating this course, you'll be able to add lessons, quizzes, and assignments through the Django admin panel at{' '}
                <a 
                  href="http://127.0.0.1:8000/admin/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="underline font-semibold hover:text-indigo-600"
                >
                  http://127.0.0.1:8000/admin/
                </a>
              </p>
            </div>

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={handleSubmit}
                disabled={loading || success}
                className="flex-1 px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin">⟳</span>
                    Creating Course...
                  </span>
                ) : success ? (
                  <span className="flex items-center justify-center gap-2">
                    <span>✓</span>
                    Course Created!
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <span>✨</span>
                    <span>Create Course</span>
                  </span>
                )}
              </button>
              
              <Link
                to="/instructor/dashboard"
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
          <p>© 2024 SimpleLMS. Empowering educators worldwide 👨‍🏫</p>
        </div>
      </footer>
    </div>
  );
}

export default CreateCourse;