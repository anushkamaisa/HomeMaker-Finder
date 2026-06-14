import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, AlertCircle, Users, ChefHat, ShieldCheck } from "lucide-react";
import "./Login.css";

// API routes
const API_ROUTES = {
  CUSTOMER_LOGIN: "http://homemaker-backend-env.eba-kymmejmz.ap-south-1.elasticbeanstalk.com/api/customer-auth/customer-login",
  HOMEMAKER_LOGIN: "http://homemaker-backend-env.eba-kymmejmz.ap-south-1.elasticbeanstalk.com/api/auth/homemaker-login",
  ADMIN_LOGIN: "http://homemaker-backend-env.eba-kymmejmz.ap-south-1.elasticbeanstalk.com/api/admin/login"
};

// Generic Login Component
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

      // 🔥 FIX: Handle admin (no token) + others (with token)
      if (response.data) {

        // Save token if exists, else save dummy token for admin
        const token = response.data.token || "admin-token";
        localStorage.setItem("token", token);

        // Save role
        localStorage.setItem("userRole", type);

        // Save IDs if present
        if (type === "Homemaker" && response.data.homemaker?._id) {
          localStorage.setItem("homemakerId", response.data.homemaker._id);
        } 
        else if (type === "Customer" && response.data.customer?._id) {
          localStorage.setItem("customerId", response.data.customer._id);
        }

        navigate(redirect);
      } else {
        throw new Error("Invalid response from server");
      }

    } catch (error) {
      if (!navigator.onLine) {
        setError("Network error. Please check your connection.");
      } else if (error.response?.status === 401) {
        setError("Invalid email or password.");
      } else if (error.response?.status === 404) {
        setError("API route not found.");
      } else {
        setError(error.response?.data?.message || error.message || "Login failed.");
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

// Role Config
const ROLE_CONFIG = {
  Customer: {
    icon: <Users size={28} />,
    colorClass: "customer",
    subtitle: "Order delicious homemade meals near you",
    image: "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?q=80&w=2670&auto=format&fit=crop",
    tagline: "Taste the Comfort of Home.",
    taglineDesc: "Discover authentic homemade meals crafted by passionate local chefs.",
    signupRoute: "/customer-signup",
    signupLabel: "Sign up as Customer",
  },
  Homemaker: {
    icon: <ChefHat size={28} />,
    colorClass: "homemaker",
    subtitle: "Manage your kitchen and orders seamlessly",
    image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=2670&auto=format&fit=crop",
    tagline: "Turn Cooking Into Income.",
    taglineDesc: "Empower your passion for cooking and grow your business from home.",
    signupRoute: "/homemaker-signup",
    signupLabel: "Sign up as Homemaker",
  },
  Admin: {
    icon: <ShieldCheck size={28} />,
    colorClass: "admin",
    subtitle: "Platform management and analytics hub",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2670&auto=format&fit=crop",
    tagline: "Powering Every Kitchen.",
    taglineDesc: "Monitor operations, manage users, and review platform insights.",
    signupRoute: null,
  },
};

// UI Component
const LoginForm = ({ title, type, handleSubmit, setUser, user, error, isLoading }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const config = ROLE_CONFIG[type];
  const { icon, colorClass, subtitle, image, tagline, taglineDesc, signupRoute, signupLabel } = config;

  return (
    <div className="login-wrapper">

      {/* LEFT */}
      <div className="login-left">
        <img src={image} alt="bg" className="login-left-image" />
        <div className="login-left-overlay" />
        <div className="login-left-content">
          <h1>{tagline}</h1>
          <p>{taglineDesc}</p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="login-right">
        <div className="login-card">

          <div className={`login-role-icon ${colorClass}`}>
            {icon}
          </div>

          <h2 className="login-title">{title}</h2>
          <p className="login-subtitle">{subtitle}</p>

          {error && (
            <div className="login-error">
              <AlertCircle size={18} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* Email */}
            <div className="login-form-group">
              <label className="login-label">Email Address</label>
              <div className="login-input-wrapper">
                <Mail className="login-input-icon" size={18} />
                <input
                  type="email"
                  className={`login-input ${colorClass}`}
                  placeholder="Enter your email"
                  required
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password */}
            <div className="login-form-group">
              <label className="login-label">Password</label>
              <div className="login-input-wrapper">
                <Lock className="login-input-icon" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  className={`login-input ${colorClass}`}
                  placeholder="Enter your password"
                  required
                  value={user.password}
                  onChange={(e) => setUser({ ...user, password: e.target.value })}
                  disabled={isLoading}
                />
                <button 
                  type="button" 
                  className="login-pw-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="login-forgot-row">
              <button 
                type="button" 
                className="login-forgot-btn"
                onClick={() => navigate("/forgot-password")}
              >
                Forgot Password?
              </button>
            </div>

            <button 
              type="submit" 
              className={`login-submit-btn ${colorClass}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="btn-loading">
                  Logging in...
                </span>
              ) : `Login as ${type}`}
            </button>

          </form>

          {signupRoute && (
            <div className="login-footer">
              <p>
                Don't have an account?
                <button 
                  className={`login-signup-btn ${colorClass}`}
                  onClick={() => navigate(signupRoute)}
                >
                  {signupLabel}
                </button>
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

// Exports
export const CustomerLogin = () => (
  <Login type="Customer" apiUrl={API_ROUTES.CUSTOMER_LOGIN} redirect="/" />
);

export const HomemakerLogin = () => (
  <Login type="Homemaker" apiUrl={API_ROUTES.HOMEMAKER_LOGIN} redirect="/homemaker-dashboard" />
);

export const AdminLogin = () => (
  <Login type="Admin" apiUrl={API_ROUTES.ADMIN_LOGIN} redirect="/admin-dashboard" />
);