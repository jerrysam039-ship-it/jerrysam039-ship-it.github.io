import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useStore } from '../../utils/store';
import { experimentCategories, experiments } from '../../data/experiments';
import { useNavigate } from 'react-router-dom';
import './LabSection.css';

gsap.registerPlugin(ScrollTrigger);

const LabSection = () => {
  const sectionRef = useRef(null);
  const setSceneState = useStore(state => state.setSceneState);
  const activeLabFilter = useStore(state => state.activeLabFilter);
  const setActiveLabFilter = useStore(state => state.setActiveLabFilter);
  const navigate = useNavigate();

  useEffect(() => {
    if (!sectionRef.current) return;

    let ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => setSceneState('LAB'),
        onEnterBack: () => setSceneState('LAB'),
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [setSceneState]);

  return (
    <section className="lab-section" ref={sectionRef}>
      <div className="lab-container">
        
        <header className="lab-header">
          <span className="lab-eyebrow">
            EXPERIMENTAL INTELLIGENCE / 001
          </span>
          <h2 className="lab-question">
            WHAT IF?
          </h2>
          <p className="lab-intro">
            A space for ideas before they become projects.
          </p>
        </header>

        <div className="lab-filters">
          {experimentCategories.map(cat => (
            <button 
              key={cat} 
              className={`filter-btn ${activeLabFilter === cat ? 'is-active' : ''}`}
              onClick={() => setActiveLabFilter(cat)}
              data-cursor="LINK"
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="lab-experiments">
          {experiments.map((exp, idx) => {
            if (activeLabFilter !== 'ALL' && exp.filterCategory !== activeLabFilter) return null;
            
            return (
              <article 
                key={exp.id} 
                className="experiment-card"
                onClick={() => navigate(`/lab/${exp.slug}`)}
                data-cursor="LINK"
              >
                <div className="experiment-meta">
                  <span>EXPERIMENT {String(idx + 1).padStart(2, '0')}</span>
                  <span>{exp.status}</span>
                </div>
                
                <h3 className="experiment-title">{exp.title}</h3>
                <p className="experiment-description">{exp.description}</p>
                
                <button className="experiment-action">
                  EXPLORE &rarr;
                </button>
              </article>
            );
          })}
        </div>
        
      </div>
    </section>
  );
};

export default LabSection;
