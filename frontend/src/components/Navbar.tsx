import React, { useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { slideInLeft } from '../animations/gsapAnimations';
import './Navbar.css';

const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    slideInLeft(navRef.current);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav ref={navRef} className="navbar">
      <div className="container flex justify-center items-center">
        <Link to="/home" className="logo">
          🎉 EventHub
        </Link>
        <div className="nav-links">
          <Link to="/home">Events</Link>
          {isAuthenticated && <Link to="/my-bookings">My Bookings</Link>}
          {isAuthenticated && user?.role === 'admin' && (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/activity-log">User Activity</Link>
              <Link to="/create-event">Create Event</Link>
            </>
          )}
        </div>
        <div className="nav-auth">
          {isAuthenticated ? (
            <>
              <div className="user-avatar">
                {getInitials(user?.name || 'U')}
              </div>
              <span className="user-name">{user?.name}</span>
              <button className="btn-secondary" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-secondary">
                Login
              </Link>
              <Link to="/register" className="btn-primary">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
