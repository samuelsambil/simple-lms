import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CourseDetail = () => {
  const { id } = useParams();
  const { user, logout, isStudent, isInstructor } = useAuth();
  const navigate = useNavigate();
  const [enrolled, setEnrolled] = useState(false);
  const [showEnrollModal, setShowEnrollModal] = useState(false);

  // Mock course data - Replace with API call
  const course = {
    id: parseInt(id),
    title: 'Complete Web Development Bootcamp',
    subtitle: 'Master modern web development with HTML, CSS, JavaScript, React, Node.js, and more',
    instructor: {
      name: 'Sarah Johnson',
      avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=6366f1&color=fff',
      title: 'Senior Web Developer',
      students: 45000,
      courses: 12,
      rating: 4.8
    },
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&h=600&fit=crop',
    price: 49.99,
    rating: 4.8,
    reviews: 2300,
    students: 12500,
    duration: '40 hours',
    level: 'Beginner',
    language: 'English',
    lastUpdated: 'December 2024',
    category: 'Web Development',
    description: `This comprehensive course covers everything you need to become a full-stack web developer. 
    
    Starting from the basics of HTML and CSS, you'll progress through JavaScript, modern frameworks like React, backend development with Node.js, databases, and deployment strategies. By the end of this course, you'll have built multiple real-world projects and be ready to start your career as a web developer.`,
    
    whatYouLearn: [
      'Build responsive websites from scratch using HTML5 and CSS3',
      'Master JavaScript fundamentals and modern ES6+ features',
      'Create dynamic web applications with React.js',
      'Build RESTful APIs with Node.js and Express',
      'Work with databases including MongoDB and PostgreSQL',
      'Deploy applications to production using modern DevOps practices',
      'Implement authentication and authorization in web apps',
      'Use Git and GitHub for version control'
    ],
    
    requirements: [
      'A computer with internet connection',
      'No prior programming experience required',
      'Willingness to learn and practice',
      'Basic computer skills'
    ],
    
    curriculum: [
      {
        section: 'Getting Started',
        lectures: 8,
        duration: '1h 30m',
        lessons: [
          { title: 'Welcome to the Course', duration: '5:30', free: true },
          { title: 'Setting Up Your Development Environment', duration: '15:20', free: true },
          { title: 'Your First Web Page', duration: '12:45', free: false }
        ]
      },
      {
        section: 'HTML & CSS Fundamentals',
        lectures: 15,
        duration: '4h 15m',
        lessons: [
          { title: 'HTML Basics and Structure', duration: '18:30', free: false },
          { title: 'CSS Styling and Selectors', duration: '22:15', free: false },
          { title: 'Responsive Design with Flexbox', duration: '25:40', free: false }
        ]
      },
      {
        section: 'JavaScript Essentials',
        lectures: 20,
        duration: '6h 30m',
        lessons: [
          { title: 'Variables and Data Types', duration: '15:20', free: false },
          { title: 'Functions and Scope', duration: '20:35', free: false },
          { title: 'DOM Manipulation', duration: '28:45', free: false }
        ]
      },
      {
        section: 'React.js Framework',
        lectures: 18,
        duration: '7h 45m',
        lessons: [
          { title: 'Introduction to React', duration: '12:30', free: false },
          { title: 'Components and Props', duration: '24:15', free: false },
          { title: 'State and Lifecycle', duration: '30:20', free: false }
        ]
      }
    ],
    
    reviews: [
      {
        id: 1,
        user: 'John Doe',
        avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=6366f1&color=fff',
        rating: 5,
        date: '2 weeks ago',
        comment: 'Absolutely fantastic course! The instructor explains everything clearly and the projects are really practical. Highly recommended for anyone wanting to learn web development.'
      },
      {
        id: 2,
        user: 'Maria Garcia',
        avatar: 'https://ui-avatars.com/api/?name=Maria+Garcia&background=ec4899&color=fff',
        rating: 4,
        date: '1 month ago',
        comment: 'Great course with comprehensive content. The only downside is that some sections could use more practice exercises, but overall it\'s excellent value for money.'
      },
      {
        id: 3,
        user: 'Alex Thompson',
        avatar: 'https://ui-avatars.com/api/?name=Alex+Thompson&background=10b981&color=fff',
        rating: 5,
        date: '2 months ago',
        comment: 'This course changed my career! I went from knowing nothing about web development to landing my first developer job. The instructor is amazing and the content is up-to-date.'
      }
    ]
  };

  // Check if user is enrolled (mock - replace with API call)
  useEffect(() => {
    if (user && isStudent) {
      // Mock: randomly set enrolled status for demo
      const isEnrolled = Math.random() > 0.7;
      setEnrolled(isEnrolled);
    }
  }, [user, isStudent]);

  const handleEnroll = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!isStudent) {
      alert('Only students can enroll in courses');
      return;
    }

    // Mock enrollment - Replace with API call
    setEnrolled(true);
    setShowEnrollModal(true);
    setTimeout(() => setShowEnrollModal(false), 3000);
  };

  const StarRating = ({ rating }) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-5 h-5 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
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

            <div className="hidden md:flex items-center space-x-8">
              <Link to="/courses" className="text-gray-700 hover:text-indigo-600 font-medium transition">
                Courses
              </Link>
              {user ? (
                <>
                  {isStudent && (
                    <Link to="/my-courses" className="text-gray-700 hover:text-indigo-600 font-medium transition">
                      My Courses
                    </Link>
                  )}
                  {isInstructor && (
                    <Link to="/instructor/dashboard" className="text-gray-700 hover:text-indigo-600 font-medium transition">
                      Dashboard
                    </Link>
                  )}
                  <Link to="/profile" className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {user.first_name?.[0] || 'U'}
                      </span>
                    </div>
                  </Link>
                  <button onClick={logout} className="text-gray-600 hover:text-gray-900 font-medium">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-700 hover:text-indigo-600 font-medium">
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition font-medium"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-indigo-600">Home</Link>
            <span>›</span>
            <Link to="/courses" className="hover:text-indigo-600">Courses</Link>
            <span>›</span>
            <span className="text-gray-900 font-medium">{course.category}</span>
          </div>
        </div>
      </div>

      {/* Course Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="mb-4">
                <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {course.category}
                </span>
              </div>
              <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
              <p className="text-xl text-gray-300 mb-6">{course.subtitle}</p>

              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center">
                  <StarRating rating={Math.floor(course.rating)} />
                  <span className="ml-2 font-semibold">{course.rating}</span>
                  <span className="ml-1 text-gray-400">({course.reviews.toLocaleString()} reviews)</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  {course.students.toLocaleString()} students
                </div>
              </div>

              <div className="mt-6 flex items-center">
                <img
                  src={course.instructor.avatar}
                  alt={course.instructor.name}
                  className="w-12 h-12 rounded-full mr-3"
                />
                <div>
                  <p className="font-medium">Created by {course.instructor.name}</p>
                  <p className="text-sm text-gray-400">{course.instructor.title}</p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-6 text-sm text-gray-400">
                <span>📅 Last updated {course.lastUpdated}</span>
                <span>🌐 {course.language}</span>
                <span>⏱️ {course.duration} total</span>
              </div>
            </div>

            {/* Course Card (Desktop) */}
            <div className="hidden lg:block">
              <div className="bg-white rounded-xl shadow-2xl overflow-hidden sticky top-24">
                <img src={course.image} alt={course.title} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <div className="text-3xl font-bold text-gray-900 mb-4">
                    ${course.price}
                  </div>

                  {enrolled ? (
                    <div className="space-y-3">
                      <Link
                        to="/my-courses"
                        className="block w-full bg-indigo-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
                      >
                        Go to My Courses
                      </Link>
                      <Link
                        to={`/learn/${course.id}`}
                        className="block w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white text-center py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition"
                      >
                        Continue Learning
                      </Link>
                    </div>
                  ) : (
                    <button
                      onClick={handleEnroll}
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition shadow-lg"
                    >
                      {user ? 'Enroll Now' : 'Login to Enroll'}
                    </button>
                  )}

                  <p className="text-center text-sm text-gray-600 mt-3">
                    30-Day Money-Back Guarantee
                  </p>

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-3">This course includes:</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center">
                        <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {course.duration} on-demand video
                      </li>
                      <li className="flex items-center">
                        <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Downloadable resources
                      </li>
                      <li className="flex items-center">
                        <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Full lifetime access
                      </li>
                      <li className="flex items-center">
                        <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Certificate of completion
                      </li>
                    </ul>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                    <Link
                      to={`/courses/${course.id}/discussions`}
                      className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                    >
                      View Course Discussions →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* What You'll Learn */}
            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">What you'll learn</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {course.whatYouLearn.map((item, index) => (
                  <div key={index} className="flex items-start">
                    <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Course Content */}
            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Content</h2>
              <div className="mb-4 text-sm text-gray-600">
                {course.curriculum.length} sections • {course.curriculum.reduce((acc, s) => acc + s.lectures, 0)} lectures • {course.duration} total length
              </div>
              <div className="space-y-3">
                {course.curriculum.map((section, index) => (
                  <details key={index} className="border border-gray-200 rounded-lg">
                    <summary className="px-6 py-4 cursor-pointer hover:bg-gray-50 font-medium text-gray-900 flex justify-between items-center">
                      <span>{section.section}</span>
                      <span className="text-sm text-gray-600">{section.lectures} lectures • {section.duration}</span>
                    </summary>
                    <div className="px-6 pb-4 space-y-2">
                      {section.lessons.map((lesson, idx) => (
                        <div key={idx} className="flex items-center justify-between py-2 text-sm">
                          <div className="flex items-center">
                            <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-gray-700">{lesson.title}</span>
                            {lesson.free && (
                              <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">Preview</span>
                            )}
                          </div>
                          <span className="text-gray-500">{lesson.duration}</span>
                        </div>
                      ))}
                    </div>
                  </details>
                ))}
              </div>
            </div>

            {/* Requirements */}
            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Requirements</h2>
              <ul className="space-y-3">
                {course.requirements.map((req, index) => (
                  <li key={index} className="flex items-start text-gray-700">
                    <span className="text-gray-400 mr-3">•</span>
                    {req}
                  </li>
                ))}
              </ul>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Description</h2>
              <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                {course.description}
              </div>
            </div>

            {/* Instructor */}
            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Instructor</h2>
              <div className="flex items-start space-x-6">
                <img
                  src={course.instructor.avatar}
                  alt={course.instructor.name}
                  className="w-24 h-24 rounded-full"
                />
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{course.instructor.name}</h3>
                  <p className="text-gray-600 mb-4">{course.instructor.title}</p>
                  <div className="flex flex-wrap gap-6 text-sm text-gray-600">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {course.instructor.rating} Instructor Rating
                    </div>
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      {course.instructor.students.toLocaleString()} Students
                    </div>
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      {course.instructor.courses} Courses
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Student Reviews</h2>
              <div className="space-y-6">
                {course.reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0">
                    <div className="flex items-start space-x-4">
                      <img
                        src={review.avatar}
                        alt={review.user}
                        className="w-12 h-12 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">{review.user}</h4>
                          <span className="text-sm text-gray-500">{review.date}</span>
                        </div>
                        <StarRating rating={review.rating} />
                        <p className="mt-3 text-gray-700">{review.comment}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {user && isStudent && enrolled && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <Link
                    to={`/courses/${course.id}/review`}
                    className="text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    Write a review →
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar (Desktop only) - Already rendered above */}
          <div className="hidden lg:block"></div>
        </div>
      </div>

      {/* Mobile Enrollment Button */}
      {!enrolled && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-40">
          <button
            onClick={handleEnroll}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition"
          >
            Enroll Now - ${course.price}
          </button>
        </div>
      )}

      {/* Enrollment Success Modal */}
      {showEnrollModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center animate-bounce-in">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Successfully Enrolled!</h3>
            <p className="text-gray-600 mb-6">You're now enrolled in this course. Start learning now!</p>
            <Link
              to="/my-courses"
              className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition"
            >
              Go to My Courses
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetail;