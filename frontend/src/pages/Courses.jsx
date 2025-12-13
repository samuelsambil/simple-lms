import { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  const location = useLocation();

  // Check for search query in URL on mount
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
    }, 500);

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
    setSelectedCategory('all');
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600 mb-4"></div>
          <div className="text-xl text-gray-600 font-medium">Loading courses...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-8">
              <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300">
                SimpleLMS
              </Link>
              <nav className="hidden md:flex items-center gap-6">
                <Link to="/courses" className="text-blue-600 font-semibold border-b-2 border-blue-600 pb-1">
                  Courses
                </Link>
                {user && user.role === 'student' && (
                  <Link to="/my-courses" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                    My Courses
                  </Link>
                )}
                {user && user.role === 'instructor' && (
                  <Link to="/instructor/dashboard" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                    Dashboard
                  </Link>
                )}
              </nav>
            </div>
            
            {user ? (
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                    {(user.first_name || user.email).charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-gray-900">
                      {user.first_name || user.email}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-medium hover:shadow-lg hover:shadow-red-500/50 transition-all duration-300 hover:scale-105"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            {searchQuery ? 'Search Results' : 'Browse Courses'}
          </h1>
          <p className="text-lg text-gray-600">
            {searchQuery 
              ? `Found ${filteredCourses.length} result${filteredCourses.length !== 1 ? 's' : ''} for "${searchQuery}"` 
              : `Explore our collection of ${courses.length} expert-led courses`
            }
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg mb-8 flex items-center gap-3">
            <span className="text-2xl">⚠️</span>
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-3xl">
            <div className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl pointer-events-none">
              🔍
            </div>
            
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search courses by title, description, or instructor..."
              className="w-full px-5 py-4 pl-14 pr-14 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-gray-900 placeholder-gray-400 shadow-sm hover:shadow-md"
            />
            
            {searchQuery && (
              <>
                <button
                  onClick={clearSearch}
                  className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors text-xl"
                >
                  ✕
                </button>
                {searching && (
                  <div className="absolute right-14 top-1/2 transform -translate-y-1/2 text-blue-600">
                    <div className="animate-spin text-xl">⟳</div>
                  </div>
                )}
              </>
            )}
          </div>
          
          {searchQuery && (
            <div className="mt-3 text-sm text-gray-600 flex items-center gap-2">
              <span className="text-lg">💡</span>
              <span>Tip: Search by course title, description, or instructor name</span>
            </div>
          )}
        </div>

        {/* Category Filter - Only show if not searching */}
        {!searchQuery && (
          <div className="mb-10">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Filter by Category</h3>
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-6 py-3 rounded-xl font-medium whitespace-nowrap transition-all duration-300 ${
                  selectedCategory === 'all'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/50 scale-105'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200 hover:border-blue-300'
                }`}
              >
                All Courses ({courses.length})
              </button>

              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.slug)}
                  className={`px-6 py-3 rounded-xl font-medium whitespace-nowrap transition-all duration-300 flex items-center gap-2 ${
                    selectedCategory === category.slug
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/50 scale-105'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <span className="text-lg">{category.icon}</span>
                  <span>{category.name} ({category.course_count})</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="mb-6 flex items-center justify-between">
          <div className="text-sm text-gray-600 font-medium">
            {searching ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin">⟳</span>
                Searching...
              </span>
            ) : (
              <span>
                {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''} 
                {searchQuery && ` matching "${searchQuery}"`}
                {selectedCategory !== 'all' && !searchQuery && ` in ${categories.find(c => c.slug === selectedCategory)?.name}`}
              </span>
            )}
          </div>

          {(searchQuery || selectedCategory !== 'all') && (
            <button
              onClick={() => {
                clearSearch();
                setSelectedCategory('all');
              }}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium underline"
            >
              Clear all filters
            </button>
          )}
        </div>

        {/* Courses Grid */}
        {filteredCourses.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-16 text-center">
            <div className="text-7xl mb-6">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              {searchQuery 
                ? `No courses found matching "${searchQuery}"`
                : selectedCategory === 'all' 
                  ? 'No courses available yet'
                  : `No courses in this category yet`
              }
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery 
                ? 'Try adjusting your search terms or browse all courses'
                : 'Check back soon for new courses!'
              }
            </p>
            {(searchQuery || selectedCategory !== 'all') && (
              <button
                onClick={() => {
                  clearSearch();
                  setSelectedCategory('all');
                }}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105"
              >
                View All Courses
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <Link
                key={course.id}
                to={`/courses/${course.id}`}
                className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden hover:-translate-y-2 border border-gray-100"
              >
                {course.thumbnail_url ? (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={course.thumbnail_url}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                ) : (
                  <div className={`h-48 flex items-center justify-center relative overflow-hidden ${
                    course.category?.slug === 'programming' ? 'bg-gradient-to-br from-blue-500 to-blue-700' :
                    course.category?.slug === 'design' ? 'bg-gradient-to-br from-pink-500 to-purple-600' :
                    course.category?.slug === 'business' ? 'bg-gradient-to-br from-green-500 to-teal-600' :
                    course.category?.slug === 'data-science' ? 'bg-gradient-to-br from-orange-500 to-red-600' :
                    course.category?.slug === 'personal-development' ? 'bg-gradient-to-br from-indigo-500 to-purple-600' :
                    'bg-gradient-to-br from-blue-500 to-purple-600'
                  }`}>
                    <span className="text-white text-5xl font-bold group-hover:scale-125 transition-transform duration-300">
                      {course.title.charAt(0)}
                    </span>
                  </div>
                )}

                <div className="p-6">
                  {course.category && (
                    <div className="mb-3">
                      <span className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium">
                        <span>{course.category.icon}</span>
                        <span>{course.category.name}</span>
                      </span>
                    </div>
                  )}

                  {course.average_rating > 0 && (
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex text-yellow-400 text-sm">
                        {'★'.repeat(Math.round(course.average_rating))}
                        {'☆'.repeat(5 - Math.round(course.average_rating))}
                      </div>
                      <span className="text-sm text-gray-600 font-medium">
                        {course.average_rating.toFixed(1)} ({course.review_count})
                      </span>
                    </div>
                  )}

                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {course.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-2 text-sm leading-relaxed">
                    {course.description}
                  </p>

                  <div className="flex items-center justify-between mb-4 text-sm">
                    <span className="text-gray-700 font-medium">
                      By {course.instructor.first_name || course.instructor.email}
                    </span>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold capitalize">
                      {course.difficulty}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 pt-4 border-t border-gray-100 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      📚 {course.total_lessons} lessons
                    </span>
                    <span className="flex items-center gap-1">
                      👥 {course.total_students} students
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-20 py-8 border-t border-gray-200 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-600 text-sm">
          <p>© 2024 SimpleLMS. Empowering learners worldwide 🌍</p>
        </div>
      </footer>
    </div>
  );
}

export default Courses;