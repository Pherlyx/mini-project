import express from 'express';
const router = express.Router();
import { v4 as uuidv4 } from 'uuid';

// Mock data for events
let events = [
  {
    id: '1',
    title: 'Tech Conference 2025',
    organizer: 'TechEvents Inc.',
    category: 'Technology',
    date: '2025-09-15',
    time: '9:00 AM - 6:00 PM',
    location: 'San Francisco, CA',
    price: 299,
    rating: 4.8,
    attendees: 1250,
    description: 'Join industry leaders for a day of innovation, networking, and cutting-edge technology discussions.',
    image: '/images/tech-conference.jpg'
  },
  {
    id: '2',
    title: 'Design Workshop',
    organizer: 'Creative Studio',
    category: 'Design',
    date: '2025-09-22',
    time: '2:00 PM - 5:00 PM',
    location: 'New York, NY',
    price: 149,
    rating: 4.9,
    attendees: 85,
    description: 'Hands-on workshop covering the latest design trends and tools for modern digital experiences.',
    image: '/images/design-workshop.jpg'
  },
  {
    id: '3',
    title: 'Startup Pitch Night',
    organizer: 'Startup Hub',
    category: 'Business',
    date: '2025-09-28',
    time: '7:00 PM - 10:00 PM',
    location: 'Austin, TX',
    price: 0,
    rating: 4.7,
    attendees: 200,
    description: 'Watch promising startups pitch their ideas to investors and network with entrepreneurs.',
    image: '/images/startup-pitch.jpg'
  }
];

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