import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Compare.css';

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

const COMPARE_STORAGE_KEY = 'eventhub.compareEvents';

const Compare: React.FC = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>(() => {
    try {
      const raw = localStorage.getItem(COMPARE_STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const saveEvents = (nextEvents: Event[]) => {
    setEvents(nextEvents);
    localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(nextEvents));
  };

  const removeEvent = (eventId: string) => {
    saveEvents(events.filter((event) => event._id !== eventId));
  };

  const clearAll = () => {
    saveEvents([]);
  };

  const demandRatio = (event: Event) => {
    if (event.capacity <= 0) {
      return 0;
    }

    return (event.capacity - event.availableSeats) / event.capacity;
  };

  const bestValueEvent = useMemo(() => {
    if (events.length === 0) return null;
    return [...events].sort((a, b) => a.price - b.price)[0];
  }, [events]);

  const mostAvailableEvent = useMemo(() => {
    if (events.length === 0) return null;
    return [...events].sort((a, b) => b.availableSeats - a.availableSeats)[0];
  }, [events]);

  const mostDemandedEvent = useMemo(() => {
    if (events.length === 0) return null;
    return [...events].sort((a, b) => demandRatio(b) - demandRatio(a))[0];
  }, [events]);

  if (events.length === 0) {
    return (
      <div className="compare-page">
        <div className="container">
          <div className="compare-empty">
            <h1>No Events To Compare</h1>
            <p>Add events from Home using Compare, then come back here for side-by-side analysis.</p>
            <Link to="/home" className="btn-primary">Back To Home</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="compare-page">
      <div className="container">
        <div className="compare-page-header">
          <div>
            <span className="compare-page-kicker">Compare Center</span>
            <h1>Compare Events Side By Side</h1>
            <p>Choose the event that best fits your budget, timing, and seat availability.</p>
          </div>
          <button className="compare-clear" onClick={clearAll}>Clear All</button>
        </div>

        <div className="compare-highlights">
          <div className="highlight-card">
            <span>Best Value</span>
            <strong>{bestValueEvent?.title || 'N/A'}</strong>
          </div>
          <div className="highlight-card">
            <span>Most Seats Left</span>
            <strong>{mostAvailableEvent?.title || 'N/A'}</strong>
          </div>
          <div className="highlight-card">
            <span>Highest Demand</span>
            <strong>{mostDemandedEvent?.title || 'N/A'}</strong>
          </div>
        </div>

        <div className="compare-page-grid">
          {events.map((event) => (
            <div key={event._id} className="compare-page-card">
              <img src={event.image} alt={event.title} className="compare-image" />
              <div className="compare-card-body">
                <div className="compare-card-header">
                  <span className="compare-tag">{event.category}</span>
                  <button className="compare-remove" onClick={() => removeEvent(event._id)}>Remove</button>
                </div>

                <h3>{event.title}</h3>
                <p>{event.description}</p>

                <div className="compare-rows">
                  <div className="compare-row"><span>Date</span><strong>{new Date(event.date).toLocaleDateString()}</strong></div>
                  <div className="compare-row"><span>Time</span><strong>{event.time}</strong></div>
                  <div className="compare-row"><span>Location</span><strong>{event.location}</strong></div>
                  <div className="compare-row"><span>Price</span><strong>${event.price}</strong></div>
                  <div className="compare-row"><span>Seats Left</span><strong>{event.availableSeats}</strong></div>
                  <div className="compare-row"><span>Demand</span><strong>{Math.round(demandRatio(event) * 100)}%</strong></div>
                </div>

                <button className="btn-primary compare-book" onClick={() => navigate(`/book/${event._id}`)}>
                  Book This Event
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Compare;
