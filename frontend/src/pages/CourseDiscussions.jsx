import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CourseDiscussions = () => {
  const { courseId } = useParams();
  const { user } = useAuth();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newDiscussion, setNewDiscussion] = useState({ title: '', content: '' });

  // Mock course data
  const course = {
    id: parseInt(courseId),
    title: 'Complete Web Development Bootcamp',
    instructor: 'Sarah Johnson'
  };

  // Mock discussions data
  const [discussions, setDiscussions] = useState([
    {
      id: 1,
      title: 'How to set up the development environment on Windows?',
      content: 'I\'m having trouble setting up Node.js on my Windows machine. Can someone help?',
      author: {
        name: 'John Doe',
        avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=6366f1&color=fff',
        isInstructor: false
      },
      createdAt: '2 hours ago',
      replies: 5,
      upvotes: 12,
      isPinned: false,
      isResolved: false
    },
    {
      id: 2,
      title: 'Best practices for CSS organization',
      content: 'What are some recommended ways to organize CSS in larger projects?',
      author: {
        name: 'Sarah Johnson',
        avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=ec4899&color=fff',
        isInstructor: true
      },
      createdAt: '5 hours ago',
      replies: 15,
      upvotes: 28,
      isPinned: true,
      isResolved: false
    },
    {
      id: 3,
      title: 'Error in Lesson 5 - React Hooks',
      content: 'I\'m getting an error when trying to use useState. The code seems correct...',
      author: {
        name: 'Mike Chen',
        avatar: 'https://ui-avatars.com/api/?name=Mike+Chen&background=10b981&color=fff',
        isInstructor: false
      },
      createdAt: 'Yesterday',
      replies: 8,
      upvotes: 6,
      isPinned: false,
      isResolved: true
    },
    {
      id: 4,
      title: 'Resources for learning Git',
      content: 'Can anyone recommend additional resources for learning Git?',
      author: {
        name: 'Emily Davis',
        avatar: 'https://ui-avatars.com/api/?name=Emily+Davis&background=f59e0b&color=fff',
        isInstructor: false
      },
      createdAt: '2 days ago',
      replies: 12,
      upvotes: 20,
      isPinned: false,
      isResolved: false
    }
  ]);

  const handleCreateDiscussion = (e) => {
    e.preventDefault();
    
    const newDiscussionObj = {
      id: discussions.length + 1,
      title: newDiscussion.title,
      content: newDiscussion.content,
      author: {
        name: user?.full_name || 'You',
        avatar: `https://ui-avatars.com/api/?name=${user?.first_name}+${user?.last_name}&background=6366f1&color=fff`,
        isInstructor: user?.role === 'instructor'
      },
      createdAt: 'Just now',
      replies: 0,
      upvotes: 0,
      isPinned: false,
      isResolved: false
    };

    setDiscussions([newDiscussionObj, ...discussions]);
    setNewDiscussion({ title: '', content: '' });
    setShowCreateForm(false);
  };

  const handleUpvote = (id) => {
    setDiscussions(discussions.map(d => 
      d.id === id ? { ...d, upvotes: d.upvotes + 1 } : d
    ));
  };

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

      {/* Page Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to={`/courses/${courseId}`}
            className="inline-flex items-center text-indigo-100 hover:text-white mb-4 transition"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Course
          </Link>
          <h1 className="text-4xl font-bold mb-2">Course Discussions</h1>
          <p className="text-indigo-100 text-lg">{course.title}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Create Discussion Button */}
        {!showCreateForm && (
          <div className="mb-8">
            <button
              onClick={() => setShowCreateForm(true)}
              className="w-full bg-white border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-indigo-500 hover:bg-indigo-50 transition text-center"
            >
              <svg className="w-8 h-8 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <p className="text-gray-700 font-medium">Start a new discussion</p>
            </button>
          </div>
        )}

        {/* Create Discussion Form */}
        {showCreateForm && (
          <div className="bg-white rounded-xl shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">New Discussion</h2>
            <form onSubmit={handleCreateDiscussion} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  value={newDiscussion.title}
                  onChange={(e) => setNewDiscussion({ ...newDiscussion, title: e.target.value })}
                  required
                  placeholder="What's your question or topic?"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  id="content"
                  value={newDiscussion.content}
                  onChange={(e) => setNewDiscussion({ ...newDiscussion, content: e.target.value })}
                  required
                  rows={4}
                  placeholder="Provide more details..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setNewDiscussion({ title: '', content: '' });
                  }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition"
                >
                  Post Discussion
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Discussions List */}
        <div className="space-y-4">
          {discussions.map((discussion) => (
            <Link
              key={discussion.id}
              to={`/courses/${courseId}/discussions/${discussion.id}`}
              className="block bg-white rounded-xl shadow-md hover:shadow-lg transition p-6"
            >
              <div className="flex items-start space-x-4">
                {/* Upvote Button */}
                <div className="flex flex-col items-center flex-shrink-0">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleUpvote(discussion.id);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                  >
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                  <span className="text-sm font-medium text-gray-700">{discussion.upvotes}</span>
                </div>

                {/* Discussion Content */}
                <div className="flex-1 min-w-0">
                  {/* Title and Badges */}
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center flex-wrap gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 hover:text-indigo-600 transition">
                          {discussion.title}
                        </h3>
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
                      <p className="text-gray-600 line-clamp-2 mb-3">{discussion.content}</p>
                    </div>
                  </div>

                  {/* Author and Meta */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={discussion.author.avatar}
                        alt={discussion.author.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="flex items-center space-x-2 text-sm">
                        <span className="font-medium text-gray-900">{discussion.author.name}</span>
                        {discussion.author.isInstructor && (
                          <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-medium rounded">
                            Instructor
                          </span>
                        )}
                        <span className="text-gray-500">•</span>
                        <span className="text-gray-500">{discussion.createdAt}</span>
                      </div>
                    </div>

                    {/* Reply Count */}
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      {discussion.replies} {discussion.replies === 1 ? 'reply' : 'replies'}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {discussions.length === 0 && !showCreateForm && (
          <div className="text-center py-16 bg-white rounded-xl">
            <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No discussions yet</h3>
            <p className="text-gray-600 mb-6">Be the first to start a discussion!</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition"
            >
              Start Discussion
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDiscussions;