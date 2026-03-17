import React, { useEffect, useState } from 'react';
import { wishlistAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { pulseWithColor } from '../animations/gsapAnimations';
import './WishlistButton.css';

interface WishlistButtonProps {
  eventId: string;
  onWishlistChange?: (eventId: string, isInWishlist: boolean) => void;
}

const WishlistButton: React.FC<WishlistButtonProps> = ({ eventId, onWishlistChange }) => {
  const { isAuthenticated } = useAuth();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [loading, setLoading] = useState(false);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isAuthenticated) {
      checkWishlist();
    }
  }, [eventId, isAuthenticated]);

  useEffect(() => {
    if (isInWishlist && buttonRef.current) {
      pulseWithColor(buttonRef.current, '#f5576c');
    }
  }, [isInWishlist]);

  const checkWishlist = async () => {
    try {
      const response = await wishlistAPI.check(eventId);
      const nextState = response.data.isInWishlist;
      setIsInWishlist(nextState);
      onWishlistChange?.(eventId, nextState);
    } catch (error) {
      console.error('Failed to check wishlist:', error);
    }
  };

  const handleToggleWishlist = async () => {
    if (!isAuthenticated) return;

    setLoading(true);
    try {
      let nextState = isInWishlist;
      if (isInWishlist) {
        await wishlistAPI.remove(eventId);
        nextState = false;
      } else {
        await wishlistAPI.add(eventId);
        nextState = true;
      }
      setIsInWishlist(nextState);
      onWishlistChange?.(eventId, nextState);
    } catch (error) {
      console.error('Failed to update wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <button
      ref={buttonRef}
      className={`wishlist-btn ${isInWishlist ? 'active' : ''}`}
      onClick={handleToggleWishlist}
      disabled={loading}
      title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      {isInWishlist ? '❤️' : '🤍'}
    </button>
  );
};

export default WishlistButton;
