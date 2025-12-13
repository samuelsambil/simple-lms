import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthProvider, AuthContext } from './context/AuthContext';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import MyCourses from './pages/MyCourses';
import CoursePlayer from './pages/CoursePlayer';
import InstructorDashboard from './pages/InstructorDashboard';
import CreateCourse from './pages/CreateCourse';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import WriteReview from './pages/WriteReview';
import CourseAnalytics from './pages/CourseAnalytics';
import TakeQuiz from './pages/TakeQuiz';
import QuizResults from './pages/QuizResults';
import CourseDiscussions from './pages/CourseDiscussions';
import DiscussionDetail from './pages/DiscussionDetail';

// Protected Route Component
function ProtectedRoute({ children, requireAuth = true, requireRole = null }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <div className="text-xl text-white">Loading...</div>
        </div>
      </div>
    );
  }

  // Require authentication
  if (requireAuth && !user) {
    return <Navigate to="/login" replace />;
  }

  // Check role requirement
  if (requireRole && user?.role !== requireRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}

// Public Route Component (redirect if already logged in)
function PublicRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <div className="text-xl text-white">Loading...</div>
        </div>
      </div>
    );
  }

  // If already logged in, redirect to home
  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/courses" element={<Courses />} />
      <Route path="/courses/:id" element={<CourseDetail />} />

      {/* Auth Routes (redirect if logged in) */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      {/* Protected Student Routes */}
      <Route
        path="/my-courses"
        element={
          <ProtectedRoute requireRole="student">
            <MyCourses />
          </ProtectedRoute>
        }
      />
      <Route
        path="/learn/:courseId"
        element={
          <ProtectedRoute requireRole="student">
            <CoursePlayer />
          </ProtectedRoute>
        }
      />
      <Route
        path="/quiz/:quizId/take"
        element={
          <ProtectedRoute requireRole="student">
            <TakeQuiz />
          </ProtectedRoute>
        }
      />
      <Route
        path="/quiz/:quizId/results/:attemptId"
        element={
          <ProtectedRoute requireRole="student">
            <QuizResults />
          </ProtectedRoute>
        }
      />

      {/* Protected Instructor Routes */}
      <Route
        path="/instructor/dashboard"
        element={
          <ProtectedRoute requireRole="instructor">
            <InstructorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/instructor/create-course"
        element={
          <ProtectedRoute requireRole="instructor">
            <CreateCourse />
          </ProtectedRoute>
        }
      />
      <Route
        path="/instructor/courses/:courseId/analytics"
        element={
          <ProtectedRoute requireRole="instructor">
            <CourseAnalytics />
          </ProtectedRoute>
        }
      />

      {/* Protected Routes (Any authenticated user) */}
      <Route
        path="/profile/edit"
        element={
          <ProtectedRoute>
            <EditProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile/:userId"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/courses/:courseId/review"
        element={
          <ProtectedRoute>
            <WriteReview />
          </ProtectedRoute>
        }
      />
      <Route
        path="/courses/:courseId/discussions"
        element={
          <ProtectedRoute>
            <CourseDiscussions />
          </ProtectedRoute>
        }
      />
      <Route
        path="/courses/:courseId/discussions/:discussionId"
        element={
          <ProtectedRoute>
            <DiscussionDetail />
          </ProtectedRoute>
        }
      />

      {/* 404 Route */}
      <Route
        path="*"
        element={
          <div className="min-h-screen bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center">
            <div className="text-center bg-white/10 backdrop-blur-lg rounded-2xl p-12 border border-white/20">
              <div className="text-8xl mb-4">😵</div>
              <h1 className="text-4xl font-bold text-white mb-4">404 - Page Not Found</h1>
              <p className="text-white/80 mb-6">The page you're looking for doesn't exist.</p>
              <a
                href="/"
                className="inline-block bg-white text-pink-600 px-6 py-3 rounded-lg font-semibold hover:bg-pink-50 transition-all"
              >
                Go Home
              </a>
            </div>
          </div>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;