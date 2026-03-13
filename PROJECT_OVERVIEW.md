# Event Booking System - Project Overview

## Architecture

### Backend (Node.js + Express + TypeScript + MongoDB)
- **Port**: 5000
- **Database**: MongoDB
- **Authentication**: JWT tokens
- **API**: RESTful endpoints

### Frontend (React + TypeScript + GSAP)
- **Port**: 3000
- **State Management**: React Context API
- **Animations**: GSAP 3.12
- **Routing**: React Router v6

## Key Features

### 1. Authentication System
- User registration with password hashing (bcrypt)
- JWT-based authentication
- Role-based access control (User/Admin)
- Protected routes

### 2. Event Management
- Browse all events
- View event details
- Create events (Admin only)
- Update/Delete events (Admin/Organizer)
- Real-time seat availability

### 3. Booking System
- Book multiple seats
- View booking history
- Cancel bookings
- Automatic seat management

### 4. Advanced GSAP Animations
- **Page Load**: fadeInUp, scaleIn, slideIn
- **Scroll Triggered**: scrollReveal for elements
- **Stagger Effects**: Multiple elements animate in sequence
- **Hover Effects**: Interactive scale animations
- **Page Transitions**: Smooth navigation transitions
- **Custom Hooks**: useGsapAnimation for reusable animations

## Database Schema

### User
- name: String
- email: String (unique)
- password: String (hashed)
- role: Enum ['user', 'admin']

### Event
- title: String
- description: String
- date: Date
- time: String
- location: String
- category: String
- price: Number
- capacity: Number
- availableSeats: Number
- image: String
- organizer: ObjectId (ref: User)

### Booking
- event: ObjectId (ref: Event)
- user: ObjectId (ref: User)
- seats: Number
- totalPrice: Number
- status: Enum ['pending', 'confirmed', 'cancelled']

## API Endpoints Summary

### Auth Routes (/api/auth)
- POST /register - Create new user
- POST /login - Authenticate user
- GET /profile - Get current user (Protected)

### Event Routes (/api/events)
- GET / - List all events
- GET /:id - Get single event
- POST / - Create event (Protected)
- PUT /:id - Update event (Protected)
- DELETE /:id - Delete event (Protected)

### Booking Routes (/api/bookings)
- POST / - Create booking (Protected)
- GET /my-bookings - User bookings (Protected)
- PUT /:id/cancel - Cancel booking (Protected)

## Frontend Pages

1. **Home** - Event listing with grid layout
2. **Login** - User authentication
3. **Register** - New user registration
4. **Booking** - Event booking with seat selection
5. **MyBookings** - User's booking history
6. **CreateEvent** - Admin event creation form

## GSAP Animation Utilities

Located in: `frontend/src/animations/gsapAnimations.ts`

- fadeInUp(element, delay)
- staggerFadeIn(elements, stagger)
- scaleIn(element, delay)
- slideInLeft(element, delay)
- slideInRight(element, delay)
- scrollReveal(elements)
- hoverScale(element)
- pulseAnimation(element)
- rotateIn(element, delay)
- flipCard(element)
- pageTransition()
- textReveal(element)
- morphShape(element)

## Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Protected API routes
- Role-based authorization
- Input validation
- CORS enabled

## Responsive Design

- Mobile-first approach
- Breakpoints: 768px, 480px
- Flexible grid layouts
- Touch-friendly interactions

## Getting Started

1. Install MongoDB
2. Run `setup.bat` (Windows) to install dependencies
3. Configure `.env` in backend folder
4. Start backend: `cd backend && npm run dev`
5. Start frontend: `cd frontend && npm start`
6. Access app at http://localhost:3000

## Default Admin Account

To create an admin user, register normally and manually update the role in MongoDB:

```javascript
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

## Technologies Stack

**Backend:**
- Node.js v18+
- Express.js v4
- MongoDB + Mongoose v8
- TypeScript v5
- JWT v9
- bcryptjs v2

**Frontend:**
- React v18
- TypeScript v5
- GSAP v3.12
- React Router v6
- Axios v1
- CSS3

## Performance Optimizations

- Lazy loading for routes
- Optimized GSAP animations
- Efficient MongoDB queries
- JWT token caching
- CSS animations for simple effects

## Future Enhancements

- Payment integration
- Email notifications
- Event search and filters
- Event categories
- User reviews and ratings
- Social media sharing
- Calendar integration
- QR code tickets
- Real-time notifications
- Image upload for events
