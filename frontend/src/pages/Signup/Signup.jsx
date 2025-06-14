import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./signup.css";
import axios from "axios";

// Use your existing API URL
const API_URL = 'http://127.0.0.1:8000/api';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirm_password: "",
    first_name: "",
    last_name: "",
    user_type: "employee", // Default user type
    department: "",
  });

  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirm_password: "",
    first_name: "",
    last_name: "",
    server: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear the specific error when user starts typing again
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    
    // Clear server error when any field changes
    if (errors.server) {
      setErrors((prev) => ({ ...prev, server: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields validation
    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!validateEmail(formData.email)) newErrors.email = "Please enter a valid email address";
    
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters";
    
    if (!formData.confirm_password) newErrors.confirm_password = "Please confirm your password";
    else if (formData.password !== formData.confirm_password) 
      newErrors.confirm_password = "Passwords do not match";
    
    if (!formData.first_name.trim()) newErrors.first_name = "First name is required";
    if (!formData.last_name.trim()) newErrors.last_name = "Last name is required";

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const newErrors = validateForm();
    setErrors(newErrors);

    // If validation fails, stop here
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setIsLoading(true);
    setSuccessMessage("");

    try {
      // Prepare data for backend (excluding confirm_password)
      const signupData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        first_name: formData.first_name,
        last_name: formData.last_name,
        user_type: formData.user_type,
        department: formData.department,
      };
      
      // Use your existing API structure for the registration
      const response = await axios.post(
        `${API_URL}/users/`,
        signupData,
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      
      console.log("Signup successful:", response.data);
      
      // Set success message
      setSuccessMessage("Registration successful! Redirecting to login...");
      
      // Redirect to login page with success message after a short delay
      setTimeout(() => {
        navigate("/login", { 
          state: { message: "Registration successful! Please login with your new account." }
        });
      }, 2000);
      
    } catch (error) {
      console.error("Signup error:", error);
      
      // Reset loading state
      setIsLoading(false);
      
      // Enhanced error handling
      let errorMessage = "Registration failed. Please try again.";
      
      if (error.response) {
        const responseData = error.response.data;
        
        // Handle field-specific errors
        if (responseData) {
          // Map backend errors to form fields
          const fieldErrors = {};
          
          // Check for specific field errors
          ['username', 'email', 'password', 'first_name', 'last_name'].forEach(field => {
            if (responseData[field]) {
              fieldErrors[field] = Array.isArray(responseData[field]) 
                ? responseData[field][0] 
                : responseData[field];
            }
          });
          
          if (Object.keys(fieldErrors).length > 0) {
            setErrors(prev => ({ ...prev, ...fieldErrors }));
          }
          
          // Check for non-field errors or general message
          if (responseData.non_field_errors) {
            errorMessage = responseData.non_field_errors[0];
          } else if (responseData.detail) {
            errorMessage = responseData.detail;
          } else if (responseData.message) {
            errorMessage = responseData.message;
          }
        }
      } else if (error.request) {
        errorMessage = "No response received from server. Please check your connection.";
      }
      
      // Set general server error
      setErrors(prev => ({ ...prev, server: errorMessage }));
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <h1>Create New Account</h1>
        
        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}
        
        <form onSubmit={handleSubmit}>
          {errors.server && (
            <div className="error-message">{errors.server}</div>
          )}
          
          <div className="form-row">
            <div className="input-group">
              <label htmlFor="first_name">First Name*</label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="Enter your first name"
                disabled={isLoading}
              />
              {errors.first_name && <span className="error">{errors.first_name}</span>}
            </div>

            <div className="input-group">
              <label htmlFor="last_name">Last Name*</label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="Enter your last name"
                disabled={isLoading}
              />
              {errors.last_name && <span className="error">{errors.last_name}</span>}
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="username">Username*</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Choose a username"
              disabled={isLoading}
            />
            {errors.username && <span className="error">{errors.username}</span>}
          </div>

          <div className="input-group">
            <label htmlFor="email">Email*</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              disabled={isLoading}
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>

          <div className="form-row">
            <div className="input-group">
              <label htmlFor="password">Password*</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Min 8 characters"
                disabled={isLoading}
              />
              {errors.password && <span className="error">{errors.password}</span>}
            </div>

            <div className="input-group">
              <label htmlFor="confirm_password">Confirm Password*</label>
              <input
                type="password"
                id="confirm_password"
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleChange}
                placeholder="Confirm password"
                disabled={isLoading}
              />
              {errors.confirm_password && <span className="error">{errors.confirm_password}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="input-group">
              <label htmlFor="user_type">User Type*</label>
              <select
                id="user_type"
                name="user_type"
                value={formData.user_type}
                onChange={handleChange}
                disabled={isLoading}
              >
                <option value="employee">Employee</option>
                <option value="support">IT Support</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="input-group">
              <label htmlFor="department">Department</label>
              <input
                type="text"
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="Enter your department"
                disabled={isLoading}
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="submit-btn"
            disabled={isLoading}
          >
            {isLoading ? "Creating Account..." : "Sign Up"}
          </button>
          
          <div className="form-links">
            <div className="login-link">
              Already have an account? <Link to="/login">Login</Link>
            </div>

            <div className="back-to-home">
              <Link to="/">Back to Home</Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;