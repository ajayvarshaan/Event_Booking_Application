import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import './Toast.css';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  const toastRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (toastRef.current) {
      gsap.fromTo(
        toastRef.current,
        { x: 400, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' }
      );

      const timer = setTimeout(() => {
        gsap.to(toastRef.current, {
          x: 400,
          opacity: 0,
          duration: 0.3,
          ease: 'power2.in',
          onComplete: onClose
        });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [onClose]);

  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ'
  };

  return (
    <div ref={toastRef} className={`toast toast-${type}`}>
      <span className="toast-icon">{icons[type]}</span>
      <span className="toast-message">{message}</span>
    </div>
  );
};

export default Toast;
