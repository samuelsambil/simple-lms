import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DiscussionDetail = () => {
  const { courseId, discussionId } = useParams();
  const { user } = useAuth();
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);

  // Mock discussion data
  const [discussion, setDiscussion] = useState({
    id: parseInt(discussionId),
    title: 'How to set up the development environment on Windows?',
    content: 'I\'m having trouble setting up Node.js on my Windows machine. I\'ve downloaded the installer but when I run it, nothing happens. Has anyone else experienced this? Any solutions would be greatly appreciated!',
    author: {
      name: 'John Doe',
      avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=6366f1&color=fff',
      isInstructor: false,
      role: 'Student'
    },
    createdAt: '2 hours ago',
    upvotes: 12,
    isResolved: false,
    isPinned: false
  });

  // Mock comments/replies
  const [comments, setComments] = useState([
    {
      id: 1,
      content: 'Try running the installer as administrator. Right-click on the installer and select "Run as administrator".',
      author: {
        name: 'Sarah Johnson',
        avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=ec4899&color=fff',
        isInstructor: true,
        role: 'Instructor'
      },
      createdAt: '1 hour ago',
      upvotes: 8,
      replies: [
        {
          id: 2,
          content: 'Thanks! That worked perfectly. I should have thought of that 😅',
          author: {
            name: 'John Doe',
            avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=6366f1&color=fff',
            isInstructor: false,
            role: 'Student'
          },
          createdAt: '45 minutes ago',
          upvotes: 2
        }
      ]
    },
    {
      id: 3,
      content: 'Also make sure you don\'t have any antivirus software blocking the installation. I had the same issue with Windows Defender.',
      author: {
        name: 'Mike Chen',
        avatar: 'https://ui-avatars.com/api/?name=Mike+Chen&background=10b981&color=fff',
        isInstructor: false,
        role: 'Student'
      },
      createdAt: '30 minutes ago',
      upvotes: 5,
      replies: []
    }
  ]);

  const handleUpvote = (type, id) => {
    if (type === 'discussion') {
      setDiscussion({ ...discussion, upvotes: discussion.upvotes + 1 });
    } else if (type === 'comment') {
      setComments(comments.map(c => 
        c.id === id ? { ...c, upvotes: c.upvotes + 1 } : c
      ));
    }
  };

  const handleResolve = () => {
    setDiscussion({ ...discussion, isResolved: !discussion.isResolved });
  };

  const handlePostComment = (e, parentId = null) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const newCommentObj = {
      id: Date.now(),
      content: newComment,
      author: {
        name: user?.full_name || 'You',
        avatar: `https://ui-avatars.com/api/?name=${user?.first_name}+${user?.last_name}&background=6366f1&color=fff`,
        isInstructor: user?.role === 'instructor',
        role: user?.role === 'instructor' ? 'Instructor' : 'Student'
      },
      createdAt: 'Just now',
      upvotes: 0,
      replies: []
    };

    if (parentId) {
      // Add as reply
      setComments(comments.map(c => 
        c.id === parentId 
          ? { ...c, replies: [...c.replies, newCommentObj] }
          : c
      ));
    } else {
      // Add as top-level comment
      setComments([...comments, newCommentObj]);
    }

    setNewComment('');
    setReplyingTo(null);
  };

  const canResolve = user?.role === 'instructor' || user?.id === discussion.author.id;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Academe
              </span>
            </Link>

            <Link to="/profile" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user?.first_name?.[0] || 'U'}
                </span>
              </div>
            </Link>
          </div>
        </div>
      </nav>

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link to={`/courses/${courseId}`} className="hover:text-indigo-600">Course</Link>
            <span>›</span>
            <Link to={`/courses/${courseId}/discussions`} className="hover:text-indigo-600">Discussions</Link>
            <span>›</span>
            <span className="text-gray-900 font-medium">Discussion</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Discussion Post */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-6">
          {/* Header with Actions */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start space-x-4 flex-1">
              {/* Upvote */}
              <div className="flex flex-col items-center flex-shrink-0">
                <button
                  onClick={() => handleUpvote('discussion')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </button>
                <span className="text-sm font-medium text-gray-700">{discussion.upvotes}</span>
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center flex-wrap gap-2 mb-3">
                  <h1 className="text-2xl font-bold text-gray-900">{discussion.title}</h1>
                  {discussion.isPinned && (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                      📌 Pinned
                    </span>
                  )}
                  {discussion.isResolved && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                      ✓ Resolved
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-3 mb-4">
                  <img
                    src={discussion.author.avatar}
                    alt={discussion.author.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">{discussion.author.name}</span>
                      {discussion.author.isInstructor && (
                        <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-medium rounded">
                          Instructor
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-gray-500">{discussion.createdAt}</span>
                  </div>
                </div>

                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{discussion.content}</p>
              </div>
            </div>

            {/* Resolve Button */}
            {canResolve && (
              <button
                onClick={handleResolve}
                className={`ml-4 px-4 py-2 rounded-lg font-medium transition ${
                  discussion.isResolved
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                {discussion.isResolved ? 'Unresolve' : 'Mark Resolved'}
              </button>
            )}
          </div>
        </div>

        {/* Comments Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900">
            {comments.reduce((total, c) => total + 1 + c.replies.length, 0)} Responses
          </h2>

          {/* Comment Form */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <form onSubmit={(e) => handlePostComment(e)}>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write your response..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-3"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!newComment.trim()}
                  className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Post Response
                </button>
              </div>
            </form>
          </div>

          {/* Comments List */}
          {comments.map((comment) => (
            <div key={comment.id}>
              {/* Main Comment */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-start space-x-4">
                  {/* Upvote */}
                  <div className="flex flex-col items-center flex-shrink-0">
                    <button
                      onClick={() => handleUpvote('comment', comment.id)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition"
                    >
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    </button>
                    <span className="text-sm font-medium text-gray-700">{comment.upvotes}</span>
                  </div>

                  {/* Comment Content */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <img
                        src={comment.author.avatar}
                        alt={comment.author.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">{comment.author.name}</span>
                          {comment.author.isInstructor && (
                            <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-medium rounded">
                              Instructor
                            </span>
                          )}
                        </div>
                        <span className="text-sm text-gray-500">{comment.createdAt}</span>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-3">{comment.content}</p>

                    <button
                      onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                      className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                      Reply
                    </button>

                    {/* Reply Form */}
                    {replyingTo === comment.id && (
                      <form onSubmit={(e) => handlePostComment(e, comment.id)} className="mt-4">
                        <textarea
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Write your reply..."
                          rows={3}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-2"
                        />
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setReplyingTo(null);
                              setNewComment('');
                            }}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={!newComment.trim()}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
                          >
                            Reply
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              </div>

              {/* Replies */}
              {comment.replies.length > 0 && (
                <div className="ml-16 mt-4 space-y-4">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                      <div className="flex items-start space-x-4">
                        <img
                          src={reply.author.avatar}
                          alt={reply.author.name}
                          className="w-8 h-8 rounded-full"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="font-medium text-gray-900">{reply.author.name}</span>
                            {reply.author.isInstructor && (
                              <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-medium rounded">
                                Instructor
                              </span>
                            )}
                            <span className="text-sm text-gray-500">• {reply.createdAt}</span>
                          </div>
                          <p className="text-gray-700">{reply.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Empty State */}
          {comments.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl">
              <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No responses yet</h3>
              <p className="text-gray-600">Be the first to respond to this discussion!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiscussionDetail;