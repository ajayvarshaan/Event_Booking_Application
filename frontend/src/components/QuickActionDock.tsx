import React, { useEffect, useMemo, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { animateDockItems, animateFloatingDock, dockHoverLift } from '../animations/gsapAnimations';
import './QuickActionDock.css';

const COMPARE_STORAGE_KEY = 'eventhub.compareEvents';

const QuickActionDock: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  const dockRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLAnchorElement | null>>([]);

  const compareCount = useMemo(() => {
    try {
      const raw = localStorage.getItem(COMPARE_STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed.length : 0;
    } catch {
      return 0;
    }
  }, [location.pathname]);

  useEffect(() => {
    if (!isAuthenticated) return;

    animateFloatingDock(dockRef.current);
    const items = itemRefs.current.filter(Boolean) as HTMLAnchorElement[];
    animateDockItems(items);
    items.forEach((item) => dockHoverLift(item));
  }, [isAuthenticated, location.pathname]);

  if (!isAuthenticated) {
    return null;
  }

  const items = [
    { to: '/home', label: 'Home', icon: '⌂' },
    { to: '/wishlist', label: 'Wishlist', icon: '♡' },
    { to: '/compare', label: 'Compare', icon: '≡', badge: compareCount > 0 ? String(compareCount) : undefined },
    { to: '/my-bookings', label: 'Bookings', icon: '▣' }
  ];

  if (user?.role === 'admin') {
    items.push({ to: '/dashboard', label: 'Admin', icon: '◫' });
  }

  return (
    <div ref={dockRef} className="quick-dock" aria-label="Quick actions dock">
      {items.map((item, index) => {
        const active = location.pathname === item.to;
        return (
          <Link
            key={item.to}
            ref={(element) => {
              itemRefs.current[index] = element;
            }}
            to={item.to}
            className={`quick-dock-item ${active ? 'active' : ''}`}
          >
            <span className="quick-dock-icon">{item.icon}</span>
            <span className="quick-dock-label">{item.label}</span>
            {item.badge && <span className="quick-dock-badge">{item.badge}</span>}
          </Link>
        );
      })}
    </div>
  );
};

export default QuickActionDock;
