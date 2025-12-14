import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CoursePlayer = () => {
  const { courseId } = useParams();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [currentLesson, setCurrentLesson] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // overview, resources, notes

  // Mock course data
  const course = {
    id: parseInt(courseId),
    title: 'Complete Web Development Bootcamp',
    instructor: 'Sarah Johnson',
    progress: 45,
    sections: [
      {
        id: 1,
        title: 'Getting Started',
        lessons: [
          {
            id: 1,
            title: 'Welcome to the Course',
            duration: '5:30',
            type: 'video',
            completed: true,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
          },
          {
            id: 2,
            title: 'Setting Up Your Environment',
            duration: '15:20',
            type: 'video',
            completed: true,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
          },
          {
            id: 3,
            title: 'Your First Web Page',
            duration: '12:45',
            type: 'video',
            completed: false,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
          }
        ]
      },
      {
        id: 2,
        title: 'HTML Fundamentals',
        lessons: [
          {
            id: 4,
            title: 'HTML Basics',
            duration: '18:30',
            type: 'video',
            completed: false
          },
          {
            id: 5,
            title: 'HTML Elements',
            duration: '22:15',
            type: 'video',
            completed: false
          },
          {
            id: 6,
            title: 'Practice Exercise',
            duration: '10 questions',
            type: 'quiz',
            completed: false,
            quizId: 1
          }
        ]
      },
      {
        id: 3,
        title: 'CSS Styling',
        lessons: [
          {
            id: 7,
            title: 'CSS Introduction',
            duration: '20:00',
            type: 'video',
            completed: false
          },
          {
            id: 8,
            title: 'Selectors and Properties',
            duration: '25:40',
            type: 'video',
            completed: false
          }
        ]
      }
    ]
  };

  // Flatten all lessons
  const allLessons = course.sections.flatMap(section => section.lessons);
  const currentLessonData = allLessons[currentLesson];

  const handleLessonClick = (lessonIndex) => {
    setCurrentLesson(lessonIndex);
  };

  const handleCompleteLesson = () => {
    // Mock: Mark lesson as complete
    console.log('Marking lesson as complete:', currentLessonData.id);
    
    // Move to next lesson
    if (currentLesson < allLessons.length - 1) {
      setCurrentLesson(currentLesson + 1);
    }
  };

  const handlePreviousLesson = () => {
    if (currentLesson > 0) {
      setCurrentLesson(currentLesson - 1);
    }
  };

  const handleNextLesson = () => {
    if (currentLesson < allLessons.length - 1) {
      setCurrentLesson(currentLesson + 1);
    }
  };

  const handleQuizClick = (quizId) => {
    navigate(`/quiz/${quizId}/take`);
  };

  const getLessonIcon = (type, completed) => {
    if (type === 'quiz') {
      return (
        <svg className={`w-5 h-5 ${completed ? 'text-green-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      );
    }
    
    if (completed) {
      return (
        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      );
    }
    
    return (
      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Top Navigation */}
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-gray-400 hover:text-white transition lg:hidden"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">A</span>
                </div>
                <span className="hidden md:inline text-white font-semibold">Academe</span>
              </Link>
            </div>

            <div className="flex-1 px-8">
              <h1 className="text-white font-semibold text-lg truncate hidden md:block">
                {course.title}
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <Link
                to="/my-courses"
                className="text-gray-300 hover:text-white transition text-sm font-medium hidden md:block"
              >
                ← My Courses
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
        </div>
      </nav>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'w-full md:w-96' : 'hidden'} bg-gray-800 border-r border-gray-700 flex flex-col overflow-hidden absolute md:relative inset-0 z-40 md:z-0`}>
          <div className="p-4 border-b border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-white font-semibold text-lg">Course Content</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-gray-400 hover:text-white md:hidden"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">{allLessons.filter(l => l.completed).length} of {allLessons.length} complete</span>
              <span className="text-indigo-400 font-medium">{course.progress}%</span>
            </div>
            <div className="mt-2 w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full transition-all"
                style={{ width: `${course.progress}%` }}
              ></div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {course.sections.map((section, sectionIndex) => {
              let lessonIndexOffset = course.sections.slice(0, sectionIndex).reduce((sum, s) => sum + s.lessons.length, 0);
              
              return (
                <div key={section.id} className="border-b border-gray-700">
                  <div className="p-4 bg-gray-750">
                    <h3 className="text-white font-medium text-sm">{section.title}</h3>
                    <p className="text-gray-400 text-xs mt-1">{section.lessons.length} lessons</p>
                  </div>
                  <div>
                    {section.lessons.map((lesson, lessonIndex) => {
                      const globalIndex = lessonIndexOffset + lessonIndex;
                      const isActive = globalIndex === currentLesson;
                      
                      return (
                        <button
                          key={lesson.id}
                          onClick={() => handleLessonClick(globalIndex)}
                          className={`w-full p-4 flex items-start space-x-3 hover:bg-gray-700 transition ${
                            isActive ? 'bg-gray-700 border-l-4 border-indigo-500' : ''
                          }`}
                        >
                          <div className="flex-shrink-0 mt-1">
                            {getLessonIcon(lesson.type, lesson.completed)}
                          </div>
                          <div className="flex-1 text-left">
                            <p className={`text-sm ${isActive ? 'text-white font-medium' : 'text-gray-300'}`}>
                              {lesson.title}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">{lesson.duration}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Video/Content Area */}
          <div className="flex-shrink-0 bg-black">
            {currentLessonData.type === 'video' ? (
              <div className="relative" style={{ paddingTop: '56.25%' }}>
                <video
                  key={currentLessonData.id}
                  className="absolute inset-0 w-full h-full"
                  controls
                  src={currentLessonData.videoUrl}
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            ) : (
              <div className="h-96 flex items-center justify-center">
                <div className="text-center">
                  <svg className="w-24 h-24 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                  <h3 className="text-white text-xl font-semibold mb-2">Quiz Time!</h3>
                  <p className="text-gray-400 mb-6">Test your knowledge with this practice quiz</p>
                  <button
                    onClick={() => handleQuizClick(currentLessonData.quizId)}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition"
                  >
                    Start Quiz
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Lesson Info & Controls */}
          <div className="flex-1 overflow-y-auto bg-gray-800">
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                <div className="mb-4 md:mb-0">
                  <h2 className="text-2xl font-bold text-white mb-2">{currentLessonData.title}</h2>
                  <p className="text-gray-400">Instructor: {course.instructor}</p>
                </div>
                <button
                  onClick={handleCompleteLesson}
                  className={`px-6 py-3 rounded-lg font-semibold transition ${
                    currentLessonData.completed
                      ? 'bg-green-600 text-white'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  {currentLessonData.completed ? (
                    <span className="flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Completed
                    </span>
                  ) : (
                    'Mark as Complete'
                  )}
                </button>
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-700 mb-6">
                <nav className="flex space-x-8">
                  {['overview', 'resources', 'notes'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm transition capitalize ${
                        activeTab === tab
                          ? 'border-indigo-500 text-white'
                          : 'border-transparent text-gray-400 hover:text-gray-300'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="text-gray-300">
                {activeTab === 'overview' && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">About this lesson</h3>
                    <p className="leading-relaxed">
                      In this lesson, you'll learn the fundamentals of web development. We'll cover the basic concepts
                      and set up your development environment for the rest of the course. By the end of this lesson,
                      you'll be ready to start building your first web application.
                    </p>
                    <div className="mt-6">
                      <h4 className="font-semibold text-white mb-2">What you'll learn:</h4>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Understanding the basics of HTML structure
                        </li>
                        <li className="flex items-start">
                          <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Setting up your code editor
                        </li>
                        <li className="flex items-start">
                          <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Creating your first web page
                        </li>
                      </ul>
                    </div>
                  </div>
                )}

                {activeTab === 'resources' && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Downloadable Resources</h3>
                    <div className="space-y-3">
                      <a href="#" className="flex items-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition">
                        <svg className="w-8 h-8 text-indigo-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <div className="flex-1">
                          <p className="font-medium text-white">Lesson Slides.pdf</p>
                          <p className="text-sm text-gray-400">2.4 MB</p>
                        </div>
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </a>
                      <a href="#" className="flex items-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition">
                        <svg className="w-8 h-8 text-indigo-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        </svg>
                        <div className="flex-1">
                          <p className="font-medium text-white">Source Code.zip</p>
                          <p className="text-sm text-gray-400">854 KB</p>
                        </div>
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </a>
                    </div>
                  </div>
                )}

                {activeTab === 'notes' && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Your Notes</h3>
                    <textarea
                      placeholder="Take notes here..."
                      className="w-full h-64 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    ></textarea>
                    <button className="mt-3 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
                      Save Notes
                    </button>
                  </div>
                )}
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t border-gray-700">
                <button
                  onClick={handlePreviousLesson}
                  disabled={currentLesson === 0}
                  className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ← Previous Lesson
                </button>
                <button
                  onClick={handleNextLesson}
                  disabled={currentLesson === allLessons.length - 1}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next Lesson →
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CoursePlayer;