// src/components/ui/button.js
import React from "react";

// In button.js
const Button = ({ children, className, ...props }) => {
  return (
    <button className={`p-4 rounded-md ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button; // Default export
