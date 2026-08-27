import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './AboutPlaceholder.css';

gsap.registerPlugin(ScrollTrigger);

const AboutPlaceholder = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!isReducedMotion) {
      gsap.fromTo(titleRef.current, 
        { y: 50, opacity: 0 },
        {
          y: 0, 
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
          }
        }
      );

      gsap.fromTo(contentRef.current, 
        { y: 30, opacity: 0 },
        {
          y: 0, 
          opacity: 1,
          duration: 1,
          delay: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
          }
        }
      );
    }
  }, []);

  return (
    <section className="about-section" ref={sectionRef}>
      <div className="container">
        <h2 className="display-text about-title" ref={titleRef}>
          THE PERSON BEHIND THE SYSTEM
        </h2>
        <div className="about-content" ref={contentRef}>
          <p className="technical-text placeholder-text">
            [Detailed story about Computer Science, development work, and network engineering to be supplied.]
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutPlaceholder;
