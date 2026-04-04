import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Phone, MapPin, ChefHat, Eye, EyeOff, AlertCircle } from "lucide-react";
import "./Signup.css";

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
    bio: "",
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
    <div className="premium-signup-wrapper">
      
      {/* Left Panel Image Banner */}
      <div className="premium-signup-left">
        <img 
          src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=2670&auto=format&fit=crop" 
          alt="Cooking environment" 
          className="premium-signup-image"
        />
        <div className="premium-signup-overlay"></div>
        <div className="premium-signup-left-content">
          <h1>Turn Your Cooking Into Income.</h1>
          <p>Join thousands of local homemakers selling authentic homemade meals to happy customers every day.</p>
        </div>
      </div>

      {/* Right Panel Form Container */}
      <div className="premium-signup-right">
        <div className="premium-signup-card">
          
          <div className="premium-signup-header">
            <div className="premium-signup-icon">
              <ChefHat size={28} />
            </div>
            <h2>Become a Homemaker</h2>
            <p>Start selling your homemade food today</p>
          </div>

          {error && (
            <div className="premium-error-msg">
              <AlertCircle size={18} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            
            {/* SECTION 1: Personal Info */}
            <div className="premium-form-section">
              <div className="premium-form-section-title">Personal Information</div>
              
              <div className="premium-input-group">
                <input 
                  type="text" 
                  className="premium-input" 
                  placeholder="Full Name" 
                  required 
                  onChange={(e) => setUser({ ...user, name: e.target.value })} 
                  value={user.name} 
                />
                <User size={20} className="premium-input-icon" />
              </div>
              
              <div className="premium-input-group">
                <input 
                  type="email" 
                  className="premium-input" 
                  placeholder="Email Address" 
                  required 
                  onChange={(e) => setUser({ ...user, email: e.target.value })} 
                  value={user.email} 
                />
                <Mail size={20} className="premium-input-icon" />
              </div>

              <div className="premium-input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  className={`premium-input ${passwordError ? "premium-input-error" : ""}`}
                  placeholder="Password"
                  required
                  onChange={handlePasswordChange}
                  value={user.password}
                />
                <Lock size={20} className="premium-input-icon" />
                <button 
                  type="button"
                  style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer' }}
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                {passwordError && <span className="premium-error-text">{passwordError}</span>}
              </div>

              <div className="premium-input-group">
                <input 
                  type="tel" 
                  className={`premium-input ${phoneError ? "premium-input-error" : ""}`}
                  placeholder="Phone Number" 
                  required 
                  onChange={handlePhoneInput} 
                  value={user.phone} 
                />
                <Phone size={20} className="premium-input-icon" />
                {phoneError && <span className="premium-error-text">{phoneError}</span>}
              </div>

              <div className="premium-input-group">
                <input 
                  type="text" 
                  className="premium-input" 
                  placeholder="Full Delivery Address" 
                  onChange={(e) => setUser({ ...user, address: e.target.value })} 
                  value={user.address} 
                  required 
                />
                <MapPin size={20} className="premium-input-icon" />
              </div>
            </div>

            {/* SECTION 2: Cooking Preferences */}
            <div className="premium-form-section">
              <div className="premium-form-section-title">Cooking Specialities</div>
              
              <p style={{ fontSize: '0.9rem', color: '#4B5563', marginBottom: '8px' }}>Dietary Profile:</p>
              <div className="premium-checkbox-grid">
                {dietaryOptions.map((option) => (
                  <label className="premium-checkbox-label" key={option}>
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

              <p style={{ fontSize: '0.9rem', color: '#4B5563', marginBottom: '8px', marginTop: '1rem' }}>Cuisines You Cook:</p>
              <div className="premium-checkbox-grid">
                {cuisinesList.map((cuisine) => (
                  <label className="premium-checkbox-label" key={cuisine}>
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
              
              <div className="premium-input-group mt-3" style={{ marginTop: '1rem' }}>
                <input
                  type="text"
                  className="premium-input"
                  style={{ paddingLeft: '14px' }}
                  placeholder="Other Custom Cuisine? (Optional)"
                  value={user.customCuisine}
                  onChange={(e) => setUser({ ...user, customCuisine: e.target.value })}
                />
              </div>

              <div className="premium-input-group mt-3" style={{ marginTop: '1rem' }}>
                <select
                  className="premium-input"
                  style={{ paddingLeft: '14px' }}
                  value={user.experience}
                  onChange={(e) => setUser({ ...user, experience: e.target.value })}
                  required
                >
                  <option value="">Select Professional Experience</option>
                  {experienceLevels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>

              <div className="premium-input-group mt-3" style={{ marginTop: '1rem' }}>
                <textarea
                  className="premium-input"
                  style={{ paddingLeft: '14px', height: '100px', paddingTop: '10px' }}
                  placeholder="About Me / Short Bio (Describe your cooking passion...)"
                  value={user.bio}
                  onChange={(e) => setUser({ ...user, bio: e.target.value })}
                />
              </div>
            </div>

            {/* SECTION 3: Profile Finalization */}
            <div className="premium-form-section">
              <div className="premium-form-section-title">Profile Picture</div>
              <input
                type="file"
                accept="image/*"
                className="premium-input"
                style={{ padding: '9px 14px' }}
                onChange={(e) => setUser({ ...user, profilePic: e.target.files[0] })}
              />
            </div>

            <div className="premium-alert-note">
              <strong>⚠️ Important Policy:</strong> Homemakers are structured to cook <strong>only one</strong> designated food item per day to ensure pristine hygiene standards and maximum quality.
            </div>

            <button type="submit" className="premium-submit-btn">
              Create Homemaker Account
            </button>
          </form>

          <div className="premium-form-footer">
            Already have a Homemaker account? <Link to="/homemaker-login" className="premium-link">Login here</Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default HomemakerSignup;