# Testing Activity Tracking

## How to Test:

1. **Restart Backend Server**
   ```bash
   cd backend
   npm run dev
   ```

2. **Login as Regular User**
   - Go to http://localhost:3000/login
   - Login with any user account (not admin)

3. **Book an Event**
   - Browse events on the home page
   - Click "Book Now" on any event
   - Complete the booking

4. **Cancel a Booking**
   - Go to "My Bookings"
   - Click "Cancel Booking" on any booking

5. **Check Admin Dashboard**
   - Logout from user account
   - Login as admin (admin@eventbooking.com / admin123)
   - Go to Dashboard
   - You should see "Recent User Bookings" section showing the activities
   - Click "View All Booking Activities" to see full activity log

## What You Should See:

### In Dashboard:
- Recent User Bookings section with:
  - User name and email
  - Green "✅ Booked" or Red "❌ Cancelled" badge
  - Event details
  - Timestamp

### In Activity Log Page:
- All booking and cancellation activities
- Color-coded cards (Green for bookings, Red for cancellations)
- User information
- Event titles
- Relative timestamps (e.g., "5m ago", "2h ago")

## Troubleshooting:

If activities don't show up:

1. Check backend console for errors
2. Look for "Logging activity:" messages in backend console
3. Check MongoDB connection
4. Verify the Activity collection exists in MongoDB
5. Check browser console for API errors

## Database Check:

To manually check activities in MongoDB:
```bash
mongosh
use event-booking
db.activities.find().sort({createdAt: -1}).limit(10)
```
