import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Phone, Eye, EyeOff, AlertCircle, ShoppingBag } from "lucide-react";
import "./Signup.css";
const BASE_URL = process.env.REACT_APP_API_URL;

const CustomerSignup = () => {
  const [user, setUser] = useState({ name: "", email: "", password: "", phone: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Load the Google Sign-In API script
    const loadGoogleScript = () => {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      
      script.onload = () => {
        if (window.google) {
          initGoogleSignIn();
        }
      };
    };
    
    loadGoogleScript();
    
    return () => {
      const googleScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
      if (googleScript) {
        googleScript.remove();
      }
    };
  }, []);
  
  const initGoogleSignIn = () => {
    window.google.accounts.id.initialize({
      client_id: "637222310524-53gmf5vs1ri0msave46ilebd75j17ept.apps.googleusercontent.com", 
      callback: handleGoogleSignIn,
      auto_select: false
    });
    
    window.google.accounts.id.renderButton(
      document.getElementById("google-signin-button"),
      { 
        theme: "outline", 
        size: "large",
        text: "signup_with",
        width: 320 // matches new premium input widths roughly
      }
    );
  };
  
  const handleGoogleSignIn = async (response) => {
    try {
      const { credential } = response;
      const result = await axios.post(`${BASE_URL}/api/customer-auth/google-signup`, {
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
    setErrors({}); 

    if (!validatePassword(user.password)) {
      setErrors((prev) => ({ ...prev, password: "Password must be 8+ chars, 1 uppercase, 1 number, 1 special char." }));
      return;
    }

    if (!validatePhone(user.phone)) {
      setErrors((prev) => ({ ...prev, phone: "Phone number must be exactly 10 digits." }));
      return;
    }

    try {
      await axios.post(`${BASE_URL}/api/customer-auth/signup`, user);

      alert("Signup Successful! Please login.");
      navigate("/customer-login");
    } catch (error) {
      setErrors((prev) => ({ ...prev, general: error.response?.data?.message || "Signup failed. Try again." }));
    }
  };

  return (
    <div className="premium-signup-wrapper">
      
      {/* Left Panel Image Banner */}
      <div className="premium-signup-left">
        <img 
          src="https://images.unsplash.com/photo-1543339308-43e59d6b73a6?q=80&w=2670&auto=format&fit=crop" 
          alt="Delicious food platter" 
          className="premium-signup-image"
        />
        <div className="premium-signup-overlay"></div>
        <div className="premium-signup-left-content">
          <h1>Taste the Comfort of Home.</h1>
          <p>Discover, order, and savor authentic homemade meals crafted by local chefs directly to your doorstep.</p>
        </div>
      </div>

      {/* Right Panel Form Container */}
      <div className="premium-signup-right">
        <div className="premium-signup-card">
          
          <div className="premium-signup-header">
            <div className="premium-signup-icon">
              <ShoppingBag size={28} />
            </div>
            <h2>Create Customer Account</h2>
            <p>Sign up to start ordering from local homemakers</p>
          </div>

          {errors.general && (
            <div className="premium-error-msg">
              <AlertCircle size={18} /> {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            
            <div className="premium-form-section" style={{ marginBottom: "1rem" }}>
              
              <div className="premium-input-group">
                <input
                  type="text"
                  name="name"
                  className="premium-input"
                  placeholder="Full Name"
                  required
                  onChange={handleChange}
                  value={user.name}
                />
                <User size={20} className="premium-input-icon" />
              </div>

              <div className="premium-input-group">
                <input
                  type="email"
                  name="email"
                  className="premium-input"
                  placeholder="Email Address"
                  required
                  onChange={handleChange}
                  value={user.email}
                />
                <Mail size={20} className="premium-input-icon" />
              </div>

              <div className="premium-input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className={`premium-input ${errors.password ? "premium-input-error" : ""}`}
                  placeholder="Password"
                  required
                  onChange={handleChange}
                  value={user.password}
                />
                <Lock size={20} className="premium-input-icon" />
                <button 
                  type="button"
                  style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer' }}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                {errors.password && <span className="premium-error-text">{errors.password}</span>}
              </div>

              <div className="premium-input-group">
                <input
                  type="tel"
                  name="phone"
                  className={`premium-input ${errors.phone ? "premium-input-error" : ""}`}
                  placeholder="Phone Number (10 digits)"
                  required
                  onChange={handleChange}
                  value={user.phone}
                />
                <Phone size={20} className="premium-input-icon" />
                {errors.phone && <span className="premium-error-text">{errors.phone}</span>}
              </div>
            </div>

            <button type="submit" className="premium-submit-btn">
              Sign Up
            </button>
          </form>

          {/* Social Divider */}
          <div style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#E5E7EB' }}></div>
            <span style={{ padding: '0 1rem', color: '#9CA3AF', fontSize: '0.85rem', fontWeight: 500 }}>OR</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#E5E7EB' }}></div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <div id="google-signin-button"></div>
          </div>

          <div className="premium-form-footer">
            Already have an account? <Link to="/customer-login" className="premium-link">Login here</Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CustomerSignup;