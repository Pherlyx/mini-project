import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../App';
import './Calendar.css';

const Calendar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const [eventData, setEventData] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [userEvents, setUserEvents] = useState([]);
  const [userRegistrations, setUserRegistrations] = useState([]);
  
  useEffect(() => {
    const fetchUserEvents = async () => {
      if (!user?.id) {
        setUserEvents([]);
        setEventData(null);
        setUserRegistrations([]);
        return;
      }

      try {
        // Get registrations for the logged-in user
        const regsRes = await axios.get(`/api/registrations/user/${user.id}`);
        const registrations = regsRes.data || [];
        setUserRegistrations(registrations);

        // Fetch event details for each registration
        const eventPromises = registrations.map(reg => axios.get(`/api/events/${reg.eventId}`));
        const eventResponses = await Promise.all(eventPromises);
        const events = eventResponses.map(r => r.data);

        setUserEvents(events);

        // Pick the nearest upcoming event (>= today)
        const today = new Date();
        const upcoming = [...events]
          .map(e => ({ ...e, _date: new Date(e.date) }))
          .filter(e => !isNaN(e._date) && e._date >= new Date(today.getFullYear(), today.getMonth(), today.getDate()))
          .sort((a, b) => a._date - b._date)[0];

        setEventData(upcoming || null);
      } catch (err) {
        console.error('Error loading user events for calendar:', err);
        setUserEvents([]);
        setEventData(null);
        setUserRegistrations([]);
      }
    };

    fetchUserEvents();
  }, [user, location.state]);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isEventDay = (day) => {
    if (!day || !userEvents.length) return false;
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    return userEvents.some(evt => {
      const d = new Date(evt.date);
      return (
        d.getDate() === day &&
        d.getMonth() === currentMonth &&
        d.getFullYear() === currentYear
      );
    });
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };


  const handleDownloadTicket = async () => {
    if (!eventData || !userRegistrations.length) return;

    try {
      // Find the registration for the current event
      const registration = userRegistrations.find(reg => reg.eventId === eventData.id);
      if (!registration) {
        console.error('No registration found for this event');
        return;
      }

      // Fetch confirmation details to get ticket info
      const response = await axios.get(`/api/registrations/confirmation/${registration.ticketId}`);
      const confirmation = response.data;

      // Create ticket HTML content
      const ticketContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Event Ticket - ${confirmation.event.title}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
            .ticket { background: white; border-radius: 10px; padding: 30px; max-width: 600px; margin: 0 auto; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .header { text-align: center; border-bottom: 2px solid #667eea; padding-bottom: 20px; margin-bottom: 30px; }
            .logo { font-size: 24px; font-weight: bold; color: #667eea; margin-bottom: 10px; }
            .ticket-id { background: #667eea; color: white; padding: 10px; border-radius: 5px; font-weight: bold; margin-bottom: 20px; }
            .event-title { font-size: 28px; font-weight: bold; color: #333; margin-bottom: 20px; }
            .details { margin-bottom: 20px; }
            .detail-row { display: flex; justify-content: space-between; margin-bottom: 10px; padding: 10px 0; border-bottom: 1px solid #eee; }
            .label { font-weight: bold; color: #666; }
            .value { color: #333; }
            .attendee { background: #f8f9fa; padding: 15px; border-radius: 5px; margin-top: 20px; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            .qr-placeholder { text-align: center; margin: 20px 0; padding: 20px; background: #f8f9fa; border-radius: 5px; }
          </style>
        </head>
        <body>
          <div class="ticket">
            <div class="header">
              <div class="logo">EventPlanner</div>
              <div class="ticket-id">Ticket #${confirmation.ticketId}</div>
            </div>
            
            <div class="event-title">${confirmation.event.title}</div>
            
            <div class="details">
              <div class="detail-row">
                <span class="label">Date:</span>
                <span class="value">${confirmation.event.date}</span>
              </div>
              <div class="detail-row">
                <span class="label">Time:</span>
                <span class="value">${confirmation.event.time}</span>
              </div>
              <div class="detail-row">
                <span class="label">Location:</span>
                <span class="value">${confirmation.event.location}</span>
              </div>
            </div>
            
            <div class="attendee">
              <div class="detail-row">
                <span class="label">Attendee:</span>
                <span class="value">${confirmation.registration.firstName} ${confirmation.registration.lastName}</span>
              </div>
              <div class="detail-row">
                <span class="label">Email:</span>
                <span class="value">${confirmation.registration.email}</span>
              </div>
              ${confirmation.registration.phone ? `
              <div class="detail-row">
                <span class="label">Phone:</span>
                <span class="value">${confirmation.registration.phone}</span>
              </div>
              ` : ''}
            </div>
            
            <div class="qr-placeholder">
              [QR Code for ${confirmation.ticketId}]
            </div>
            
            <div class="footer">
              <p>Please present this ticket at the event entrance</p>
              <p>Generated on ${new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </body>
        </html>
      `;

      // Create and download the ticket
      const blob = new Blob([ticketContent], { type: 'text/html' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ticket_${confirmation.ticketId}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading ticket:', error);
    }
  };

  const handleDownloadEventTicket = async (event) => {
    if (!event.registration) return;

    try {
      // Fetch confirmation details to get ticket info
      const response = await axios.get(`/api/registrations/confirmation/${event.registration.ticketId}`);
      const confirmation = response.data;

      // Create ticket HTML content
      const ticketContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Event Ticket - ${event.title}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
            .ticket { background: white; border-radius: 10px; padding: 30px; max-width: 600px; margin: 0 auto; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .header { text-align: center; border-bottom: 2px solid #667eea; padding-bottom: 20px; margin-bottom: 30px; }
            .logo { font-size: 24px; font-weight: bold; color: #667eea; margin-bottom: 10px; }
            .ticket-id { background: #667eea; color: white; padding: 10px; border-radius: 5px; font-weight: bold; margin-bottom: 20px; }
            .event-title { font-size: 28px; font-weight: bold; color: #333; margin-bottom: 20px; }
            .details { margin-bottom: 20px; }
            .detail-row { display: flex; justify-content: space-between; margin-bottom: 10px; padding: 10px 0; border-bottom: 1px solid #eee; }
            .label { font-weight: bold; color: #666; }
            .value { color: #333; }
            .attendee { background: #f8f9fa; padding: 15px; border-radius: 5px; margin-top: 20px; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            .qr-placeholder { text-align: center; margin: 20px 0; padding: 20px; background: #f8f9fa; border-radius: 5px; }
          </style>
        </head>
        <body>
          <div class="ticket">
            <div class="header">
              <div class="logo">EventPlanner</div>
              <div class="ticket-id">Ticket #${event.registration.ticketId}</div>
            </div>
            
            <div class="event-title">${event.title}</div>
            
            <div class="details">
              <div class="detail-row">
                <span class="label">Date:</span>
                <span class="value">${event.date}</span>
              </div>
              <div class="detail-row">
                <span class="label">Time:</span>
                <span class="value">${event.time}</span>
              </div>
              <div class="detail-row">
                <span class="label">Location:</span>
                <span class="value">${event.location}</span>
              </div>
            </div>
            
            <div class="attendee">
              <div class="detail-row">
                <span class="label">Attendee:</span>
                <span class="value">${confirmation.registration.firstName} ${confirmation.registration.lastName}</span>
              </div>
              <div class="detail-row">
                <span class="label">Email:</span>
                <span class="value">${confirmation.registration.email}</span>
              </div>
              ${confirmation.registration.phone ? `
              <div class="detail-row">
                <span class="label">Phone:</span>
                <span class="value">${confirmation.registration.phone}</span>
              </div>
              ` : ''}
            </div>
            
            <div class="qr-placeholder">
              [QR Code for ${event.registration.ticketId}]
            </div>
            
            <div class="footer">
              <p>Please present this ticket at the event entrance</p>
              <p>Generated on ${new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </body>
        </html>
      `;

      // Create and download the ticket
      const blob = new Blob([ticketContent], { type: 'text/html' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ticket_${event.registration.ticketId}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading ticket:', error);
    }
  };


  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15,18 9,12 15,6"></polyline>
          </svg>
        </button>
        <h1>My Calendar</h1>
      </div>

      {eventData && (
        <div className="event-added-banner">
          <div className="success-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <polyline points="20,6 9,17 4,12"></polyline>
            </svg>
          </div>
          <div className="banner-content">
            <h3>Upcoming Registered Event</h3>
            <p>{eventData.title} is on your calendar</p>
          </div>
        </div>
      )}

      <div className="calendar-widget">
        <div className="calendar-nav">
          <button onClick={() => navigateMonth(-1)} className="nav-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15,18 9,12 15,6"></polyline>
            </svg>
          </button>
          <h2>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
          <button onClick={() => navigateMonth(1)} className="nav-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9,18 15,12 9,6"></polyline>
            </svg>
          </button>
        </div>

        <div className="calendar-grid">
          <div className="day-headers">
            {dayNames.map(day => (
              <div key={day} className="day-header">{day}</div>
            ))}
          </div>
          <div className="days-grid">
            {getDaysInMonth(currentDate).map((day, index) => (
              <div 
                key={index} 
                className={`day-cell ${day ? 'active' : 'inactive'} ${isEventDay(day) ? 'event-day' : ''}`}
              >
                {day && (
                  <>
                    <span className="day-number">{day}</span>
                    {isEventDay(day) && (
                      <div className="event-indicator">
                        <div className="event-dot"></div>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

{userEvents.length > 0 ? (
        <div className="upcoming-events-section">
          <h3>My Booked Events</h3>
          <div className="events-list">
            {userEvents
              .map(event => ({ 
                ...event, 
                _date: new Date(event.date),
                registration: userRegistrations.find(reg => reg.eventId === event.id)
              }))
              .sort((a, b) => a._date - b._date)
              .map((event, index) => (
                <div key={event.id || index} className="event-card">
                  <div className="event-info">
                    <div className="event-title">{event.title}</div>
                    <div className="event-meta">
                      <div className="meta-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="16" y1="2" x2="16" y2="6"></line>
                          <line x1="8" y1="2" x2="8" y2="6"></line>
                          <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        <span>{formatDate(event.date)}</span>
                      </div>
                      <div className="meta-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"></circle>
                          <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        <span>{event.time}</span>
                      </div>
                      <div className="meta-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 10c0 7-9 12-9 12S3 17 3 10a9 9 0 1 1 18 0z"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        <span>{event.location}</span>
                      </div>
                    </div>
                    {event.registration && (
                      <div className="ticket-info">
                        <span className="ticket-id">Ticket #${event.registration.ticketId}</span>
                      </div>
                    )}
                  </div>
                  <div className="event-actions">
                    <button 
                      className="download-btn primary" 
                      onClick={() => handleDownloadEventTicket(event)}
                    >
                      Download Ticket
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ) : (
        <div className="event-details-card">
          <h3>No Booked Events</h3>
          <p>{user ? 'You have no registrations yet. Browse events and register to see them here.' : 'Please sign in to view your registered events.'}</p>
        </div>
      )}

      <div className="calendar-actions">
        <button className="secondary-btn" onClick={() => navigate('/events')}>
          Browse More Events
        </button>
      </div>
    </div>
  );
};

export default Calendar;
