import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useStore } from '../../utils/store';
import './NetworkSection.css';

gsap.registerPlugin(ScrollTrigger);

const NetworkSection = () => {
  const sectionRef = useRef(null);
  const textRefs = useRef([]);

  useEffect(() => {
    let ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top center",
        end: "bottom center",
        onEnter: () => useStore.getState().setSceneState('NETWORK'),
        onEnterBack: () => useStore.getState().setSceneState('NETWORK'),
      });
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".network-philosophy",
          start: "top 80%",
          end: "bottom 20%",
          scrub: 1,
        }
      });

      if (textRefs.current.length > 0) {
          textRefs.current.forEach((el, index) => {
              tl.fromTo(el, 
                  { opacity: 0, y: 50 },
                  { opacity: 1, y: 0, duration: 1 }
              );
              
              if (index < textRefs.current.length - 1) {
                   tl.to(el, { opacity: 0.1, duration: 0.5 });
              }
          });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="network-section" ref={sectionRef}>
      <div className="container network-container">
        
        <header className="network-header">
          <h2 className="display-text section-title">NETWORK ENGINEERING</h2>
          <p className="technical-text">SYSTEMS BECOME MEANINGFUL THROUGH THEIR CONNECTIONS.</p>
        </header>
        
        <div className="network-topology-spacer"></div>

        <div className="network-philosophy">
           <h2 className="display-text" ref={el => textRefs.current[0] = el}>THINK IN SYSTEMS.</h2>
           <h2 className="display-text" ref={el => textRefs.current[1] = el}>TRACE THE CONNECTION.</h2>
           <h2 className="display-text" ref={el => textRefs.current[2] = el}>UNDERSTAND THE FLOW.</h2>
           <h2 className="display-text" ref={el => textRefs.current[3] = el}>BUILD WITH PURPOSE.</h2>
        </div>

        <div className="sr-only">
           Interactive 3D network topology visualization representing infrastructure thinking.
           Contains core routers, distribution switches, access points, and endpoints connected in a hierarchical model.
        </div>
        
        <div className="future-lab-hook technical-text">
            [ EXPERIMENTAL NODES DETECTED ]
        </div>

      </div>
    </section>
  );
};

export default NetworkSection;
