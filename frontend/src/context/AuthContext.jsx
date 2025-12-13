import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('access_token');
    
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login function (mock - will connect to backend later)
  const login = async (credentials) => {
    try {
      // MOCK LOGIN - Replace with real API call
      if (credentials.email && credentials.password) {
        const mockUser = {
          id: 1,
          email: credentials.email,
          first_name: 'John',
          last_name: 'Doe',
          role: credentials.email.includes('instructor') ? 'instructor' : 'student',
          avatar: null,
          full_name: 'John Doe'
        };
        
        const mockTokens = {
          access: 'mock_access_token_' + Date.now(),
          refresh: 'mock_refresh_token_' + Date.now()
        };

        localStorage.setItem('access_token', mockTokens.access);
        localStorage.setItem('refresh_token', mockTokens.refresh);
        localStorage.setItem('user', JSON.stringify(mockUser));
        
        setUser(mockUser);
        return { success: true, user: mockUser };
      }
      
      throw new Error('Invalid credentials');
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  // Register function (mock - will connect to backend later)
  const register = async (userData) => {
    try {
      // MOCK REGISTER - Replace with real API call
      const mockUser = {
        id: Date.now(),
        email: userData.email,
        first_name: userData.first_name,
        last_name: userData.last_name,
        role: userData.role || 'student',
        avatar: null,
        full_name: `${userData.first_name} ${userData.last_name}`
      };
      
      const mockTokens = {
        access: 'mock_access_token_' + Date.now(),
        refresh: 'mock_refresh_token_' + Date.now()
      };

      localStorage.setItem('access_token', mockTokens.access);
      localStorage.setItem('refresh_token', mockTokens.refresh);
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      setUser(mockUser);
      return { success: true, user: mockUser };
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, error: error.message };
    }
  };

  // Google OAuth login (mock - will connect to backend later)
  const googleLogin = async (googleToken) => {
    try {
      // MOCK GOOGLE LOGIN - Replace with real API call to /api/auth/google/
      const mockUser = {
        id: Date.now(),
        email: 'google.user@gmail.com',
        first_name: 'Google',
        last_name: 'User',
        role: 'student',
        avatar: null,
        full_name: 'Google User',
        is_google_user: true
      };
      
      const mockTokens = {
        access: 'mock_access_token_' + Date.now(),
        refresh: 'mock_refresh_token_' + Date.now()
      };

      localStorage.setItem('access_token', mockTokens.access);
      localStorage.setItem('refresh_token', mockTokens.refresh);
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      setUser(mockUser);
      return { success: true, user: mockUser };
    } catch (error) {
      console.error('Google login error:', error);
      return { success: false, error: error.message };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    setUser(null);
    
    // Google sign-out (if Google user)
    if (window.google && user?.is_google_user) {
      window.google.accounts.id.disableAutoSelect();
    }
  };

  // Update user profile
  const updateUser = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    loading,
    login,
    register,
    googleLogin,
    logout,
    updateUser,
    isAuthenticated: !!user,
    isStudent: user?.role === 'student',
    isInstructor: user?.role === 'instructor'
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};