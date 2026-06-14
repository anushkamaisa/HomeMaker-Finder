import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { 
  User, Mail, Lock, Phone, MapPin, ChefHat, 
  Salad, Award, ImagePlus, Eye, EyeOff, 
  AlertCircle, ChevronRight, CheckCircle2
} from "lucide-react";
import "./Signup.css";

const BASE_URL = process.env.REACT_APP_API_URL;

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

      await axios.post(`${BASE_URL}/api/auth/signup`, formData, {
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
      
      {/* Left Panel: Branding & Motivation */}
      <div className="premium-signup-left">
        <img 
          src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=2670&auto=format&fit=crop" 
          alt="Home cooking" 
          className="premium-signup-image"
        />
        <div className="premium-signup-overlay"></div>
        <div className="premium-signup-left-content">
          <h1>Turn Your Passion into Income.</h1>
          <p>Join thousands of homemakers who share their love for cooking with the world. Start your journey as a home chef today!</p>
        </div>
      </div>

      {/* Right Panel: Signup Form */}
      <div className="premium-signup-right">
        <div className="premium-signup-card">
          
          <div className="premium-signup-header">
            <div className="premium-signup-icon">
              <ChefHat size={32} />
            </div>
            <h2>Homemaker Signup</h2>
            <p>Create your chef profile and start cooking</p>
          </div>

          {error && (
            <div className="premium-error-msg">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            
            {/* Section 1: Personal Info */}
            <div className="premium-form-section">
              <h3 className="premium-form-section-title">
                <User size={18} /> Personal Information
              </h3>
              
              <div className="premium-input-group">
                <label className="premium-label">Full Name</label>
                <input 
                  type="text" 
                  placeholder="Enter your full name" 
                  className="premium-input"
                  required 
                  onChange={(e) => setUser({ ...user, name: e.target.value })} 
                  value={user.name} 
                />
                <User size={20} className="premium-input-icon" />
              </div>

              <div className="premium-input-group">
                <label className="premium-label">Email Address</label>
                <input 
                  type="email" 
                  placeholder="name@example.com" 
                  className="premium-input"
                  required 
                  onChange={(e) => setUser({ ...user, email: e.target.value })} 
                  value={user.email} 
                />
                <Mail size={20} className="premium-input-icon" />
              </div>

              <div className="premium-input-group">
                <label className="premium-label">Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    className={`premium-input ${passwordError ? "premium-input-error" : ""}`}
                    required
                    onChange={handlePasswordChange}
                    value={user.password}
                  />
                  <Lock size={20} className="premium-input-icon" />
                  <button 
                    type="button" 
                    className="premium-password-toggle"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {passwordError && <span className="premium-error-text">{passwordError}</span>}
              </div>

              <div className="premium-input-group">
                <label className="premium-label">Phone Number</label>
                <input 
                  type="tel" 
                  placeholder="10-digit mobile number" 
                  className={`premium-input ${phoneError ? "premium-input-error" : ""}`}
                  required 
                  onChange={handlePhoneInput} 
                  value={user.phone} 
                />
                <Phone size={20} className="premium-input-icon" />
                {phoneError && <span className="premium-error-text">{phoneError}</span>}
              </div>

              <div className="premium-input-group">
                <label className="premium-label">Operating Address</label>
                <input 
                  type="text" 
                  placeholder="Complete street address" 
                  className="premium-input"
                  onChange={(e) => setUser({ ...user, address: e.target.value })} 
                  value={user.address} 
                  required 
                />
                <MapPin size={20} className="premium-input-icon" />
              </div>
            </div>

            {/* Section 2: Cooking Expertise */}
            <div className="premium-form-section">
              <h3 className="premium-form-section-title">
                <ChefHat size={18} /> Cooking Expertise
              </h3>
              
              <label className="premium-label">Dietary Specializations</label>
              <div className="premium-checkbox-grid">
                {dietaryOptions.map((option) => (
                  <label key={option} className={`premium-checkbox-label ${user.dietaryPreferences.includes(option) ? 'checked' : ''}`}>
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

              <label className="premium-label">Cuisines You Master</label>
              <div className="premium-checkbox-grid">
                {cuisinesList.map((cuisine) => (
                  <label key={cuisine} className={`premium-checkbox-label ${user.cuisines.includes(cuisine) ? 'checked' : ''}`}>
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

              <div className="premium-input-group" style={{ marginTop: '1rem' }}>
                <label className="premium-label">Custom Cuisine (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Lebanese, Thai..."
                  className="premium-input"
                  value={user.customCuisine}
                  onChange={(e) => setUser({ ...user, customCuisine: e.target.value })}
                />
                <ChefHat size={20} className="premium-input-icon" />
              </div>

              <div className="premium-input-group">
                <label className="premium-label">Experience Level</label>
                <select
                  className="premium-input"
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
                <Award size={20} className="premium-input-icon" />
              </div>
            </div>

            {/* Profile Pic Upload */}
            <div className="premium-form-section">
              <h3 className="premium-form-section-title">
                <ImagePlus size={18} /> Media & Finalization
              </h3>
              <label className="premium-label">Upload Profile Picture</label>
              <div className="premium-file-input-wrapper">
                <input
                  type="file"
                  accept="image/*"
                  className="premium-file-input"
                  onChange={(e) => setUser({ ...user, profilePic: e.target.files[0] })}
                  required
                />
              </div>

              <div className="premium-alert-note">
                <strong><AlertCircle size={16} inline /> Important:</strong>
                Homemakers must cook <strong>only one</strong> food item per day to ensure hygiene and maintain premium quality.
              </div>
            </div>

            <button type="submit" className="premium-submit-btn">
              Create Chef Account <ChevronRight size={20} style={{ marginLeft: '8px', verticalAlign: 'middle' }} />
            </button>
          </form>

          <footer className="premium-form-footer">
            Already have a chef account? <Link to="/homemaker-login" className="premium-link">Login here</Link>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default HomemakerSignup;