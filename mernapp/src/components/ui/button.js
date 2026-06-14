// components/ui/button.js
import React from "react";

const Button = ({ children, className, disabled, onClick, variant = "default" }) => {
  const base = "px-4 py-2 rounded font-semibold transition";
  const styles = {
    default: "bg-green-600 text-white hover:bg-green-700",
    outline: "border border-green-600 text-green-700 hover:bg-green-50",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${styles[variant]} ${className} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {children}
    </button>
  );
};

export default Button;
