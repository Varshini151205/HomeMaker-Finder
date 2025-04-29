import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

const CustomerSignup = () => {
  const [user, setUser] = useState({ name: "", email: "", password: "", phone: "" });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

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
