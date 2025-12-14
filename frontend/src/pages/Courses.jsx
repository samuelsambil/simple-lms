import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Courses = () => {
  const { user, logout, isStudent, isInstructor } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');

  // Categories
  const categories = [
    'All',
    'Web Development',
    'Data Science',
    'Design',
    'Business',
    'Marketing',
    'Photography',
    'Music',
    'Health & Fitness'
  ];

  // Mock courses data
  const allCourses = [
    {
      id: 1,
      title: 'Complete Web Development Bootcamp',
      instructor: 'Sarah Johnson',
      image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop',
      students: 12500,
      rating: 4.8,
      reviews: 2300,
      price: 49.99,
      category: 'Web Development',
      level: 'Beginner',
      duration: '40 hours'
    },
    {
      id: 2,
      title: 'Machine Learning A-Z',
      instructor: 'Dr. Michael Chen',
      image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=600&fit=crop',
      students: 8900,
      rating: 4.9,
      reviews: 1800,
      price: 59.99,
      category: 'Data Science',
      level: 'Advanced',
      duration: '50 hours'
    },
    {
      id: 3,
      title: 'UI/UX Design Masterclass',
      instructor: 'Emily Rodriguez',
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop',
      students: 6700,
      rating: 4.7,
      reviews: 1200,
      price: 39.99,
      category: 'Design',
      level: 'Intermediate',
      duration: '30 hours'
    },
    {
      id: 4,
      title: 'Digital Marketing Strategy',
      instructor: 'James Wilson',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
      students: 5400,
      rating: 4.6,
      reviews: 980,
      price: 44.99,
      category: 'Marketing',
      level: 'Beginner',
      duration: '25 hours'
    },
    {
      id: 5,
      title: 'Python for Data Science',
      instructor: 'Lisa Anderson',
      image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=600&fit=crop',
      students: 9200,
      rating: 4.8,
      reviews: 2100,
      price: 54.99,
      category: 'Data Science',
      level: 'Intermediate',
      duration: '45 hours'
    },
    {
      id: 6,
      title: 'Photography Fundamentals',
      instructor: 'David Martinez',
      image: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800&h=600&fit=crop',
      students: 4100,
      rating: 4.9,
      reviews: 890,
      price: 34.99,
      category: 'Photography',
      level: 'Beginner',
      duration: '20 hours'
    },
  ];

  // Filter courses based on search and category
  const filteredCourses = allCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Sort courses
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return b.students - a.students;
      case 'rating':
        return b.rating - a.rating;
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      default:
        return 0;
    }
  });

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/courses?search=${encodeURIComponent(searchQuery)}`);
  };

  const clearSearch = () => {
    setSearchQuery('');
    navigate('/courses');
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
              <Link to="/courses" className="text-indigo-600 font-medium">
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
                  <Link to="/profile" className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 transition">
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

      {/* Page Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Explore Courses</h1>
          <p className="text-indigo-100 text-lg mb-6">
            Discover thousands of courses taught by expert instructors
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 rounded-lg text-gray-900 focus:outline-none focus:ring-4 focus:ring-white/30 pr-24"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-32 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h3 className="font-bold text-gray-900 mb-4">Filters</h3>

              {/* Category Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-3">Category</h4>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category === 'All' ? 'all' : category)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition ${
                        (selectedCategory === 'all' && category === 'All') ||
                        selectedCategory === category
                          ? 'bg-indigo-50 text-indigo-600 font-medium'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort By */}
              <div>
                <h4 className="font-medium text-gray-700 mb-3">Sort By</h4>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="popular">Most Popular</option>
                  <option value="rating">Highest Rated</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>
          </aside>

          {/* Courses Grid */}
          <main className="flex-1">
            <div className="mb-6 flex justify-between items-center">
              <p className="text-gray-600">
                {sortedCourses.length} {sortedCourses.length === 1 ? 'course' : 'courses'} found
              </p>
            </div>

            {sortedCourses.length > 0 ? (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {sortedCourses.map((course) => (
                  <Link
                    key={course.id}
                    to={`/courses/${course.id}`}
                    className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full text-xs font-medium text-indigo-600">
                        {course.category}
                      </div>
                      <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-xs font-medium">
                        {course.level}
                      </div>
                    </div>

                    <div className="p-5">
                      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition line-clamp-2">
                        {course.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">By {course.instructor}</p>

                      <div className="flex items-center space-x-3 text-sm text-gray-500 mb-3">
                        <span className="flex items-center">
                          <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          {course.rating}
                        </span>
                        <span>({course.reviews.toLocaleString()})</span>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div className="flex items-center text-sm text-gray-500">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                          {course.students.toLocaleString()}
                        </div>
                        <span className="text-2xl font-bold text-indigo-600">${course.price}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                  className="text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Courses;