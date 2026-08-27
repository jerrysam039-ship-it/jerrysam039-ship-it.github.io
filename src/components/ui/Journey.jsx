import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useStore } from '../../utils/store';
import './Journey.css';

gsap.registerPlugin(ScrollTrigger);

const milestones = [
  {
    title: 'BUILDING DIGITAL PRODUCTS',
    detail: 'Created four production web projects — from e-commerce platforms to educational systems and media archives — each designed with a distinct purpose and deployed to live audiences.'
  },
  {
    title: 'OPERATING DIGITAL SYSTEMS',
    detail: 'Led Loyola Media Team operations — building the digital presence, managing the content workflow and architecting the Media Hub as a permanent college event archive.'
  },
  {
    title: 'UNDERSTANDING INFRASTRUCTURE',
    detail: 'Studied network engineering as a core discipline — developing a systems-level understanding of how digital experiences are actually delivered, connected and maintained.'
  },
  {
    title: 'CREATING INTERACTIVE EXPERIENCES',
    detail: 'Built WebGL-powered, GSAP-animated web experiences that treat motion and depth as first-class design tools rather than decorative afterthoughts.'
  },
  {
    title: 'EXPERIMENTING IN THE LAB',
    detail: 'Maintaining an active experimental thinking space — asking what-if questions about spatial interfaces, network-as-UI, interaction memory and calm complexity.'
  },
  {
    title: 'STILL BUILDING',
    detail: 'Final year. Every project, experiment and idea is part of a longer trajectory. The system is not finished.'
  }
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
        nodesRef.current.forEach((node) => {
          if (!node) return;
          
          gsap.fromTo(node, 
            { opacity: 0.2, scale: 0.96, y: 60 },
            {
              opacity: 1,
              scale: 1,
              y: 0,
              duration: 0.9,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: node,
                start: "top 82%",
                end: "top 45%",
                scrub: 0.8,
              }
            }
          );

          gsap.to(node, {
            opacity: 0.35,
            scale: 0.97,
            y: -30,
            scrollTrigger: {
              trigger: node,
              start: "top 20%",
              end: "bottom top",
              scrub: 0.8,
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
                <h3 className="node-title">{milestone.title}</h3>
                <p className="node-detail">{milestone.detail}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Journey;
