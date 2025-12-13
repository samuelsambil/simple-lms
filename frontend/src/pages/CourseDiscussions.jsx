import { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';

function CourseDiscussions() {
  const { courseId } = useParams();
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showNewDiscussion, setShowNewDiscussion] = useState(false);
  const [newDiscussion, setNewDiscussion] = useState({ title: '', content: '' });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    fetchData();
  }, [courseId, user, navigate]);

  const fetchData = async () => {
    try {
      const [courseRes, discussionsRes] = await Promise.all([
        api.get(`/courses/${courseId}/`),
        api.get(`/discussions/?course_id=${courseId}`)
      ]);
      
      setCourse(courseRes.data);
      setDiscussions(discussionsRes.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load discussions');
      setLoading(false);
    }
  };

  const handleCreateDiscussion = async (e) => {
    e.preventDefault();
    setCreating(true);
    setError('');

    try {
      await api.post('/discussions/', {
        course: parseInt(courseId),
        title: newDiscussion.title,
        content: newDiscussion.content
      });

      setNewDiscussion({ title: '', content: '' });
      setShowNewDiscussion(false);
      fetchData();
    } catch (err) {
      setError('Failed to create discussion');
    } finally {
      setCreating(false);
    }
  };

  const handleUpvote = async (discussionId) => {
    try {
      await api.post(`/discussions/${discussionId}/upvote/`);
      fetchData();
    } catch (err) {
      console.error('Failed to upvote');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-600 mb-4"></div>
          <div className="text-xl text-gray-600 font-medium">Loading discussions...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-6">
              <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300">
                SimpleLMS
              </Link>
              <Link 
                to={`/courses/${courseId}`} 
                className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors font-medium"
              >
                <span>←</span>
                <span>Back to Course</span>
              </Link>
            </div>
            
            {user && (
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
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
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl">💬</span>
            <h1 className="text-4xl font-bold text-gray-900">
              Course Discussions
            </h1>
          </div>
          <p className="text-lg text-gray-600">{course?.title}</p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg mb-8 flex items-center gap-3">
            <span className="text-2xl">⚠️</span>
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* New Discussion Section */}
        <div className="mb-8">
          {!showNewDiscussion ? (
            <button
              onClick={() => setShowNewDiscussion(true)}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/60 transition-all duration-300 hover:scale-105 flex items-center gap-2"
            >
              <span className="text-2xl">+</span>
              <span>Start New Discussion</span>
            </button>
          ) : (
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-purple-100">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">✨</span>
                <h2 className="text-2xl font-bold text-gray-900">
                  Start a New Discussion
                </h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
                    Discussion Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    required
                    value={newDiscussion.title}
                    onChange={(e) => setNewDiscussion({ ...newDiscussion, title: e.target.value })}
                    placeholder="What's your question or topic?"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 text-gray-900"
                  />
                </div>

                <div>
                  <label htmlFor="content" className="block text-sm font-semibold text-gray-700 mb-2">
                    Details *
                  </label>
                  <textarea
                    id="content"
                    required
                    value={newDiscussion.content}
                    onChange={(e) => setNewDiscussion({ ...newDiscussion, content: e.target.value })}
                    rows="6"
                    placeholder="Provide more details about your question or topic..."
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 text-gray-900"
                  ></textarea>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleCreateDiscussion}
                    disabled={creating || !newDiscussion.title.trim() || !newDiscussion.content.trim()}
                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {creating ? (
                      <span className="flex items-center gap-2">
                        <span className="animate-spin">⟳</span>
                        Creating...
                      </span>
                    ) : (
                      'Post Discussion'
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setShowNewDiscussion(false);
                      setNewDiscussion({ title: '', content: '' });
                    }}
                    className="px-8 py-3 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-all duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Discussions List */}
        {discussions.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-16 text-center">
            <div className="text-7xl mb-6">💬</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              No discussions yet
            </h3>
            <p className="text-gray-600 text-lg mb-6">
              Be the first to start a conversation!
            </p>
            <button
              onClick={() => setShowNewDiscussion(true)}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Start Discussion
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {discussions.map((discussion) => (
              <Link
                key={discussion.id}
                to={`/courses/${courseId}/discussions/${discussion.id}`}
                className="block bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 p-6 border border-gray-100 hover:border-purple-200 hover:-translate-y-1"
              >
                <div className="flex items-start gap-6">
                  {/* Upvote Section */}
                  <div className="flex flex-col items-center gap-2 shrink-0">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleUpvote(discussion.id);
                      }}
                      className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 text-purple-600 hover:from-purple-100 hover:to-pink-100 transition-all duration-300 flex items-center justify-center text-xl font-bold hover:scale-110"
                    >
                      ▲
                    </button>
                    <span className="text-base font-bold text-gray-900">
                      {discussion.upvotes}
                    </span>
                    <span className="text-xs text-gray-500">votes</span>
                  </div>

                  {/* Discussion Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                          {discussion.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-xs font-bold">
                              {(discussion.user.first_name || discussion.user.email).charAt(0).toUpperCase()}
                            </div>
                            <span className="font-medium">
                              {discussion.user.first_name || discussion.user.email}
                            </span>
                          </div>
                          <span className="text-gray-400">•</span>
                          <span>{new Date(discussion.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}</span>
                          <span className="text-gray-400">•</span>
                          <span className="flex items-center gap-1">
                            💬 {discussion.comment_count} {discussion.comment_count === 1 ? 'reply' : 'replies'}
                          </span>
                        </div>
                      </div>
                      
                      {/* Status Badges */}
                      <div className="flex gap-2 shrink-0">
                        {discussion.is_pinned && (
                          <span className="bg-yellow-100 text-yellow-800 text-xs px-3 py-1 rounded-full font-semibold flex items-center gap-1">
                            📌 Pinned
                          </span>
                        )}
                        {discussion.is_resolved && (
                          <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full font-semibold flex items-center gap-1">
                            ✓ Resolved
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-gray-700 line-clamp-2 leading-relaxed">
                      {discussion.content}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
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

export default CourseDiscussions;