import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const TakeQuiz = () => {
  const { quizId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Mock quiz data
  const quizData = {
    id: parseInt(quizId),
    title: 'HTML Fundamentals Quiz',
    description: 'Test your knowledge of HTML basics',
    courseTitle: 'Complete Web Development Bootcamp',
    totalQuestions: 10,
    passingScore: 70,
    timeLimit: 600, // 10 minutes in seconds
    questions: [
      {
        id: 1,
        question: 'What does HTML stand for?',
        options: [
          'Hyper Text Markup Language',
          'High Tech Modern Language',
          'Home Tool Markup Language',
          'Hyperlinks and Text Markup Language'
        ],
        correctAnswer: 0
      },
      {
        id: 2,
        question: 'Which HTML tag is used to define an internal style sheet?',
        options: ['<css>', '<script>', '<style>', '<link>'],
        correctAnswer: 2
      },
      {
        id: 3,
        question: 'Which is the correct HTML element for the largest heading?',
        options: ['<heading>', '<h6>', '<h1>', '<head>'],
        correctAnswer: 2
      },
      {
        id: 4,
        question: 'What is the correct HTML for adding a background color?',
        options: [
          '<body bg="yellow">',
          '<background>yellow</background>',
          '<body style="background-color:yellow;">',
          '<body color="yellow">'
        ],
        correctAnswer: 2
      },
      {
        id: 5,
        question: 'Choose the correct HTML element to define important text:',
        options: ['<strong>', '<b>', '<important>', '<i>'],
        correctAnswer: 0
      },
      {
        id: 6,
        question: 'Which character is used to indicate an end tag?',
        options: ['<', '^', '/', '*'],
        correctAnswer: 2
      },
      {
        id: 7,
        question: 'How can you make a numbered list?',
        options: ['<ul>', '<ol>', '<list>', '<nl>'],
        correctAnswer: 1
      },
      {
        id: 8,
        question: 'How can you make an email link?',
        options: [
          '<a href="xxx@example.com">',
          '<mail href="xxx@example.com">',
          '<a href="mailto:xxx@example.com">',
          '<email>xxx@example.com</email>'
        ],
        correctAnswer: 2
      },
      {
        id: 9,
        question: 'What is the correct HTML for creating a hyperlink?',
        options: [
          '<a url="http://www.example.com">Example</a>',
          '<a name="http://www.example.com">Example</a>',
          '<a href="http://www.example.com">Example</a>',
          '<a>http://www.example.com</a>'
        ],
        correctAnswer: 2
      },
      {
        id: 10,
        question: 'Which HTML attribute is used to define inline styles?',
        options: ['class', 'styles', 'style', 'font'],
        correctAnswer: 2
      }
    ]
  };

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(quizData.timeLimit);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (questionId, optionIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: optionIndex
    });
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < quizData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleQuestionJump = (index) => {
    setCurrentQuestion(index);
  };

  const calculateScore = () => {
    let correct = 0;
    quizData.questions.forEach((question) => {
      if (selectedAnswers[question.id] === question.correctAnswer) {
        correct++;
      }
    });
    return (correct / quizData.questions.length) * 100;
  };

  const handleSubmit = () => {
    const unanswered = quizData.questions.length - Object.keys(selectedAnswers).length;
    if (unanswered > 0) {
      if (!window.confirm(`You have ${unanswered} unanswered questions. Are you sure you want to submit?`)) {
        return;
      }
    }
    
    // Mock: Submit quiz and navigate to results
    const attemptId = Date.now();
    const score = calculateScore();
    
    // In real app, save to API first
    navigate(`/quiz/${quizId}/results/${attemptId}`, {
      state: {
        score,
        totalQuestions: quizData.questions.length,
        selectedAnswers,
        questions: quizData.questions,
        passingScore: quizData.passingScore
      }
    });
  };

  const handleAutoSubmit = () => {
    // Auto-submit when time runs out
    const attemptId = Date.now();
    const score = calculateScore();
    
    navigate(`/quiz/${quizId}/results/${attemptId}`, {
      state: {
        score,
        totalQuestions: quizData.questions.length,
        selectedAnswers,
        questions: quizData.questions,
        passingScore: quizData.passingScore,
        timeExpired: true
      }
    });
  };

  const currentQ = quizData.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quizData.questions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">A</span>
                </div>
                <span className="hidden md:inline text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Academe
                </span>
              </Link>
              <div className="hidden md:block h-8 w-px bg-gray-300"></div>
              <div className="hidden md:block">
                <p className="text-sm text-gray-600">{quizData.courseTitle}</p>
                <p className="font-semibold text-gray-900">{quizData.title}</p>
              </div>
            </div>

            {/* Timer */}
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
              timeRemaining < 60 ? 'bg-red-100 text-red-700' : 'bg-indigo-100 text-indigo-700'
            }`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-semibold">{formatTime(timeRemaining)}</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">
              Question {currentQuestion + 1} of {quizData.questions.length}
            </span>
            <span className="text-sm font-medium text-gray-900">
              {Object.keys(selectedAnswers).length} / {quizData.questions.length} answered
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Question Navigator (Sidebar) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-4">Questions</h3>
              <div className="grid grid-cols-5 lg:grid-cols-4 gap-2">
                {quizData.questions.map((q, index) => (
                  <button
                    key={q.id}
                    onClick={() => handleQuestionJump(index)}
                    className={`w-10 h-10 rounded-lg font-medium text-sm transition ${
                      index === currentQuestion
                        ? 'bg-indigo-600 text-white'
                        : selectedAnswers[q.id] !== undefined
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-gray-200 space-y-2 text-sm">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-indigo-600 rounded mr-2"></div>
                  <span className="text-gray-600">Current</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-100 border border-green-300 rounded mr-2"></div>
                  <span className="text-gray-600">Answered</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded mr-2"></div>
                  <span className="text-gray-600">Not Answered</span>
                </div>
              </div>
            </div>
          </div>

          {/* Question Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-md p-8 mb-6">
              <div className="mb-6">
                <span className="text-sm font-medium text-indigo-600">Question {currentQuestion + 1}</span>
                <h2 className="text-2xl font-bold text-gray-900 mt-2">{currentQ.question}</h2>
              </div>

              <div className="space-y-3">
                {currentQ.options.map((option, index) => {
                  const isSelected = selectedAnswers[currentQ.id] === index;
                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(currentQ.id, index)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 flex-shrink-0 ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-600'
                            : 'border-gray-300'
                        }`}>
                          {isSelected && (
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <span className={`flex-1 ${isSelected ? 'text-indigo-900 font-medium' : 'text-gray-700'}`}>
                          {option}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center">
              <button
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Previous
              </button>

              <div className="flex gap-3">
                {currentQuestion === quizData.questions.length - 1 ? (
                  <button
                    onClick={() => setShowSubmitConfirm(true)}
                    className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition shadow-lg"
                  >
                    Submit Quiz
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition"
                  >
                    Next →
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Submit Quiz?</h3>
              <p className="text-gray-600">
                You've answered {Object.keys(selectedAnswers).length} out of {quizData.questions.length} questions.
                {Object.keys(selectedAnswers).length < quizData.questions.length && (
                  <span className="block mt-2 text-orange-600 font-medium">
                    {quizData.questions.length - Object.keys(selectedAnswers).length} questions are still unanswered.
                  </span>
                )}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowSubmitConfirm(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
              >
                Review
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TakeQuiz;