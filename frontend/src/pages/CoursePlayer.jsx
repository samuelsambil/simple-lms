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
      alert('Lesson marked as complete! 🎉');
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading course...</div>
      </div>
    );
  }

  if (error && !enrollment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl text-red-600 mb-4">{error}</div>
          <Link to="/courses" className="text-blue-600 hover:underline">
            Browse Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-6">
              <Link to="/" className="text-xl font-bold text-gray-900">
                Simple LMS
              </Link>
              <span className="text-gray-600">
                {enrollment?.course.title}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <Link
                to="/my-courses"
                className="text-blue-600 hover:text-blue-700"
              >
                ← Back to My Courses
              </Link>
              <button
                onClick={logout}
                className="text-red-600 hover:text-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-bold text-lg mb-2">Course Content</h2>
            <div className="flex items-center gap-2 text-sm">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all"
                  style={{
                    width: `${enrollment?.progress_percentage || 0}%`,
                  }}
                ></div>
              </div>
              <span className="text-gray-600">
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
                  className={`w-full text-left p-3 rounded-lg mb-2 transition ${
                    isActive
                      ? 'bg-blue-50 border-2 border-blue-500'
                      : 'hover:bg-gray-50 border-2 border-transparent'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {isCompleted ? (
                        <span className="text-green-600 text-xl">✓</span>
                      ) : (
                        <span className="text-gray-400 text-xl">○</span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-gray-500 mb-1">
                        Lesson {index + 1}
                      </div>

                      {/* TITLE + QUIZ BADGE */}
                      <div className="font-medium text-gray-900 mb-1">
                        {lesson.title}
                        {lesson.quiz && (
                          <span className="ml-2 text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                            📝 Quiz
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-gray-500">
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
        <div className="flex-1 overflow-y-auto">
          {currentLesson ? (
            <div className="max-w-5xl mx-auto p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-6">
                {currentLesson.title}
              </h1>

              {error && (
                <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                  {error}
                </div>
              )}

              {/* Video Player */}
              {currentLesson.lesson_type === 'video' && (
                <div className="mb-6">
                  <div className="aspect-video bg-black rounded-lg overflow-hidden">
                    {currentLesson.video_file_url ? (
                      // Uploaded video file
                      <video
                        controls
                        className="w-full h-full"
                        poster=""
                      >
                        <source src={currentLesson.video_file_url} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    ) : currentLesson.video_url ? (
                      // YouTube video
                      <iframe
                        src={getVideoEmbedUrl(currentLesson.video_url)}
                        title={currentLesson.title}
                        className="w-full h-full"
                        allowFullScreen
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      ></iframe>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white">
                        <p>No video available</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Text Content */}
              {currentLesson.lesson_type === 'text' &&
                currentLesson.text_content && (
                  <div className="prose max-w-none mb-6 bg-white p-8 rounded-lg shadow">
                    <div className="whitespace-pre-wrap">
                      {currentLesson.text_content}
                    </div>
                  </div>
                )}

              {/* Description */}
              {currentLesson.description && (
                <div className="bg-white p-6 rounded-lg shadow mb-6">
                  <h3 className="font-bold text-lg mb-2">About this lesson</h3>
                  <p className="text-gray-600">
                    {currentLesson.description}
                  </p>
                </div>
              )}

              {/* Quiz Button - ADD THIS */}
{currentLesson.quiz && (
  <div className="bg-white p-6 rounded-lg shadow mb-6">
    <div className="flex items-center justify-between">
      <div>
        <h3 className="font-bold text-lg text-gray-900 mb-2">
          📝 Quiz Available
        </h3>
        <p className="text-gray-600">
          Test your knowledge of this lesson
        </p>
      </div>
      <Link
        to={`/quiz/${currentLesson.quiz.id}/take`}
        className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 font-medium"
      >
        Take Quiz
      </Link>
    </div>
  </div>
)}

{/* Complete Lesson Button */}
<div className="bg-white p-6 rounded-lg shadow">
  {isLessonCompleted(currentLesson.id) ? (
    <div className="text-center">
      <div className="text-green-600 font-medium text-lg mb-2">
        ✓ Lesson Completed
      </div>
      <p className="text-gray-600">
        Great job! Move on to the next lesson.
      </p>
    </div>
  ) : (
    <button
      onClick={handleCompleteLesson}
      disabled={completing}
      className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-medium disabled:opacity-50"
    >
      {completing ? 'Marking as complete...' : 'Mark as Complete'}
    </button>
  )}
</div>


              {/* Navigation */}
              <div className="flex justify-between mt-6">
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
                  className="bg-gray-200 text-gray-700 px-6 py-2 rounded hover:bg-gray-300 disabled:opacity-50"
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
                  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  Next Lesson →
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-600">
                <p className="text-xl">Select a lesson to start learning</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CoursePlayer;