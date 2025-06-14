import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home/Home';
import Signup from './pages/Signup/Signup';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import { isAuthenticated } from './utils/authUtils';
import axios from 'axios';
import Chats from './components/Chats/Chats'; // Corrected path
import ErrorBoundary from './components/ErrorBoundary'; // Import ErrorBoundary

// Protected route component
const ProtectedRoute = ({ element }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }
  return element;
};

function App() {
  useEffect(() => {
    // Set up axios interceptor for handling auth errors
    const interceptor = axios.interceptors.response.use(
      response => response,
      error => {
        if (error.response && error.response.status === 401) {
          // Unauthorized - clear local storage and redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('isAuthenticated');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );

    // Set default auth header if token exists
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Token ${token}`;
    }

    // Clean up interceptor on component unmount
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
        
        <Route 
          path="/tickets/:ticketId/chat" 
          element={
            <ProtectedRoute element={
              <ErrorBoundary>
                <Chats />
              </ErrorBoundary>
            } />
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
