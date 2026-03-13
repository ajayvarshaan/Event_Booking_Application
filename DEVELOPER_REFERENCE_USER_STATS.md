# Developer Reference - User Booking Statistics

## Quick Overview

The User Booking Statistics feature displays aggregated booking data for each user in the admin dashboard, showing:
- How many orders each user has booked
- Total seats booked
- Total amount spent
- Detailed list of events booked

## File Structure

```
backend/
├── src/
│   ├── controllers/
│   │   └── bookingController.ts (NEW: getUserBookingStats function)
│   └── routes/
│       └── bookingRoutes.ts (NEW: /user-stats route)

frontend/
├── src/
│   ├── pages/
│   │   ├── AdminDashboard.tsx (UPDATED: Added user stats section)
│   │   └── AdminDashboard.css (UPDATED: Added user stats styles)
│   └── services/
│       └── api.ts (UPDATED: Added getUserBookingStats method)
```

## Backend Implementation

### Controller Function: `getUserBookingStats`

**Location:** `backend/src/controllers/bookingController.ts`

**Purpose:** Aggregates booking data by user using MongoDB aggregation pipeline

**Key Features:**
- Filters out cancelled bookings
- Joins with users and events collections
- Groups by user ID
- Calculates totals (bookings, seats, spent)
- Returns sorted results (by total bookings descending)

**Aggregation Pipeline Stages:**

1. **$match**: Filter cancelled bookings
   ```javascript
   { $match: { status: { $ne: 'cancelled' } } }
   ```

2. **$lookup**: Join users collection
   ```javascript
   {
     $lookup: {
       from: 'users',
       localField: 'user',
       foreignField: '_id',
       as: 'userDetails'
     }
   }
   ```

3. **$lookup**: Join events collection
   ```javascript
   {
     $lookup: {
       from: 'events',
       localField: 'event',
       foreignField: '_id',
       as: 'eventDetails'
     }
   }
   ```

4. **$unwind**: Flatten arrays
   ```javascript
   { $unwind: '$userDetails' }
   { $unwind: '$eventDetails' }
   ```

5. **$group**: Aggregate by user
   ```javascript
   {
     $group: {
       _id: '$user',
       userName: { $first: '$userDetails.name' },
       userEmail: { $first: '$userDetails.email' },
       totalBookings: { $sum: 1 },
       totalSeats: { $sum: '$seats' },
       totalSpent: { $sum: '$totalPrice' },
       events: {
         $push: {
           eventTitle: '$eventDetails.title',
           seats: '$seats',
           totalPrice: '$totalPrice',
           bookingDate: '$createdAt'
         }
       }
     }
   }
   ```

6. **$sort**: Sort by total bookings
   ```javascript
   { $sort: { totalBookings: -1 } }
   ```

### Route: `/api/bookings/user-stats`

**Location:** `backend/src/routes/bookingRoutes.ts`

**Method:** GET

**Authentication:** Required (Bearer token)

**Authorization:** Admin only

**Route Definition:**
```typescript
router.get('/user-stats', protect, admin, getUserBookingStats);
```

**Response Format:**
```json
[
  {
    "_id": "ObjectId",
    "userName": "string",
    "userEmail": "string",
    "totalBookings": number,
    "totalSeats": number,
    "totalSpent": number,
    "events": [
      {
        "eventTitle": "string",
        "seats": number,
        "totalPrice": number,
        "bookingDate": "ISO8601 date"
      }
    ]
  }
]
```

## Frontend Implementation

### Component: `AdminDashboard`

**Location:** `frontend/src/pages/AdminDashboard.tsx`

**Key State:**
```typescript
const [stats, setStats] = useState<Stats>({
  totalBookings: 0,
  totalEvents: 0,
  totalUsers: 0,
  recentActivities: [],
  userBookingStats: []
});
const [expandedUser, setExpandedUser] = useState<string | null>(null);
```

**Data Fetching:**
```typescript
const [bookingsRes, eventsRes, activitiesRes, userStatsRes] = await Promise.all([
  bookingAPI.getAllBookings(),
  eventAPI.getAll(),
  activityAPI.getRecent(10),
  bookingAPI.getUserBookingStats()
]);
```

**Key Functions:**
- `fetchDashboardData()`: Fetches all dashboard data
- `getActionIcon()`: Returns emoji for activity type
- `getActionColor()`: Returns color for activity type
- `formatDate()`: Formats relative dates

### Interfaces

**UserBookingStat:**
```typescript
interface UserBookingStat {
  _id: string;
  userName: string;
  userEmail: string;
  totalBookings: number;
  totalSeats: number;
  totalSpent: number;
  events: {
    eventTitle: string;
    seats: number;
    totalPrice: number;
    bookingDate: string;
  }[];
}
```

### API Service

**Location:** `frontend/src/services/api.ts`

**Method:**
```typescript
getUserBookingStats: () => API.get('/bookings/user-stats')
```

**Usage:**
```typescript
const response = await bookingAPI.getUserBookingStats();
const userStats = response.data;
```

## Styling

**Location:** `frontend/src/pages/AdminDashboard.css`

**Key Classes:**
- `.user-stats-section`: Main container
- `.user-stat-card`: Individual user card
- `.user-stat-header`: Header with user info and stats
- `.user-avatar`: Circular avatar
- `.stat-badge`: Statistics display
- `.user-events-details`: Expandable event details
- `.event-detail-item`: Individual event booking

**Responsive Breakpoints:**
- Desktop: Full layout
- Tablet (768px): Adjusted spacing
- Mobile (< 480px): Stacked layout

## Data Flow

```
Admin Dashboard Component
    ↓
fetchDashboardData()
    ↓
bookingAPI.getUserBookingStats()
    ↓
GET /api/bookings/user-stats
    ↓
Backend Controller (getUserBookingStats)
    ↓
MongoDB Aggregation Pipeline
    ↓
Return aggregated user stats
    ↓
Update component state
    ↓
Render user booking statistics section
```

## Performance Considerations

1. **Single Aggregation Query**: Uses one efficient MongoDB query instead of multiple queries
2. **No N+1 Problem**: All data fetched in one aggregation
3. **Sorting**: Done at database level for efficiency
4. **Filtering**: Cancelled bookings excluded at query level

## Security

1. **Authentication**: Requires valid JWT token
2. **Authorization**: Admin-only access via `admin` middleware
3. **Data Validation**: Input validated by middleware
4. **Error Handling**: Errors logged and returned safely

## Extending the Feature

### Add More Statistics
To add additional statistics (e.g., average booking value):

```typescript
// In aggregation pipeline $group stage
avgBookingValue: { $avg: '$totalPrice' },
maxBookingValue: { $max: '$totalPrice' },
minBookingValue: { $min: '$totalPrice' }
```

### Add Filtering
To filter by date range:

```typescript
// Add to $match stage
{
  $match: {
    status: { $ne: 'cancelled' },
    createdAt: {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    }
  }
}
```

### Add Pagination
To add pagination:

```typescript
// Add to route
router.get('/user-stats', protect, admin, (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;
  
  // Add $skip and $limit to pipeline
});
```

### Add Export Functionality
To export data as CSV:

```typescript
// Add new route
router.get('/user-stats/export', protect, admin, (req, res) => {
  // Generate CSV from aggregation results
  // Set response headers for download
});
```

## Testing

### Unit Tests
Test the aggregation pipeline with various data scenarios

### Integration Tests
Test the full API endpoint with authentication

### Component Tests
Test React component rendering and interactions

### E2E Tests
Test complete user flow from login to viewing statistics

## Troubleshooting

### Common Issues

**Issue**: Empty results
- **Check**: Verify bookings exist and are not cancelled
- **Check**: Verify user and event references are valid

**Issue**: Incorrect calculations
- **Check**: Verify booking prices and seat counts
- **Check**: Verify aggregation pipeline logic

**Issue**: Performance issues
- **Check**: Add database indexes on user and event fields
- **Check**: Consider pagination for large datasets

**Issue**: Authorization errors
- **Check**: Verify user has admin role
- **Check**: Verify token is valid

## Related Files

- `backend/src/models/Booking.ts`: Booking schema
- `backend/src/models/User.ts`: User schema
- `backend/src/models/Event.ts`: Event schema
- `backend/src/middleware/auth.ts`: Authentication middleware
- `frontend/src/context/AuthContext.tsx`: Auth context

## Version History

- **v1.0** (Initial Release)
  - User booking statistics display
  - Expandable event details
  - Responsive design
  - Admin-only access
