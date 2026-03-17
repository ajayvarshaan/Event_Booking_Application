import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventAPI } from '../services/api';
import { fadeInUp, staggerFadeIn } from '../animations/gsapAnimations';
import './PlanEvening.css';

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

type EveningVibe = 'any' | 'high-energy' | 'networking' | 'chill' | 'after-work';
type PlanMode = 'flexible' | 'single-night';

const PlanEvening: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [vibe, setVibe] = useState<EveningVibe>('any');
  const [mode, setMode] = useState<PlanMode>('flexible');
  const [maxBudget, setMaxBudget] = useState(120);
  const [startHour, setStartHour] = useState(17);
  const [shareState, setShareState] = useState<'idle' | 'copied' | 'failed'>('idle');
  const navigate = useNavigate();
  const titleRef = useRef<HTMLHeadingElement>(null);
  const planRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await eventAPI.getAll();
        setEvents(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Failed to fetch events for evening planner:', error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    fadeInUp(titleRef.current);
  }, []);

  useEffect(() => {
    if (planRef.current) {
      const cards = planRef.current.querySelectorAll('.plan-event-card');
      if (cards.length > 0) {
        staggerFadeIn(cards, 0.12);
      }
    }
  }, [vibe, maxBudget, startHour, events]);

  const parseEventDateTime = (event: Event) => {
    const base = new Date(event.date);
    const [hoursStr, minutesStr] = event.time.split(':');
    const hours = Number(hoursStr) || 0;
    const minutes = Number(minutesStr) || 0;
    base.setHours(hours, minutes, 0, 0);
    return base;
  };

  const getDemandRatio = (event: Event) => {
    if (event.capacity <= 0) return 0;
    return (event.capacity - event.availableSeats) / event.capacity;
  };

  const vibeMatch = (event: Event) => {
    if (vibe === 'any') return true;
    if (vibe === 'high-energy') return event.category === 'music' || event.category === 'sports';
    if (vibe === 'networking') return event.category === 'business' || event.category === 'tech';
    if (vibe === 'chill') return event.category === 'other' || event.price <= 40;
    if (vibe === 'after-work') {
      const dt = parseEventDateTime(event);
      return dt.getHours() >= 17;
    }
    return true;
  };

  const plannedEvents = useMemo(() => {
    const now = Date.now();

    const upcoming = events
      .filter((event) => {
        const dt = parseEventDateTime(event);
        const hours = dt.getHours();
        return dt.getTime() > now && dt.getTime() - now <= 1000 * 60 * 60 * 24 * 14 && hours >= startHour;
      })
      .filter((event) => event.price <= maxBudget)
      .filter((event) => vibeMatch(event));

    const scored = upcoming
      .map((event) => {
        const dt = parseEventDateTime(event);
        const daysAway = Math.max((dt.getTime() - now) / (1000 * 60 * 60 * 24), 0);
        const soonScore = Math.max(0, 1 - Math.min(daysAway, 14) / 14);
        const valueScore = Math.max(0, 1 - Math.min(event.price, maxBudget) / Math.max(maxBudget, 1));
        const demandScore = getDemandRatio(event);
        const totalScore = soonScore * 45 + valueScore * 35 + demandScore * 20;
        return { event, score: Math.round(totalScore * 100) / 100, dateTime: dt };
      })
      .sort((a, b) => b.score - a.score);

    if (mode === 'single-night') {
      const byDay = new Map<string, typeof scored>();

      for (const item of scored) {
        const dayKey = item.dateTime.toDateString();
        const bucket = byDay.get(dayKey);
        if (bucket) {
          bucket.push(item);
        } else {
          byDay.set(dayKey, [item]);
        }
      }

      let bestDayPlan: typeof scored = [];
      let bestDayScore = -1;

      for (const [, dayItems] of byDay) {
        const topForDay = [...dayItems]
          .sort((a, b) => b.score - a.score)
          .slice(0, 3)
          .sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime());

        const total = topForDay.reduce((sum, item) => sum + item.score, 0);
        if (topForDay.length > 0 && total > bestDayScore) {
          bestDayScore = total;
          bestDayPlan = topForDay;
        }
      }

      return bestDayPlan;
    }

    const itinerary: typeof scored = [];
    const occupiedDays = new Set<string>();

    for (const item of scored) {
      const dayKey = item.dateTime.toDateString();
      if (occupiedDays.has(dayKey)) continue;
      itinerary.push(item);
      occupiedDays.add(dayKey);
      if (itinerary.length >= 3) break;
    }

    return itinerary;
  }, [events, maxBudget, startHour, vibe, mode]);

  const handleSharePlan = async () => {
    if (plannedEvents.length === 0) {
      setShareState('failed');
      return;
    }

    const headline =
      mode === 'single-night' ? 'My EventHub single-night plan' : 'My EventHub evening plan';
    const lines = plannedEvents.map(
      ({ event }) =>
        `- ${event.title} | ${new Date(event.date).toLocaleDateString()} ${event.time} | ${event.location} | $${event.price}`
    );
    const summary = `${headline}\nBudget cap: $${maxBudget} | Start after: ${String(startHour).padStart(2, '0')}:00 | Vibe: ${vibe}\n\n${lines.join('\n')}`;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(summary);
      } else {
        throw new Error('Clipboard API unavailable');
      }
      setShareState('copied');
    } catch {
      setShareState('failed');
    }

    window.setTimeout(() => setShareState('idle'), 1800);
  };

  const estimatedSpend = plannedEvents.reduce((sum, item) => sum + item.event.price, 0);

  if (loading) {
    return <div className="loading">Building your evening planner...</div>;
  }

  return (
    <div className="plan-evening-page">
      <div className="container">
        <div className="plan-header">
          <h1 ref={titleRef}>Plan My Evening</h1>
          <p>Generate a smart event itinerary by vibe, budget, and preferred start time.</p>
        </div>

        <div className="planner-controls">
          <div className="planner-control planner-mode">
            <span>Itinerary Mode</span>
            <div className="mode-toggle">
              <button
                type="button"
                className={mode === 'flexible' ? 'mode-btn active' : 'mode-btn'}
                onClick={() => setMode('flexible')}
              >
                Flexible
              </button>
              <button
                type="button"
                className={mode === 'single-night' ? 'mode-btn active' : 'mode-btn'}
                onClick={() => setMode('single-night')}
              >
                One Night
              </button>
            </div>
          </div>

          <label className="planner-control">
            <span>Vibe</span>
            <select value={vibe} onChange={(e) => setVibe(e.target.value as EveningVibe)}>
              <option value="any">Any</option>
              <option value="high-energy">High Energy</option>
              <option value="networking">Networking</option>
              <option value="chill">Chill</option>
              <option value="after-work">After Work</option>
            </select>
          </label>

          <label className="planner-control">
            <span>Max Budget (${maxBudget})</span>
            <input
              type="range"
              min={20}
              max={250}
              step={5}
              value={maxBudget}
              onChange={(e) => setMaxBudget(Number(e.target.value))}
            />
          </label>

          <label className="planner-control">
            <span>Start After ({String(startHour).padStart(2, '0')}:00)</span>
            <input
              type="range"
              min={15}
              max={22}
              step={1}
              value={startHour}
              onChange={(e) => setStartHour(Number(e.target.value))}
            />
          </label>
        </div>

        <div className="planner-summary">
          <div className="summary-item">
            <span>Selected Events</span>
            <strong>{plannedEvents.length}</strong>
          </div>
          <div className="summary-item">
            <span>Estimated Spend</span>
            <strong>${estimatedSpend.toFixed(2)}</strong>
          </div>
          <div className="summary-item">
            <span>Vibe</span>
            <strong>{vibe === 'any' ? 'Any' : vibe.replace('-', ' ')}</strong>
          </div>
          <div className="summary-item">
            <span>Mode</span>
            <strong>{mode === 'single-night' ? 'One Night' : 'Flexible'}</strong>
          </div>
        </div>

        <div className="planner-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={handleSharePlan}
            disabled={plannedEvents.length === 0}
          >
            Share This Plan
          </button>
          {shareState === 'copied' && <span className="share-status success">Plan copied</span>}
          {shareState === 'failed' && (
            <span className="share-status error">Unable to copy right now</span>
          )}
        </div>

        {plannedEvents.length === 0 ? (
          <div className="plan-empty">
            <h2>No matching evening plan right now</h2>
            <p>Try a higher budget or a broader vibe to discover more options.</p>
          </div>
        ) : (
          <div ref={planRef} className="plan-grid">
            {plannedEvents.map(({ event, score }) => (
              <article key={event._id} className="plan-event-card">
                <img src={event.image} alt={event.title} className="plan-event-image" />
                <div className="plan-event-body">
                  <div className="plan-event-top">
                    <span className="plan-chip">{event.category}</span>
                    <span className="plan-score">Fit {Math.round(score)}%</span>
                  </div>
                  <h3>{event.title}</h3>
                  <p>{event.description}</p>
                  <div className="plan-event-meta">
                    <span>📅 {new Date(event.date).toLocaleDateString()}</span>
                    <span>🕐 {event.time}</span>
                    <span>📍 {event.location}</span>
                    <span>💰 ${event.price}</span>
                  </div>
                  <button className="btn-primary" onClick={() => navigate(`/book/${event._id}`)}>
                    Book This Plan
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlanEvening;
