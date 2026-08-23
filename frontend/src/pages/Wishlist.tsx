import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import EventCard from '../components/EventCard';
import { wishlistAPI } from '../services/api';
import gsap from 'gsap';
import './Wishlist.css';

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
}

const Wishlist: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const fetchWishlist = async () => {
    try {
      const response = await wishlistAPI.get();
      setEvents(Array.isArray(response.data?.events) ? response.data.events : []);
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  useEffect(() => {
    if (!loading) {
      if (headerRef.current) {
        gsap.fromTo(headerRef.current,
          { opacity: 0, y: -40, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'back.out(1.5)' }
        );
      }
      if (gridRef.current) {
        const cards = gridRef.current.children;
        if (cards.length > 0) {
          gsap.fromTo(cards,
            { opacity: 0, y: 50, rotationY: -15, scale: 0.9 },
            {
              opacity: 1, y: 0, rotationY: 0, scale: 1,
              duration: 0.7, stagger: 0.12, ease: 'back.out(1.6)',
              transformPerspective: 900
            }
          );
        }
      }
    }
  }, [loading, events.length]);

  const handleBook = (eventId: string) => {
    navigate(`/book/${eventId}`);
  };

  const handleWishlistChange = (eventId: string, isInWishlist: boolean) => {
    if (!isInWishlist) {
      const cardEl = document.getElementById(`wishlist-card-${eventId}`);
      if (cardEl) {
        gsap.to(cardEl, {
          opacity: 0,
          scale: 0.8,
          y: -30,
          duration: 0.35,
          ease: 'power2.in',
          onComplete: () => {
            setEvents((prev) => prev.filter((event) => event._id !== eventId));
          }
        });
      } else {
        setEvents((prev) => prev.filter((event) => event._id !== eventId));
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading wishlist...</div>;
  }

  return (
    <div className="wishlist-page">
      <div className="container">
        <div className="wishlist-header" ref={headerRef}>
          <span className="wishlist-header-kicker">❤️ Saved Events</span>
          <h1>My Wishlist</h1>
          <p>Your hand-picked events, saved in one beautiful place.</p>
        </div>

        {events.length === 0 ? (
          <div className="wishlist-empty">
            <span className="wishlist-empty-icon">💫</span>
            <h2>Your Wishlist is Empty</h2>
            <p>Tap the heart icon on any event card to save it here for later. Your favourite events are just a click away.</p>
            <Link to="/home" className="btn-primary">
              ✨ Browse Events
            </Link>
          </div>
        ) : (
          <div className="wishlist-grid" ref={gridRef}>
            {events.map((event) => (
              <div id={`wishlist-card-${event._id}`} key={event._id}>
                <EventCard
                  event={event}
                  onBook={handleBook}
                  onWishlistChange={handleWishlistChange}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;