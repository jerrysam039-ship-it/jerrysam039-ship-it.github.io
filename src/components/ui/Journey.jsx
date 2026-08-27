import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useStore } from '../../utils/store';
import './Journey.css';

gsap.registerPlugin(ScrollTrigger);

const milestones = [
  "PROJECTS",
  "I BUILD DIGITAL PRODUCTS",
  "LOYOLA MEDIA",
  "I OPERATE DIGITAL SYSTEMS",
  "NETWORK ENGINEERING",
  "I UNDERSTAND THE INFRASTRUCTURE"
];

const Journey = () => {
  const sectionRef = useRef(null);
  const nodesRef = useRef([]);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Trigger state change
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top center",
        end: "bottom center",
        onEnter: () => useStore.getState().setSceneState('JOURNEY'),
        onEnterBack: () => useStore.getState().setSceneState('JOURNEY'),
      });

      const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (!isReducedMotion) {
        // Journey Nodes Scroll Effect (Spatial feel)
        nodesRef.current.forEach((node) => {
          if (!node) return;
          
          gsap.fromTo(node, 
            { opacity: 0.2, scale: 0.8, y: 100 },
            {
              opacity: 1,
              scale: 1,
              y: 0,
              duration: 1,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: node,
                start: "top 80%",
                end: "top 40%",
                scrub: 1,
              }
            }
          );

          // Keep previous nodes visible but faded to show continuity
          gsap.to(node, {
            opacity: 0.4,
            scale: 0.9,
            y: -50,
            scrollTrigger: {
              trigger: node,
              start: "top 20%",
              end: "bottom top",
              scrub: 1,
            }
          });
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="journey-section" ref={sectionRef}>
      <div className="container journey-container">
        
        <h2 className="display-text journey-main-title">THE JOURNEY</h2>

        <div className="journey-path">
          <div className="journey-path-line"></div>
          
          {milestones.map((milestone, idx) => (
            <div 
              key={idx} 
              className="journey-node-container"
              ref={el => nodesRef.current[idx] = el}
              data-cursor="DISCOVER"
            >
              <div className="journey-node-point"></div>
              <div className="journey-node-content">
                <div className="technical-text node-index">0{idx + 1}</div>
                <h3 className="node-title display-text">{milestone}</h3>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Journey;
