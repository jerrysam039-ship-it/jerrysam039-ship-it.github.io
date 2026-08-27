import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import './IntroSequence.css';

const IntroSequence = ({ onComplete }) => {
  const containerRef = useRef(null);
  const text1Ref = useRef(null);
  const text2Ref = useRef(null);
  const text3Ref = useRef(null);
  const text4Ref = useRef(null);
  const text5Ref = useRef(null);
  const nameRef = useRef(null);
  const titleRef = useRef(null);
  const philosophyRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          gsap.to(containerRef.current, {
            opacity: 0,
            duration: 1,
            ease: 'power2.inOut',
            onComplete: onComplete
          });
        }
      });

      const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (isReducedMotion) {
        onComplete();
        return;
      }

      // Sequence
      tl.to(text1Ref.current, { opacity: 1, duration: 0.5 })
        .to(text1Ref.current, { opacity: 0, duration: 0.3, delay: 0.2 })
        .to(text2Ref.current, { opacity: 1, duration: 0.3 })
        .to(text2Ref.current, { opacity: 0, duration: 0.2, delay: 0.1 })
        .to(text3Ref.current, { opacity: 1, duration: 0.3 })
        .to(text3Ref.current, { opacity: 0, duration: 0.2, delay: 0.1 })
        .to(text4Ref.current, { opacity: 1, duration: 0.3 })
        .to(text4Ref.current, { opacity: 0, duration: 0.2, delay: 0.1 })
        .to(text5Ref.current, { opacity: 1, duration: 0.3 })
        .to(text5Ref.current, { opacity: 0, duration: 0.2, delay: 0.1 })
        
        // Name & Details reveal
        .to(nameRef.current, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' })
        .to(titleRef.current, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6')
        
        // Hold, then exit Name & Details
        .to([nameRef.current, titleRef.current], { 
          opacity: 0, 
          y: -30, 
          duration: 0.8, 
          ease: 'power2.in'
        }, '+=1')
        
        // Philosophy reveal (BUILDING CONNECTIONS)
        .to(philosophyRef.current, { opacity: 1, scale: 1, duration: 1, ease: 'power3.out' })
        
        // Hold, then exit Philosophy
        .to(philosophyRef.current, { 
          opacity: 0, 
          y: -30, 
          duration: 1, 
          ease: 'power2.in'
        }, '+=1');
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, [onComplete]);

  return (
    <div className="intro-sequence" ref={containerRef}>
      <div className="intro-system-text technical-text">
        <div ref={text1Ref} className="intro-step">INITIALIZING</div>
        <div ref={text2Ref} className="intro-step">SYSTEM</div>
        <div ref={text3Ref} className="intro-step">NETWORK</div>
        <div ref={text4Ref} className="intro-step">PROJECTS</div>
        <div ref={text5Ref} className="intro-step">EXPERIENCE</div>
      </div>
      
      <div className="intro-main-content">
        <h1 ref={nameRef} className="display-text intro-name">CYRIL SHAM J</h1>
        <div ref={titleRef} className="intro-title technical-text">
          <span>COMPUTER SCIENCE</span>
          <span>NETWORK ENGINEERING</span>
          <span>DIGITAL SYSTEMS</span>
        </div>
        
        <div ref={philosophyRef} className="intro-philosophy display-text">
          BUILDING CONNECTIONS
        </div>
      </div>
    </div>
  );
};

export default IntroSequence;
