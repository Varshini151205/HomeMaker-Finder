import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

// Customer, Homemaker, and Admin Login Components
const CustomerLogin = () => (
  <Login type="Customer" apiUrl="http://localhost:5000/api/customer-auth/customer-login" redirect="/customer-dashboard" />
);

const HomemakerLogin = () => (
  <Login type="Homemaker" apiUrl="http://localhost:5000/api/auth/homemaker-login" redirect="/homemaker-dashboard" />
);

const AdminLogin = () => (
  <Login type="Admin" apiUrl="http://localhost:5000/api/auth/admin-login" redirect="/admin-dashboard" />
);

// Generic Login Component
const Login = ({ type, apiUrl, redirect }) => {
  const [user, setUser] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    console.log("👉 Submitting login form");

    // Simple validation
    if (!user.email || !user.password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      const response = await axios.post(apiUrl, user);
      console.log("✅ Login success", response.data);

      // Check the structure of response.data
      console.log("Response data:", response.data);

      // Save JWT token
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      } else {
        console.error("Token missing in the response");
      }

      // If homemaker, also store homemakerId
      if (type === "Homemaker" && response.data.homemaker?._id) {
        console.log("Homemaker ID found:", response.data.homemaker._id);  // Log the ID
        localStorage.setItem("homemakerId", response.data.homemaker._id);  // Store the ID in localStorage
      } else {
        console.error("Homemaker ID missing in the response");
      }

      alert(`${type} Login Successful!`);
      navigate(redirect);  // Redirect after successful login
    } catch (error) {
      console.error("❌ Login failed", error.response?.data);
      setError(error.response?.data?.message || "Invalid credentials.");
    }
  };

  return (
    <LoginForm
      title={`${type} Login`}
      handleSubmit={handleSubmit}
      setUser={setUser}
      user={user}
      error={error}
    />
  );
};

// Common Login Form Component
const LoginForm = ({ title, handleSubmit, setUser, user, error }) => {
  const navigate = useNavigate();

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">{title}</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            required
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            value={user.email}
          />
          <input
            type="password"
            placeholder="Password"
            required
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            value={user.password}
          />
          <button type="submit" className="login-button">Login</button>
        </form>

        {/* Forgot Password Link */}
        <p className="forgot-password-link">
          <span
            className="forgot-password-btn"
            onClick={() => navigate("/forgot-password")}
            style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}
          >
            Forgot Password?
          </span>
        </p>

        {/* Sign up links */}
        <p className="signup-link">
          Don't have an account?  
          {title.includes("Customer") && (
            <span
              className="signup-btn"
              onClick={() => navigate("/customer-signup")}
              style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}
            >
              {" "}Sign up as Customer
            </span>
          )}
          {title.includes("Homemaker") && (
            <span
              className="signup-btn"
              onClick={() => navigate("/homemaker-signup")}
              style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}
            >
              {" "}Sign up as Homemaker
            </span>
          )}
        </p>
      </div>
    </div>
  );
};

export { CustomerLogin, HomemakerLogin, AdminLogin };
