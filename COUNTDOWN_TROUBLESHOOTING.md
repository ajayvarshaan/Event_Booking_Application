# Countdown Not Updating - Troubleshooting Guide

## 🔍 Issue: Countdown shows "Event Started" even after changing to future date

### Quick Fixes:

#### 1. **Manual Refresh Button** (NEW!)
- Look for the 🔄 button next to the search bar
- Click it to manually refresh all events
- This forces a fresh fetch from the database

#### 2. **Hard Refresh Browser**
```
Windows: Ctrl + Shift + R or Ctrl + F5
Mac: Cmd + Shift + R
```

#### 3. **Check the Date in Database**
Open MongoDB Compass and verify:
- Database: `event-booking`
- Collection: `events`
- Check the `date` field format

### Expected Date Format in Database:

```json
{
  "date": "2024-12-25T00:00:00.000Z",  // ISO format
  "time": "18:00"
}
```

### Common Issues:

#### Issue 1: Date is in the past
**Solution**: Edit event and set date to future (e.g., 30 days from today)

#### Issue 2: Timezone confusion
**Problem**: Date might be stored in UTC but displayed in local time
**Solution**: 
```javascript
// When editing, make sure to use a date far in the future
// Example: If today is Jan 9, 2025, use Feb 15, 2025 or later
```

#### Issue 3: Cache not clearing
**Solution**:
1. Open DevTools (F12)
2. Go to Application tab
3. Clear Storage
4. Refresh page

### Testing Steps:

1. **Login as Admin**
   ```
   Email: admin@eventbooking.com
   Password: admin123
   ```

2. **Edit an Event**
   - Click blue "Edit" button
   - Change date to: **30 days from today**
   - Click "Update Event"

3. **Verify Update**
   - Click the 🔄 refresh button
   - Check if countdown shows ~30 days
   - Watch seconds tick

4. **If Still Not Working**
   - Open browser console (F12)
   - Look for errors
   - Check what date is being passed to Countdown

### Debug in Console:

Open browser console and run:
```javascript
// Check what events are loaded
console.log('Events:', JSON.parse(localStorage.getItem('events')));

// Force refresh
window.location.reload();
```

### Manual Database Fix:

If countdown still doesn't work, manually update in MongoDB Compass:

1. Open MongoDB Compass
2. Connect to `mongodb://localhost:27017`
3. Select database: `event-booking`
4. Select collection: `events`
5. Find your event
6. Edit the `date` field to:
   ```
   2025-02-15T00:00:00.000Z
   ```
7. Save
8. Go back to app and click 🔄 refresh button

### Expected Behavior After Fix:

✅ Countdown shows: `36 Days 12 Hours 45 Mins 23 Secs`
✅ Numbers tick every second
✅ No "Event Started" message
✅ Refresh button works

### Still Not Working?

Try this complete reset:

```bash
# Stop both servers
# Ctrl+C in both terminal windows

# Backend - reseed database
cd backend
node seed.js

# This creates fresh events with future dates:
# - Summer Music Festival 2024 (July 15, 2024)
# - Tech Conference 2024 (June 20, 2024)
# - Food & Wine Expo (August 10, 2024)
# - Marathon Championship (September 5, 2024)
# - Business Leadership Summit (July 25, 2024)
# - Jazz Night Live (June 30, 2024)

# Restart backend
npm run dev

# In another terminal, restart frontend
cd frontend
npm start

# Now all events should have proper countdowns!
```

### Pro Tip:

When editing dates, always use dates that are:
- ✅ At least 7 days in the future
- ✅ In the format: YYYY-MM-DD
- ✅ Realistic (not year 2099)

### Contact Points:

If countdown still doesn't update:
1. Check browser console for errors
2. Verify backend is running (http://localhost:5000)
3. Verify MongoDB is running
4. Check network tab in DevTools for API calls
5. Look for 200 status codes on GET /api/events

The 🔄 refresh button should solve most issues! Click it after editing any event.
