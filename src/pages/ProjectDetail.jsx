import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useStore } from '../utils/store';
import { projects } from '../data/projects';
import ImageGallery from '../components/ui/ImageGallery';
import './ProjectDetail.css';

gsap.registerPlugin(ScrollTrigger);

const ProjectDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { setSceneState, setActiveProject } = useStore();
  const contentRef = useRef(null);
  
  const project = projects.find(p => p.slug === slug);
  const relatedProjects = project?.connections?.map(id => projects.find(p => p.id === id)).filter(Boolean) || [];

  useEffect(() => {
    if (!project) {
      navigate('/');
      return;
    }

    setActiveProject(project.id);
    setSceneState('PROJECT');

    let ctx = gsap.context(() => {
      if (contentRef.current) {
        const sections = contentRef.current.querySelectorAll('.project-section');
        sections.forEach(section => {
          gsap.fromTo(section, 
            { opacity: 0, y: 30 },
            { 
              opacity: 1, 
              y: 0, 
              duration: 1, 
              ease: 'power2.out',
              scrollTrigger: {
                trigger: section,
                start: 'top 85%'
              }
            }
          );
        });
      }
    }, contentRef);

    return () => ctx.revert();
  }, [project, setActiveProject, setSceneState, navigate]);

  const handleReturn = () => {
    setSceneState('UNIVERSE');
    setActiveProject(null);
    setTimeout(() => {
      navigate('/');
    }, 100);
  };

  const handleRelatedNavigation = (relatedProj) => {
    setActiveProject(relatedProj.id);
    navigate(`/project/${relatedProj.slug}`);
  };

  if (!project) return null;

  const cs = project.caseStudy || {};
  const media = project.media || [];
  const heroMedia = media.filter(m => m.type === 'hero');
  const otherMedia = media.filter(m => m.type !== 'hero');

  return (
    <main className="page-project-detail">
      <Helmet>
        <title>{`${project.title} | Cyril Sham J`}</title>
        <meta name="description" content={project.shortDescription || project.title} />
        <link rel="canonical" href={`https://cyrilsham.com/project/${project.slug}`} />
        <meta property="og:title" content={`${project.title} | Cyril Sham J`} />
        <meta property="og:description" content={project.shortDescription || project.title} />
      </Helmet>

      <div className="project-detail-overlay">
        
        <button className="return-btn technical-text" onClick={handleReturn}>
          ← RETURN TO UNIVERSE
        </button>

        <div className="project-detail-content" ref={contentRef}>
          <header className="project-header">
            <h2 className="technical-text project-index">0{projects.indexOf(project) + 1}</h2>
            <h1 className="display-text project-title">{project.title}</h1>
            {cs.subtitle && (
              <h2 className="technical-text project-subtitle" style={{ marginTop: '1rem', color: 'var(--color-accent)', whiteSpace: 'pre-line' }}>
                {cs.subtitle}
              </h2>
            )}
            <div className="project-meta technical-text">
              <div className="meta-col">
                <span className="meta-label">CATEGORY</span>
                <span className="meta-val">{project.category}</span>
              </div>
              {project.role && (
                <div className="meta-col">
                  <span className="meta-label">ROLE</span>
                  <span className="meta-val">{project.role}</span>
                </div>
              )}
              {project.year && (
                <div className="meta-col">
                  <span className="meta-label">YEAR</span>
                  <span className="meta-val">{project.year}</span>
                </div>
              )}
            </div>

            <div className="project-actions" style={{ display: 'flex', gap: '2rem', marginTop: '3rem', flexWrap: 'wrap' }}>
              <button 
                className="technical-text" 
                style={{ background: 'none', border: 'none', color: 'var(--color-text-primary)', opacity: 0.6, fontSize: '0.75rem', letterSpacing: '0.1em', cursor: 'pointer', padding: 0 }}
                onClick={() => {
                   // Scroll down slightly to case study
                   window.scrollBy({ top: window.innerHeight * 0.5, behavior: 'smooth' });
                }}
              >
                [ EXPLORE CASE STUDY ]
              </button>
              
              {project.url && (
                <a 
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="technical-text"
                  style={{ color: 'var(--color-text-primary)', opacity: 0.6, fontSize: '0.75rem', letterSpacing: '0.1em', textDecoration: 'none', transition: 'color 0.3s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-accent)'; e.currentTarget.style.opacity = '1'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-primary)'; e.currentTarget.style.opacity = '0.6'; }}
                >
                  [ VISIT LIVE PROJECT &rarr; ]
                </a>
              )}
            </div>
          </header>

          <section className="project-body">
            {heroMedia.length > 0 && (
              <div className="project-section full-width">
                <ImageGallery media={heroMedia} />
              </div>
            )}

            {cs.overview && (
              <div className="project-section">
                <h2 className="technical-text section-title">OVERVIEW</h2>
                <p className="body-text">{cs.overview}</p>
              </div>
            )}

            {cs.idea && (
              <div className="project-section">
                <h2 className="technical-text section-title">THE IDEA</h2>
                <p className="body-text">{cs.idea}</p>
              </div>
            )}

            {cs.experience && (
              <div className="project-section">
                <h2 className="technical-text section-title">THE EXPERIENCE</h2>
                <p className="body-text">{cs.experience}</p>
              </div>
            )}

            {cs.built && (
              <div className="project-section">
                <h2 className="technical-text section-title">WHAT I BUILT</h2>
                <p className="body-text">{cs.built}</p>
              </div>
            )}

            {cs.technology && (
              <div className="project-section">
                <h2 className="technical-text section-title">TECHNOLOGY</h2>
                <p className="body-text">{cs.technology}</p>
              </div>
            )}

            {otherMedia.length > 0 && (
              <div className="project-section full-width">
                <h2 className="technical-text section-title">PROJECT MEDIA</h2>
                <ImageGallery media={otherMedia} />
              </div>
            )}

            {cs.learned && (
              <div className="project-section">
                <h2 className="technical-text section-title">WHAT I LEARNED</h2>
                <p className="body-text">{cs.learned}</p>
              </div>
            )}
            
            {/* If absolutely no case study sections exist, show a minimal subtle placeholder so it doesn't look broken */}
            {!cs.overview && !cs.idea && !cs.experience && !cs.built && !cs.technology && !cs.learned && (
              <div className="project-section">
                <p className="placeholder-text technical-text" style={{opacity: 0.3, letterSpacing: '0.1em'}}>
                  DOCUMENTATION PENDING
                </p>
              </div>
            )}

          </section>

          {relatedProjects.length > 0 && (
            <footer className="project-footer">
              <h2 className="technical-text section-title">RELATED PROJECTS</h2>
              <div className="related-links">
                {relatedProjects.map(rp => (
                  <button 
                    key={rp.id} 
                    className="related-btn" 
                    onClick={() => handleRelatedNavigation(rp)}
                  >
                    <span className="display-text">{rp.title}</span>
                    <span className="technical-text">→ {rp.category}</span>
                  </button>
                ))}
              </div>
            </footer>
          )}

          <div className="bottom-return">
            <button className="display-text massive-return-btn" onClick={handleReturn}>
              RETURN TO THE UNIVERSE
            </button>
          </div>

        </div>
      </div>
    </main>
  );
};

export default ProjectDetail;
