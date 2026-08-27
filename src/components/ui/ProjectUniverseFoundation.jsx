import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useStore } from '../../utils/store';
import './ProjectUniverseFoundation.css';

gsap.registerPlugin(ScrollTrigger);

const ProjectUniverseFoundation = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const nodesRef = useRef([]);

  const futureProjects = [
    "AnnuDomain",
    "Annu Educational Trust",
    "AET Salem",
    "Loyola Media Hub",
    "Loyola Media Team",
    "Network Engineering",
  ];

  useEffect(() => {
    let ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top center",
        end: "bottom center",
        onEnter: () => useStore.getState().setSceneState('UNIVERSE'),
        onEnterBack: () => useStore.getState().setSceneState('UNIVERSE'),
      });

      const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (!isReducedMotion) {
        gsap.fromTo(titleRef.current, 
          { opacity: 0, y: 30 },
          {
            opacity: 1, 
            y: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
            }
          }
        );

        gsap.fromTo(nodesRef.current, 
          { opacity: 0, scale: 0.8 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: 'back.out(1.2)',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 60%",
            }
          }
        );
      }
    }, sectionRef);
    
    return () => ctx.revert();
  }, []);

  return (
    <section className="universe-section" ref={sectionRef}>
      <div className="container">
        <div className="universe-header">
          <h2 className="display-text universe-title" ref={titleRef}>
            PROJECT UNIVERSE
          </h2>
          <p className="technical-text universe-subtitle">SYSTEM ARCHITECTURE IN PROGRESS</p>
        </div>
        
        <div className="universe-grid">
          {futureProjects.map((project, idx) => (
            <div 
              key={idx} 
              className="universe-node" 
              ref={el => nodesRef.current[idx] = el}
              data-cursor="PROJECT"
            >
              <div className="node-indicator"></div>
              <span className="node-name technical-text">{project}</span>
              <div className="node-connection-line"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectUniverseFoundation;
