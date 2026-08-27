import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { experiments } from '../data/experiments';
import './ExperimentDetail.css';

const ExperimentDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  const experiment = experiments.find(e => e.slug === slug);

  useEffect(() => {
    // If experiment not found, we could redirect, but for now we'll handle gracefully
    if (!experiment) {
       navigate('/');
    }
  }, [experiment, navigate]);

  if (!experiment) return null;

  return (
    <main className="experiment-detail-page">
      <Helmet>
        <title>{experiment.title} | The Lab | Cyril Sham J</title>
        <meta name="description" content={experiment.description} />
      </Helmet>

      <nav className="experiment-nav">
        <Link to="/" data-cursor="LINK" className="back-link">
          <span className="arrow">←</span> RETURN TO LAB
        </Link>
      </nav>

      <article className="experiment-content">
        <header className="experiment-header">
          <div className="experiment-meta">
            <span className="experiment-status">{experiment.status}</span>
            <span className="experiment-category">{experiment.category}</span>
            <span className="experiment-year">{experiment.year}</span>
          </div>
          <h1 className="experiment-title">{experiment.title}</h1>
          {experiment.isConceptual && (
            <div className="technical-text" style={{ marginTop: '1rem', color: 'var(--color-accent)', letterSpacing: '0.1em' }}>
              CONCEPTUAL EXPLORATION
            </div>
          )}
        </header>

        <div className="experiment-body">
          {experiment.why && (
            <section className="experiment-section">
              <h2>WHY</h2>
              <p>{experiment.why}</p>
            </section>
          )}

          {experiment.theQuestion && (
            <section className="experiment-section">
              <h2>THE QUESTION</h2>
              <p>{experiment.theQuestion}</p>
            </section>
          )}

          {experiment.theIdea && (
            <section className="experiment-section">
              <h2>THE IDEA</h2>
              <p>{experiment.theIdea}</p>
            </section>
          )}

          {experiment.whatIWouldTest && (
            <section className="experiment-section">
              <h2>WHAT I WOULD TEST</h2>
              <p>{experiment.whatIWouldTest}</p>
            </section>
          )}
          
          {experiment.whatIWouldLearn && (
            <section className="experiment-section">
              <h2>WHAT I WOULD LEARN</h2>
              <p>{experiment.whatIWouldLearn}</p>
            </section>
          )}
        </div>
        
        {experiment.media && experiment.media.length > 0 && (
           <section className="experiment-media">
              {/* Media gallery architecture will go here if populated */}
           </section>
        )}
      </article>
    </main>
  );
};

export default ExperimentDetail;
