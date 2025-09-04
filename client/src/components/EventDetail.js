import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getEventImage } from '../utils/eventImages';
import './EventDetail.css';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState(new Set());

  const fetchEvent = useCallback(async () => {
    try {
      const response = await axios.get(`/api/events/${id}`);
      setEvent(response.data);
    } catch (error) {
      console.error('Error fetching event:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleRegister = () => {
    navigate(`/register/${id}`);
  };

  const formatPrice = (price) => {
    return price === 0 ? 'Free' : `$${price}`;
  };

  const toggleFavorite = (eventId, e) => {
    e.stopPropagation();
    setFavorites(prevFavorites => {
      const newFavorites = new Set(prevFavorites);
      if (newFavorites.has(eventId)) {
        newFavorites.delete(eventId);
      } else {
        newFavorites.add(eventId);
      }
      // Save to localStorage for persistence
      localStorage.setItem('favoriteEvents', JSON.stringify(Array.from(newFavorites)));
      return newFavorites;
    });
  };

  // Load favorites from localStorage on component mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('favoriteEvents');
    if (savedFavorites) {
      setFavorites(new Set(JSON.parse(savedFavorites)));
    }
  }, []);

  if (loading) {
    return (
      <div className="event-detail-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="event-detail-container">
        <div className="message message-error">Event not found</div>
      </div>
    );
  }

  return (
    <div className="event-detail-container">
      {/* Header with Image */}
      <div className="event-header">
        <div className="event-image-container">
          <img 
            src={getEventImage(event.category)} 
            alt={event.title}
            className="event-image"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = getEventImage('Default');
            }}
          />
        </div>
        
        {/* Navigation Buttons */}
        <div className="header-actions">
          <button className="nav-btn back-btn" onClick={handleBack}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15,18 9,12 15,6"></polyline>
            </svg>
          </button>
          <div className="right-actions">
            <button 
              className={`nav-btn favorite-button ${favorites.has(event.id) ? 'favorited' : ''}`}
              onClick={(e) => toggleFavorite(event.id, e)}
              aria-label={favorites.has(event.id) ? 'Remove from favorites' : 'Add to favorites'}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill={favorites.has(event.id) ? '#ff4d4f' : 'none'} stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Event Content */}
      <div className="event-content">
        {/* Event Category and Price */}
        <div className="event-header-info">
          <div className="event-category">{event.category}</div>
          <div className="event-price">{formatPrice(event.price)}</div>
        </div>

        {/* Event Title and Organizer */}
        <h1 className="event-title">{event.title}</h1>
        <p className="event-organizer">{event.organizer}</p>

        {/* Rating and Attendees */}
        <div className="event-stats">
          <div className="rating">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
              <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"></polygon>
            </svg>
            <span>{event.rating} ({event.attendees} going)</span>
          </div>
        </div>

        {/* Event Details Cards */}
        <div className="event-details-cards">
          <div className="detail-card">
            <div className="detail-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </div>
            <div className="detail-content">
              <div className="detail-title">{event.date}</div>
              <div className="detail-subtitle">{event.time}</div>
            </div>
          </div>

          <div className="detail-card">
            <div className="detail-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
            <div className="detail-content">
              <div className="detail-title">{event.location}</div>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="about-section">
          <h2 className="section-title">About this event</h2>
          <p className="event-description">{event.description}</p>
        </div>

        {/* Organizer Section */}
        <div className="organizer-section">
          <h2 className="section-title">Organizer</h2>
          <div className="organizer-info">
            <div className="organizer-avatar">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <div className="organizer-details">
              <div className="organizer-name">{event.organizer}</div>
              <div className="organizer-role">Event organizer</div>
            </div>
          </div>
        </div>
      </div>

      {/* Register Button */}
      <div className="register-section">
        <button className="btn btn-dark register-btn" onClick={handleRegister}>
          Register Now
        </button>
      </div>
    </div>
  );
};

export default EventDetail; 