import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

const CustomerSignup = () => {
  const [user, setUser] = useState({ name: "", email: "", password: "", phone: "" });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  
  useEffect(() => {
    // Load the Google Sign-In API script
    const loadGoogleScript = () => {
      // Load the Google API script
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      
      // Initialize Google Sign-In when script loads
      script.onload = () => {
        if (window.google) {
          initGoogleSignIn();
        }
      };
    };
    
    loadGoogleScript();
    
    return () => {
      // Cleanup - remove any Google Sign-In related elements
      const googleScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
      if (googleScript) {
        googleScript.remove();
      }
    };
  }, []);
  
  const initGoogleSignIn = () => {
    window.google.accounts.id.initialize({
      client_id: "637222310524-53gmf5vs1ri0msave46ilebd75j17ept.apps.googleusercontent.com", // Replace with your actual Google Client ID
      callback: handleGoogleSignIn,
      auto_select: false
    });
    
    window.google.accounts.id.renderButton(
      document.getElementById("google-signin-button"),
      { 
        theme: "outline", 
        size: "large",
        text: "signup_with",
        width: 250
      }
    );
  };
  
  const handleGoogleSignIn = async (response) => {
    try {
      // Google Sign-In was successful, get user info from the response
      const { credential } = response;
      
      // Send the token to your backend
      const result = await axios.post("http://localhost:5000/api/customer-auth/google-signup", {
        token: credential
      });
      
      if (result.data) {
        alert("Google Sign-Up Successful!");
        navigate("/customer-login");
      }
    } catch (error) {
      setErrors((prev) => ({ 
        ...prev, 
        general: error.response?.data?.message || "Google signup failed. Please try again." 
      }));
    }
  };

  const validatePassword = (password) => {
    return /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
  };

  const validatePhone = (phone) => {
    return /^[0-9]{10}$/.test(phone);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });

    // Real-time validation
    if (name === "password" && !validatePassword(value)) {
      setErrors((prev) => ({ ...prev, password: "Password must be 8+ chars, 1 uppercase, 1 number, 1 special char." }));
    } else if (name === "password") {
      setErrors((prev) => ({ ...prev, password: "" }));
    }

    if (name === "phone" && !validatePhone(value)) {
      setErrors((prev) => ({ ...prev, phone: "Phone number must be exactly 10 digits." }));
    } else if (name === "phone") {
      setErrors((prev) => ({ ...prev, phone: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({}); // Reset errors

    if (!validatePassword(user.password)) {
      setErrors((prev) => ({ ...prev, password: "Password must be 8+ chars, 1 uppercase, 1 number, 1 special char." }));
      return;
    }

    if (!validatePhone(user.phone)) {
      setErrors((prev) => ({ ...prev, phone: "Phone number must be exactly 10 digits." }));
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/customer-auth/signup", user);

      alert("Signup Successful! Please login.");
      navigate("/customer-login");
    } catch (error) {
      setErrors((prev) => ({ ...prev, general: error.response?.data?.message || "Signup failed. Try again." }));
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h1>Customer Signup</h1>
        {errors.general && <div className="error-message">{errors.general}</div>}
        
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            required
            onChange={handleChange}
            value={user.name}
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            onChange={handleChange}
            value={user.email}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            onChange={handleChange}
            value={user.password}
          />
          {errors.password && <small className="error-text">{errors.password}</small>}

          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            required
            onChange={handleChange}
            value={user.phone}
          />
          {errors.phone && <small className="error-text">{errors.phone}</small>}

          <button type="submit" className="signup-button">Sign Up</button>
        </form>
        
        <div className="or-divider">
          <span>OR</span>
        </div>
        
        <div className="social-signup">
          <div id="google-signin-button"></div>
        </div>

        <p>
          Already have an account?  
          <span 
            className="login-link"
            onClick={() => navigate("/customer-login")}
            style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}
          >
            Login here
          </span>
        </p>
      </div>
    </div>
  );
};

export default CustomerSignup;