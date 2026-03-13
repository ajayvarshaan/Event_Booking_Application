import React, { useEffect, useRef, useState } from 'react';
import { bookingAPI } from '../services/api';
import { staggerFadeIn, fadeInUp } from '../animations/gsapAnimations';
import Modal from '../components/Modal';
import Toast from '../components/Toast';
import './MyBookings.css';

interface Booking {
  _id: string;
  event: {
    _id: string;
    title: string;
    date: string;
    time: string;
    location: string;
    price: number;
  } | null;
  seats: number;
  totalPrice: number;
  status: string;
  createdAt: string;
}

const MyBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const bookingsRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await bookingAPI.getMyBookings();
        // Filter out bookings with deleted events
        const validBookings = response.data.filter((b: Booking) => b.event !== null);
        setBookings(validBookings);
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  useEffect(() => {
    if (!loading && bookingsRef.current) {
      const cards = bookingsRef.current.querySelectorAll('.booking-card');
      if (cards.length > 0) {
        staggerFadeIn(cards, 0.15);
      }
    }
  }, [loading, bookings]);

  useEffect(() => {
    if (titleRef.current) {
      fadeInUp(titleRef.current);
    }
  }, []);

  const handleCancel = (bookingId: string) => {
    setSelectedBookingId(bookingId);
    setModalOpen(true);
  };

  const confirmCancel = async () => {
    if (!selectedBookingId) return;
    
    try {
      await bookingAPI.cancel(selectedBookingId);
      setBookings(bookings.filter((b) => b._id !== selectedBookingId));
      setModalOpen(false);
      setSelectedBookingId(null);
      setToast({ message: 'Booking cancelled successfully!', type: 'success' });
    } catch (error) {
      console.error('Failed to cancel booking:', error);
      setModalOpen(false);
      setToast({ message: 'Failed to cancel booking', type: 'error' });
    }
  };

  if (loading) {
    return <div className="loading">Loading bookings...</div>;
  }

  return (
    <div className="my-bookings">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={confirmCancel}
        title="Cancel Booking"
        message="Are you sure you want to cancel this booking? This action cannot be undone."
        confirmText="Yes, Cancel"
        cancelText="No, Keep It"
      />
      
      <div className="container">
        <h1 ref={titleRef}>My Bookings</h1>

        {bookings.length === 0 ? (
          <div className="no-bookings">
            <p>You haven't booked any events yet.</p>
            <a href="/home" className="btn-primary">
              Browse Events
            </a>
          </div>
        ) : (
          <div ref={bookingsRef} className="bookings-list">
            {bookings.map((booking) => {
              // Safety check for deleted events
              if (!booking.event) {
                return (
                  <div key={booking._id} className="booking-card card deleted-event">
                    <div className="booking-header">
                      <h3>⚠️ Event Deleted</h3>
                      <span className={`status ${booking.status}`}>{booking.status}</span>
                    </div>
                    <div className="booking-details">
                      <p className="deleted-message">
                        This event has been deleted by the organizer.
                      </p>
                      <div className="detail-row">
                        <span>🎫 Seats:</span>
                        <span>{booking.seats}</span>
                      </div>
                      <div className="detail-row">
                        <span>💰 Total Price:</span>
                        <span className="price">${booking.totalPrice}</span>
                      </div>
                    </div>
                  </div>
                );
              }
              
              return (
                <div key={booking._id} className="booking-card card">
                  <div className="booking-header">
                    <h3>{booking.event.title}</h3>
                    <span className={`status ${booking.status}`}>{booking.status}</span>
                  </div>

                  <div className="booking-details">
                    <div className="detail-row">
                      <span>📅 Date:</span>
                      <span>{new Date(booking.event.date).toLocaleDateString()}</span>
                    </div>
                    <div className="detail-row">
                      <span>🕐 Time:</span>
                      <span>{booking.event.time}</span>
                    </div>
                    <div className="detail-row">
                      <span>📍 Location:</span>
                      <span>{booking.event.location}</span>
                    </div>
                    <div className="detail-row">
                      <span>🎫 Seats:</span>
                      <span>{booking.seats}</span>
                    </div>
                    <div className="detail-row">
                      <span>💰 Total Price:</span>
                      <span className="price">${booking.totalPrice}</span>
                    </div>
                  </div>

                  {booking.status === 'confirmed' && (
                    <button
                      className="btn-secondary w-full"
                      onClick={() => handleCancel(booking._id)}
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
