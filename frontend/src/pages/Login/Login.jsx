import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./login.css";
import axios from "axios";

// Create an axios instance
const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    username: "",
    password: "",
    server: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear errors when user starts typing again
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (errors.server) {
      setErrors((prev) => ({ ...prev, server: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newErrors = {};
    if (!formData.username) newErrors.username = "Username is required";
    if (!formData.password) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors({ ...errors, ...newErrors });
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await api.post("/users/login/", formData);

      if (response.status === 200 && response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("isAuthenticated", "true");

        axios.defaults.headers.common[
          "Authorization"
        ] = `Token ${response.data.token}`;
        navigate("/dashboard");
      }
    } catch (error) {
      let errorMessage = "Login failed. Please try again.";

      if (error.response) {
        if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data?.detail) {
          errorMessage = error.response.data.detail;
        } else if (error.response.data?.non_field_errors) {
          errorMessage = error.response.data.non_field_errors[0];
        }
      } else if (error.request) {
        errorMessage = "No response from server.";
      }

      setErrors((prev) => ({ ...prev, server: errorMessage }));
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-bg">
      <div className="login-container">
        <h1>Login to Your Account</h1>
        <form onSubmit={handleSubmit}>
          {errors.server && (
            <div className="error-message">{errors.server}</div>
          )}

          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              disabled={isSubmitting}
            />
            {errors.username && (
              <span className="error">{errors.username}</span>
            )}
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              disabled={isSubmitting}
            />
            {errors.password && (
              <span className="error">{errors.password}</span>
            )}
          </div>

          <div className="back-to-home">
            <Link to="/">← Back to Home</Link>
          </div>

          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
