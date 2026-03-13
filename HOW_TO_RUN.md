# How to Run Frontend (Vite) and Backend

## 🚀 Quick Start (3 Simple Steps)

### Step 1: Install Dependencies
```bash
# Run from project root
setup.bat
```

### Step 2: Start Both Servers
```bash
# Run from project root
start-app.bat
```

### Step 3: Open Browser
```
http://localhost:3000
```

**That's it! Your app is running! 🎊**

---

## 📋 Manual Setup

### 1. Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend (Vite):**
```bash
cd frontend
npm install
```

### 2. Configure Environment

Edit `backend/.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/event-booking
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

### 3. Start MongoDB
```bash
net start MongoDB
```

### 4. Start Backend (Terminal 1)
```bash
cd backend
npm run dev
```

✅ Backend running on http://localhost:5000

### 5. Start Frontend with Vite (Terminal 2)
```bash
cd frontend
npm run dev
```

✅ Frontend running on http://localhost:3000

---

## 🎯 Available Commands

### Backend Commands:
```bash
cd backend
npm run dev     # Start development server with ts-node
npm run build   # Build TypeScript to JavaScript
npm start       # Run production build
```

### Frontend Commands (Vite):
```bash
cd frontend
npm run dev      # Start Vite dev server (Fast HMR)
npm run build    # Build for production
npm run preview  # Preview production build
```

---

## ⚡ Why Vite?

- **Lightning Fast**: Instant server start
- **Hot Module Replacement (HMR)**: Updates instantly without refresh
- **Optimized Build**: Faster than Create React App
- **Modern**: Uses native ES modules

---

## 🔧 Vite Configuration

Located in `frontend/vite.config.ts`:
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true  // Auto-opens browser
  }
})
```

---

## 📁 Project Structure

```
event-booking/
├── backend/                    # Express + TypeScript
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── server.ts
│   ├── .env
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                   # React + Vite + TypeScript
│   ├── src/
│   │   ├── animations/        # GSAP utilities
│   │   ├── components/        # React components
│   │   ├── context/           # Auth context
│   │   ├── pages/             # Page components
│   │   ├── services/          # API calls
│   │   ├── styles/            # Global CSS
│   │   ├── App.tsx
│   │   └── main.tsx           # Vite entry point
│   ├── index.html             # Vite HTML template
│   ├── vite.config.ts         # Vite configuration
│   ├── package.json
│   └── tsconfig.json
│
├── start-app.bat              # Start both servers
├── stop-app.bat               # Stop both servers
└── setup.bat                  # Install dependencies
```

---

## 🌐 URLs

| Service  | URL                      | Port |
|----------|--------------------------|------|
| Frontend | http://localhost:3000    | 3000 |
| Backend  | http://localhost:5000    | 5000 |
| MongoDB  | mongodb://localhost:27017| 27017|

---

## 🐛 Troubleshooting

### Backend won't start?
```bash
# Check if port 5000 is in use
netstat -ano | findstr :5000

# Kill the process
taskkill /PID <PID> /F
```

### Frontend won't start?
```bash
# Check if port 3000 is in use
netstat -ano | findstr :3000

# Kill the process
taskkill /PID <PID> /F

# Clear Vite cache
cd frontend
rmdir /s /q node_modules\.vite
npm run dev
```

### MongoDB connection error?
```bash
# Start MongoDB
net start MongoDB

# Or use MongoDB Atlas connection string in .env
```

### Module not found?
```bash
# Reinstall dependencies
cd backend
rmdir /s /q node_modules
del package-lock.json
npm install

cd ../frontend
rmdir /s /q node_modules
del package-lock.json
npm install
```

---

## 🎨 GSAP Animations

All animations work seamlessly with Vite's HMR:

- **fadeInUp** - Fade in with upward motion
- **staggerFadeIn** - Staggered animation
- **scaleIn** - Scale with bounce
- **slideInLeft/Right** - Slide animations
- **scrollReveal** - Scroll-triggered
- **hoverScale** - Hover effects
- **pulseAnimation** - Continuous pulse
- **rotateIn** - Rotation entrance
- **pageTransition** - Page transitions

---

## 🔥 Vite Features in Action

### Hot Module Replacement (HMR)
- Edit any React component
- Changes appear instantly
- State is preserved

### Fast Refresh
- Edit CSS files
- Styles update without page reload

### Optimized Imports
- Only loads what you need
- Tree-shaking built-in

---

## 📝 Testing the Application

### 1. Register User
```
URL: http://localhost:3000/register
Name: John Doe
Email: john@example.com
Password: password123
```

### 2. Create Admin User (MongoDB)
```bash
mongo
use event-booking
db.users.updateOne(
  { email: "john@example.com" },
  { $set: { role: "admin" } }
)
```

### 3. Login as Admin
```
URL: http://localhost:3000/login
```

### 4. Create Event
```
URL: http://localhost:3000/create-event
```

### 5. Book Event
```
Logout, register new user
Browse events and book
```

---

## 🚀 Production Build

### Build Backend
```bash
cd backend
npm run build
npm start
```

### Build Frontend (Vite)
```bash
cd frontend
npm run build
# Output in dist/ folder

# Preview production build
npm run preview
```

---

## 💡 Development Tips

1. **Vite Dev Server**: Starts in ~200ms
2. **HMR**: Changes reflect instantly
3. **TypeScript**: Full type checking
4. **GSAP**: Animations work perfectly with Vite
5. **Console**: Check browser console for errors

---

## 📚 Documentation

- **Vite**: https://vitejs.dev/
- **React**: https://react.dev/
- **GSAP**: https://greensock.com/docs/
- **TypeScript**: https://www.typescriptlang.org/

---

## ✅ Checklist

- [ ] MongoDB is running
- [ ] Backend dependencies installed
- [ ] Frontend dependencies installed
- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000
- [ ] Can register user
- [ ] Can login
- [ ] Can view events
- [ ] Can book events
- [ ] Animations are smooth

---

🎉 **Enjoy your Event Booking System with Vite + GSAP!**
