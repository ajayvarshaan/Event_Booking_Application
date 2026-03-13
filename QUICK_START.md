# Quick Start Guide - Event Booking System

## Prerequisites
✅ Node.js (v18 or higher)
✅ MongoDB (local or Atlas)
✅ npm or yarn

## Installation (Windows)

### Option 1: Automated Setup
```bash
setup.bat
```

### Option 2: Manual Setup

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

## Configuration

### Backend Environment (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/event-booking
JWT_SECRET=your_secret_key_change_this
NODE_ENV=development
```

## Running the Application

### Terminal 1 - Backend
```bash
cd backend
npm run dev
```
✅ Backend running on http://localhost:5000

### Terminal 2 - Frontend
```bash
cd frontend
npm start
```
✅ Frontend running on http://localhost:3000

## First Time Setup

1. **Start MongoDB**
   - Windows: Start MongoDB service
   - Or use MongoDB Atlas cloud database

2. **Create Admin User**
   - Register a normal user at http://localhost:3000/register
   - Connect to MongoDB and update user role:
   ```javascript
   db.users.updateOne(
     { email: "your@email.com" },
     { $set: { role: "admin" } }
   )
   ```

3. **Create Events**
   - Login as admin
   - Navigate to "Create Event"
   - Fill in event details

4. **Test Booking**
   - Logout and register as regular user
   - Browse events
   - Book tickets

## Project Structure

```
event-booking/
├── backend/              # Express + TypeScript API
│   ├── src/
│   │   ├── config/      # Database config
│   │   ├── controllers/ # Route handlers
│   │   ├── middleware/  # Auth middleware
│   │   ├── models/      # Mongoose models
│   │   ├── routes/      # API routes
│   │   └── server.ts    # Entry point
│   └── package.json
│
├── frontend/            # React + TypeScript + GSAP
│   ├── src/
│   │   ├── animations/  # GSAP utilities
│   │   ├── components/  # React components
│   │   ├── context/     # Auth context
│   │   ├── pages/       # Page components
│   │   ├── services/    # API calls
│   │   ├── styles/      # Global CSS
│   │   ├── utils/       # Helpers & types
│   │   ├── App.tsx      # Main app
│   │   └── index.tsx    # Entry point
│   └── package.json
│
└── README.md
```

## Testing the Application

### 1. Register User
- Go to http://localhost:3000/register
- Fill in name, email, password
- Click Register

### 2. Login
- Use registered credentials
- JWT token stored in localStorage

### 3. Browse Events
- View all events on home page
- Click "Book Now" on any event

### 4. Book Event
- Select number of seats
- Confirm booking
- View in "My Bookings"

### 5. Admin Features (if admin role)
- Create new events
- Update existing events
- Delete events

## GSAP Animations Showcase

The app features advanced GSAP animations:

- **Home Page**: Staggered fade-in for event cards
- **Login/Register**: Slide-in forms
- **Event Cards**: Hover scale effects
- **Booking Page**: Fade and scale animations
- **Navigation**: Smooth transitions
- **Scroll Effects**: Reveal on scroll

## API Testing (Optional)

Use Postman or curl to test API:

### Register
```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Login
```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Get Events
```bash
GET http://localhost:5000/api/events
```

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check MONGODB_URI in .env
- Try: `mongodb://127.0.0.1:27017/event-booking`

### Port Already in Use
- Backend: Change PORT in .env
- Frontend: Set PORT=3001 in environment

### CORS Errors
- Ensure backend is running
- Check API baseURL in frontend/src/services/api.ts

### TypeScript Errors
- Run: `npm install` again
- Delete node_modules and reinstall

## Build for Production

### Backend
```bash
cd backend
npm run build
npm start
```

### Frontend
```bash
cd frontend
npm run build
```

## Support

For issues or questions:
1. Check PROJECT_OVERVIEW.md
2. Review README.md
3. Check console logs for errors

## Next Steps

- Customize event categories
- Add more GSAP animations
- Implement payment gateway
- Add email notifications
- Deploy to cloud (Heroku, Vercel, AWS)

---

🎉 Happy Coding! Enjoy your Event Booking System with amazing GSAP animations!
