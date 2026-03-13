import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import Countdown from './Countdown';
import './EventCard.css';

interface EventCardProps {
  event: {
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
  };
  onBook: (eventId: string) => void;
  onDelete?: (eventId: string) => void;
  onEdit?: (eventId: string) => void;
  isAdmin?: boolean;
}

const EventCard: React.FC<EventCardProps> = ({ event, onBook, onDelete, onEdit, isAdmin }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [key, setKey] = useState(0);

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(cardRef.current,
        { opacity: 0, y: 40 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.6, 
          ease: 'power3.out'
        }
      );
    }
  }, []);

  // Force re-render when event date changes
  useEffect(() => {
    setKey(prev => prev + 1);
  }, [event.date]);

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      music: '🎵',
      sports: '⚽',
      tech: '💻',
      business: '💼',
      other: '🎉'
    };
    return icons[category] || '🎉';
  };

  const getCapacityPercentage = () => {
    return ((event.capacity - event.availableSeats) / event.capacity) * 100;
  };

  const getCapacityColor = () => {
    const percentage = getCapacityPercentage();
    if (percentage >= 80) return '#f56565'; // Red
    if (percentage >= 50) return '#ed8936'; // Orange
    return '#48bb78'; // Green
  };

  const isAlmostFull = () => {
    return getCapacityPercentage() >= 80;
  };

  return (
    <div ref={cardRef} className="event-card card">
      <div className="event-image-container">
        <div className="event-category-badge">
          {getCategoryIcon(event.category)} {event.category}
        </div>
        {isAlmostFull() && (
          <div className="almost-full-badge">
            🔥 Almost Full!
          </div>
        )}
        <img src={event.image} alt={event.title} className="event-image" />
      </div>
      
      <h3>{event.title}</h3>
      <p className="description">{event.description}</p>
      
      <Countdown key={`countdown-${event._id}-${key}`} targetDate={event.date} />
      
      <div className="event-details">
        <span>📅 {new Date(event.date).toLocaleDateString()}</span>
        <span>🕐 {event.time}</span>
        <span>📍 {event.location}</span>
      </div>
      
      <div className="capacity-section">
        <div className="capacity-info">
          <span className="capacity-label">Capacity</span>
          <span className="capacity-numbers">
            {event.capacity - event.availableSeats}/{event.capacity}
          </span>
        </div>
        <div className="capacity-bar">
          <div 
            className="capacity-fill" 
            style={{ 
              width: `${getCapacityPercentage()}%`,
              background: getCapacityColor()
            }}
          ></div>
        </div>
      </div>
      
      <div className="event-footer">
        <span className="price">${event.price}</span>
        <span className="seats">{event.availableSeats} seats left</span>
      </div>
      
      <div className="event-actions">
        {!isAdmin ? (
          <button className="btn-primary w-full" onClick={() => onBook(event._id)}>
            Book Now
          </button>
        ) : (
          <>
            <button className="btn-primary" onClick={() => onBook(event._id)}>
              Book Now
            </button>
            {onEdit && (
              <button className="btn-secondary" onClick={() => onEdit(event._id)}>
                Edit
              </button>
            )}
            {onDelete && (
              <button className="btn-danger" onClick={() => onDelete(event._id)}>
                Delete
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default EventCard;
