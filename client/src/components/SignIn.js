import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { AuthContext } from '../App';
import './SignIn.css';

const SignIn = () => {
  const navigate = useNavigate();
  const { updateUser, BASE_URL } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${BASE_URL}/api/auth/signin`, {
        email: formData.email,
        password: formData.password
      });
      
      // Update user in context and localStorage
      updateUser(response.data.user);
      localStorage.setItem('token', response.data.token);
      
      // Navigate to events page
      navigate('/events');
    } catch (error) {
      console.error('Sign in error:', error);
      setError(error.response?.data?.message || 'Sign in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError('');

    try {
      console.log('Google login successful:', credentialResponse);
      
      // Decode the JWT token to get user info
      const decoded = JSON.parse(atob(credentialResponse.credential.split('.')[1]));
      
      const googleUser = {
        id: 'google_' + decoded.sub,
        email: decoded.email,
        firstName: decoded.given_name || decoded.name?.split(' ')[0] || 'Google',
        lastName: decoded.family_name || decoded.name?.split(' ').slice(1).join(' ') || 'User',
        provider: 'google',
        picture: decoded.picture
      };

      console.log('Google user created:', googleUser);

      // Update user in context and localStorage
      updateUser(googleUser);
      localStorage.setItem('token', credentialResponse.credential);
      
      // Navigate to events page
      navigate('/events');
    } catch (error) {
      console.error('Google sign in error:', error);
      setError('Google sign in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    console.error('Google login failed');
    setError('Google sign in failed. Please try again.');
    setLoading(false);
  };

  return (
    <div className="signin-container">
      <div className="signin-card">
        <div className="signin-header">
          <h1>Welcome Back</h1>
          <p>Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="signin-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
          <div className="auth-links">
            <Link to="/forgot-password">Forgot Password?</Link>
            <span>•</span>
            <Link to="/signup">Don't have an account? Sign Up</Link>
          </div>

          <div className="divider">
            <span>or</span>
          </div>

          {/* Google signin temporarily disabled - requires valid Client ID */}
          {/* 
          <div className="google-signin-container">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap
              theme="outline"
              size="large"
              text="continue_with"
              shape="rectangular"
              width="100%"
            />
          </div>
          */}

          <div className="signin-footer">
            <p>
              Don't have an account?{' '}
              <Link to="/signup" className="signup-link">
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignIn;