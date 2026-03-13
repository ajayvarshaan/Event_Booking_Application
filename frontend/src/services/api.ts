import axios, { AxiosInstance } from 'axios';

interface AuthResponse {
  _id: string;
  name: string;
  email: string;
  role: string;
  token: string;
}

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  price: number;
  capacity: number;
  availableSeats: number;
  image: string;
  organizer: string;
}

interface Booking {
  _id: string;
  event: Event;
  user: string;
  seats: number;
  totalPrice: number;
  status: string;
}

interface Activity {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  userName: string;
  userEmail: string;
  action: string;
  description: string;
  eventId?: string;
  eventTitle?: string;
  bookingId?: string;
  metadata?: any;
  createdAt: string;
}

const API: AxiosInstance = axios.create({ baseURL: 'http://localhost:5000/api' });

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export const authAPI = {
  register: (data: { name: string; email: string; password: string }) =>
    API.post<AuthResponse>('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    API.post<AuthResponse>('/auth/login', data),
  getProfile: () => API.get<AuthResponse>('/auth/profile')
};

export const eventAPI = {
  getAll: () => API.get<Event[]>('/events'),
  getOne: (id: string) => API.get<Event>(`/events/${id}`),
  create: (data: Partial<Event>) => API.post<Event>('/events', data),
  update: (id: string, data: Partial<Event>) => API.put<Event>(`/events/${id}`, data),
  delete: (id: string) => API.delete(`/events/${id}`)
};

export const bookingAPI = {
  create: (data: { eventId: string; seats: number }) =>
    API.post<Booking>('/bookings', data),
  getMyBookings: () => API.get<Booking[]>('/bookings/my-bookings'),
  getAllBookings: () => API.get<Booking[]>('/bookings/all'),
  getUserBookingStats: () => API.get('/bookings/user-stats'),
  getCanceledBookingStats: () => API.get('/bookings/canceled-stats'),
  cancel: (id: string) => API.put(`/bookings/${id}/cancel`)
};

export const activityAPI = {
  getAll: (page?: number, limit?: number) => 
    API.get<{ activities: Activity[]; currentPage: number; totalPages: number; totalActivities: number }>(
      `/activities/all?page=${page || 1}&limit=${limit || 20}`
    ),
  getRecent: (limit?: number) => 
    API.get<Activity[]>(`/activities/recent?limit=${limit || 10}`),
  getUserActivities: (userId: string, page?: number, limit?: number) =>
    API.get<{ activities: Activity[]; currentPage: number; totalPages: number; totalActivities: number }>(
      `/activities/user/${userId}?page=${page || 1}&limit=${limit || 20}`
    ),
  getStats: () =>
    API.get<{ stats: any[]; totalActivities: number; todayActivities: number }>('/activities/stats')
};


export const reviewAPI = {
  create: (data: { eventId: string; rating: number; comment: string }) =>
    API.post('/reviews', data),
  getEventReviews: (eventId: string) =>
    API.get(`/reviews/event/${eventId}`),
  update: (reviewId: string, data: { rating?: number; comment?: string }) =>
    API.put(`/reviews/${reviewId}`, data),
  delete: (reviewId: string) =>
    API.delete(`/reviews/${reviewId}`)
};

export const wishlistAPI = {
  add: (eventId: string) =>
    API.post('/wishlist/add', { eventId }),
  remove: (eventId: string) =>
    API.post('/wishlist/remove', { eventId }),
  get: () =>
    API.get('/wishlist'),
  check: (eventId: string) =>
    API.get(`/wishlist/check/${eventId}`)
};
