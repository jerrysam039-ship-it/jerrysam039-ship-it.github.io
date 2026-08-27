import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useStore } from '../../utils/store';
import './Hero.css';

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const tagsRef = useRef(null);
  const statementRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top center",
        end: "bottom center",
        onEnter: () => useStore.getState().setSceneState('HERO'),
        onEnterBack: () => useStore.getState().setSceneState('HERO'),
      });

      const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      // Intro sequence sets initial visibility, we use a tiny delay for hero entrance
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out', duration: 1.2 },
        delay: 0.2
      });

      if (!isReducedMotion) {
        tl.fromTo(imageRef.current, { clipPath: 'inset(100% 0 0 0)', scale: 1.1 }, { clipPath: 'inset(0% 0 0 0)', scale: 1, duration: 1.5 })
          .fromTo(titleRef.current, { y: 50, opacity: 0 }, { y: 0, opacity: 1 }, '-=1')
          .fromTo(subtitleRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1 }, '-=0.8')
          .fromTo(tagsRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1 }, '-=0.9')
          .fromTo(statementRef.current, { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1 }, '-=0.7')
          .fromTo(ctaRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1 }, '-=0.6');
      }

      // Scroll Transition Animation
      gsap.to(containerRef.current, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
        z: -200, // Move deeper into scene
        opacity: 0,
        yPercent: 20,
        ease: "none"
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="hero-section" ref={containerRef}>
      <div className="container hero-container">
        
        <div className="hero-image-wrapper" ref={imageRef}>
          <img src="/Cyril.jpeg" alt="Cyril Sham J" className="hero-image" />
          <div className="hero-image-overlay"></div>
        </div>

        <div className="hero-content">
          <h1 className="display-text hero-title" ref={titleRef}>CYRIL SHAM J</h1>
          
          <h2 className="hero-subtitle technical-text" ref={subtitleRef}>
            B.SC. COMPUTER SCIENCE — FINAL YEAR
          </h2>
          
          <div className="hero-tags technical-text" ref={tagsRef}>
            <span>NETWORK ENGINEERING</span>
            <span>DIGITAL SYSTEMS</span>
          </div>

          <div className="hero-statement" ref={statementRef}>
            BUILDING CONNECTIONS
          </div>

          <div className="hero-cta-group" ref={ctaRef}>
            <button className="btn-primary" data-cursor="PROJECT">
              <span className="btn-text">EXPLORE MY WORLD</span>
              <div className="btn-bg"></div>
            </button>
            <button className="btn-secondary" data-cursor="LINK">
              VIEW WORK
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;
