import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Signup.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const cuisinesList = ["North Indian", "South Indian", "Chinese", "Italian", "Mexican", "Bengali", "Gujarati"];
const experienceLevels = ["Less than 1 year", "1-3 years", "3-5 years", "5+ years"];
const dietaryOptions = ["Vegan", "Gluten-Free", "Jain", "Low-Carb"];


const HomemakerSignup = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    cuisines: [],
    customCuisine: "",
    experience: "",
    profilePic: null,
    dietaryPreferences: [],
  });

  const [error, setError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const validatePassword = (password) => {
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongPasswordRegex.test(password);
  };

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setUser({ ...user, password });

    if (!validatePassword(password)) {
      setPasswordError("Password must include 1 uppercase, 1 lowercase, 1 number, 1 special character, and be at least 8 characters long.");
    } else {
      setPasswordError("");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handlePhoneInput = (e) => {
    const onlyNumbers = e.target.value.replace(/\D/g, "");
    setUser({ ...user, phone: onlyNumbers });

    if (onlyNumbers.length !== 10) {
      setPhoneError("Phone number must be exactly 10 digits.");
    } else {
      setPhoneError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setPhoneError("");
    setPasswordError("");

    if (!validatePassword(user.password)) {
      setPasswordError("Password must include 1 uppercase, 1 lowercase, 1 number, 1 special character, and be at least 8 characters long.");
      return;
    }

    if (user.phone.length !== 10) {
      setPhoneError("Phone number must be exactly 10 digits.");
      return;
    }

    try {
      const formData = new FormData();
      Object.keys(user).forEach((key) => {
        if (key === "profilePic" && user[key]) {
          formData.append(key, user[key]);
        } else if (Array.isArray(user[key])) {
          user[key].forEach((item) => formData.append(key, item));
        } else {
          formData.append(key, user[key]);
        }
      });

      // ✅ Fixed endpoint URL
      await axios.post("http://localhost:5000/api/auth/signup", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Signup Successful! Please login.");
      navigate("/homemaker-login");
    } catch (error) {
      setError(error.response?.data?.message || "Signup failed. Try again.");
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h6 className="signup-heading">Homemaker Signup</h6>

        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Full Name" required onChange={(e) => setUser({ ...user, name: e.target.value })} value={user.name} />
          <input type="email" placeholder="Email" required onChange={(e) => setUser({ ...user, email: e.target.value })} value={user.email} />

          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              required
              onChange={handlePasswordChange}
              value={user.password}
              className={passwordError ? "input-error" : ""}
            />
            <span className="eye-icon" onClick={togglePasswordVisibility}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {passwordError && <div className="error-text">{passwordError}</div>}

          <input type="tel" placeholder="Phone Number" required onChange={handlePhoneInput} value={user.phone} />
          {phoneError && <div className="error-text">{phoneError}</div>}

          <label>Address:</label>
          <input type="text" placeholder="Enter Address" onChange={(e) => setUser({ ...user, address: e.target.value })} value={user.address} required />

          {/* Dietary Preferences */}
          <label>Dietary Preferences:</label>
          <div>
            {dietaryOptions.map((option) => (
              <label key={option}>
                <input
                  type="checkbox"
                  value={option}
                  checked={user.dietaryPreferences.includes(option)}
                  onChange={(e) =>
                    setUser((prev) => ({
                      ...prev,
                      dietaryPreferences: prev.dietaryPreferences.includes(option)
                        ? prev.dietaryPreferences.filter((item) => item !== option)
                        : [...prev.dietaryPreferences, option],
                    }))
                  }
                />
                {option}
              </label>
            ))}
          </div>

          {/* Cuisine Selection */}
          <label>Cuisines You Can Cook:</label>
          <div>
            {cuisinesList.map((cuisine) => (
              <label key={cuisine}>
                <input
                  type="checkbox"
                  value={cuisine}
                  checked={user.cuisines.includes(cuisine)}
                  onChange={(e) =>
                    setUser((prev) => ({
                      ...prev,
                      cuisines: prev.cuisines.includes(cuisine)
                        ? prev.cuisines.filter((item) => item !== cuisine)
                        : [...prev.cuisines, cuisine],
                    }))
                  }
                />
                {cuisine}
              </label>
            ))}
            <input
              type="text"
              placeholder="Custom Cuisine"
              value={user.customCuisine}
              onChange={(e) => setUser({ ...user, customCuisine: e.target.value })}
            />
          </div>

          {/* Experience Level */}
          <label>Experience Level:</label>
          <select
            value={user.experience}
            onChange={(e) => setUser({ ...user, experience: e.target.value })}
            required
          >
            <option value="">Select Experience Level</option>
            {experienceLevels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>

          {/* Profile Pic Upload */}
          <label>Upload Profile Picture:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setUser({ ...user, profilePic: e.target.files[0] })}
          />

          <div className="highlighted-note">
            <strong>⚠️ Important:</strong>
            <span className="note-text">
              Homemakers must cook <strong>only one</strong> food item per day to ensure hygiene and maintain quality.
            </span>
          </div>

          <button type="submit" className="signup-button">Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default HomemakerSignup;
