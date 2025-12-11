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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading discussions...</div>
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
              <Link to={`/courses/${courseId}`} className="text-gray-600 hover:text-gray-900">
                ← Back to Course
              </Link>
            </div>
            
            {user && (
              <div className="flex items-center gap-4">
                <Link to="/profile" className="text-gray-700 hover:text-gray-900">
                  {user.first_name || user.email}
                </Link>
                <button
                  onClick={logout}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Course Discussions
          </h1>
          <p className="text-gray-600">{course?.title}</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* New Discussion Button */}
        <div className="mb-6">
          {!showNewDiscussion ? (
            <button
              onClick={() => setShowNewDiscussion(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
            >
              + New Discussion
            </button>
          ) : (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Start a New Discussion
              </h2>
              <form onSubmit={handleCreateDiscussion} className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    required
                    value={newDiscussion.title}
                    onChange={(e) => setNewDiscussion({ ...newDiscussion, title: e.target.value })}
                    placeholder="What's your question or topic?"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                    Details
                  </label>
                  <textarea
                    id="content"
                    required
                    value={newDiscussion.content}
                    onChange={(e) => setNewDiscussion({ ...newDiscussion, content: e.target.value })}
                    rows="6"
                    placeholder="Provide more details about your question or topic..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  ></textarea>
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={creating}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
                  >
                    {creating ? 'Creating...' : 'Post Discussion'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowNewDiscussion(false);
                      setNewDiscussion({ title: '', content: '' });
                    }}
                    className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Discussions List */}
        {discussions.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">💬</div>
            <p className="text-gray-600 text-lg">
              No discussions yet. Be the first to start one!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {discussions.map((discussion) => (
              <Link
                key={discussion.id}
                to={`/courses/${courseId}/discussions/${discussion.id}`}
                className="block bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
              >
                <div className="flex items-start gap-4">
                  {/* Upvote Section */}
                  <div className="flex flex-col items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleUpvote(discussion.id);
                      }}
                      className="text-gray-400 hover:text-blue-600 transition"
                    >
                      ▲
                    </button>
                    <span className="text-sm font-medium text-gray-700">
                      {discussion.upvotes}
                    </span>
                  </div>

                  {/* Discussion Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          {discussion.title}
                        </h3>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <span>
                            By {discussion.user.first_name || discussion.user.email}
                          </span>
                          <span>•</span>
                          <span>{new Date(discussion.created_at).toLocaleDateString()}</span>
                          <span>•</span>
                          <span>💬 {discussion.comment_count} replies</span>
                        </div>
                      </div>
                      
                      {/* Status Badges */}
                      <div className="flex gap-2">
                        {discussion.is_pinned && (
                          <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                            📌 Pinned
                          </span>
                        )}
                        {discussion.is_resolved && (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                            ✓ Resolved
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-gray-700 line-clamp-2">
                      {discussion.content}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default CourseDiscussions;