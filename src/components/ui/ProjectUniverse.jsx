import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useStore } from '../../utils/store';
import { projects } from '../../data/projects';
import { useNavigate } from 'react-router-dom';
import './ProjectUniverse.css';

gsap.registerPlugin(ScrollTrigger);

const categories = ["ALL", "WEB", "NETWORK", "DESIGN", "EXPERIMENTS"];

const ProjectUniverse = () => {
  const sectionRef = useRef(null);
  const { activeFilter, setActiveFilter, sceneState, setHoveredProject } = useStore();
  const navigate = useNavigate();

  const primaryProjects = projects.filter(p => p.weight === 'PRIMARY' || p.weight === 'SECONDARY');

  useEffect(() => {
    let ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top center",
        end: "bottom bottom", // Wait, 100vh height means it might end quickly. Let's make it taller if needed, but for now 100vh is fine.
        onEnter: () => useStore.getState().setSceneState('UNIVERSE'),
        onEnterBack: () => useStore.getState().setSceneState('UNIVERSE'),
      });
    }, sectionRef);
    
    return () => ctx.revert();
  }, []);

  return (
    <section className="projects-section" ref={sectionRef} id="projects">
      <div className="container universe-container">
        
        <header className="projects-header">
          <h3 className="technical-text universe-subtitle">SELECTED WORK</h3>
          <h2 className="projects-title">PROJECTS</h2>
        </header>

        {/* Only show filters if we are fully in the universe state to avoid visual clutter during scrolling */}
        <div className={`universe-filters ${sceneState === 'UNIVERSE' ? 'is-visible' : ''}`}>
          {categories.map(cat => (
            <button 
              key={cat}
              className={`filter-btn technical-text ${activeFilter === cat ? 'is-active' : ''}`}
              onClick={() => setActiveFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* DOM Project List - Guaranteed to render actual React elements */}
        <div className={`projects-grid ${sceneState === 'UNIVERSE' ? 'is-visible' : ''}`}>
          {primaryProjects.map((project, idx) => {
            if (activeFilter !== 'ALL' && project.filterCategory !== activeFilter) return null;
            
            return (
              <article 
                key={project.id} 
                className="project-card"
                onMouseEnter={() => setHoveredProject(project.id)}
                onMouseLeave={() => setHoveredProject(null)}
                onClick={() => navigate(`/project/${project.slug}`)}
              >
                <div className="project-card-number">
                  {String(idx + 1).padStart(2, '0')}
                </div>
                <div className="project-card-content">
                  <p className="project-card-category">{project.category}</p>
                  <h3 className="project-card-title">{project.title}</h3>
                  {project.subtitle && (
                    <h4 className="project-card-subtitle">{project.subtitle}</h4>
                  )}
                  <p className="project-card-description">{project.shortDescription}</p>
                  
                  {project.url ? (
                    <a 
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-card-link"
                      onClick={(e) => e.stopPropagation()}
                    >
                      VISIT PROJECT ↗
                    </a>
                  ) : (
                    <div className="project-card-link">
                      EXPLORE CASE STUDY &rarr;
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default ProjectUniverse;
