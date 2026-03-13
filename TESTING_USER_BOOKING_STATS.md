# Testing Guide - User Booking Statistics Feature

## Prerequisites
- Backend server running on `http://localhost:5000`
- Frontend running on `http://localhost:3000`
- Admin user account created
- Sample events and bookings in the database

## Step-by-Step Testing

### 1. Setup Test Data

#### Create Test Events (as Admin)
1. Log in as admin
2. Navigate to "Create Event"
3. Create at least 2-3 events with different details:
   - Event 1: "Concert Night" - $50 per seat, 100 capacity
   - Event 2: "Tech Conference" - $100 per seat, 50 capacity
   - Event 3: "Sports Event" - $20 per seat, 200 capacity

#### Create Test Bookings (as Regular Users)
1. Log out and create/log in as a regular user
2. Book seats for multiple events:
   - Book 2 seats for Event 1
   - Book 4 seats for Event 2
3. Log out and create another user
4. Book seats as the second user:
   - Book 3 seats for Event 1
   - Book 2 seats for Event 3

### 2. Test Admin Dashboard

#### Access Admin Dashboard
1. Log in as admin
2. Navigate to Admin Dashboard (should see "📊 Admin Dashboard")
3. Verify the page loads without errors

#### Verify Statistics Cards
- Check "Total Bookings" shows correct count (should be 3 bookings total)
- Check "Total Events" shows correct count (should be 3 events)
- Check "Recent Activities" shows recent activity count

#### Test User Booking Statistics Section
1. Scroll to "👥 User Booking Statistics" section
2. Verify all users with bookings are displayed
3. For each user, verify:
   - User name and email are correct
   - Avatar shows first letter of name
   - "Bookings" badge shows correct count
   - "Seats" badge shows total seats booked
   - "Total Spent" badge shows correct amount (seats × price)

#### Test Expandable Event Details
1. Click on a user card to expand
2. Verify "Booked Events:" section appears
3. For each event in the list, verify:
   - Event title is displayed with 🎉 emoji
   - Booking date is shown
   - Number of seats is correct
   - Total price for that booking is correct
4. Click again to collapse
5. Verify the section collapses

### 3. Test Data Accuracy

#### Verify Calculations
For User 1 (2 seats @ $50 + 4 seats @ $100):
- Total Bookings: 2
- Total Seats: 6
- Total Spent: $500 (100 + 400)

For User 2 (3 seats @ $50 + 2 seats @ $20):
- Total Bookings: 2
- Total Seats: 5
- Total Spent: $190 (150 + 40)

### 4. Test Responsive Design

#### Desktop View
- All elements should be properly aligned
- User cards should display horizontally
- Stats badges should be in a row

#### Tablet View (768px)
- User stat header should adapt
- Stats badges should wrap if needed
- Event details should remain readable

#### Mobile View (< 480px)
- User info and stats should stack vertically
- Event details should be full width
- All text should be readable

### 5. Test Edge Cases

#### No Bookings
1. Create a new event with no bookings
2. Verify "No booking data available" message appears if no users have bookings

#### Single Booking
1. Create a user with only 1 booking
2. Verify stats show correctly:
   - Bookings: 1
   - Seats: (number of seats)
   - Total Spent: (price × seats)

#### Multiple Bookings for Same Event
1. Have a user book the same event multiple times
2. Verify each booking is listed separately in event details

#### Large Numbers
1. Create bookings with high seat counts (e.g., 50 seats)
2. Verify calculations are correct
3. Verify display formatting is proper

### 6. Test API Endpoints

#### Test `/api/bookings/user-stats` Endpoint
```bash
# Using curl or Postman
GET http://localhost:5000/api/bookings/user-stats
Authorization: Bearer <admin_token>
```

Expected Response:
```json
[
  {
    "_id": "user_id_1",
    "userName": "User Name",
    "userEmail": "user@example.com",
    "totalBookings": 2,
    "totalSeats": 6,
    "totalSpent": 500,
    "events": [
      {
        "eventTitle": "Event Name",
        "seats": 2,
        "totalPrice": 100,
        "bookingDate": "2024-01-15T10:30:00Z"
      }
    ]
  }
]
```

### 7. Test Error Handling

#### Non-Admin Access
1. Log in as regular user
2. Try to access `/api/bookings/user-stats` directly
3. Should receive 403 Forbidden error

#### Unauthenticated Access
1. Log out
2. Try to access `/api/bookings/user-stats`
3. Should receive 401 Unauthorized error

#### Network Error
1. Stop backend server
2. Try to load Admin Dashboard
3. Should show loading state and handle error gracefully

### 8. Performance Testing

#### Large Dataset
1. Create 100+ bookings across multiple users
2. Load Admin Dashboard
3. Verify page loads within reasonable time (< 3 seconds)
4. Verify no console errors

#### Sorting Verification
1. Verify users are sorted by total bookings (highest first)
2. Verify order is maintained when expanding/collapsing

## Expected Behavior Summary

✅ Admin Dashboard loads successfully
✅ User booking statistics section displays all users with bookings
✅ Each user shows correct totals (bookings, seats, spent)
✅ Clicking user card expands to show event details
✅ Event details show correct information
✅ Responsive design works on all screen sizes
✅ API endpoint returns correct aggregated data
✅ Non-admin users cannot access the endpoint
✅ No console errors or warnings
✅ Performance is acceptable with large datasets

## Troubleshooting

### Issue: "No booking data available" message
- **Solution**: Ensure bookings exist in database and are not cancelled
- Check MongoDB for booking records

### Issue: Incorrect totals
- **Solution**: Verify booking data in database
- Check if cancelled bookings are being excluded
- Verify event prices are correct

### Issue: User names not showing
- **Solution**: Ensure user references are properly populated
- Check if user documents exist in database

### Issue: Dates showing incorrectly
- **Solution**: Verify timezone settings
- Check date format in browser console

### Issue: API returns 500 error
- **Solution**: Check backend console for errors
- Verify MongoDB connection
- Check aggregation pipeline syntax

## Success Criteria

The feature is working correctly when:
1. ✅ All users with bookings are displayed
2. ✅ Statistics are calculated correctly
3. ✅ Event details expand/collapse properly
4. ✅ Responsive design works on all devices
5. ✅ No errors in console
6. ✅ API endpoint returns correct data
7. ✅ Admin-only access is enforced
8. ✅ Performance is acceptable
