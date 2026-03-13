# User Booking Statistics Feature

## Overview
Added a new section to the Admin Dashboard that displays how many orders each user has booked, along with detailed event information.

## Changes Made

### Backend

#### 1. New Controller Function: `getUserBookingStats`
**File:** `backend/src/controllers/bookingController.ts`

- Uses MongoDB aggregation pipeline to fetch booking statistics
- Groups bookings by user
- Includes user details (name, email)
- Calculates:
  - Total bookings per user
  - Total seats booked
  - Total amount spent
  - List of all booked events with details
- Excludes cancelled bookings
- Sorts by total bookings (descending)

#### 2. New Route: `/api/bookings/user-stats`
**File:** `backend/src/routes/bookingRoutes.ts`

- Protected route (requires authentication)
- Admin-only access
- GET request
- Returns aggregated user booking statistics

### Frontend

#### 1. Updated AdminDashboard Component
**File:** `frontend/src/pages/AdminDashboard.tsx`

**New Interfaces:**
- `UserBookingStat`: Defines structure for user booking statistics

**New State:**
- `expandedUser`: Tracks which user's event details are expanded

**New Features:**
- Fetches user booking stats from new backend endpoint
- Displays user booking statistics section with:
  - User avatar (first letter of name)
  - User name and email
  - Summary badges showing:
    - Total bookings count
    - Total seats booked
    - Total amount spent
  - Expandable event details showing:
    - Event title
    - Booking date
    - Number of seats
    - Total price for that booking

#### 2. New Styles
**File:** `frontend/src/pages/AdminDashboard.css`

Added comprehensive styling for:
- `.user-stats-section`: Main container
- `.user-stat-card`: Individual user card
- `.user-stat-header`: Header with user info and stats
- `.user-avatar`: Circular avatar with gradient
- `.stat-badge`: Statistics display badges
- `.user-events-details`: Expandable event details section
- `.event-detail-item`: Individual event booking details
- Responsive design for mobile devices

## Features

### User Booking Statistics Display
- Shows all users who have made bookings
- Displays key metrics for each user:
  - Number of bookings
  - Total seats booked
  - Total money spent
- Sorted by number of bookings (highest first)

### Expandable Event Details
- Click on a user card to expand/collapse event details
- Shows all events booked by that user with:
  - Event name
  - Booking date
  - Number of seats
  - Total price paid

### Responsive Design
- Adapts to mobile screens
- Stacked layout on smaller devices
- Touch-friendly interface

## API Response Example

```json
[
  {
    "_id": "user_id_1",
    "userName": "John Doe",
    "userEmail": "john@example.com",
    "totalBookings": 3,
    "totalSeats": 8,
    "totalSpent": 240,
    "events": [
      {
        "eventTitle": "Concert Night",
        "seats": 2,
        "totalPrice": 100,
        "bookingDate": "2024-01-15T10:30:00Z"
      },
      {
        "eventTitle": "Tech Conference",
        "seats": 4,
        "totalPrice": 120,
        "bookingDate": "2024-01-20T14:00:00Z"
      },
      {
        "eventTitle": "Sports Event",
        "seats": 2,
        "totalPrice": 20,
        "bookingDate": "2024-01-25T18:00:00Z"
      }
    ]
  }
]
```

## How to Use

1. Navigate to Admin Dashboard
2. Scroll to "👥 User Booking Statistics" section
3. View all users and their booking summaries
4. Click on any user card to expand and see detailed event bookings
5. Click again to collapse

## Technical Details

### Aggregation Pipeline
The backend uses MongoDB aggregation with:
- `$match`: Filters out cancelled bookings
- `$lookup`: Joins with users and events collections
- `$unwind`: Flattens the joined arrays
- `$group`: Groups by user and aggregates statistics
- `$sort`: Orders by total bookings

### Performance
- Single aggregation query for efficiency
- No N+1 query problems
- Suitable for large datasets

## Security
- Admin-only access (protected by `admin` middleware)
- Requires valid JWT token
- User data is properly populated from database
