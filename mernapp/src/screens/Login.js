import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, AlertCircle, Users, ChefHat, ShieldCheck } from "lucide-react";
import "./Login.css";

// API routes - you can move these to a separate config file later
const API_ROUTES = {
  CUSTOMER_LOGIN: "http://localhost:5000/api/customer-auth/customer-login",
  HOMEMAKER_LOGIN: "http://localhost:5000/api/auth/homemaker-login",
  ADMIN_LOGIN: "http://localhost:5000/api/auth/admin-login"
};

// Generic Login Component — LOGIC UNCHANGED
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
      if (!user.email || !user.password) {
        throw new Error("Please enter both email and password.");
      }
      
      const response = await axios.post(apiUrl, user);
      
      if (response.data?.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userRole", type); // Store role (Customer, Homemaker, Admin)
        
        if (type === "Homemaker" && response.data.homemaker?._id) {
          localStorage.setItem("homemakerId", response.data.homemaker._id);
          console.log("homemakers added"+response.data.homemaker._id);
        } else if (type === "Customer" && response.data.customer?._id) {
          localStorage.setItem("customerId", response.data.customer._id);
        }
        
        navigate(redirect);
      } else {
        throw new Error("Authentication failed: Invalid response format");
      }
    } catch (error) {
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
      type={type}
      handleSubmit={handleSubmit}
      setUser={setUser}
      user={user}
      error={error}
      isLoading={isLoading}
    />
  );
};

// Role config — drives icon, color class, image, and taglines
const ROLE_CONFIG = {
  Customer: {
    icon: <Users size={28} />,
    colorClass: "customer",
    subtitle: "Order delicious homemade meals near you",
    image: "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?q=80&w=2670&auto=format&fit=crop",
    tagline: "Taste the Comfort of Home.",
    taglineDesc: "Discover authentic homemade meals crafted by local chefs, delivered fresh to your door.",
    signupRoute: "/customer-signup",
    signupLabel: "Sign up as Customer",
  },
  Homemaker: {
    icon: <ChefHat size={28} />,
    colorClass: "homemaker",
    subtitle: "Manage your kitchen and incoming orders",
    image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=2670&auto=format&fit=crop",
    tagline: "Turn Your Cooking Into Income.",
    taglineDesc: "Join thousands of homemakers earning from their passion for cooking every day.",
    signupRoute: "/homemaker-signup",
    signupLabel: "Sign up as Homemaker",
  },
  Admin: {
    icon: <ShieldCheck size={28} />,
    colorClass: "admin",
    subtitle: "Platform management and analytics",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2670&auto=format&fit=crop",
    tagline: "Powering Every Home Kitchen.",
    taglineDesc: "Monitor operations, manage users, and keep the HomeMade Meals platform running smoothly.",
    signupRoute: null,
    signupLabel: null,
  },
};

// Common Login Form Component — UI only
const LoginForm = ({ title, type, handleSubmit, setUser, user, error, isLoading }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const config = ROLE_CONFIG[type] || ROLE_CONFIG.Customer;
  const { icon, colorClass, subtitle, image, tagline, taglineDesc, signupRoute, signupLabel } = config;

  return (
    <div className="login-wrapper">

      {/* LEFT PANEL */}
      <div className="login-left">
        <img src={image} alt="Food background" className="login-left-image" />
        <div className="login-left-overlay" />
        <div className="login-left-content">
          <h1>{tagline}</h1>
          <p>{taglineDesc}</p>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="login-right">
        <div className="login-card">

          {/* Role Icon */}
          <div className={`login-role-icon ${colorClass}`}>
            {icon}
          </div>

          <h2 className="login-title">{title}</h2>
          <p className="login-subtitle">{subtitle}</p>

          {/* Error */}
          {error && (
            <div className="login-error">
              <AlertCircle size={18} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* Email */}
            <div className="login-form-group">
              <label className="login-label" htmlFor="email">Email Address</label>
              <div className="login-input-wrapper">
                <input
                  id="email"
                  type="email"
                  className={`login-input ${colorClass}`}
                  placeholder="Enter your email"
                  required
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  value={user.email}
                  disabled={isLoading}
                />
                <Mail size={18} className="login-input-icon" />
              </div>
            </div>

            {/* Password */}
            <div className="login-form-group">
              <label className="login-label" htmlFor="password">Password</label>
              <div className="login-input-wrapper">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className={`login-input ${colorClass}`}
                  placeholder="Enter your password"
                  required
                  onChange={(e) => setUser({ ...user, password: e.target.value })}
                  value={user.password}
                  disabled={isLoading}
                />
                <Lock size={18} className="login-input-icon" />
                <button
                  type="button"
                  className="login-pw-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Forgot */}
            <div className="login-forgot-row">
              <button
                type="button"
                className="login-forgot-btn"
                onClick={() => navigate("/forgot-password")}
                disabled={isLoading}
              >
                Forgot Password?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className={`login-submit-btn ${colorClass}`}
              disabled={isLoading}
            >
              {isLoading ? "Logging in…" : `Login as ${type}`}
            </button>

          </form>

          {/* Signup footer */}
          {signupRoute && (
            <p className="login-footer">
              Don't have an account?
              <button
                className={`login-signup-btn ${colorClass}`}
                onClick={() => navigate(signupRoute)}
                disabled={isLoading}
              >
                {signupLabel}
              </button>
            </p>
          )}

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
    redirect="/" 
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