import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Mail, KeyRound, AlertCircle, CheckCircle, ArrowLeft } from "lucide-react";
import "./ForgotPassword.css";
const BASE_URL = process.env.REACT_APP_API_URL;

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // ── Logic unchanged ──────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsLoading(true);

    try {
      const response = await axios.post(`${BASE_URL}/api/auth/forgot-password`, { email });
      setSuccessMessage(response.data.message);
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };
  // ─────────────────────────────────────────────────────────────────

  return (
    <div className="fp-page">
      {/* Background */}
      <div className="fp-bg" />

      {/* Card */}
      <div className="fp-card">

        {/* Icon */}
        <div className="fp-icon-wrap">
          <KeyRound size={30} />
        </div>

        <h2 className="fp-title">Forgot Password?</h2>
        <p className="fp-subtitle">
          No worries! Enter your registered email and we'll send you a link to reset your password.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="fp-input-group">
            <input
              type="email"
              className="fp-input"
              placeholder="Enter your email address"
              required
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              disabled={isLoading || !!successMessage}
            />
            <Mail size={18} className="fp-input-icon" />
          </div>

          <button
            type="submit"
            className="fp-btn"
            disabled={isLoading || !!successMessage}
          >
            {isLoading ? "Sending…" : "Send Reset Link"}
          </button>
        </form>

        {/* Error */}
        {error && (
          <div className="fp-error">
            <AlertCircle size={18} style={{ flexShrink: 0, marginTop: 1 }} />
            {error}
          </div>
        )}

        {/* Success */}
        {successMessage && (
          <div className="fp-success">
            <CheckCircle size={18} style={{ flexShrink: 0, marginTop: 1 }} />
            {successMessage}
          </div>
        )}

        {/* Back to login */}
        <div className="fp-back">
          <ArrowLeft size={15} />
          <span>Remember it?</span>
          <button className="fp-back-btn" onClick={() => navigate("/login")}>
            Back to Login
          </button>
        </div>

      </div>
    </div>
  );
};

export default ForgotPassword;
