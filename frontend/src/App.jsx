import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/routing/ProtectedRoute';
import PublicRoute from './components/routing/PublicRoute';

// Import all pages
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

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* ========== PUBLIC ROUTES ========== */}
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetail />} />

          {/* ========== AUTH ROUTES (redirect if logged in) ========== */}
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

          {/* ========== STUDENT ROUTES ========== */}
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

          {/* ========== INSTRUCTOR ROUTES ========== */}
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

          {/* ========== AUTHENTICATED USER ROUTES ========== */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
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
            path="/profile/edit"
            element={
              <ProtectedRoute>
                <EditProfile />
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

          {/* ========== 404 NOT FOUND ========== */}
          <Route
            path="*"
            element={
              <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <h1 className="text-6xl font-bold text-gray-900">404</h1>
                  <p className="mt-4 text-xl text-gray-600">Page not found</p>
                  <a
                    href="/"
                    className="mt-6 inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                  >
                    Go Home
                  </a>
                </div>
              </div>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
