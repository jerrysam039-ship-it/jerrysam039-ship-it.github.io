import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useStore } from '../../utils/store';
import './Philosophy.css';

gsap.registerPlugin(ScrollTrigger);

const statements = [
  "BUILD WITH PURPOSE.",
  "UNDERSTAND THE SYSTEM.",
  "CONNECT EVERYTHING.",
  "KEEP LEARNING.",
  "MAKE IT REAL."
];

const Philosophy = () => {
  const sectionRef = useRef(null);
  const textRefs = useRef([]);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Trigger state change
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top center",
        end: "bottom center",
        onEnter: () => useStore.getState().setSceneState('PHILOSOPHY'),
        onEnterBack: () => useStore.getState().setSceneState('PHILOSOPHY'),
      });

      const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (!isReducedMotion) {
        // Pin the section and scrub through the statements
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "+=400%", // 4 sections of scroll
            scrub: 1,
            pin: true,
          }
        });

        // Show first
        gsap.set(textRefs.current[0], { opacity: 1, scale: 1 });
        
        for (let i = 0; i < statements.length - 1; i++) {
          // Fade out current, scale up
          tl.to(textRefs.current[i], { opacity: 0, scale: 1.5, filter: 'blur(10px)', duration: 1 })
          // Fade in next, scale down from slightly larger
            .fromTo(textRefs.current[i + 1], { opacity: 0, scale: 0.8, filter: 'blur(10px)' }, { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 1 }, "-=0.5");
        }
        
        // The last one ("MAKE IT REAL.") stays for a bit
        tl.to({}, { duration: 1 }); // padding at the end
        
        // Transition out of philosophy (typography to particles concept)
        tl.to(textRefs.current[statements.length - 1], { opacity: 0, scale: 1.2, letterSpacing: '0.2em', filter: 'blur(20px)', duration: 1 });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="philosophy-section" ref={sectionRef} data-cursor="SCROLL">
      <div className="container philosophy-container">
        <div className="philosophy-title-small technical-text">HOW I THINK</div>
        
        <div className="philosophy-statements">
          {statements.map((stmt, idx) => (
            <div 
              key={idx} 
              className="philosophy-statement display-text" 
              ref={el => textRefs.current[idx] = el}
            >
              {stmt}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Philosophy;
