import express from 'express';
const router = express.Router();
import { v4 as uuidv4 } from 'uuid';
import { events } from '../data/events.js';

// Mock registrations data
let registrations = [
  {
    id: '1',
    eventId: '1',
    userId: '1',
    ticketId: 'EVT-2024-001',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    company: 'Tech Corp',
    dietaryRestrictions: '',
    additionalNotes: '',
    registrationDate: new Date().toISOString(),
    status: 'confirmed'
  }
];

// Register for an event
router.post('/', (req, res) => {
  try {
    const { eventId, userId, firstName, lastName, email, phone, company, dietaryRestrictions, additionalNotes } = req.body;
    
    // Generate ticket ID with 2025
    const ticketId = `EVT-2025-${String(registrations.length + 1).padStart(3, '0')}`;
    
    const registration = {
      id: uuidv4(),
      eventId,
      userId,
      ticketId,
      firstName,
      lastName,
      email,
      phone,
      company: company || '',
      dietaryRestrictions: dietaryRestrictions || '',
      additionalNotes: additionalNotes || '',
      registrationDate: new Date().toISOString(),
      status: 'confirmed'
    };
    
    registrations.push(registration);
    
    res.status(201).json({
      message: 'Registration successful!',
      registration,
      ticketId
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user registrations
router.get('/user/:userId', (req, res) => {
  const userRegistrations = registrations.filter(reg => reg.userId === req.params.userId);
  res.json(userRegistrations);
});

// Get registration by ID
router.get('/:id', (req, res) => {
  const registration = registrations.find(reg => reg.id === req.params.id);
  if (!registration) {
    return res.status(404).json({ message: 'Registration not found' });
  }
  res.json(registration);
});

// Calculate payment summary
router.post('/payment-summary', (req, res) => {
  const { eventId } = req.body;
  
  // Find the event by ID from imported events
  const event = events.find(e => e.id === eventId);
  
  if (!event) {
    return res.status(404).json({ message: 'Event not found' });
  }
  
  // Only apply service fee for paid events
  const serviceFee = event.price > 0 ? 9.99 : 0;
  const total = event.price + serviceFee;
  
  res.json({
    eventTitle: event.title,
    eventTicket: event.price,
    serviceFee,
    total
  });
});

// Get registration details for confirmation
router.get('/confirmation/:ticketId', (req, res) => {
  console.log('Confirmation endpoint hit with ticketId:', req.params.ticketId);
  console.log('Available registrations:', registrations.map(r => r.ticketId));
  
  const registration = registrations.find(reg => reg.ticketId === req.params.ticketId);
  if (!registration) {
    console.log('Registration not found for ticketId:', req.params.ticketId);
    return res.status(404).json({ message: 'Registration not found' });
  }
  
  // Event data based on eventId to match actual events
  const eventData = {
    '1': {
      title: 'Tech Conference 2025',
      date: 'September 15, 2025',
      time: '9:00 AM - 6:00 PM',
      location: 'San Francisco, CA'
    },
    '2': {
      title: 'Design Workshop',
      date: 'September 22, 2025', 
      time: '2:00 PM - 5:00 PM',
      location: 'New York, NY'
    },
    '3': {
      title: 'Startup Pitch Night',
      date: 'September 28, 2025',
      time: '7:00 PM - 10:00 PM',
      location: 'Austin, TX'
    }
  };
  
  const event = eventData[registration.eventId] || {
    title: 'Tech Conference 2025',
    date: 'September 15, 2025',
    time: '9:00 AM - 6:00 PM',
    location: 'San Francisco, CA'
  };
  
  console.log('Sending confirmation response for:', registration.ticketId);
  res.json({
    registration,
    event,
    ticketId: registration.ticketId
  });
});

export default router;