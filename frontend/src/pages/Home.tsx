import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EventCard from '../components/EventCard';
import Modal from '../components/Modal';
import Toast from '../components/Toast';
import { eventAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import gsap from 'gsap';
import './Home.css';

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

const Home: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const eventsRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await eventAPI.getAll();
        setEvents(response.data);
        setFilteredEvents(response.data);
      } catch (error) {
        console.error('Failed to fetch events:', error);
        setToast({ message: 'Failed to load events', type: 'error' });
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Animate hero section
    if (heroRef.current) {
      tl.fromTo(heroRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.6 }
      );
    }

    // Animate hero title with word-by-word reveal
    if (titleRef.current) {
      const text = titleRef.current.textContent || '';
      titleRef.current.innerHTML = '';
      
      text.split(' ').forEach((word) => {
        const wordSpan = document.createElement('span');
        wordSpan.style.display = 'inline-block';
        wordSpan.style.marginRight = '20px';
        wordSpan.style.opacity = '0';
        
        word.split('').forEach((char) => {
          const span = document.createElement('span');
          span.textContent = char;
          span.style.display = 'inline-block';
          wordSpan.appendChild(span);
        });
        
        titleRef.current?.appendChild(wordSpan);
      });

      const words = titleRef.current.querySelectorAll('span');
      tl.to(words, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'back.out(1.5)'
      }, '-=0.3');
    }

    // Animate subtitle
    if (subtitleRef.current) {
      tl.fromTo(subtitleRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, ease: 'power4.out' },
        '-=0.6'
      );
    }
  }, []);

  useEffect(() => {
    let filtered = events;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(event => event.category === selectedCategory);
    }

    setFilteredEvents(filtered);
  }, [searchQuery, selectedCategory, events]);

  useEffect(() => {
    if (!loading && eventsRef.current) {
      const cards = eventsRef.current.querySelectorAll('.event-card');
      if (cards.length > 0) {
        gsap.fromTo(cards,
          { 
            opacity: 0, 
            y: 80, 
            scale: 0.9,
            rotationX: -15
          },
          { 
            opacity: 1, 
            y: 0, 
            scale: 1,
            rotationX: 0,
            duration: 0.8, 
            stagger: {
              amount: 0.6,
              from: 'start',
              ease: 'power2.out'
            },
            ease: 'power4.out',
            clearProps: 'transform'
          }
        );
      }
    }
  }, [loading, filteredEvents]);

  const handleBook = (eventId: string) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate(`/book/${eventId}`);
  };

  const handleDelete = (eventId: string) => {
    setSelectedEventId(eventId);
    setModalOpen(true);
  };

  const handleEdit = (eventId: string) => {
    navigate(`/edit-event/${eventId}`);
  };

  const confirmDelete = async () => {
    if (!selectedEventId) return;
    
    try {
      await eventAPI.delete(selectedEventId);
      setEvents(events.filter((e) => e._id !== selectedEventId));
      setModalOpen(false);
      setSelectedEventId(null);
      setToast({ message: 'Event deleted successfully!', type: 'success' });
    } catch (error) {
      console.error('Failed to delete event:', error);
      setModalOpen(false);
      setToast({ message: 'Failed to delete event', type: 'error' });
    }
  };

  const refreshEvents = async () => {
    try {
      const response = await eventAPI.getAll();
      setEvents(response.data);
      setFilteredEvents(response.data);
      setToast({ message: 'Events refreshed!', type: 'info' });
    } catch (error) {
      console.error('Failed to refresh events:', error);
    }
  };

  // Refresh events when component mounts or when returning from edit
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        refreshEvents();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  if (loading) {
    return <div className="loading">Loading events...</div>;
  }

  return (
    <div className="home">
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
        onConfirm={confirmDelete}
        title="Delete Event"
        message="Are you sure you want to delete this event? This action cannot be undone and all bookings will be affected."
        confirmText="Yes, Delete"
        cancelText="Cancel"
      />
      
      <div className="hero" ref={heroRef}>
        <div className="hero-bg-shape shape-1"></div>
        <div className="hero-bg-shape shape-2"></div>
        <div className="hero-bg-shape shape-3"></div>
        <h1 ref={titleRef}>Discover Amazing Events</h1>
        <p ref={subtitleRef}>Book your favorite events and create unforgettable memories</p>
      </div>

      <div className="container">
        <div className="search-filter-section">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search events by title, description, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button 
              className="refresh-btn" 
              onClick={refreshEvents}
              title="Refresh events"
            >
              🔄
            </button>
          </div>
          
          <div className="filter-buttons">
            <button
              className={`filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('all')}
            >
              All Events
            </button>
            <button
              className={`filter-btn ${selectedCategory === 'music' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('music')}
            >
              🎵 Music
            </button>
            <button
              className={`filter-btn ${selectedCategory === 'sports' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('sports')}
            >
              ⚽ Sports
            </button>
            <button
              className={`filter-btn ${selectedCategory === 'tech' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('tech')}
            >
              💻 Tech
            </button>
            <button
              className={`filter-btn ${selectedCategory === 'business' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('business')}
            >
              💼 Business
            </button>
            <button
              className={`filter-btn ${selectedCategory === 'other' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('other')}
            >
              🎉 Other
            </button>
          </div>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="no-events">
            <h2>No Events Available</h2>
            <p>There are currently no events to display. Check back later!</p>
            {isAuthenticated && (
              <p className="admin-hint">Are you an admin? <a href="/create-event">Create an event</a></p>
            )}
          </div>
        ) : (
          <div ref={eventsRef} className="events-grid">
            {filteredEvents.map((event) => (
              <EventCard 
                key={event._id} 
                event={event} 
                onBook={handleBook}
                onDelete={handleDelete}
                onEdit={handleEdit}
                isAdmin={user?.role === 'admin'}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
