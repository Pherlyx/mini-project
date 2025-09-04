// Mapping of event categories to relevant stock images from Unsplash
const eventImages = {
  'Technology': 'https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
  'Design': 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
  'Business': 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
  'Music': 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
  'Food & Drink': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
  'Sports': 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
  'Health': 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
  'Education': 'https://images.unsplash.com/photo-1509062522246-3755967920d2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
  'Default': 'https://images.unsplash.com/photo-1505373877841-8d25f96d5338?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
};

export const getEventImage = (category) => {
  return eventImages[category] || eventImages['Default'];
};

export default eventImages;
