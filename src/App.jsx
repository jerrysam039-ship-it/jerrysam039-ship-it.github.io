import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import CustomCursor from './components/ui/CustomCursor';
import GlobalCanvas from './components/canvas/GlobalCanvas';
import Home from './pages/Home';
import ProjectDetail from './pages/ProjectDetail';
import ExperimentDetail from './pages/ExperimentDetail';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function App() {
  // If landing on a deep link, skip intro
  const [introFinished, setIntroFinished] = useState(
    window.location.pathname !== '/'
  );

  return (
    <HelmetProvider>
      <Router>
        <ScrollToTop />
        <CustomCursor />
        
        {/* The Global WebGL Scene */}
        <GlobalCanvas />
        
        {/* HTML Content Overlay */}
        <div className="app-content">
          <Routes>
            <Route path="/" element={<Home introFinished={introFinished} setIntroFinished={setIntroFinished} />} />
            <Route path="/contact" element={<Home introFinished={introFinished} setIntroFinished={setIntroFinished} />} />
            <Route path="/project/:slug" element={<ProjectDetail />} />
            <Route path="/lab/:slug" element={<ExperimentDetail />} />
          </Routes>
        </div>
      </Router>
    </HelmetProvider>
  );
}

export default App;
