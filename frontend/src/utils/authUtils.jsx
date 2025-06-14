import axios from 'axios';

// Set the base URL
const API_URL = 'http://127.0.0.1:8000/api';

// Setup axios with default config
const setupAxiosDefaults = () => {
  // Get token from local storage
  const token = localStorage.getItem('token');
  
  // If token exists, set default authorization header
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Token ${token}`;
  } else {
    // If no token, remove the header
    delete axios.defaults.headers.common['Authorization'];
  }
};

// Initialize on import
setupAxiosDefaults();

// Register function - NEW
export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/users/`, userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Login function
export const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/users/login/`, { username, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('isAuthenticated', 'true');
      
      // Set token for future requests
      axios.defaults.headers.common['Authorization'] = `Token ${response.data.token}`;
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Logout function
export const logout = async () => {
  try {
    // Call backend logout endpoint if needed
    if (localStorage.getItem('token')) {
      await axios.post(`${API_URL}/users/logout/`);
    }
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Always clear local storage on logout attempt
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    delete axios.defaults.headers.common['Authorization'];
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return localStorage.getItem('token') !== null;
};

// Get current user
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    return JSON.parse(userStr);
  }
  return null;
};

// API request with authentication
export const authRequest = async (method, url, data = null) => {
  setupAxiosDefaults();
  
  try {
    const config = {
      method,
      url: `${API_URL}${url}`,
    };
    
    if (data) {
      config.data = data;
    }
    
    const response = await axios(config);
    return response.data;
  } catch (error) {
    // If 401 Unauthorized, clear token and redirect to login
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
      window.location.href = '/login';
    }
    throw error;
  }
};