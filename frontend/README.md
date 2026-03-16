# Frontend Application

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

The app will run on `http://localhost:3000`

## Build for Production

```bash
npm run build
```

## Project Structure

- `src/components/` - Reusable components
- `src/pages/` - Page components
- `src/context/` - React context providers (Auth, Cart)
- `src/utils/` - Utility functions

## Features

- Responsive design with Tailwind CSS
- React Router for navigation
- Context API for state management
- Axios for API calls
- Toast notifications
- QR code generation

## Environment Variables

Create `.env` file if needed:
```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Choose "Web application"
6. Add authorized JavaScript origins:
   - `http://localhost:3000` (for development)
   - Your production domain (for production)
7. Copy the Client ID and add it to your `.env` file as `VITE_GOOGLE_CLIENT_ID`
8. Make sure the same Client ID is also added to backend `.env` as `GOOGLE_CLIENT_ID`

