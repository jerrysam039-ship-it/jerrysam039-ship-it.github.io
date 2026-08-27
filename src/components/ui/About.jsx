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
  const storyRef = useRef(null);
  const metaRef = useRef(null);
  const attributesRef = useRef(null);

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
          .fromTo(storyRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }, '-=0.6')
          .fromTo(metaRef.current.children, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out' }, '-=0.6');

        if (attributesRef.current) {
          gsap.fromTo(attributesRef.current.children,
            { opacity: 0, y: 10 },
            {
              opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out',
              scrollTrigger: { trigger: attributesRef.current, start: 'top 85%' }
            }
          );
        }

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
            <img src="/Cyril.jpeg" alt="Cyril Sham J - Portrait" className="about-image" loading="lazy" />
            <div className="about-image-overlay"></div>
          </div>
        </div>

        <div className="about-content-column">
          <h2 className="display-text about-title" ref={titleRef}>
            THE PERSON BEHIND THE SYSTEM
          </h2>

          <div className="about-story" ref={storyRef}>
            <p className="about-paragraph">
              I'm Cyril Sham J — a final-year Computer Science student at Loyola College of Arts and Science, Mettala, who builds digital products the same way a network engineer builds infrastructure: with precision, purpose and an understanding of how every layer connects to the next.
            </p>
            <p className="about-paragraph">
              My work sits at the intersection of frontend engineering, network thinking and digital storytelling. I don't separate design from engineering — every interface I build reflects an underlying architecture, and every system I design considers its human interface.
            </p>
            <p className="about-paragraph">
              I believe the best digital experiences feel inevitable — as if they could not have been built any other way.
            </p>
          </div>

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

          <div className="about-attributes" ref={attributesRef}>
            <span className="attribute-tag technical-text">FRONTEND ENGINEERING</span>
            <span className="attribute-tag technical-text">NETWORK SYSTEMS</span>
            <span className="attribute-tag technical-text">DIGITAL PRODUCTS</span>
            <span className="attribute-tag technical-text">INTERACTIVE EXPERIENCES</span>
            <span className="attribute-tag technical-text">WEBGL / 3D WEB</span>
            <span className="attribute-tag technical-text">MOTION DESIGN</span>
          </div>
        </div>

      </div>
    </section>
  );
};

export default About;
