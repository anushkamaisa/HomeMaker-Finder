import React from "react";
import { Link } from "react-router-dom";
import { Users, ChefHat, ShieldCheck, ArrowRight } from "lucide-react";
import "./LoginSelection.css";

const LoginSelection = () => {
  return (
    <div className="login-selection-page">
      <div className="login-selection-container">
        <div className="login-selection-header">
          <h1>Welcome Back</h1>
          <p>Please select your account type to securely log in to your dashboard.</p>
        </div>

        <div className="login-cards-grid">
          {/* Customer Login Card */}
          <Link to="/customer-login" className="login-card customer-card">
            <div className="icon-wrapper">
              <Users />
            </div>
            <h2>Customer</h2>
            <p>Order delicious homemade meals, manage your active orders, and explore local kitchens.</p>
            <div className="login-card-btn">
              Login as Customer <ArrowRight size={18} />
            </div>
          </Link>

          {/* Homemaker Login Card */}
          <Link to="/homemaker-login" className="login-card homemaker-card">
            <div className="icon-wrapper">
              <ChefHat />
            </div>
            <h2>Homemaker</h2>
            <p>Manage your custom menu, track incoming meal orders, and grow your local business.</p>
            <div className="login-card-btn">
              Login as Homemaker <ArrowRight size={18} />
            </div>
          </Link>

          {/* Admin Login Card */}
          <Link to="/admin-login" className="login-card admin-card">
            <div className="icon-wrapper">
              <ShieldCheck />
            </div>
            <h2>Administrator</h2>
            <p>Oversee platform operations, manage users, and review comprehensive analytics metrics.</p>
            <div className="login-card-btn">
              Login as Admin <ArrowRight size={18} />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginSelection;
