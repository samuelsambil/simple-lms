import { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';

function CoursePlayer() {
  const { courseId } = useParams();
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [enrollment, setEnrollment] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (user.role !== 'student') {
      navigate('/');
      return;
    }

    fetchEnrollment();
  }, [courseId, user, navigate]);

  const fetchEnrollment = async () => {
    try {
      const response = await api.get('/enrollments/');
      const foundEnrollment = response.data.find(
        (e) => e.course.id === parseInt(courseId)
      );

      if (!foundEnrollment) {
        setError('You are not enrolled in this course');
        setLoading(false);
        return;
      }

      setEnrollment(foundEnrollment);

      const firstIncomplete = foundEnrollment.lesson_progress.find(
        (lp) => !lp.completed
      );

      if (firstIncomplete) {
        setCurrentLesson(firstIncomplete.lesson);
      } else if (foundEnrollment.lesson_progress.length > 0) {
        setCurrentLesson(foundEnrollment.lesson_progress[0].lesson);
      }

      setLoading(false);
    } catch (err) {
      setError('Failed to load course');
      setLoading(false);
    }
  };

  const handleCompleteLesson = async () => {
    if (!currentLesson || !enrollment) return;

    setCompleting(true);
    setError('');

    try {
      await api.post(`/enrollments/${enrollment.id}/complete_lesson/`, {
        lesson_id: currentLesson.id,
      });

      await fetchEnrollment();
    } catch (err) {
      setError('Failed to mark lesson as complete');
    } finally {
      setCompleting(false);
    }
  };

  const isLessonCompleted = (lessonId) => {
    if (!enrollment) return false;
    const progress = enrollment.lesson_progress.find(
      (lp) => lp.lesson.id === lessonId
    );
    return progress?.completed || false;
  };

  const getVideoEmbedUrl = (url) => {
    if (!url) return '';

    let videoId = '';

    if (url.includes('youtube.com/watch?v=')) {
      videoId = url.split('watch?v=')[1].split('&')[0];
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split('?')[0];
    } else if (url.includes('youtube.com/embed/')) {
      return url;
    }

    return `https://www.youtube.com/embed/${videoId}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-400 mb-4"></div>
          <div className="text-xl text-white font-medium">Loading course...</div>
        </div>
      </div>
    );
  }

  if (error && !enrollment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <div className="text-2xl text-white mb-4 font-bold">{error}</div>
          <Link to="/courses" className="text-blue-400 hover:text-blue-300 underline text-lg">
            Browse Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 text-white">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-6">
              <Link to="/" className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300">
                SimpleLMS
              </Link>
              <div className="hidden md:block text-gray-300 max-w-md truncate">
                {enrollment?.course.title}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Link
                to="/my-courses"
                className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors font-medium"
              >
                <span>←</span>
                <span className="hidden sm:inline">My Courses</span>
              </Link>
              <button
                onClick={logout}
                className="px-4 py-2 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-colors text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Sidebar */}
        <div className="w-80 bg-black/40 backdrop-blur-xl border-r border-white/10 overflow-y-auto">
          <div className="p-4 border-b border-white/10">
            <h2 className="font-bold text-lg mb-3 text-white">Course Content</h2>
            <div className="flex items-center gap-2 text-sm">
              <div className="flex-1 bg-white/10 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-green-400 to-emerald-400 h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${enrollment?.progress_percentage || 0}%`,
                  }}
                ></div>
              </div>
              <span className="text-gray-300 font-semibold">
                {Math.round(enrollment?.progress_percentage || 0)}%
              </span>
            </div>
          </div>

          <div className="p-2">
            {enrollment?.lesson_progress.map((lessonProgress, index) => {
              const lesson = lessonProgress.lesson;
              const isActive = currentLesson?.id === lesson.id;
              const isCompleted = lessonProgress.completed;

              return (
                <button
                  key={lesson.id}
                  onClick={() => setCurrentLesson(lesson)}
                  className={`w-full text-left p-4 rounded-xl mb-2 transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500/30 to-purple-500/30 border-2 border-blue-400 shadow-lg'
                      : 'hover:bg-white/5 border-2 border-transparent'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {isCompleted ? (
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-400 flex items-center justify-center text-white text-sm font-bold">
                          ✓
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full border-2 border-gray-500 flex items-center justify-center text-gray-500 text-sm">
                          {index + 1}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-gray-400 mb-1 uppercase tracking-wider">
                        Lesson {index + 1}
                      </div>

                      <div className="font-semibold text-white mb-1 flex items-center gap-2 flex-wrap">
                        <span className="line-clamp-2">{lesson.title}</span>
                        {lesson.quiz && (
                          <span className="text-xs bg-purple-500/30 text-purple-300 px-2 py-1 rounded-full font-semibold whitespace-nowrap">
                            📝 Quiz
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <span>
                          {lesson.lesson_type === 'video' ? '🎥' : '📝'}
                        </span>
                        <span>{lesson.duration} min</span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-800/50 to-blue-900/50">
          {currentLesson ? (
            <div className="max-w-5xl mx-auto p-8">
              <h1 className="text-4xl font-bold text-white mb-6 leading-tight">
                {currentLesson.title}
              </h1>

              {error && (
                <div className="bg-red-500/20 border-l-4 border-red-500 text-red-200 px-6 py-4 rounded-lg mb-6 flex items-center gap-3">
                  <span className="text-2xl">⚠️</span>
                  <span className="font-medium">{error}</span>
                </div>
              )}

              {/* Video Player */}
              {currentLesson.lesson_type === 'video' && (
                <div className="mb-8">
                  <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                    {currentLesson.video_file_url ? (
                      <video
                        controls
                        className="w-full h-full"
                      >
                        <source src={currentLesson.video_file_url} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    ) : currentLesson.video_url ? (
                      <iframe
                        src={getVideoEmbedUrl(currentLesson.video_url)}
                        title={currentLesson.title}
                        className="w-full h-full"
                        allowFullScreen
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      ></iframe>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <div className="text-center">
                          <div className="text-6xl mb-4">🎥</div>
                          <p>No video available</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Text Content */}
              {currentLesson.lesson_type === 'text' &&
                currentLesson.text_content && (
                  <div className="prose prose-invert max-w-none mb-8 bg-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/10 shadow-xl">
                    <div className="whitespace-pre-wrap text-gray-200 leading-relaxed">
                      {currentLesson.text_content}
                    </div>
                  </div>
                )}

              {/* Description */}
              {currentLesson.description && (
                <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10 mb-6 shadow-xl">
                  <h3 className="font-bold text-lg mb-2 text-white flex items-center gap-2">
                    <span>📖</span>
                    <span>About this lesson</span>
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {currentLesson.description}
                  </p>
                </div>
              )}

              {/* Quiz Button */}
              {currentLesson.quiz && (
                <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-lg p-6 rounded-2xl border border-purple-400/30 mb-6 shadow-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-xl text-white mb-2 flex items-center gap-2">
                        <span>📝</span>
                        <span>Quiz Available</span>
                      </h3>
                      <p className="text-gray-300">
                        Test your knowledge of this lesson
                      </p>
                    </div>
                    <Link
                      to={`/quiz/${currentLesson.quiz.id}/take`}
                      className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 whitespace-nowrap"
                    >
                      Take Quiz
                    </Link>
                  </div>
                </div>
              )}

              {/* Complete Lesson Button */}
              <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10 mb-6 shadow-xl">
                {isLessonCompleted(currentLesson.id) ? (
                  <div className="text-center">
                    <div className="text-green-400 font-bold text-xl mb-2 flex items-center justify-center gap-2">
                      <span className="text-3xl">✓</span>
                      <span>Lesson Completed</span>
                    </div>
                    <p className="text-gray-300">
                      Great job! Move on to the next lesson.
                    </p>
                  </div>
                ) : (
                  <button
                    onClick={handleCompleteLesson}
                    disabled={completing}
                    className="w-full px-8 py-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold text-lg shadow-lg hover:shadow-green-500/50 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {completing ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="animate-spin">⟳</span>
                        Marking as complete...
                      </span>
                    ) : (
                      'Mark as Complete'
                    )}
                  </button>
                )}
              </div>

              {/* Navigation */}
              <div className="flex justify-between gap-4">
                <button
                  onClick={() => {
                    const currentIndex =
                      enrollment.lesson_progress.findIndex(
                        (lp) => lp.lesson.id === currentLesson.id
                      );
                    if (currentIndex > 0) {
                      setCurrentLesson(
                        enrollment.lesson_progress[currentIndex - 1].lesson
                      );
                    }
                  }}
                  disabled={
                    enrollment.lesson_progress.findIndex(
                      (lp) => lp.lesson.id === currentLesson.id
                    ) === 0
                  }
                  className="px-8 py-3 rounded-xl bg-white/10 backdrop-blur-lg text-white font-semibold hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 border border-white/20"
                >
                  ← Previous Lesson
                </button>

                <button
                  onClick={() => {
                    const currentIndex =
                      enrollment.lesson_progress.findIndex(
                        (lp) => lp.lesson.id === currentLesson.id
                      );
                    if (
                      currentIndex <
                      enrollment.lesson_progress.length - 1
                    ) {
                      setCurrentLesson(
                        enrollment.lesson_progress[currentIndex + 1]
                          .lesson
                      );
                    }
                  }}
                  disabled={
                    enrollment.lesson_progress.findIndex(
                      (lp) => lp.lesson.id === currentLesson.id
                    ) ===
                    enrollment.lesson_progress.length - 1
                  }
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow-lg hover:shadow-blue-500/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 disabled:hover:scale-100"
                >
                  Next Lesson →
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-400">
                <div className="text-7xl mb-4">📚</div>
                <p className="text-2xl font-semibold">Select a lesson to start learning</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CoursePlayer;