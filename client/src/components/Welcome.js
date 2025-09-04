import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Welcome.css';

const Welcome = () => {
  const navigate = useNavigate();

  const handleExploreEvents = () => {
    navigate('/events');
  };

  const handleSignIn = () => {
    navigate('/signin');
  };

  return (
    <div className="welcome">
      <div className="welcome-content">
        {/* Calendar Icon */}
        <div className="calendar-icon">
          <div className="calendar-circle">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </div>
        </div>

        {/* App Title */}
        <h1 className="app-title">EventPlanner</h1>

        {/* Tagline */}
        <p className="tagline">
          Discover amazing events and connect<br />
          with like-minded people in your area.
        </p>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button 
            className="btn btn-primary explore-btn"
            onClick={handleExploreEvents}
          >
            Explore Events
          </button>
          
          <button 
            className="btn btn-secondary signin-btn"
            onClick={handleSignIn}
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default Welcome; 