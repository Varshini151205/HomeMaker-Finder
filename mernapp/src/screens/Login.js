import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

// API routes - you can move these to a separate config file later
const API_ROUTES = {
  CUSTOMER_LOGIN: "http://localhost:5000/api/customer-auth/customer-login",
  HOMEMAKER_LOGIN: "http://localhost:5000/api/auth/homemaker-login",
  ADMIN_LOGIN: "http://localhost:5000/api/auth/admin-login"
};

// Generic Login Component
const Login = ({ type, apiUrl, redirect }) => {
  const [user, setUser] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    try {
      // Validation
      if (!user.email || !user.password) {
        throw new Error("Please enter both email and password.");
      }
      
      const response = await axios.post(apiUrl, user);
      
      // Handle authentication data
      if (response.data?.token) {
        // Consider a more secure approach than localStorage
        localStorage.setItem("token", response.data.token);
        
        // Store user-specific data
        if (type === "Homemaker" && response.data.homemaker?._id) {
          localStorage.setItem("homemakerId", response.data.homemaker._id);
        } else if (type === "Customer" && response.data.customer?._id) {
          localStorage.setItem("customerId", response.data.customer._id);
        }
        
        navigate(redirect);
      } else {
        throw new Error("Authentication failed: Invalid response format");
      }
    } catch (error) {
      // Enhanced error handling
      if (!navigator.onLine) {
        setError("Network error. Please check your connection.");
      } else if (error.response?.status === 401) {
        setError("Invalid email or password.");
      } else if (error.response?.status === 429) {
        setError("Too many login attempts. Please try again later.");
      } else {
        setError(error.message || "Login failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginForm
      title={`${type} Login`}
      handleSubmit={handleSubmit}
      setUser={setUser}
      user={user}
      error={error}
      isLoading={isLoading}
    />
  );
};

// Common Login Form Component
const LoginForm = ({ title, handleSubmit, setUser, user, error, isLoading }) => {
  const navigate = useNavigate();

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="login-overlay">
          <h3 className="login-tagline">Taste of Home, Wherever You Are.</h3>
        </div>
      </div>
      <div className="login-card">
        <h2 className="login-title">{title}</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              required
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              value={user.email}
              disabled={isLoading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              required
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              value={user.password}
              disabled={isLoading}
            />
          </div>
          <button 
            type="submit" 
            className={`login-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="login-actions">
          <button 
            className="text-button forgot-password-btn"
            onClick={() => navigate("/forgot-password")}
            disabled={isLoading}
          >
            Forgot Password?
          </button>
          
          <div className="signup-section">
            <p>Don't have an account?</p>
            {title.includes("Customer") && (
              <button
                className="text-button signup-btn"
                onClick={() => navigate("/customer-signup")}
                disabled={isLoading}
              >
                Sign up as Customer
              </button>
            )}
            {title.includes("Homemaker") && (
              <button
                className="text-button signup-btn"
                onClick={() => navigate("/homemaker-signup")}
                disabled={isLoading}
              >
                Sign up as Homemaker
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Specialized Login Components - defined AFTER the base components
const CustomerLogin = () => (
  <Login 
    type="Customer" 
    apiUrl={API_ROUTES.CUSTOMER_LOGIN}
    redirect="/customer-dashboard" 
  />
);

const HomemakerLogin = () => (
  <Login 
    type="Homemaker" 
    apiUrl={API_ROUTES.HOMEMAKER_LOGIN} 
    redirect="/homemaker-dashboard" 
  />
);

const AdminLogin = () => (
  <Login 
    type="Admin" 
    apiUrl={API_ROUTES.ADMIN_LOGIN} 
    redirect="/admin-dashboard" 
  />
);

export { CustomerLogin, HomemakerLogin, AdminLogin };