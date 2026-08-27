import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import './CustomCursor.css';

const CustomCursor = () => {
  const cursorRef = useRef(null);
  const [cursorState, setCursorState] = useState('DEFAULT'); // DEFAULT, LINK, PROJECT, IMAGE, NAVIGATION
  const [text, setText] = useState('');

  useEffect(() => {
    // Mobile check (prefers-reduced-motion or touch fine)
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    if (isTouchDevice) return;

    // Center cursor initially by moving it off screen until first move
    gsap.set(cursorRef.current, { xPercent: -50, yPercent: -50, opacity: 0 });

    let isFirstMove = true;

    const onMouseMove = (e) => {
      if (isFirstMove) {
        gsap.to(cursorRef.current, { opacity: 1, duration: 0.3 });
        isFirstMove = false;
      }
      gsap.to(cursorRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.15,
        ease: "power2.out"
      });
    };

    const handleMouseOver = (e) => {
      const target = e.target.closest('a, button, [data-cursor]');
      if (!target) {
        setCursorState('DEFAULT');
        setText('');
        return;
      }
      
      const type = target.getAttribute('data-cursor') || 'LINK';
      setCursorState(type);
      
      if (type === 'PROJECT' || type === 'EXPLORE') setText('EXPLORE');
      else if (type === 'IMAGE' || type === 'VIEW') setText('VIEW');
      else if (type === 'NAVIGATION' || type === 'OPEN') setText('OPEN');
      else if (type === 'INSPECT') setText('INSPECT');
      else if (type === 'TRACE') setText('TRACE');
      else if (type === 'SCROLL') setText('SCROLL');
      else if (type === 'DISCOVER') setText('DISCOVER');
      else if (type === 'CONNECT') setText('CONNECT');
      else if (type === 'FOLLOW') setText('FOLLOW');
      else setText('');
    };

    const handleCustomCursor = (e) => {
      const type = e.detail;
      if (!type) {
        setCursorState('DEFAULT');
        setText('');
        return;
      }
      setCursorState(type);
      if (type === 'PROJECT' || type === 'EXPLORE') setText('EXPLORE');
      else if (type === 'IMAGE' || type === 'VIEW') setText('VIEW');
      else if (type === 'NAVIGATION' || type === 'OPEN') setText('OPEN');
      else if (type === 'INSPECT') setText('INSPECT');
      else if (type === 'TRACE') setText('TRACE');
      else if (type === 'SCROLL') setText('SCROLL');
      else if (type === 'DISCOVER') setText('DISCOVER');
      else if (type === 'CONNECT') setText('CONNECT');
      else if (type === 'FOLLOW') setText('FOLLOW');
      else setText('');
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('set-cursor', handleCustomCursor);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('set-cursor', handleCustomCursor);
    };
  }, []);

  const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
  if (isTouchDevice) return null;

  return (
    <div className={`custom-cursor state-${cursorState.toLowerCase()}`} ref={cursorRef}>
      <div className="cursor-dot"></div>
      <div className="cursor-text">{text}</div>
    </div>
  );
};

export default CustomCursor;
