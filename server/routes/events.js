import express from 'express';
const router = express.Router();
import { v4 as uuidv4 } from 'uuid';
import { events } from '../data/events.js';

// Get all categories including 'All' as first option
router.get('/categories/all', (req, res) => {
  // Extract unique categories from events and add 'All' as first option
  const categories = ['All', ...new Set(events.map(event => event.category))];
  res.json(categories);
});

// Get all events
router.get('/', (req, res) => {
  const { category, search } = req.query;
  
  let filteredEvents = events;
  
  if (category && category !== 'All') {
    filteredEvents = events.filter(event => event.category === category);
  }
  
  if (search) {
    filteredEvents = filteredEvents.filter(event => 
      event.title.toLowerCase().includes(search.toLowerCase()) ||
      event.organizer.toLowerCase().includes(search.toLowerCase()) ||
      event.location.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  res.json(filteredEvents);
});

// Get event by ID
router.get('/:id', (req, res) => {
  const event = events.find(e => e.id === req.params.id);
  if (!event) {
    return res.status(404).json({ message: 'Event not found' });
  }
  res.json(event);
});

// Create new event
router.post('/', (req, res) => {
  const newEvent = {
    id: uuidv4(),
    ...req.body,
    rating: 0,
    attendees: 0
  };
  events.push(newEvent);
  res.status(201).json(newEvent);
});

// Update event
router.put('/:id', (req, res) => {
  const eventIndex = events.findIndex(e => e.id === req.params.id);
  if (eventIndex === -1) {
    return res.status(404).json({ message: 'Event not found' });
  }
  
  events[eventIndex] = { ...events[eventIndex], ...req.body };
  res.json(events[eventIndex]);
});

// Delete event
router.delete('/:id', (req, res) => {
  const eventIndex = events.findIndex(e => e.id === req.params.id);
  if (eventIndex === -1) {
    return res.status(404).json({ message: 'Event not found' });
  }
  
  events.splice(eventIndex, 1);
  res.json({ message: 'Event deleted successfully' });
});



export default router; 