import { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';

function DiscussionDetail() {
  const { courseId, discussionId } = useParams();
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [discussion, setDiscussion] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commenting, setCommenting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    fetchDiscussion();
  }, [discussionId, user, navigate]);

  const fetchDiscussion = async () => {
    try {
      const response = await api.get(`/discussions/${discussionId}/`);
      setDiscussion(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load discussion');
      setLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setCommenting(true);
    setError('');

    try {
      await api.post('/comments/', {
        discussion: parseInt(discussionId),
        parent_comment: replyingTo,
        content: newComment
      });

      setNewComment('');
      setReplyingTo(null);
      fetchDiscussion();
    } catch (err) {
      setError('Failed to post comment');
    } finally {
      setCommenting(false);
    }
  };

  const handleUpvoteDiscussion = async () => {
    try {
      await api.post(`/discussions/${discussionId}/upvote/`);
      fetchDiscussion();
    } catch (err) {
      console.error('Failed to upvote');
    }
  };

  const handleUpvoteComment = async (commentId) => {
    try {
      await api.post(`/comments/${commentId}/upvote/`);
      fetchDiscussion();
    } catch (err) {
      console.error('Failed to upvote');
    }
  };

  const handleResolve = async () => {
    try {
      await api.post(`/discussions/${discussionId}/resolve/`);
      fetchDiscussion();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to mark as resolved');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-600 mb-4"></div>
          <div className="text-xl text-gray-600 font-medium">Loading discussion...</div>
        </div>
      </div>
    );
  }

  if (!discussion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <div className="text-2xl text-gray-900 font-bold mb-4">Discussion not found</div>
          <Link to={`/courses/${courseId}/discussions`} className="text-purple-600 hover:text-purple-700 underline text-lg">
            Back to Discussions
          </Link>
        </div>
      </div>
    );
  }

  const isInstructor = user?.role === 'instructor';
  const isDiscussionOwner = discussion.user.id === user?.id;

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
                to={`/courses/${courseId}/discussions`} 
                className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors font-medium"
              >
                <span>←</span>
                <span>Back to Discussions</span>
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
      <main className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg mb-8 flex items-center gap-3">
            <span className="text-2xl">⚠️</span>
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Discussion Post */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-purple-100">
          <div className="flex items-start gap-6">
            {/* Upvote Section */}
            <div className="flex flex-col items-center gap-2 shrink-0">
              <button
                onClick={handleUpvoteDiscussion}
                className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 text-purple-600 hover:from-purple-100 hover:to-pink-100 transition-all duration-300 flex items-center justify-center text-2xl font-bold hover:scale-110"
              >
                ▲
              </button>
              <span className="text-2xl font-bold text-gray-900">
                {discussion.upvotes}
              </span>
              <span className="text-xs text-gray-500 font-medium">votes</span>
            </div>

            {/* Discussion Content */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-3 leading-tight">
                    {discussion.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-sm font-bold">
                        {(discussion.user.first_name || discussion.user.email).charAt(0).toUpperCase()}
                      </div>
                      <span className="font-semibold text-gray-900">
                        {discussion.user.first_name || discussion.user.email}
                      </span>
                    </div>
                    <span className="text-gray-400">•</span>
                    <span>{new Date(discussion.created_at).toLocaleString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit'
                    })}</span>
                  </div>
                </div>

                {/* Status Badges */}
                <div className="flex flex-col gap-2 shrink-0">
                  {discussion.is_pinned && (
                    <span className="bg-yellow-100 text-yellow-800 text-sm px-4 py-2 rounded-full font-semibold flex items-center gap-2">
                      📌 Pinned
                    </span>
                  )}
                  {discussion.is_resolved && (
                    <span className="bg-green-100 text-green-800 text-sm px-4 py-2 rounded-full font-semibold flex items-center gap-2">
                      ✓ Resolved
                    </span>
                  )}
                </div>
              </div>

              <div className="prose max-w-none mb-6">
                <p className="text-gray-700 whitespace-pre-wrap text-lg leading-relaxed">
                  {discussion.content}
                </p>
              </div>

              {/* Resolve Button */}
              {!discussion.is_resolved && (isInstructor || isDiscussionOwner) && (
                <button
                  onClick={handleResolve}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold shadow-lg hover:shadow-green-500/50 transition-all duration-300 hover:scale-105 flex items-center gap-2"
                >
                  <span>✓</span>
                  <span>Mark as Resolved</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-purple-100">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">💬</span>
            <h2 className="text-2xl font-bold text-gray-900">
              {discussion.comment_count} {discussion.comment_count === 1 ? 'Reply' : 'Replies'}
            </h2>
          </div>

          {/* Add Comment Form */}
          <div className="mb-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-100">
            {replyingTo && (
              <div className="bg-purple-100 border border-purple-300 p-3 rounded-xl mb-4 flex justify-between items-center">
                <span className="text-sm text-purple-800 font-medium">✨ Replying to a comment</span>
                <button
                  onClick={() => setReplyingTo(null)}
                  className="text-purple-800 hover:text-purple-900 font-bold"
                >
                  ✕
                </button>
              </div>
            )}
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={replyingTo ? "Write your reply..." : "Share your thoughts..."}
              rows="4"
              className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 text-gray-900 resize-none"
            ></textarea>
            <div className="flex justify-end mt-4">
              <button
                onClick={handleAddComment}
                disabled={commenting || !newComment.trim()}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {commenting ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin">⟳</span>
                    Posting...
                  </span>
                ) : (
                  'Post Comment'
                )}
              </button>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-6">
            {discussion.comments && discussion.comments.length > 0 ? (
              discussion.comments.map((comment) => (
                <div key={comment.id} className="border-l-4 border-purple-200 pl-6 py-2 hover:border-purple-400 transition-colors duration-300">
                  <div className="flex items-start gap-4">
                    {/* Upvote */}
                    <div className="flex flex-col items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleUpvoteComment(comment.id)}
                        className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600 hover:from-purple-100 hover:to-pink-100 hover:text-purple-600 transition-all duration-300 flex items-center justify-center font-bold hover:scale-110"
                      >
                        ▲
                      </button>
                      <span className="text-sm font-bold text-gray-700">
                        {comment.upvotes}
                      </span>
                    </div>

                    {/* Comment Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-xs font-bold">
                            {(comment.user.first_name || comment.user.email).charAt(0).toUpperCase()}
                          </div>
                          <span className="font-semibold text-gray-900">
                            {comment.user.first_name || comment.user.email}
                          </span>
                        </div>
                        {comment.is_instructor_reply && (
                          <span className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 text-xs px-3 py-1 rounded-full font-bold border border-purple-200">
                            👨‍🏫 Instructor
                          </span>
                        )}
                        <span className="text-sm text-gray-500">
                          {new Date(comment.created_at).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>

                      <p className="text-gray-700 whitespace-pre-wrap mb-3 leading-relaxed">
                        {comment.content}
                      </p>

                      <button
                        onClick={() => {
                          setReplyingTo(comment.id);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-2"
                      >
                        <span>↩️</span>
                        <span>Reply</span>
                        {comment.reply_count > 0 && (
                          <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs">
                            {comment.reply_count}
                          </span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">💭</div>
                <p className="text-gray-600 text-lg">
                  No comments yet. Be the first to comment!
                </p>
              </div>
            )}
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

export default DiscussionDetail;