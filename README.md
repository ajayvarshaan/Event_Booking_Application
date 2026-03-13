# Event Booking System - MERN + TypeScript + GSAP

A full-stack event booking application built with MongoDB, Express, React, Node.js, TypeScript, and advanced GSAP animations.

## Features

- 🎨 Advanced GSAP animations (fade, slide, scale, stagger, scroll-triggered)
- 🔐 JWT authentication with role-based access
- 📅 Event creation and management
- 🎫 Seat booking system
- 👤 User profile and booking history
- 📱 Responsive design
- ⚡ TypeScript for type safety

## Project Structure

```
event-booking/
├── backend/          # Node.js + Express + TypeScript
│   ├── src/
│   │   ├── config/   # Database configuration
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── server.ts
│   ├── .env
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/         # React + TypeScript + GSAP
    ├── src/
    │   ├── animations/    # GSAP animation utilities
    │   ├── components/    # Reusable components
    │   ├── context/       # Auth context
    │   ├── pages/         # Page components
    │   ├── services/      # API services
    │   ├── styles/        # Global styles
    │   ├── App.tsx
    │   └── index.tsx
    ├── public/
    ├── package.json
    └── tsconfig.json
```

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB (running locally or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables in `.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/event-booking
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

4. Start the backend server:
```bash
npm run dev
```

Backend will run on http://localhost:5000

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

Frontend will run on http://localhost:3000

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/profile` - Get user profile (protected)

### Events
- GET `/api/events` - Get all events
- GET `/api/events/:id` - Get single event
- POST `/api/events` - Create event (protected)
- PUT `/api/events/:id` - Update event (protected)
- DELETE `/api/events/:id` - Delete event (protected)

### Bookings
- POST `/api/bookings` - Create booking (protected)
- GET `/api/bookings/my-bookings` - Get user bookings (protected)
- PUT `/api/bookings/:id/cancel` - Cancel booking (protected)

## GSAP Animations

The application includes advanced GSAP animations:

- **fadeInUp**: Fade in with upward motion
- **staggerFadeIn**: Staggered fade-in for multiple elements
- **scaleIn**: Scale animation with bounce effect
- **slideInLeft/Right**: Slide animations from sides
- **scrollReveal**: Scroll-triggered animations
- **hoverScale**: Interactive hover effects
- **pageTransition**: Smooth page transitions
- **pulseAnimation**: Continuous pulse effect
- **rotateIn**: Rotation entrance animation
- **textReveal**: Character-by-character text reveal

## User Roles

- **User**: Can browse events, book tickets, view bookings
- **Admin**: Can create, update, delete events + all user permissions

## Technologies Used

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- TypeScript
- JWT for authentication
- bcryptjs for password hashing

### Frontend
- React 18
- TypeScript
- React Router v6
- Axios
- GSAP 3.12
- CSS3

## Development

### Build Backend
```bash
cd backend
npm run build
```

### Build Frontend
```bash
cd frontend
npm run build
```

## License

MIT
