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
      alert('Discussion marked as resolved!');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to mark as resolved');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading discussion...</div>
      </div>
    );
  }

  if (!discussion) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl text-red-600 mb-4">Discussion not found</div>
          <Link to={`/courses/${courseId}/discussions`} className="text-blue-600 hover:underline">
            Back to Discussions
          </Link>
        </div>
      </div>
    );
  }

  const isInstructor = user?.role === 'instructor';
  const isDiscussionOwner = discussion.user.id === user?.id;

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
              <Link to={`/courses/${courseId}/discussions`} className="text-gray-600 hover:text-gray-900">
                ← Back to Discussions
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
      <main className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {error && (
          <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Discussion Post */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <div className="flex items-start gap-6">
            {/* Upvote Section */}
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={handleUpvoteDiscussion}
                className="text-2xl text-gray-400 hover:text-blue-600 transition"
              >
                ▲
              </button>
              <span className="text-xl font-bold text-gray-700">
                {discussion.upvotes}
              </span>
            </div>

            {/* Discussion Content */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {discussion.title}
                  </h1>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <span>
                      By {discussion.user.first_name || discussion.user.email}
                    </span>
                    <span>•</span>
                    <span>{new Date(discussion.created_at).toLocaleString()}</span>
                  </div>
                </div>

                {/* Status Badges */}
                <div className="flex flex-col gap-2">
                  {discussion.is_pinned && (
                    <span className="bg-yellow-100 text-yellow-800 text-sm px-3 py-1 rounded">
                      📌 Pinned
                    </span>
                  )}
                  {discussion.is_resolved && (
                    <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded">
                      ✓ Resolved
                    </span>
                  )}
                </div>
              </div>

              <div className="prose max-w-none mb-6">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {discussion.content}
                </p>
              </div>

              {/* Resolve Button */}
              {!discussion.is_resolved && (isInstructor || isDiscussionOwner) && (
                <button
                  onClick={handleResolve}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm"
                >
                  ✓ Mark as Resolved
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {discussion.comment_count} {discussion.comment_count === 1 ? 'Reply' : 'Replies'}
          </h2>

          {/* Add Comment Form */}
          <form onSubmit={handleAddComment} className="mb-8">
            <div className="mb-4">
              {replyingTo && (
                <div className="bg-blue-50 border border-blue-200 p-3 rounded mb-2 flex justify-between items-center">
                  <span className="text-sm text-blue-800">Replying to a comment</span>
                  <button
                    type="button"
                    onClick={() => setReplyingTo(null)}
                    className="text-blue-800 hover:text-blue-900"
                  >
                    ✕
                  </button>
                </div>
              )}
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={replyingTo ? "Write your reply..." : "Add your comment..."}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={commenting || !newComment.trim()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
            >
              {commenting ? 'Posting...' : 'Post Comment'}
            </button>
          </form>

          {/* Comments List */}
          <div className="space-y-6">
            {discussion.comments && discussion.comments.length > 0 ? (
              discussion.comments.map((comment) => (
                <div key={comment.id} className="border-l-4 border-gray-200 pl-6">
                  <div className="flex items-start gap-4">
                    {/* Upvote */}
                    <div className="flex flex-col items-center gap-1">
                      <button
                        onClick={() => handleUpvoteComment(comment.id)}
                        className="text-gray-400 hover:text-blue-600"
                      >
                        ▲
                      </button>
                      <span className="text-sm text-gray-700">
                        {comment.upvotes}
                      </span>
                    </div>

                    {/* Comment Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-medium text-gray-900">
                          {comment.user.first_name || comment.user.email}
                        </span>
                        {comment.is_instructor_reply && (
                          <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                            Instructor
                          </span>
                        )}
                        <span className="text-sm text-gray-500">
                          {new Date(comment.created_at).toLocaleString()}
                        </span>
                      </div>

                      <p className="text-gray-700 whitespace-pre-wrap mb-3">
                        {comment.content}
                      </p>

                      <button
                        onClick={() => {
                          setReplyingTo(comment.id);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="text-sm text-blue-600 hover:text-blue-700"
                      >
                        Reply ({comment.reply_count})
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600 text-center py-8">
                No comments yet. Be the first to comment!
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default DiscussionDetail;