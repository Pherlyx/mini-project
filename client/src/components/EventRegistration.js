import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../App';
import { getEventImage } from '../utils/eventImages';
import './EventRegistration.css';

const EventRegistration = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [event, setEvent] = useState(null);
  const [paymentSummary, setPaymentSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    company: '',
    dietaryRestrictions: '',
    additionalNotes: ''
  });

  const fetchEvent = useCallback(async () => {
    try {
      const response = await axios.get(`/api/events/${eventId}`);
      setEvent(response.data);
    } catch (error) {
      console.error('Error fetching event:', error);
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  const fetchPaymentSummary = useCallback(async () => {
    try {
      const response = await axios.post('/api/registrations/payment-summary', { eventId });
      setPaymentSummary(response.data);
    } catch (error) {
      console.error('Error fetching payment summary:', error);
    }
  }, [eventId]);

  useEffect(() => {
    fetchEvent();
    fetchPaymentSummary();
  }, [fetchEvent, fetchPaymentSummary]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const registrationData = {
        eventId,
        userId: user?.id || 'guest',
        ...formData
      };

      console.log('Submitting registration:', registrationData);
      const response = await axios.post('/api/registrations', registrationData);
      console.log('Registration response:', response.data);
      
      // Navigate to confirmation page
      const confirmationUrl = `/confirmation/${response.data.ticketId}`;
      console.log('Navigating to:', confirmationUrl);
      navigate(confirmationUrl);
    } catch (error) {
      console.error('Error submitting registration:', error);
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="registration-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="registration-container">
        <div className="message message-error">Event not found</div>
      </div>
    );
  }

  return (
    <div className="registration-container">
      {/* Header */}
      <div className="registration-header">
        <button className="back-btn" onClick={handleBack}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15,18 9,12 15,6"></polyline>
          </svg>
        </button>
        <h1 className="registration-title">Event Registration</h1>
      </div>

      {/* Event Summary */}
      <div className="event-summary">
        <div className="event-image">
          <img 
            src={getEventImage(event.category)} 
            alt={event.title}
            className="event-image-content"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = getEventImage('Default');
            }}
          />
        </div>
        <div className="event-info">
          <h2 className="event-title">{event.title}</h2>
          <p className="event-date">{event.date}</p>
          <p className="event-location">{event.location}</p>
          <div className="event-price">{event.price === 0 ? 'Free' : `$${event.price}`}</div>
        </div>
      </div>

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="registration-form">
        <div className="form-section">
          <h3 className="section-title">Personal Information</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Company (Optional)</label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Your company"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Dietary Restrictions</label>
            <select
              name="dietaryRestrictions"
              value={formData.dietaryRestrictions}
              onChange={handleInputChange}
              className="form-input"
            >
              <option value="">Select if any</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="vegan">Vegan</option>
              <option value="gluten-free">Gluten-free</option>
              <option value="dairy-free">Dairy-free</option>
              <option value="nut-free">Nut-free</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Additional Notes (Optional)</label>
            <textarea
              name="additionalNotes"
              value={formData.additionalNotes}
              onChange={handleInputChange}
              className="form-input"
              rows="4"
              placeholder="Any special requirements or questions..."
            />
          </div>
        </div>

        {/* Payment Summary */}
        {paymentSummary && (
          <div className="payment-summary">
            <h3 className="section-title">Payment Summary</h3>
            <div className="summary-item">
              <span>Event Ticket</span>
              <span>${paymentSummary.eventTicket}</span>
            </div>
            <div className="summary-item">
              <span>Service Fee</span>
              <span>${paymentSummary.serviceFee}</span>
            </div>
            <div className="summary-total">
              <span>Total</span>
              <span>${paymentSummary.total}</span>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="submit-section">
          <button 
            type="submit" 
            className="btn btn-dark submit-btn"
            disabled={submitting}
          >
            {submitting ? 'Processing...' : 'Complete Registration'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventRegistration; 