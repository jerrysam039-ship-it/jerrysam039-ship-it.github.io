import React from 'react';
import { Helmet } from 'react-helmet-async';
import IntroSequence from '../components/ui/IntroSequence';
import Hero from '../components/ui/Hero';
import About from '../components/ui/About';
import SkillsSection from '../components/ui/SkillsSection';
import Philosophy from '../components/ui/Philosophy';
import Journey from '../components/ui/Journey';
import ProcessSection from '../components/ui/ProcessSection';
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
        <title>Cyril Sham J — Creative Developer &amp; Network Engineer</title>
        <meta name="description" content="Portfolio of Cyril Sham J — Computer Science final year student at Loyola College of Arts and Science, Mettala. Building digital products, network systems and cinematic web experiences." />
        <link rel="canonical" href="https://jerrysam039-ship-it.github.io/" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://jerrysam039-ship-it.github.io/" />
        <meta property="og:title" content="Cyril Sham J — Creative Developer &amp; Network Engineer" />
        <meta property="og:description" content="Building digital products, network systems and cinematic web experiences. B.Sc. Computer Science — Loyola College of Arts and Science, Mettala." />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Cyril Sham J — Creative Developer &amp; Network Engineer" />
        <meta name="twitter:description" content="Building digital products, network systems and cinematic web experiences." />
        <meta name="theme-color" content="#030305" />
      </Helmet>
      
      {!introFinished && <IntroSequence onComplete={() => setIntroFinished(true)} />}
      
      <div className={`home-content ${introFinished ? 'is-visible' : 'is-hidden'}`}>
        <Hero />
        <About />
        <SkillsSection />
        <Philosophy />
        <Journey />
        <ProcessSection />
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
