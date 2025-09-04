# EventPlanner - Event Discovery & Registration Platform

A modern, mobile-first event discovery and registration platform built with React, Node.js, and Express. This is EventPlanner.

## Features

- **Welcome Screen**: Beautiful gradient landing page with app branding
- **Event Discovery**: Browse events with search and category filtering
- **Event Details**: Comprehensive event information with registration
- **User Authentication**: Sign in functionality with JWT tokens
- **Event Registration**: Complete registration flow with payment summary
- **Registration Confirmation**: Success page with event details and actions
- **Responsive Design**: Mobile-first design that works on all devices

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing
- **UUID** - Unique identifier generation

### Frontend
- **React** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **CSS3** - Styling with modern features

## Project Structure

```
EventPlanner/
├── server/
│   ├── index.js              # Main server file
│   └── routes/
│       ├── events.js         # Event CRUD operations
│       ├── auth.js           # Authentication routes
│       └── registrations.js  # Registration handling
├── client/
│   ├── public/
│   │   └── index.html        # HTML template
│   └── src/
│       ├── components/
│       │   ├── Welcome.js    # Landing page
│       │   ├── Events.js     # Event listing
│       │   ├── EventDetail.js # Event details
│       │   ├── EventRegistration.js # Registration form
│       │   ├── RegistrationConfirmation.js # Success page
│       │   └── SignIn.js     # Authentication
│       ├── App.js            # Main app component
│       ├── index.js          # React entry point
│       └── index.css         # Global styles
├── package.json              # Root package.json
└── README.md                # This file
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd EventPlanner
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install client dependencies
   cd client
   npm install
   cd ..
   ```

3. **Start the development servers**
   ```bash
   # Start both backend and frontend
   npm run dev
   
   # Or start them separately:
   # Backend only
   npm run server
   
   # Frontend only
   npm run client
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## API Endpoints

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get event by ID
- `GET /api/events/categories/all` - Get all categories
- `POST /api/events` - Create new event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/signin` - Sign in user
- `GET /api/auth/profile` - Get user profile

### Registrations
- `POST /api/registrations` - Register for event
- `GET /api/registrations/user/:userId` - Get user registrations
- `POST /api/registrations/payment-summary` - Get payment summary
- `GET /api/registrations/confirmation/:ticketId` - Get confirmation details

## Demo Data

The application includes demo data for testing:

### Events
- Tech Conference 2024 ($299)
- Design Workshop ($149)
- Startup Pitch Night (Free)

### User Credentials
- **Email**: john@example.com
- **Password**: password

## Features in Detail

### Welcome Screen
- Gradient background with app branding
- Calendar icon and tagline
- Call-to-action buttons for exploration and sign-in

### Event Discovery
- Search functionality
- Category filtering (All, Technology, Design, Business)
- Event cards with images, ratings, and pricing
- Responsive grid layout

### Event Details
- Comprehensive event information
- Date, time, and location details
- Organizer information
- Registration button

### Registration Flow
- Personal information form
- Payment summary with service fees
- Form validation
- Success confirmation

### Authentication
- JWT-based authentication
- Secure password hashing
- User session management

## Styling & Design

The application uses a modern, mobile-first design approach:

- **Color Scheme**: Purple gradient (#667eea to #764ba2)
- **Typography**: System fonts for optimal performance
- **Components**: Reusable CSS classes and components
- **Responsive**: Mobile-first with tablet and desktop breakpoints
- **Animations**: Smooth transitions and hover effects

## Development

### Available Scripts

```bash
# Development
npm run dev          # Start both servers
npm run server       # Start backend only
npm run client       # Start frontend only

# Production
npm run build        # Build frontend for production
npm run install-all  # Install all dependencies
```

### Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
JWT_SECRET=your-secret-key-here
```

## Deployment

### Backend Deployment
1. Set up environment variables
2. Install dependencies: `npm install`
3. Start the server: `npm start`

### Frontend Deployment
1. Build the application: `npm run build`
2. Serve the `client/build` directory
3. Configure proxy for API calls

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue in the repository. 