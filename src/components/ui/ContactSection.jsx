import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useStore } from '../../utils/store';
import { contactData } from '../../data/contact';
import './ContactSection.css';

gsap.registerPlugin(ScrollTrigger);

const ContactRow = ({ channelKey, channel }) => {
  const [copyStatus, setCopyStatus] = useState(channel.action);

  const handleCopy = async (e) => {
    if (channel.action !== 'COPY') return;
    
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(channel.value);
      setCopyStatus('COPIED');
      setTimeout(() => setCopyStatus(channel.action), 2000);
    } catch (err) {
      setCopyStatus('FAILED');
    }
  };

  return (
    <a 
      href={channel.link} 
      className="contact-row" 
      data-cursor={channel.cursor}
      target={channel.action === 'FOLLOW' || channel.action === 'CHAT' ? "_blank" : "_self"}
      rel="noopener noreferrer"
    >
      <div className="contact-row-label">{channel.label}</div>
      <div className="contact-row-value">{channel.value}</div>
      {channel.action === 'COPY' ? (
        <button 
           className={`contact-action-btn ${copyStatus === 'COPIED' ? 'is-success' : ''}`}
           onClick={handleCopy}
           aria-live="polite"
        >
          {copyStatus}
        </button>
      ) : (
        <div className="contact-action-text">{channel.action}</div>
      )}
      <div className="contact-row-line"></div>
    </a>
  );
};

const ContactSection = () => {
  const sectionRef = useRef(null);
  const headlineRef = useRef(null);
  const setSceneState = useStore(state => state.setSceneState);
  const reducedMotion = useStore(state => state.reducedMotion);

  useEffect(() => {
    if (!sectionRef.current) return;

    let ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top center',
        end: 'bottom bottom',
        onEnter: () => setSceneState('CONTACT'),
        onEnterBack: () => setSceneState('CONTACT'),
      });

      if (!reducedMotion && headlineRef.current) {
         gsap.fromTo(headlineRef.current, 
           { opacity: 0, letterSpacing: '-0.1em', filter: 'blur(10px)', y: 50 },
           { 
              scrollTrigger: {
                 trigger: sectionRef.current,
                 start: 'top 60%',
              },
              opacity: 1, 
              letterSpacing: '-0.02em', 
              filter: 'blur(0px)', 
              y: 0,
              duration: 1.5, 
              ease: 'power3.out' 
           }
         );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [setSceneState, reducedMotion]);

  const handleBackToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: reducedMotion ? 'auto' : 'smooth'
    });
  };

  return (
    <section className="contact-section" ref={sectionRef} id="contact">
      <div className="contact-container">
        
        <header className="contact-header">
          <h1 className="contact-headline" ref={headlineRef}>LET'S CONNECT.</h1>
          <p className="contact-subtitle">OPEN TO IDEAS, COLLABORATION, AND BUILDING SOMETHING MEANINGFUL.</p>
        </header>

        <div className="contact-identity">
          <h2 className="identity-name">{contactData.identity.name}</h2>
          <p className="identity-education">{contactData.identity.education}</p>
          <p className="identity-institution">{contactData.identity.institution}</p>
        </div>

        <div className="contact-channels">
          <ContactRow channelKey="personalEmail" channel={contactData.channels.personalEmail} />
          <ContactRow channelKey="officialEmail" channel={contactData.channels.officialEmail} />
          <ContactRow channelKey="whatsapp" channel={contactData.channels.whatsapp} />
          <ContactRow channelKey="phone" channel={contactData.channels.phone} />
          <ContactRow channelKey="instagram" channel={contactData.channels.instagram} />
          <ContactRow channelKey="github" channel={contactData.channels.github} />
        </div>

        <footer className="minimal-footer">
          <div className="footer-content">
            <div className="footer-left">
               <span className="footer-name">{contactData.identity.name}</span>
               <span className="footer-tagline">BUILDING CONNECTIONS.</span>
            </div>
            <div className="footer-right">
               <span className="footer-year">© {new Date().getFullYear()}</span>
            </div>
          </div>
          
          <button className="back-to-top" onClick={handleBackToTop} data-cursor="LINK">
             BACK TO TOP
          </button>
        </footer>

      </div>
    </section>
  );
};

export default ContactSection;
