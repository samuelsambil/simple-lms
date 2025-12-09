import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';

function TakeQuiz() {
  const { quizId } = useParams();
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [attempt, setAttempt] = useState(null);
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    fetchQuizAndStart();
  }, [quizId, user, navigate]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const fetchQuizAndStart = async () => {
    try {
      // Get quiz details
      const quizRes = await api.get(`/quizzes/${quizId}/`);
      setQuiz(quizRes.data);

      // Start new attempt
      const attemptRes = await api.post(`/quizzes/${quizId}/start_attempt/`);
      setAttempt(attemptRes.data);

      // Set timer if exists
      if (quizRes.data.time_limit_minutes) {
        setTimeLeft(quizRes.data.time_limit_minutes * 60);
      }

      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load quiz');
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionId, answerId) => {
    setAnswers({
      ...answers,
      [questionId]: answerId,
    });
  };

  const handleSubmit = async () => {
    if (submitting) return;

    // Check if all questions answered
    const unanswered = quiz.questions.filter(
      (q) => !answers[q.id]
    );

    if (unanswered.length > 0) {
      if (!window.confirm(
        `You have ${unanswered.length} unanswered question(s). Submit anyway?`
      )) {
        return;
      }
    }

    setSubmitting(true);

    try {
      // Format answers for submission
      const formattedAnswers = Object.entries(answers).map(
        ([questionId, answerId]) => ({
          question_id: parseInt(questionId),
          answer_id: parseInt(answerId),
        })
      );

      const timeTaken = quiz.time_limit_minutes && timeLeft !== null
        ? quiz.time_limit_minutes * 60 - timeLeft
        : 0;

      console.log('Submitting quiz:', {
        quizId,
        answers: formattedAnswers,
        time_taken_seconds: timeTaken
      });

      // Submit quiz
      const result = await api.post(`/quizzes/${quizId}/submit/`, {
        answers: formattedAnswers,
        time_taken_seconds: timeTaken,
      });

      console.log('Submit successful:', result.data);

      // Navigate to results
      navigate(`/quiz/${quizId}/results/${result.data.id}`);
    } catch (err) {
      console.error('Submit error:', err);
      console.error('Error response:', err.response?.data);
      setError(err.response?.data?.error || err.response?.data?.detail || 'Failed to submit quiz');
      setSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading quiz...</div>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl text-red-600 mb-4">{error || 'Quiz not found'}</div>
          <Link to="/courses" className="text-blue-600 hover:underline">
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  const currentQ = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-gray-900">{quiz.title}</h1>
              <p className="text-sm text-gray-600">
                Question {currentQuestion + 1} of {quiz.questions.length}
              </p>
            </div>

            {/* Timer */}
            {timeLeft !== null && (
              <div className={`text-2xl font-bold ${
                timeLeft < 60 ? 'text-red-600' : 'text-blue-600'
              }`}>
                ⏱️ {formatTime(timeLeft)}
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          {/* Question */}
          <div className="mb-8">
            <div className="flex items-start gap-4 mb-6">
              <span className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                {currentQuestion + 1}
              </span>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {currentQ.question_text}
                </h2>
                <p className="text-sm text-gray-600">
                  {currentQ.points} point{currentQ.points !== 1 ? 's' : ''}
                </p>
              </div>
            </div>

            {/* Answer Options */}
            <div className="space-y-3">
              {currentQ.answers.map((answer) => (
                <button
                  key={answer.id}
                  onClick={() => handleAnswerSelect(currentQ.id, answer.id)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition ${
                    answers[currentQ.id] === answer.id
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      answers[currentQ.id] === answer.id
                        ? 'border-blue-600 bg-blue-600'
                        : 'border-gray-300'
                    }`}>
                      {answers[currentQ.id] === answer.id && (
                        <span className="text-white text-sm">✓</span>
                      )}
                    </div>
                    <span className="text-gray-900">{answer.answer_text}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
            disabled={currentQuestion === 0}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Previous
          </button>

          <div className="text-sm text-gray-600">
            {Object.keys(answers).length} / {quiz.questions.length} answered
          </div>

          {currentQuestion < quiz.questions.length - 1 ? (
            <button
              onClick={() => setCurrentQuestion((prev) => prev + 1)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Quiz'}
            </button>
          )}
        </div>

        {/* Question Navigation */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="font-bold text-gray-900 mb-4">Question Navigator</h3>
          <div className="grid grid-cols-10 gap-2">
            {quiz.questions.map((q, index) => (
              <button
                key={q.id}
                onClick={() => setCurrentQuestion(index)}
                className={`w-10 h-10 rounded-lg font-medium ${
                  index === currentQuestion
                    ? 'bg-blue-600 text-white'
                    : answers[q.id]
                    ? 'bg-green-100 text-green-700 border border-green-300'
                    : 'bg-gray-100 text-gray-600 border border-gray-300'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default TakeQuiz;