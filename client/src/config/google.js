// Google OAuth Configuration
// IMPORTANT: Replace with your actual Google Client ID from Google Cloud Console

// Temporary development Client ID - REPLACE THIS WITH YOUR OWN
const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || "your-google-client-id-here.apps.googleusercontent.com";

// To set up Google OAuth:
// 1. Go to https://console.cloud.google.com/
// 2. Create a new project or select existing one
// 3. Enable Google Identity API (not Google+ API - it's deprecated)
// 4. Go to Credentials → Create Credentials → OAuth 2.0 Client ID
// 5. Choose Web application
// 6. Add authorized JavaScript origins: 
//    - http://localhost:3000 (for development)
//    - https://yourdomain.com (for production)
// 7. Add authorized redirect URIs:
//    - http://localhost:3000 (for development)
//    - https://yourdomain.com (for production)
// 8. Copy the Client ID and either:
//    - Replace the value above, OR
//    - Create a .env file with REACT_APP_GOOGLE_CLIENT_ID=your-client-id

export default GOOGLE_CLIENT_ID;