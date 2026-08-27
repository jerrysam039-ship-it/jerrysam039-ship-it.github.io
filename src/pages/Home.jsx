import React from 'react';
import { Helmet } from 'react-helmet-async';
import IntroSequence from '../components/ui/IntroSequence';
import Hero from '../components/ui/Hero';
import About from '../components/ui/About';
import Philosophy from '../components/ui/Philosophy';
import Journey from '../components/ui/Journey';
import ProjectUniverse from '../components/ui/ProjectUniverse';
import LoyolaMediaSection from '../components/ui/LoyolaMediaSection';
import NetworkSection from '../components/ui/NetworkSection';
import LabSection from '../components/ui/LabSection';
import ContactSection from '../components/ui/ContactSection';
import { useLocation } from 'react-router-dom';

const Home = ({ introFinished, setIntroFinished }) => {
  const location = useLocation();

  React.useEffect(() => {
    if (location.pathname === '/contact' && introFinished) {
      const contactEl = document.getElementById('contact');
      if (contactEl) {
        contactEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location.pathname, introFinished]);

  return (
    <main className="page-home">
      <Helmet>
        <title>Cyril Sham J | Portfolio</title>
        <meta name="description" content="Computer Science student bridging digital products and network engineering." />
      </Helmet>
      
      {!introFinished && <IntroSequence onComplete={() => setIntroFinished(true)} />}
      
      <div className={`home-content ${introFinished ? 'is-visible' : 'is-hidden'}`}>
        <Hero />
        <About />
        <Philosophy />
        <Journey />
        <ProjectUniverse />
        <LoyolaMediaSection />
        <NetworkSection />
        <LabSection />
        <ContactSection />
      </div>
    </main>
  );
};
export default Home;
