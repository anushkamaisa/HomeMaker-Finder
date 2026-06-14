import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Signup.css"; // Import CSS
const BASE_URL = process.env.REACT_APP_API_URL;
export default function Signup() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState(""); // To show error message
  const [loading, setLoading] = useState(false); // For loading state while submitting form
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset error message on each submit attempt
    setError("");
    
    // Check if passwords match
    if (user.password !== user.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Password strength validation (simple check)
    if (user.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      setLoading(true); // Show loading indicator
      // Send the user data for signup
      await axios.post(`${BASE_URL}/api/auth/signup`, {
        name: user.name,
        email: user.email,
        password: user.password,
      });

      alert("Signup Successful!");
      setUser({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      }); // Clear the form fields after successful signup
      navigate("/login"); // Redirect to login page
    } catch (error) {
      setError("Error during signup. Please try again."); // Generic error message
      console.error("Signup error:", error); // Log error for debugging
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
      <h1 className="signup-heading">HomeMaker Signup</h1>

        <h2 className="signup-title">Sign Up</h2>
        
        {/* Display error message if any */}
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Name"
              required
              className="form-control"
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
            />
          </div>
          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              required
              className="form-control"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              required
              className="form-control"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Confirm Password"
              required
              className="form-control"
              value={user.confirmPassword}
              onChange={(e) => setUser({ ...user, confirmPassword: e.target.value })}
            />
          </div>
          
          {/* Submit Button */}
          <button type="submit" className="signup-button" disabled={loading}>
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        {/* Link to Login page */}
        <p className="signup-link">
          Already have an account? <a href="/login">Login here</a>
        </p>
      </div>
    </div>
  );
}
