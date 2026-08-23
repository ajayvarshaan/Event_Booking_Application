import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import './CustomCursor.css';

const CustomCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    // Detect touch device
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      setIsTouch(true);
      return;
    }

    const dot = dotRef.current;
    const ring = ringRef.current;

    if (!dot || !ring) return;

    // Center initial placement
    gsap.set([dot, ring], { xPercent: -50, yPercent: -50, opacity: 0 });

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let isVisible = false;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) {
        gsap.to([dot, ring], { opacity: 1, duration: 0.3 });
        isVisible = true;
      }

      // Dot follows cursor immediately
      gsap.to(dot, {
        x: mouseX,
        y: mouseY,
        duration: 0.1,
        ease: 'power2.out'
      });

      // Ring trails smoothly with spring friction
      gsap.to(ring, {
        x: mouseX,
        y: mouseY,
        duration: 0.35,
        ease: 'power3.out'
      });
    };

    const onMouseDown = () => {
      setIsClicked(true);
      gsap.to(ring, { scale: 0.75, duration: 0.15 });
    };

    const onMouseUp = () => {
      setIsClicked(false);
      gsap.to(ring, { scale: isHovered ? 2.2 : 1, duration: 0.2, ease: 'back.out(2)' });
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const isInteractive =
        target.closest('button') ||
        target.closest('a') ||
        target.closest('input') ||
        target.closest('select') ||
        target.closest('textarea') ||
        target.closest('.card') ||
        target.closest('.event-card') ||
        target.closest('.chip') ||
        target.closest('.filter-btn') ||
        target.closest('.dock-item') ||
        target.closest('[data-cursor="pointer"]');

      if (isInteractive) {
        setIsHovered(true);
        gsap.to(ring, {
          scale: 2.2,
          borderColor: 'rgba(240, 147, 251, 0.9)',
          backgroundColor: 'rgba(102, 126, 234, 0.12)',
          duration: 0.25,
          ease: 'power2.out'
        });
        gsap.to(dot, {
          scale: 0.5,
          backgroundColor: '#f093fb',
          duration: 0.2
        });
      } else {
        setIsHovered(false);
        gsap.to(ring, {
          scale: 1,
          borderColor: 'rgba(0, 200, 255, 0.6)',
          backgroundColor: 'transparent',
          duration: 0.25,
          ease: 'power2.out'
        });
        gsap.to(dot, {
          scale: 1,
          backgroundColor: '#00c8ff',
          duration: 0.2
        });
      }
    };

    const onMouseLeave = () => {
      gsap.to([dot, ring], { opacity: 0, duration: 0.3 });
      isVisible = false;
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mouseover', onMouseOver);
    document.body.addEventListener('mouseleave', onMouseLeave);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('mouseover', onMouseOver);
      document.body.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [isHovered]);

  if (isTouch) return null;

  return (
    <>
      <div ref={dotRef} className={`custom-cursor-dot ${isClicked ? 'clicked' : ''}`} />
      <div ref={ringRef} className={`custom-cursor-ring ${isHovered ? 'hovered' : ''}`} />
    </>
  );
};

export default CustomCursor;
