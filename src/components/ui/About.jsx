import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useStore } from '../../utils/store';
import './About.css';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const sectionRef = useRef(null);
  const imageRef = useRef(null);
  const titleRef = useRef(null);
  const metaRef = useRef(null);

  useEffect(() => {
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let ctx = gsap.context(() => {
      // Trigger state change
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top center",
        end: "bottom center",
        onEnter: () => useStore.getState().setSceneState('ABOUT'),
        onEnterBack: () => useStore.getState().setSceneState('ABOUT'),
      });

      if (!isReducedMotion) {
        // Cinematic Entrance
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
          }
        });

        tl.fromTo(imageRef.current, { clipPath: 'inset(100% 0 0 0)', scale: 1.1 }, { clipPath: 'inset(0% 0 0 0)', scale: 1, duration: 1.5, ease: 'power3.out' })
          .fromTo(titleRef.current, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }, '-=1')
          .fromTo(metaRef.current.children, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out' }, '-=0.8');

        // Parallax scroll effect
        gsap.to(imageRef.current, {
          yPercent: 15,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="about-section" ref={sectionRef}>
      <div className="container about-container">
        
        <div className="about-image-column">
          <div className="about-image-wrapper" ref={imageRef} data-cursor="EXPLORE">
            <img src="/Cyril.jpeg" alt="Cyril Sham J - Portrait" className="about-image" />
            <div className="about-image-overlay"></div>
          </div>
        </div>

        <div className="about-content-column">
          <h2 className="display-text about-title" ref={titleRef}>
            THE PERSON BEHIND THE SYSTEM
          </h2>
          
          <div className="about-metadata" ref={metaRef}>
            <div className="meta-item">
              <span className="meta-label technical-text">IDENTITY</span>
              <span className="meta-value">CYRIL SHAM J</span>
            </div>
            <div className="meta-item">
              <span className="meta-label technical-text">FIELD</span>
              <span className="meta-value">COMPUTER SCIENCE</span>
            </div>
            <div className="meta-item">
              <span className="meta-label technical-text">CURRENT STAGE</span>
              <span className="meta-value">FINAL YEAR</span>
            </div>
            <div className="meta-item">
              <span className="meta-label technical-text">INSTITUTION</span>
              <span className="meta-value">LOYOLA COLLEGE OF ARTS AND SCIENCE</span>
            </div>
            <div className="meta-item">
              <span className="meta-label technical-text">CAMPUS</span>
              <span className="meta-value">METTALA</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default About;
