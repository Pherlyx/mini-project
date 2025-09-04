import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      // If no user data, redirect to sign in
      navigate('/signin');
    }
  }, [navigate]);

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    // Redirect to home page
    navigate('/');
  };

  if (!user) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <h1>My Profile</h1>
          <button onClick={handleLogout} className="logout-btn">
            Sign Out
          </button>
        </div>
        
        <div className="profile-info">
          <div className="profile-avatar">
            {user.firstName ? user.firstName[0].toUpperCase() : 'U'}
          </div>
          
          <div className="profile-details">
            <div className="detail-row">
              <span className="detail-label">Name:</span>
              <span className="detail-value">{user.firstName} {user.lastName}</span>
            </div>
            
            <div className="detail-row">
              <span className="detail-label">Email:</span>
              <span className="detail-value">{user.email}</span>
            </div>
            
            {user.phone && (
              <div className="detail-row">
                <span className="detail-label">Phone:</span>
                <span className="detail-value">{user.phone}</span>
              </div>
            )}
            
            {user.provider && (
              <div className="detail-row">
                <span className="detail-label">Signed in with:</span>
                <span className="detail-value">
                  {user.provider.charAt(0).toUpperCase() + user.provider.slice(1)}
                </span>
              </div>
            )}
          </div>
        </div>
        
        <div className="profile-actions">
          <button 
            className="edit-profile-btn"
            onClick={() => navigate('/profile/edit')}
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
