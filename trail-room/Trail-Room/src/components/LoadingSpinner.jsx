// components/LoadingSpinner.jsx
import React from 'react';
import '../styles/LoadingSpinner.css'; // Import your CSS styles for the spinner

const LoadingSpinner = ({ message = "Loading your fashion items" }) => {
  return (
    <div className="loading-container">
      <div className="loading-animation">
        <div className="loading-spinner">
            <center>
          <div className="cube">
            <div className="side front"></div>
            <div className="side back"></div>
            <div className="side right"></div>
            <div className="side left"></div>
            <div className="side top"></div>
            <div className="side bottom"></div>
          </div>
          </center>
        </div>
        <div className="loading-text">{message}</div>
      </div>
    </div>
  );
};

export default LoadingSpinner;