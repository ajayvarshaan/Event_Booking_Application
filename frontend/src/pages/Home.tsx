import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EventCard from '../components/EventCard';
import Modal from '../components/Modal';
import Toast from '../components/Toast';
import { eventAPI, wishlistAPI } from '../services/api';
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

type DiscoveryMode = 'all' | 'smart' | 'weekend' | 'budget' | 'almost-full' | 'soon';
type SortMode = 'smart' | 'date' | 'price-low' | 'price-high';
type VibeMode = 'all' | 'after-work' | 'high-energy' | 'family' | 'premium' | 'networking';
const COMPARE_STORAGE_KEY = 'eventhub.compareEvents';

const Home: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [comparedEvents, setComparedEvents] = useState<Event[]>(() => {
    try {
      const raw = localStorage.getItem(COMPARE_STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [discoveryMode, setDiscoveryMode] = useState<DiscoveryMode>('smart');
  const [sortMode, setSortMode] = useState<SortMode>('smart');
  const [vibeMode, setVibeMode] = useState<VibeMode>('all');
  const [showWishlistOnly, setShowWishlistOnly] = useState(false);
  const [wishlistEventIds, setWishlistEventIds] = useState<Set<string>>(new Set());
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
    localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(comparedEvents));
  }, [comparedEvents]);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!isAuthenticated) {
        setWishlistEventIds(new Set());
        setShowWishlistOnly(false);
        return;
      }

      try {
        const response = await wishlistAPI.get();
        const eventIds = Array.isArray(response.data?.events)
          ? response.data.events.map((event: Event) => event._id)
          : [];
        setWishlistEventIds(new Set(eventIds));
      } catch (error) {
        console.error('Failed to fetch wishlist:', error);
      }
    };

    fetchWishlist();
  }, [isAuthenticated]);

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

  const getEventDate = (event: Event) => {
    const parsedDate = new Date(event.date);
    const [rawHours, rawMinutes] = event.time.split(':');

    if (!Number.isNaN(Number(rawHours)) && !Number.isNaN(Number(rawMinutes))) {
      parsedDate.setHours(Number(rawHours), Number(rawMinutes), 0, 0);
    }

    return parsedDate;
  };

  const getDaysUntilEvent = (event: Event) => {
    const diff = getEventDate(event).getTime() - Date.now();
    return diff / (1000 * 60 * 60 * 24);
  };

  const getDemandRatio = (event: Event) => {
    if (event.capacity <= 0) {
      return 0;
    }

    return (event.capacity - event.availableSeats) / event.capacity;
  };

  const isWeekendEvent = (event: Event) => {
    const day = getEventDate(event).getDay();
    return day === 0 || day === 6;
  };

  const isUpcomingSoon = (event: Event, maxDays: number) => {
    const daysUntil = getDaysUntilEvent(event);
    return daysUntil >= 0 && daysUntil <= maxDays;
  };

  const getEventHour = (event: Event) => {
    const [rawHours] = event.time.split(':');
    return Number(rawHours) || 0;
  };

  const matchesVibe = (event: Event, vibe: VibeMode) => {
    if (vibe === 'all') return true;
    if (vibe === 'after-work') return getEventHour(event) >= 17;
    if (vibe === 'high-energy') return event.category === 'music' || event.category === 'sports';
    if (vibe === 'family') return event.price <= 60 && event.availableSeats >= 20;
    if (vibe === 'premium') return event.price >= 80 || event.category === 'business';
    if (vibe === 'networking') return event.category === 'business' || event.category === 'tech';
    return true;
  };

  const getSmartScore = (event: Event) => {
    const urgencyScore = Math.max(0, 1 - Math.min(Math.max(getDaysUntilEvent(event), 0), 30) / 30);
    const demandScore = getDemandRatio(event);
    const priceScore = event.price <= 0 ? 1 : Math.max(0, 1 - Math.min(event.price, 150) / 150);

    return urgencyScore * 45 + demandScore * 40 + priceScore * 15;
  };

  useEffect(() => {
    let filtered = [...events];

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

    // Filter by wishlist
    if (showWishlistOnly) {
      filtered = filtered.filter(event => wishlistEventIds.has(event._id));
    }

    if (vibeMode !== 'all') {
      filtered = filtered.filter(event => matchesVibe(event, vibeMode));
    }

    // Discovery lenses
    if (discoveryMode === 'weekend') {
      filtered = filtered.filter(event => isWeekendEvent(event) && getDaysUntilEvent(event) >= 0);
    }

    if (discoveryMode === 'budget') {
      filtered = filtered.filter(event => event.price <= 50);
    }

    if (discoveryMode === 'almost-full') {
      filtered = filtered.filter(event => getDemandRatio(event) >= 0.75);
    }

    if (discoveryMode === 'soon') {
      filtered = filtered.filter(event => isUpcomingSoon(event, 7));
    }

    // Sorting
    if (sortMode === 'smart') {
      filtered.sort((a, b) => getSmartScore(b) - getSmartScore(a));
    }

    if (sortMode === 'date') {
      filtered.sort((a, b) => getEventDate(a).getTime() - getEventDate(b).getTime());
    }

    if (sortMode === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    }

    if (sortMode === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    }

    setFilteredEvents(filtered);
  }, [searchQuery, selectedCategory, discoveryMode, sortMode, vibeMode, showWishlistOnly, wishlistEventIds, events]);

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

  const handleWishlistChange = (eventId: string, isInWishlist: boolean) => {
    setWishlistEventIds((prev) => {
      const next = new Set(prev);
      if (isInWishlist) {
        next.add(eventId);
      } else {
        next.delete(eventId);
      }
      return next;
    });
  };

  const handleToggleCompare = (event: Event) => {
    setComparedEvents((prev) => {
      const alreadyCompared = prev.some((item) => item._id === event._id);

      if (alreadyCompared) {
        return prev.filter((item) => item._id !== event._id);
      }

      if (prev.length >= 3) {
        setToast({ message: 'You can compare up to 3 events at a time.', type: 'info' });
        return prev;
      }

      return [...prev, event];
    });
  };

  const clearComparedEvents = () => {
    setComparedEvents([]);
  };

  const openComparePage = () => {
    navigate('/compare');
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

  const dealRadarEvents = useMemo(() => {
    const upcoming = events.filter((event) => {
      const days = getDaysUntilEvent(event);
      return days >= 0 && days <= 21;
    });

    if (upcoming.length === 0) {
      return [] as Event[];
    }

    const prices = upcoming.map((event) => event.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = Math.max(maxPrice - minPrice, 1);

    return [...upcoming]
      .map((event) => {
        const normalizedPrice = (event.price - minPrice) / priceRange;
        const valueScore = 1 - normalizedPrice;
        const urgencyScore = Math.max(0, 1 - Math.min(getDaysUntilEvent(event), 21) / 21);
        const demandScore = getDemandRatio(event);
        const radarScore = valueScore * 0.55 + urgencyScore * 0.3 + demandScore * 0.15;

        return {
          event,
          radarScore
        };
      })
      .sort((a, b) => b.radarScore - a.radarScore)
      .slice(0, 3)
      .map((item) => item.event);
  }, [events]);

  if (loading) {
    return <div className="loading">Loading events...</div>;
  }

  const highDemandCount = filteredEvents.filter((event) => getDemandRatio(event) >= 0.75).length;
  const averagePrice = filteredEvents.length > 0
    ? Math.round(filteredEvents.reduce((total, event) => total + event.price, 0) / filteredEvents.length)
    : 0;

  const activeDiscoveryLabel = {
    all: 'All events',
    smart: 'Smart Picks',
    weekend: 'Weekend Plans',
    budget: 'Budget Friendly',
    'almost-full': 'Almost Gone',
    soon: 'Happening Soon'
  }[discoveryMode];
  const activeVibeLabel = {
    all: 'Any Vibe',
    'after-work': 'After Work',
    'high-energy': 'High Energy',
    family: 'Family Friendly',
    premium: 'Premium',
    networking: 'Networking'
  }[vibeMode];

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
        <div className="discovery-studio">
          <div className="discovery-copy">
            <span className="discovery-kicker">Discovery Studio</span>
            <h2>Find events by momentum, urgency, and value</h2>
            <p>Use quick-pick lenses to surface the events people are most likely to book next.</p>
          </div>

          <div className="discovery-controls">
            <div className="discovery-chips">
              <button
                className={`discovery-chip ${discoveryMode === 'smart' ? 'active' : ''}`}
                onClick={() => setDiscoveryMode('smart')}
              >
                ✨ Smart Picks
              </button>
              <button
                className={`discovery-chip ${discoveryMode === 'weekend' ? 'active' : ''}`}
                onClick={() => setDiscoveryMode('weekend')}
              >
                🎊 Weekend Plans
              </button>
              <button
                className={`discovery-chip ${discoveryMode === 'budget' ? 'active' : ''}`}
                onClick={() => setDiscoveryMode('budget')}
              >
                💸 Budget Friendly
              </button>
              <button
                className={`discovery-chip ${discoveryMode === 'almost-full' ? 'active' : ''}`}
                onClick={() => setDiscoveryMode('almost-full')}
              >
                🔥 Almost Gone
              </button>
              <button
                className={`discovery-chip ${discoveryMode === 'soon' ? 'active' : ''}`}
                onClick={() => setDiscoveryMode('soon')}
              >
                ⏰ Happening Soon
              </button>
              <button
                className={`discovery-chip ${discoveryMode === 'all' ? 'active' : ''}`}
                onClick={() => setDiscoveryMode('all')}
              >
                🌐 View All
              </button>
            </div>

            <label className="sort-control">
              <span>Sort</span>
              <select value={sortMode} onChange={(e) => setSortMode(e.target.value as SortMode)}>
                <option value="smart">Smart Match</option>
                <option value="date">Soonest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </label>
          </div>

          <div className="discovery-metrics">
            <div className="discovery-metric">
              <span className="metric-label">Active Lens</span>
              <strong>{activeDiscoveryLabel}</strong>
            </div>
            <div className="discovery-metric">
              <span className="metric-label">Active Vibe</span>
              <strong>{activeVibeLabel}</strong>
            </div>
            <div className="discovery-metric">
              <span className="metric-label">Matching Events</span>
              <strong>{filteredEvents.length}</strong>
            </div>
            <div className="discovery-metric">
              <span className="metric-label">High Demand</span>
              <strong>{highDemandCount}</strong>
            </div>
            <div className="discovery-metric">
              <span className="metric-label">Average Price</span>
              <strong>${averagePrice}</strong>
            </div>
          </div>
        </div>

        <div className="search-filter-section">
          <div className="vibe-studio">
            <div className="vibe-copy">
              <span className="vibe-kicker">Vibe Match</span>
              <h3>Browse by mood, not only by category</h3>
              <p>Switch between intent-based vibes to discover the right event for the moment.</p>
            </div>
            <div className="vibe-chips">
              <button className={`vibe-chip ${vibeMode === 'all' ? 'active' : ''}`} onClick={() => setVibeMode('all')}>Any Vibe</button>
              <button className={`vibe-chip ${vibeMode === 'after-work' ? 'active' : ''}`} onClick={() => setVibeMode('after-work')}>🌆 After Work</button>
              <button className={`vibe-chip ${vibeMode === 'high-energy' ? 'active' : ''}`} onClick={() => setVibeMode('high-energy')}>⚡ High Energy</button>
              <button className={`vibe-chip ${vibeMode === 'family' ? 'active' : ''}`} onClick={() => setVibeMode('family')}>👨‍👩‍👧 Family</button>
              <button className={`vibe-chip ${vibeMode === 'premium' ? 'active' : ''}`} onClick={() => setVibeMode('premium')}>✨ Premium</button>
              <button className={`vibe-chip ${vibeMode === 'networking' ? 'active' : ''}`} onClick={() => setVibeMode('networking')}>🤝 Networking</button>
            </div>
          </div>

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
            {isAuthenticated && (
              <button
                className={`filter-btn wishlist-filter-btn ${showWishlistOnly ? 'active' : ''}`}
                onClick={() => setShowWishlistOnly((prev) => !prev)}
              >
                {showWishlistOnly ? '❤️ Wishlist Only' : '🤍 Wishlist'}
              </button>
            )}
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

        {comparedEvents.length > 0 && (
          <div className="compare-launchpad">
            <div>
              <span className="compare-launch-kicker">Compare Ready</span>
              <h3>{comparedEvents.length} event{comparedEvents.length > 1 ? 's' : ''} selected</h3>
              <p>Open the Compare page for a full side-by-side breakdown.</p>
            </div>
            <div className="compare-launch-actions">
              <button className="btn-secondary" onClick={clearComparedEvents}>Clear</button>
              <button className="btn-primary" onClick={openComparePage}>Open Compare Page</button>
            </div>
          </div>
        )}

        {dealRadarEvents.length > 0 && (
          <section className="deal-radar-section">
            <div className="deal-radar-header">
              <span className="deal-radar-kicker">Deal Radar</span>
              <h3>Best value events this week</h3>
              <p>Ranked by price value, urgency, and demand so you can book smarter.</p>
            </div>

            <div className="deal-radar-grid">
              {dealRadarEvents.map((event) => (
                <article key={event._id} className="deal-radar-card">
                  <img src={event.image} alt={event.title} />
                  <div className="deal-radar-body">
                    <div className="deal-radar-top">
                      <strong>{event.title}</strong>
                      <span>{event.category}</span>
                    </div>
                    <p>{new Date(event.date).toLocaleDateString()} • {event.time}</p>
                    <div className="deal-radar-meta">
                      <span>Price: ${event.price}</span>
                      <span>Seats left: {event.availableSeats}</span>
                    </div>
                    <button className="btn-primary" onClick={() => handleBook(event._id)}>
                      Book Deal
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

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
                onWishlistChange={handleWishlistChange}
                onToggleCompare={handleToggleCompare}
                isCompared={comparedEvents.some((item) => item._id === event._id)}
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
