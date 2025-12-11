import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
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
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetail />} />
          <Route path="/my-courses" element={<MyCourses />} />
          <Route path="/learn/:courseId" element={<CoursePlayer />} />
          <Route path="/instructor/dashboard" element={<InstructorDashboard />} />
          <Route path="/instructor/create-course" element={<CreateCourse />} />
          <Route path="/instructor/courses/:courseId/analytics" element={<CourseAnalytics />} />  {/* Add this */}
          <Route path="/quiz/:quizId/take" element={<TakeQuiz />} />  {/* Add this */}
          <Route path="/quiz/:quizId/results/:attemptId" element={<QuizResults />} />  {/* Add this */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:userId" element={<Profile />} />
          <Route path="/courses/:courseId/discussions" element={<CourseDiscussions />} />  {/* Add this */}
          <Route path="/courses/:courseId/discussions/:discussionId" element={<DiscussionDetail />} />  {/* Add this */}
          <Route path="/profile/edit" element={<EditProfile />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:userId" element={<Profile />} />
          <Route path="/profile/edit" element={<EditProfile />} />
          <Route path="/courses/:courseId/review" element={<WriteReview />} />  {/* Add this */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;