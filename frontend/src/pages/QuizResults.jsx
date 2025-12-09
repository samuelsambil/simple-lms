import { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';

function QuizResults() {
  const { quizId, attemptId } = useParams();
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    fetchResults();
  }, [attemptId, user, navigate]);

  const fetchResults = async () => {
    try {
      const response = await api.get(`/quiz-attempts/${attemptId}/`);
      setAttempt(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load results');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading results...</div>
      </div>
    );
  }

  if (error || !attempt) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl text-red-600 mb-4">{error || 'Results not found'}</div>
          <Link to="/courses" className="text-blue-600 hover:underline">
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  const correctCount = attempt.student_answers.filter((a) => a.is_correct).length;
  const totalQuestions = attempt.student_answers.length;

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
              <Link to="/my-courses" className="text-gray-600 hover:text-gray-900">
                ← My Courses
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
        {/* Results Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          {/* Pass/Fail Banner */}
          <div className={`p-8 text-center ${
            attempt.passed ? 'bg-green-600' : 'bg-red-600'
          } text-white`}>
            <div className="text-6xl mb-4">
              {attempt.passed ? '🎉' : '😞'}
            </div>
            <h1 className="text-3xl font-bold mb-2">
              {attempt.passed ? 'Congratulations!' : 'Not Quite There'}
            </h1>
            <p className="text-xl">
              {attempt.passed 
                ? 'You passed the quiz!' 
                : 'Keep trying, you can do it!'}
            </p>
          </div>

          {/* Score Details */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {Math.round(attempt.score)}%
                </div>
                <div className="text-sm text-gray-600">Your Score</div>
              </div>

              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {correctCount}/{totalQuestions}
                </div>
                <div className="text-sm text-gray-600">Correct Answers</div>
              </div>

              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">
                  {attempt.earned_points}/{attempt.total_points}
                </div>
                <div className="text-sm text-gray-600">Points Earned</div>
              </div>

              <div className="text-center">
                <div className="text-4xl font-bold text-orange-600 mb-2">
                  {attempt.attempt_number}
                </div>
                <div className="text-sm text-gray-600">Attempt Number</div>
              </div>
            </div>

            {attempt.time_taken_seconds && (
              <div className="text-center text-gray-600 mb-6">
                Time taken: {Math.floor(attempt.time_taken_seconds / 60)}m {attempt.time_taken_seconds % 60}s
              </div>
            )}

            {/* Detailed Answers */}
            <div className="border-t pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Question Review
              </h2>

              <div className="space-y-6">
                {attempt.student_answers.map((answer, index) => (
                  <div
                    key={answer.id}
                    className={`border-2 rounded-lg p-6 ${
                      answer.is_correct
                        ? 'border-green-200 bg-green-50'
                        : 'border-red-200 bg-red-50'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                        answer.is_correct
                          ? 'bg-green-600 text-white'
                          : 'bg-red-600 text-white'
                      }`}>
                        {answer.is_correct ? '✓' : '✗'}
                      </div>

                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 mb-3">
                          Question {index + 1}: {answer.question_text}
                        </h3>

                        <div className="space-y-2">
                          <div>
                            <span className="font-medium text-gray-700">Your answer: </span>
                            <span className={answer.is_correct ? 'text-green-700' : 'text-red-700'}>
                              {answer.selected_answer_text}
                            </span>
                          </div>

                          {!answer.is_correct && (
                            <div>
                              <span className="font-medium text-gray-700">Correct answer: </span>
                              <span className="text-green-700">
                                {answer.correct_answer_text}
                              </span>
                            </div>
                          )}

                          {answer.explanation && (
                            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
                              <span className="font-medium text-blue-900">💡 Explanation: </span>
                              <span className="text-blue-800">{answer.explanation}</span>
                            </div>
                          )}
                        </div>

                        <div className="mt-3 text-sm text-gray-600">
                          Points: {answer.points_earned} / {answer.is_correct ? answer.points_earned : answer.points_earned + 1}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <Link
            to="/my-courses"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-medium"
          >
            Back to My Courses
          </Link>
          
          {!attempt.passed && (
            <Link
              to={`/quiz/${quizId}/take`}
              className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 font-medium"
            >
              Try Again
            </Link>
          )}
        </div>
      </main>
    </div>
  );
}

export default QuizResults;