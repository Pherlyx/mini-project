import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Link } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import GOOGLE_CLIENT_ID from './config/google';
import Welcome from './components/Welcome';
import Events from './components/Events';
import EventDetail from './components/EventDetail';
import EventRegistration from './components/EventRegistration';
import RegistrationConfirmation from './components/RegistrationConfirmation';
import Calendar from './components/Calendar';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Profile from './components/Profile';
import EditProfile from './components/EditProfile';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import './App.css';

// Create a context for user authentication
export const AuthContext = React.createContext(null);

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const BASE_URL = 'http://localhost:5000'

  // Check for user in localStorage on initial load
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // Update user in state and localStorage
  const updateUser = (userData) => {
    setUser(userData);
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData));
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  };

  // Handle logout
  const handleLogout = () => {
    updateUser(null);
    navigate('/');
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthContext.Provider value={{BASE_URL, user, updateUser, handleLogout }}>
        <div className="App">
          <nav className="main-nav">
            <div className="nav-left">
              <Link to="/" className="logo">EventPlanner</Link>
              <Link to="/events" className="nav-link">Events</Link>
              <Link to="/calendar" className="nav-link">Calendar</Link>
            </div>
            <div className="nav-right">
              {user ? (
                <div className="user-menu">
                  <Link to="/profile" className="nav-link">
                    {user.firstName || 'Profile'}
                  </Link>
                  <button onClick={handleLogout} className="nav-button">
                    Sign Out
                  </button>
                </div>
              ) : (
                <>
                  <Link to="/signin" className="nav-link">Sign In</Link>
                  <Link to="/signup" className="nav-button">Sign Up</Link>
                </>
              )}
            </div>
          </nav>
          
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/events" element={<Events />} />
            <Route path="/event/:id" element={<EventDetail />} />
            <Route path="/register/:eventId" element={<EventRegistration />} />
            <Route path="/confirmation/:ticketId" element={<RegistrationConfirmation />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/edit" element={<EditProfile />} />
          </Routes>
        </div>
      </AuthContext.Provider>
    </GoogleOAuthProvider>
  );
}

export default App; 