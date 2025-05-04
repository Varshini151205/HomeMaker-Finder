import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Signup.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const cuisinesList = ["North Indian", "South Indian", "Chinese", "Italian", "Mexican", "Bengali", "Gujarati"];
const experienceLevels = ["Less than 1 year", "1-3 years", "3-5 years", "5+ years"];
const dietaryOptions = ["Vegan", "Gluten-Free", "Jain", "Low-Carb"];

// Add this CSS to your Signup.css file
const additionalCSS = `
  /* Enhanced styling for the signup page */
  .signup-container {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2rem;
    background: linear-gradient(135deg, #fff8e1 0%, #ffecb3 100%);
    position: relative;
    overflow: hidden;
  }

  /* Floating food animations */
  .floating-foods {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 0;
  }

  .food-item {
    position: absolute;
    opacity: 0.6;
    font-size: 2rem;
    animation: float-animation 8s ease-in-out infinite;
  }

  @keyframes float-animation {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(5deg); }
  }

  /* Background pattern */
  .bg-pattern {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url('/path-to-your-pattern.jpg'); /* You can replace this with an actual pattern */
    background-repeat: repeat;
    background-size: 200px;
    opacity: 0.05;
    z-index: 0;
  }

  /* Enhanced signup card */
  .signup-card {
    width: 100%;
    max-width: 500px;
    background: white;
    border-radius: 16px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    position: relative;
    z-index: 1;
  }

  /* Enhanced header */
  .signup-heading {
    background: linear-gradient(to right, #ff7043, #ff5722);
    color: white;
    padding: 1.5rem;
    margin: 0;
    font-size: 1.5rem;
    text-align: center;
    font-weight: 600;
    position: relative;
  }

  .signup-heading::after {
    content: "Join our community of home chefs";
    display: block;
    font-size: 0.9rem;
    font-weight: 400;
    margin-top: 0.25rem;
    opacity: 0.9;
  }

  /* Form styling */
  form {
    padding: 1.5rem;
  }

  input, select {
    width: 100%;
    padding: 0.75rem;
    margin-bottom: 1rem;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    font-size: 0.9rem;
    transition: all 0.3s ease;
  }

  input:focus, select:focus {
    border-color: #ff7043;
    box-shadow: 0 0 0 2px rgba(255, 112, 67, 0.2);
    outline: none;
  }

  input[type="checkbox"] {
    width: auto;
    margin-right: 0.5rem;
  }

  /* Label styling */
  label {
    font-weight: 500;
    color: #555;
    margin-bottom: 0.5rem;
    display: block;
  }

  /* Checkbox groups */
  .checkbox-group {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  .checkbox-group label {
    display: flex;
    align-items: center;
    font-weight: normal;
    cursor: pointer;
  }

  /* Password container */
  .password-container {
    position: relative;
  }

  .eye-icon {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    color: #757575;
  }

  /* Error message */
  .error-message {
    background-color: #ffebee;
    color: #d32f2f;
    padding: 0.75rem;
    border-radius: 8px;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
  }

  .error-message::before {
    content: "⚠️";
    margin-right: 0.5rem;
  }

  .error-text {
    color: #d32f2f;
    font-size: 0.8rem;
    margin-top: -0.5rem;
    margin-bottom: 0.75rem;
  }

  .input-error {
    border-color: #d32f2f;
  }

  /* Submit button */
  .signup-button {
    width: 100%;
    padding: 0.75rem;
    background: linear-gradient(to right, #ff7043, #ff5722);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-top: 1rem;
  }

  .signup-button:hover {
    background: linear-gradient(to right, #ff5722, #f4511e);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255, 112, 67, 0.3);
  }

  /* Note styling */
  .highlighted-note {
    background-color: #fff8e1;
    border-left: 4px solid #ffc107;
    padding: 1rem;
    border-radius: 4px;
    margin: 1rem 0;
  }

  .highlighted-note strong {
    color: #f57c00;
  }

  .note-text {
    margin-left: 0.5rem;
    color: #795548;
  }

  /* Sections */
  .form-section {
    border-bottom: 1px solid #e0e0e0;
    padding-bottom: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .form-section h3 {
    color: #424242;
    font-size: 1.1rem;
    margin-bottom: 1rem;
  }
`;

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
  const [floatingFoods, setFloatingFoods] = useState([]);
  const navigate = useNavigate();

  // Initialize floating food items
  useEffect(() => {
    const foodEmojis = ["🍕", "🍜", "🍛", "🥘", "🍲", "🥗", "🍱", "🥪", "🌮", "🥐", "🍔", "🍣", "🍎", "🍇", "🥑", "🍊"];
    const foods = [];
    
    for (let i = 0; i < 16; i++) {
      foods.push({
        emoji: foodEmojis[i % foodEmojis.length],
        top: Math.random() * 80 + 10, // Keep within 10-90% of the screen
        left: Math.random() * 80 + 10, // Keep within 10-90% of the screen
        animationDuration: 5 + Math.random() * 7,
        animationDelay: Math.random() * 5,
        size: 24 + Math.floor(Math.random() * 24)
      });
    }
    
    setFloatingFoods(foods);
  }, []);

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
    <>
      {/* Add the additional CSS */}
      <style>{additionalCSS}</style>
      
      <div className="signup-container">
        {/* Floating food background */}
        <div className="floating-foods">
          {floatingFoods.map((food, idx) => (
            <div
              key={idx}
              className="food-item"
              style={{
                top: `${food.top}%`,
                left: `${food.left}%`,
                fontSize: `${food.size}px`,
                animationDuration: `${food.animationDuration}s`,
                animationDelay: `${food.animationDelay}s`,
              }}
            >
              {food.emoji}
            </div>
          ))}
        </div>
        
        {/* Background pattern */}
        <div className="bg-pattern"></div>
        
        <div className="signup-card">
          <h6 className="signup-heading">Homemaker Signup</h6>

          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <h3>Personal Information</h3>
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
            </div>

            <div className="form-section">
              <h3>Cooking Preferences</h3>
              
              {/* Dietary Preferences */}
              <label>Dietary Preferences:</label>
              <div className="checkbox-group">
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
              <div className="checkbox-group">
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
              </div>
              <input
                type="text"
                placeholder="Custom Cuisine"
                value={user.customCuisine}
                onChange={(e) => setUser({ ...user, customCuisine: e.target.value })}
              />

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
            </div>

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
    </>
  );
};

export default HomemakerSignup;