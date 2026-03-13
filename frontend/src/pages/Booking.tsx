import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventAPI, bookingAPI } from '../services/api';
import { fadeInUp, scaleIn } from '../animations/gsapAnimations';
import Toast from '../components/Toast';
import './Booking.css';

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  price: number;
  availableSeats: number;
  image: string;
}

const Booking: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [seats, setSeats] = useState(1);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const navigate = useNavigate();
  const formRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await eventAPI.getOne(eventId!);
        setEvent(response.data);
      } catch (error) {
        console.error('Failed to fetch event:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  useEffect(() => {
    if (!loading) {
      fadeInUp(titleRef.current);
      scaleIn(formRef.current);
    }
  }, [loading]);

  const handleBooking = async () => {
    if (!event) return;
    setBooking(true);

    try {
      await bookingAPI.create({ eventId: event._id, seats });
      setToast({ message: 'Booking successful! Redirecting...', type: 'success' });
      setTimeout(() => navigate('/my-bookings'), 1500);
    } catch (error) {
      console.error('Booking failed:', error);
      setToast({ message: 'Booking failed. Please try again.', type: 'error' });
      setBooking(false);
    }
  };

  if (loading) return <div className="loading">Loading event...</div>;
  if (!event) return <div className="loading">Event not found</div>;

  const totalPrice = event.price * seats;

  return (
    <div className="booking-container">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      
      <div className="container">
        <h1 ref={titleRef}>Book Event</h1>
        <div className="booking-content">
          <div className="event-info">
            <img src={event.image} alt={event.title} />
            <h2>{event.title}</h2>
            <p>{event.description}</p>
            <div className="info-grid">
              <div>📅 {new Date(event.date).toLocaleDateString()}</div>
              <div>🕐 {event.time}</div>
              <div>📍 {event.location}</div>
              <div>💰 ${event.price} per seat</div>
            </div>
          </div>

          <div ref={formRef} className="booking-form card">
            <h3>Complete Your Booking</h3>
            <div className="form-group">
              <label>Number of Seats</label>
              <input
                type="number"
                min="1"
                max={event.availableSeats}
                value={seats}
                onChange={(e) => setSeats(Math.max(1, parseInt(e.target.value) || 1))}
              />
              <small>{event.availableSeats} seats available</small>
            </div>

            <div className="price-summary">
              <div className="summary-row">
                <span>Price per seat:</span>
                <span>${event.price}</span>
              </div>
              <div className="summary-row">
                <span>Number of seats:</span>
                <span>{seats}</span>
              </div>
              <div className="summary-row total">
                <span>Total Price:</span>
                <span>${totalPrice}</span>
              </div>
            </div>

            <button
              className="btn-primary w-full"
              onClick={handleBooking}
              disabled={booking || seats > event.availableSeats}
            >
              {booking ? 'Processing...' : 'Confirm Booking'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
