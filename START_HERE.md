# 🚀 START HERE - Event Booking System

## What You Have

A complete **MERN Stack Event Booking System** with:
- ✅ Backend: Node.js + Express + TypeScript + MongoDB
- ✅ Frontend: React + TypeScript + **Vite** + GSAP
- ✅ Advanced GSAP Animations
- ✅ Full Authentication System
- ✅ Event Management
- ✅ Booking System

---

## 🎯 How to Run (3 Steps)

### Step 1: Install Dependencies
Open Command Prompt in project root and run:
```bash
setup.bat
```
This installs all dependencies for both backend and frontend.

### Step 2: Start Both Servers
```bash
start-app.bat
```
This starts:
- Backend on http://localhost:5000
- Frontend on http://localhost:3000

### Step 3: Open Browser
```
http://localhost:3000
```

**Done! Your app is running! 🎊**

---

## 📋 What to Do Next

### 1. Register a User
- Go to http://localhost:3000/register
- Fill in name, email, password
- Click Register

### 2. Create Admin User (Optional)
To create events, you need admin access:

```bash
# Open MongoDB shell
mongo

# Switch to database
use event-booking

# Update user to admin
db.users.updateOne(
  { email: "your@email.com" },
  { $set: { role: "admin" } }
)
```

### 3. Create Events (As Admin)
- Login with admin account
- Click "Create Event" in navbar
- Fill in event details
- Submit

### 4. Book Events (As User)
- Logout and register a new user
- Browse events on home page
- Click "Book Now"
- Select seats and confirm

### 5. View Bookings
- Click "My Bookings" in navbar
- See all your bookings
- Cancel if needed

---

## 🎨 Features to Explore

### GSAP Animations
- **Home Page**: Staggered fade-in for event cards
- **Login/Register**: Slide-in forms
- **Event Cards**: Hover scale effects
- **Booking Page**: Smooth transitions
- **Navigation**: Animated navbar

### Vite Features
- **Instant Start**: Server starts in ~200ms
- **Hot Module Replacement**: Edit code, see changes instantly
- **Fast Refresh**: No page reload needed

---

## 📁 Important Files

### Configuration
- `backend/.env` - Backend environment variables
- `frontend/vite.config.ts` - Vite configuration

### Entry Points
- `backend/src/server.ts` - Backend entry
- `frontend/src/main.tsx` - Frontend entry

### Documentation
- `README.md` - Main documentation
- `HOW_TO_RUN.md` - Detailed running guide
- `COMPLETE_GUIDE.md` - Complete reference

---

## 🛠️ Useful Commands

### Start/Stop
```bash
start-app.bat    # Start both servers
stop-app.bat     # Stop both servers
```

### Backend
```bash
cd backend
npm run dev      # Start development
npm run build    # Build TypeScript
npm start        # Run production
```

### Frontend (Vite)
```bash
cd frontend
npm run dev      # Start Vite dev server
npm run build    # Build for production
npm run preview  # Preview production build
```

---

## 🐛 Common Issues

### MongoDB Not Running
```bash
net start MongoDB
```

### Port Already in Use
```bash
# Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Dependencies Issue
```bash
# Reinstall everything
setup.bat
```

---

## 📚 Project Structure

```
event-booking/
├── backend/              # Express API
│   ├── src/
│   │   ├── config/      # Database
│   │   ├── controllers/ # Logic
│   │   ├── models/      # MongoDB models
│   │   ├── routes/      # API routes
│   │   └── server.ts    # Entry point
│   └── .env             # Configuration
│
├── frontend/            # React + Vite
│   ├── src/
│   │   ├── animations/  # GSAP utilities
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API calls
│   │   └── main.tsx     # Entry point
│   └── vite.config.ts   # Vite config
│
├── setup.bat            # Install dependencies
├── start-app.bat        # Start servers
└── stop-app.bat         # Stop servers
```

---

## 🌐 URLs

| What | URL |
|------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:5000 |
| Events API | http://localhost:5000/api/events |

---

## ✅ Quick Test

1. ✅ Run `start-app.bat`
2. ✅ Open http://localhost:3000
3. ✅ Register a user
4. ✅ Browse events
5. ✅ Book an event
6. ✅ Check "My Bookings"

---

## 🎓 Technologies Used

- **Backend**: Node.js, Express, MongoDB, TypeScript, JWT
- **Frontend**: React 18, TypeScript, Vite, GSAP, React Router
- **Database**: MongoDB
- **Animations**: GSAP 3.12
- **Build Tool**: Vite 5

---

## 💡 Tips

1. **Keep terminals open** while developing
2. **Vite HMR** updates code instantly
3. **Check browser console** for errors
4. **Use MongoDB Compass** to view database
5. **Read COMPLETE_GUIDE.md** for full details

---

## 🎉 Ready to Start!

### Quick Start:
```bash
setup.bat
start-app.bat
```

### Then open:
```
http://localhost:3000
```

**Enjoy your Event Booking System! 🚀**

---

## 📞 Need Help?

1. Check `HOW_TO_RUN.md` for detailed instructions
2. Check `COMPLETE_GUIDE.md` for full reference
3. Check browser console for frontend errors
4. Check terminal for backend errors
5. Ensure MongoDB is running

---

**Happy Coding! 🎊**
