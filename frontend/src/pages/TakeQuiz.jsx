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
      const quizRes = await api.get(`/quizzes/${quizId}/`);
      setQuiz(quizRes.data);

      const attemptRes = await api.post(`/quizzes/${quizId}/start_attempt/`);
      setAttempt(attemptRes.data);

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

    const unanswered = quiz.questions.filter((q) => !answers[q.id]);

    if (unanswered.length > 0) {
      if (!window.confirm(
        `You have ${unanswered.length} unanswered question(s). Submit anyway?`
      )) {
        return;
      }
    }

    setSubmitting(true);

    try {
      const formattedAnswers = Object.entries(answers).map(
        ([questionId, answerId]) => ({
          question_id: parseInt(questionId),
          answer_id: parseInt(answerId),
        })
      );

      const timeTaken = quiz.time_limit_minutes && timeLeft !== null
        ? quiz.time_limit_minutes * 60 - timeLeft
        : 0;

      const result = await api.post(`/quizzes/${quizId}/submit/`, {
        answers: formattedAnswers,
        time_taken_seconds: timeTaken,
      });

      navigate(`/quiz/${quizId}/results/${result.data.id}`);
    } catch (err) {
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
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-300 mb-4"></div>
          <div className="text-xl text-white font-medium">Loading quiz...</div>
        </div>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <div className="text-2xl text-white font-bold mb-4">{error || 'Quiz not found'}</div>
          <Link to="/courses" className="text-purple-300 hover:text-purple-200 underline text-lg">
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  const currentQ = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-3">
                <span className="text-3xl">📝</span>
                <span>{quiz.title}</span>
              </h1>
              <p className="text-sm text-purple-300 font-medium">
                Question {currentQuestion + 1} of {quiz.questions.length}
              </p>
            </div>

            {/* Timer */}
            {timeLeft !== null && (
              <div className={`px-6 py-3 rounded-xl font-bold text-2xl flex items-center gap-2 ${
                timeLeft < 60 
                  ? 'bg-red-500/20 text-red-300 border-2 border-red-500/50 animate-pulse' 
                  : 'bg-purple-500/20 text-purple-300 border-2 border-purple-500/30'
              }`}>
                <span className="text-3xl">⏱️</span>
                <span>{formatTime(timeLeft)}</span>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 h-3 rounded-full transition-all duration-500 relative overflow-hidden"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-500/20 border-l-4 border-red-500 text-red-200 px-6 py-4 rounded-lg mb-6 flex items-center gap-3">
            <span className="text-2xl">⚠️</span>
            <span className="font-medium">{error}</span>
          </div>
        )}

        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8 mb-6 border border-white/20">
          {/* Question */}
          <div className="mb-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-xl flex items-center justify-center font-bold text-xl shadow-lg">
                {currentQuestion + 1}
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-white mb-3 leading-tight">
                  {currentQ.question_text}
                </h2>
                <div className="inline-flex items-center gap-2 bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 px-4 py-2 rounded-full text-sm font-semibold">
                  <span>⭐</span>
                  <span>{currentQ.points} point{currentQ.points !== 1 ? 's' : ''}</span>
                </div>
              </div>
            </div>

            {/* Answer Options */}
            <div className="space-y-3">
              {currentQ.answers.map((answer) => (
                <button
                  key={answer.id}
                  onClick={() => handleAnswerSelect(currentQ.id, answer.id)}
                  className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-300 ${
                    answers[currentQ.id] === answer.id
                      ? 'border-purple-400 bg-purple-500/30 shadow-lg shadow-purple-500/50 scale-[1.02]'
                      : 'border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                      answers[currentQ.id] === answer.id
                        ? 'border-purple-400 bg-purple-500 shadow-lg'
                        : 'border-white/40'
                    }`}>
                      {answers[currentQ.id] === answer.id && (
                        <span className="text-white text-lg font-bold">✓</span>
                      )}
                    </div>
                    <span className="text-white text-lg font-medium">{answer.answer_text}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
            disabled={currentQuestion === 0}
            className="px-8 py-4 bg-white/10 backdrop-blur-lg text-white rounded-xl hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 font-semibold border border-white/20"
          >
            ← Previous
          </button>

          <div className="text-center">
            <div className="text-white/70 text-sm mb-1">Answered</div>
            <div className="text-white font-bold text-2xl">
              {Object.keys(answers).length} / {quiz.questions.length}
            </div>
          </div>

          {currentQuestion < quiz.questions.length - 1 ? (
            <button
              onClick={() => setCurrentQuestion((prev) => prev + 1)}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 font-semibold hover:scale-105"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-10 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:shadow-lg hover:shadow-green-500/50 transition-all duration-300 font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 hover:scale-105"
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">⟳</span>
                  Submitting...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <span>✓</span>
                  <span>Submit Quiz</span>
                </span>
              )}
            </button>
          )}
        </div>

        {/* Question Navigator */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-white/20">
          <h3 className="font-bold text-white text-xl mb-4 flex items-center gap-2">
            <span>🗺️</span>
            <span>Question Navigator</span>
          </h3>
          <div className="grid grid-cols-10 gap-3">
            {quiz.questions.map((q, index) => (
              <button
                key={q.id}
                onClick={() => setCurrentQuestion(index)}
                className={`w-12 h-12 rounded-xl font-bold transition-all duration-300 ${
                  index === currentQuestion
                    ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg scale-110 border-2 border-white'
                    : answers[q.id]
                    ? 'bg-green-500/30 text-green-300 border-2 border-green-400/50 hover:scale-105'
                    : 'bg-white/10 text-white/60 border-2 border-white/20 hover:bg-white/20 hover:scale-105'
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