import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getEventImage } from '../utils/eventImages';
import './Events.css';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);
  const [favorites, setFavorites] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchEvents = useCallback(async () => {
    try {
      const params = {};
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (searchTerm) params.search = searchTerm;
      
      const response = await axios.get('/api/events', { params });
      let eventsData = response.data;
      
      // Filter favorites if the filter is active
      if (showFavorites) {
        eventsData = eventsData.filter(event => favorites.has(event.id));
      }
      
      setEvents(eventsData);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, searchTerm, showFavorites, favorites]);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await axios.get('/api/events/categories/all');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
    fetchCategories();
  }, [fetchEvents, fetchCategories]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleEventClick = (eventId) => {
    navigate(`/event/${eventId}`);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
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

  const formatPrice = (price) => {
    return price === 0 ? 'Free' : `$${price}`;
  };

  if (loading) {
    return (
      <div className="events-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="events-container">
      {/* Header */}
      <div className="events-header">
        <h1 className="events-title">Events</h1>
        <div className="header-actions">
          <button 
            className={`icon-btn favorite-btn ${showFavorites ? 'active' : ''}`}
            onClick={() => setShowFavorites(!showFavorites)}
            aria-label={showFavorites ? 'Show all events' : 'Show favorites only'}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill={showFavorites ? '#667eea' : 'none'} stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="search-filter-container">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
        </div>
        <button 
          className={`filter-toggle ${showFavorites ? 'active' : ''}`}
          onClick={() => setShowFavorites(!showFavorites)}
          aria-label={showFavorites ? 'Show all events' : 'Show favorites only'}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill={showFavorites ? '#667eea' : 'none'} stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
          <span>Favorites</span>
        </button>
      </div>

      {/* Category Filters */}
      <div className="category-filters">
        {categories.map((category) => (
          <button
            key={category}
            className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => handleCategoryChange(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Events List */}
      <div className="events-list">
        {events.map((event) => (
          <div key={event.id} className="event-card">
            <div className="event-card-content" onClick={() => handleEventClick(event.id)}>
              {/* Event Image */}
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
                <div className="event-category">{event.category}</div>
              </div>

              {/* Event Details */}
              <div className="event-details">
                <h3 className="event-title">{event.title}</h3>
                <p className="event-organizer">{event.organizer}</p>
                
                <div className="event-info">
                  <div className="info-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    <span>{event.date}</span>
                  </div>
                  
                  <div className="info-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <span>{event.location}</span>
                  </div>
                </div>

                <div className="event-footer">
                  <div className="event-price">
                    {formatPrice(event.price)}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Favorite Button - Top right corner */}
            <button 
              className={`favorite-button ${favorites.has(event.id) ? 'favorited' : ''}`}
              onClick={(e) => toggleFavorite(event.id, e)}
              aria-label={favorites.has(event.id) ? 'Remove from favorites' : 'Add to favorites'}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill={favorites.has(event.id) ? '#ff4d4f' : 'none'} stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Events; 