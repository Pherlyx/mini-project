import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './RegistrationConfirmation.css';

const RegistrationConfirmation = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const [confirmation, setConfirmation] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchConfirmation = useCallback(async () => {
    try {
      console.log('Fetching confirmation for ticketId:', ticketId);
      console.log('API URL:', `/api/registrations/confirmation/${ticketId}`);
      const response = await axios.get(`/api/registrations/confirmation/${ticketId}`);
      console.log('Confirmation response:', response.data);
      setConfirmation(response.data);
    } catch (error) {
      console.error('Error fetching confirmation:', error);
      console.error('Error details:', error.response?.data);
      console.error('Error status:', error.response?.status);
    } finally {
      setLoading(false);
    }
  }, [ticketId]);

  useEffect(() => {
    fetchConfirmation();
  }, [fetchConfirmation]);

  const handleAddToCalendar = () => {
    // Navigate to calendar page with event data
    navigate('/calendar', { 
      state: { 
        event: confirmation.event 
      } 
    });
  };

  const handleBrowseMoreEvents = () => {
    navigate('/events');
  };

  if (loading) {
    return (
      <div className="confirmation-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!confirmation) {
    return (
      <div className="confirmation-container">
        <div className="message message-error">Confirmation not found</div>
      </div>
    );
  }

  return (
    <div className="confirmation-container">
      {/* Success Icon */}
      <div className="success-icon-container">
        <div className="success-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <polyline points="20,6 9,17 4,12"></polyline>
          </svg>
        </div>
      </div>

      {/* Success Title */}
      <h1 className="success-title">Registration Successful!</h1>

      {/* Success Messages */}
      <div className="success-messages">
        <p className="success-message">
          You're all set for {confirmation.event.title}.
        </p>
        <p className="success-subtitle">
          Check your email for confirmation details.
        </p>
      </div>

      {/* Event Details Card */}
      <div className="event-details-card">
        <div className="detail-row">
          <span className="detail-label">Event</span>
          <span className="detail-value">{confirmation.event.title}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Date</span>
          <span className="detail-value">{confirmation.event.date}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Time</span>
          <span className="detail-value">{confirmation.event.time}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Location</span>
          <span className="detail-value">{confirmation.event.location}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Ticket ID</span>
          <span className="detail-value">#{confirmation.ticketId}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        <button 
          className="btn btn-dark action-btn primary-btn"
          onClick={handleAddToCalendar}
        >
          Add to Calendar
        </button>
        <button 
          className="btn btn-secondary action-btn secondary-btn"
          onClick={handleBrowseMoreEvents}
        >
          Browse More Events
        </button>
      </div>
    </div>
  );
};

export default RegistrationConfirmation;