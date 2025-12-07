import { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';  // Add useLocation
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';

function Courses() {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState('');
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();  // Add this

  // Check for search query in URL - Add this useEffect
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search');
    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, [location]);

  useEffect(() => {
    fetchCategories();
    fetchCourses();
  }, []);

  // Debounced search - search as user types
  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (searchQuery.trim()) {
        searchCourses(searchQuery);
      } else {
        fetchCourses();
      }
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(delaySearch);
  }, [searchQuery]);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories/');
      setCategories(response.data);
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await api.get('/courses/');
      setCourses(response.data);
      setLoading(false);
      setSearching(false);
    } catch (err) {
      setError('Failed to load courses');
      setLoading(false);
      setSearching(false);
    }
  };

  const searchCourses = async (query) => {
    setSearching(true);
    try {
      const response = await api.get(`/courses/?search=${encodeURIComponent(query)}`);
      setCourses(response.data);
      setSearching(false);
    } catch (err) {
      setError('Search failed');
      setSearching(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setSelectedCategory('all'); // Reset category filter when searching
  };

  const clearSearch = () => {
    setSearchQuery('');
    fetchCourses();
  };

  const filteredCourses = selectedCategory === 'all'
    ? courses
    : courses.filter(course => course.category?.slug === selectedCategory);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading courses...</div>
      </div>
    );
  }

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
              <Link to="/courses" className="text-blue-600 font-medium">
                Courses
              </Link>
              {user && user.role === 'student' && (
                <Link to="/my-courses" className="text-gray-600 hover:text-gray-900">
                  My Courses
                </Link>
              )}
            </div>
            
            {user ? (
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
            ) : (
              <Link
                to="/login"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Browse Courses
          </h1>
          <p className="text-gray-600">
            {searchQuery 
              ? `Search results for "${searchQuery}"` 
              : `Explore our collection of ${courses.length} courses`
            }
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Search Bar */}
<div className="mb-8">
  <div className="relative max-w-2xl">
    <input
      type="text"
      value={searchQuery}
      onChange={handleSearchChange}
      placeholder="Search courses by title, description, or instructor..."
      className="w-full px-4 py-3 pl-12 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    />
    
    {/* Search Icon */}
    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
      🔍
    </div>
    
    {/* Clear Button */}
    {searchQuery && (
      <button
        onClick={clearSearch}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
      >
        ✕
      </button>
    )}
    
    {/* Loading Indicator */}
    {searching && (
      <div className="absolute right-12 top-1/2 transform -translate-y-1/2 text-blue-600">
        <div className="animate-spin">⟳</div>
      </div>
    )}
  </div>
  
  {/* Search Tips */}
  {searchQuery && (
    <div className="mt-2 text-sm text-gray-600">
      <span className="font-medium">💡 Tip:</span> Search by course title, description, or instructor name
    </div>
  )}
</div>

        {/* Category Filter - Only show if not searching */}
        {!searchQuery && (
          <div className="mb-8">
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition ${
                  selectedCategory === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                All Courses ({courses.length})
              </button>

              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.slug)}
                  className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition flex items-center gap-2 ${
                    selectedCategory === category.slug
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  }`}
                >
                  <span>{category.icon}</span>
                  <span>{category.name} ({category.course_count})</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="mb-4 text-sm text-gray-600">
          {searching ? (
            <span>Searching...</span>
          ) : (
            <span>
              {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''} found
              {searchQuery && ` for "${searchQuery}"`}
              {selectedCategory !== 'all' && !searchQuery && ` in ${categories.find(c => c.slug === selectedCategory)?.name}`}
            </span>
          )}
        </div>

        {/* Courses Grid */}
        {filteredCourses.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-600 text-lg mb-2">
              {searchQuery 
                ? `No courses found matching "${searchQuery}"`
                : selectedCategory === 'all' 
                  ? 'No courses available yet. Check back soon!'
                  : `No courses in this category yet.`
              }
            </p>
            {(searchQuery || selectedCategory !== 'all') && (
              <button
                onClick={() => {
                  clearSearch();
                  setSelectedCategory('all');
                }}
                className="mt-4 text-blue-600 hover:underline"
              >
                Clear filters and view all courses
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <Link
                key={course.id}
                to={`/courses/${course.id}`}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden"
              >
                {course.thumbnail ? (
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <span className="text-white text-4xl font-bold">
                      {course.title.charAt(0)}
                    </span>
                  </div>
                )}

                <div className="p-6">
                  {/* Category Badge */}
                  {course.category && (
                    <div className="mb-3">
                      <span className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        <span>{course.category.icon}</span>
                        <span>{course.category.name}</span>
                      </span>
                    </div>
                  )}

                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {course.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {course.description}
                  </p>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                      By {course.instructor.first_name || course.instructor.email}
                    </span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {course.difficulty}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 mt-4 text-sm text-gray-600">
                    <span>📚 {course.total_lessons} lessons</span>
                    <span>👥 {course.total_students} students</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Courses;