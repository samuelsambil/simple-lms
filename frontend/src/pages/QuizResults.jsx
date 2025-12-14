import { Link, useParams, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const QuizResults = () => {
  const { quizId, attemptId } = useParams();
  const { user } = useAuth();
  const location = useLocation();

  // Get data from navigation state (passed from TakeQuiz)
  const {
    score = 0,
    totalQuestions = 0,
    selectedAnswers = {},
    questions = [],
    passingScore = 70,
    timeExpired = false
  } = location.state || {};

  const passed = score >= passingScore;
  const correctCount = Math.round((score / 100) * totalQuestions);

  // Get letter grade
  const getLetterGrade = (score) => {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  };

  const letterGrade = getLetterGrade(score);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white shadow-sm">
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

            <Link
              to="/my-courses"
              className="text-gray-700 hover:text-indigo-600 font-medium transition"
            >
              ← My Courses
            </Link>
          </div>
        </div>
      </nav>

      {/* Results Banner */}
      <div className={`${passed ? 'bg-gradient-to-r from-green-600 to-emerald-600' : 'bg-gradient-to-r from-red-600 to-orange-600'} text-white py-12`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {timeExpired && (
            <div className="mb-4 inline-flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Time Expired - Quiz Auto-Submitted
            </div>
          )}
          
          <div className="mb-6">
            {passed ? (
              <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>

          <h1 className="text-4xl font-bold mb-2">
            {passed ? 'Congratulations! You Passed!' : 'Quiz Completed'}
          </h1>
          <p className="text-xl opacity-90">
            {passed 
              ? 'Great job! You\'ve successfully completed this quiz.'
              : `You need ${passingScore}% to pass. Keep practicing and try again!`
            }
          </p>
        </div>
      </div>

      {/* Score Cards */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-8">
        <div className="grid md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <p className="text-gray-600 text-sm font-medium mb-2">Your Score</p>
            <p className="text-4xl font-bold text-gray-900">{Math.round(score)}%</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <p className="text-gray-600 text-sm font-medium mb-2">Grade</p>
            <p className={`text-4xl font-bold ${
              letterGrade === 'A' ? 'text-green-600' :
              letterGrade === 'B' ? 'text-blue-600' :
              letterGrade === 'C' ? 'text-yellow-600' :
              'text-red-600'
            }`}>{letterGrade}</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <p className="text-gray-600 text-sm font-medium mb-2">Correct</p>
            <p className="text-4xl font-bold text-green-600">{correctCount}</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <p className="text-gray-600 text-sm font-medium mb-2">Total</p>
            <p className="text-4xl font-bold text-gray-900">{totalQuestions}</p>
          </div>
        </div>
      </div>

      {/* Performance Analysis */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Performance Analysis</h2>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-700 font-medium">Accuracy</span>
                <span className="text-gray-900 font-semibold">{Math.round(score)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className={`h-4 rounded-full transition-all ${
                    passed
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600'
                      : 'bg-gradient-to-r from-red-600 to-orange-600'
                  }`}
                  style={{ width: `${score}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0%</span>
                <span className="font-medium">Passing: {passingScore}%</span>
                <span>100%</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 pt-6 border-t border-gray-200">
              <div>
                <div className="flex items-center mb-2">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{correctCount}</p>
                    <p className="text-sm text-gray-600">Correct Answers</p>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center mb-2">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{totalQuestions - correctCount}</p>
                    <p className="text-sm text-gray-600">Incorrect Answers</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Question Review */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Review Your Answers</h2>
          
          <div className="space-y-8">
            {questions.map((question, index) => {
              const userAnswer = selectedAnswers[question.id];
              const isCorrect = userAnswer === question.correctAnswer;
              const wasAnswered = userAnswer !== undefined;

              return (
                <div key={question.id} className="pb-8 border-b border-gray-200 last:border-0">
                  <div className="flex items-start mb-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 ${
                      isCorrect ? 'bg-green-100' : wasAnswered ? 'bg-red-100' : 'bg-gray-100'
                    }`}>
                      {isCorrect ? (
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : wasAnswered ? (
                        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      ) : (
                        <span className="text-gray-400 text-sm font-medium">{index + 1}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Question {index + 1}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          isCorrect 
                            ? 'bg-green-100 text-green-700' 
                            : wasAnswered 
                            ? 'bg-red-100 text-red-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {isCorrect ? 'Correct' : wasAnswered ? 'Incorrect' : 'Not Answered'}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-4">{question.question}</p>

                      <div className="space-y-2">
                        {question.options.map((option, optionIndex) => {
                          const isUserAnswer = userAnswer === optionIndex;
                          const isCorrectAnswer = question.correctAnswer === optionIndex;

                          return (
                            <div
                              key={optionIndex}
                              className={`p-4 rounded-lg border-2 ${
                                isCorrectAnswer
                                  ? 'border-green-500 bg-green-50'
                                  : isUserAnswer && !isCorrect
                                  ? 'border-red-500 bg-red-50'
                                  : 'border-gray-200 bg-gray-50'
                              }`}
                            >
                              <div className="flex items-center">
                                <div className="flex-shrink-0 mr-3">
                                  {isCorrectAnswer && (
                                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                      </svg>
                                    </div>
                                  )}
                                  {isUserAnswer && !isCorrect && (
                                    <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                      </svg>
                                    </div>
                                  )}
                                  {!isCorrectAnswer && !isUserAnswer && (
                                    <div className="w-6 h-6 border-2 border-gray-300 rounded-full"></div>
                                  )}
                                </div>
                                <span className={`flex-1 ${
                                  isCorrectAnswer ? 'text-green-900 font-medium' : 
                                  isUserAnswer ? 'text-red-900 font-medium' : 
                                  'text-gray-700'
                                }`}>
                                  {option}
                                </span>
                                {isCorrectAnswer && (
                                  <span className="text-xs font-medium text-green-700 ml-2">Correct Answer</span>
                                )}
                                {isUserAnswer && !isCorrect && (
                                  <span className="text-xs font-medium text-red-700 ml-2">Your Answer</span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/my-courses"
            className="flex-1 bg-gray-100 text-gray-700 text-center py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
          >
            Back to My Courses
          </Link>
          {!passed && (
            <Link
              to={`/quiz/${quizId}/take`}
              className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-center py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition"
            >
              Try Again
            </Link>
          )}
          {passed && (
            <Link
              to="/my-courses"
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-center py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition"
            >
              Continue Learning
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizResults;