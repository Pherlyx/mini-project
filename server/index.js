import express from 'express';
import cors from 'cors';
import path from 'path';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
// Import routes
import eventsRoutes from './routes/events.js';
import authRoutes from './routes/auth.js';
import registrationRoutes from './routes/registrations.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Routes
app.use('/api/events', eventsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/registrations', registrationRoutes);

// Serve static files from React app (only in production)
// app.use(express.static(path.join(__dirname, '../client/build')));

// Catch all handler: send back React's index.html file (only in production)
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../client/build/index.html'));
// });


app.listen(PORT, () => {
  connectDB();
  console.log(`Server running on port ${PORT}`);
});