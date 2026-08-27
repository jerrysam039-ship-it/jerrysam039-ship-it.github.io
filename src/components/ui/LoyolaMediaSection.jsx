import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useStore } from '../../utils/store';
import ImageGallery from './ImageGallery';
import { projects } from '../../data/projects';
import './LoyolaMediaSection.css';

gsap.registerPlugin(ScrollTrigger);

const LoyolaMediaSection = () => {
  const sectionRef = useRef(null);
  const flowRef = useRef(null);
  
  // Extract Media Hub images (for the archive part)
  const mediaHub = projects.find(p => p.slug === 'loyola-media-hub');
  const archiveImages = mediaHub ? mediaHub.media : [];

  useEffect(() => {
    let ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top center",
        end: "bottom center",
        onEnter: () => useStore.getState().setSceneState('MEDIA_SECTION'),
        onEnterBack: () => useStore.getState().setSceneState('MEDIA_SECTION'),
      });
      
      if (flowRef.current) {
          const steps = flowRef.current.querySelectorAll('.flow-step');
          gsap.fromTo(steps, 
              { opacity: 0, y: 20 },
              { 
                  opacity: 1, 
                  y: 0, 
                  stagger: 0.2,
                  scrollTrigger: {
                      trigger: flowRef.current,
                      start: 'top 80%'
                  }
              }
          );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="media-section" ref={sectionRef}>
      <div className="container media-container">
        
        <header className="media-header">
          <h3 className="technical-text section-subtitle">DIGITAL OPERATIONS</h3>
          <h2 className="display-text section-title">LOYOLA MEDIA</h2>
        </header>
        
        <div className="media-flow-concept" ref={flowRef}>
          <div className="flow-step technical-text">CONTENT</div>
          <div className="flow-arrow">↓</div>
          <div className="flow-step technical-text">CAPTURE</div>
          <div className="flow-arrow">↓</div>
          <div className="flow-step technical-text">PROCESS</div>
          <div className="flow-arrow">↓</div>
          <div className="flow-step technical-text">PUBLISH</div>
        </div>

        <div className="media-duality">
          <div className="duality-card" data-cursor="VIEW">
            <h3 className="display-text">MEDIA TEAM</h3>
            <p className="technical-text">OFFICIAL DIGITAL PRESENCE</p>
          </div>
          
          <div className="duality-connection technical-text">
            <span>MEDIA SIGNAL</span>
            <div className="signal-line"></div>
            <span>EVENT ARCHIVE</span>
          </div>
          
          <div className="duality-card" data-cursor="VIEW">
            <h3 className="display-text">MEDIA HUB</h3>
            <p className="technical-text">PRESERVING MOMENTS</p>
          </div>
        </div>

        {archiveImages.length > 0 && (
          <div className="media-archive-preview" data-cursor="OPEN">
            <ImageGallery media={archiveImages} />
          </div>
        )}

      </div>
    </section>
  );
};

export default LoyolaMediaSection;
