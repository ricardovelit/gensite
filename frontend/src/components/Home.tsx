import React, { useState, useEffect } from 'react';
import './Home.css';

const Home = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    // Animación de carga inicial
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    // Listener para el scroll
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    console.log('Generando código con:', prompt);
    
    setTimeout(() => {
      setIsGenerating(false);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <div className="loading-logo">
            <img src="/image/LOGO GEN SITE.svg" alt="GenSite" />
          </div>
          <div className="loading-text">Aligno</div>
          <div className="loading-subtitle">
            Prioritise What Matters - Streamline Your<br />
            Workflow and Focus on What Drives<br />
            Success!
          </div>
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        </div>
        <div className="loading-bg-elements">
          <div className="bg-element bg-element-1"></div>
          <div className="bg-element bg-element-2"></div>
          <div className="bg-element bg-element-3"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="home-container">
      {/* Navegación */}
      <nav className="navigation">
        <div className="nav-content">
          <div className="nav-links">
            <a href="#features">Features</a>
            <a href="#testimonials">Testimonials</a>
          </div>
          <div className="nav-logo">
            <img src="/image/LOGO GEN SITE.svg" alt="Aligno" />
          </div>
          <div className="nav-actions">
            <a href="#why">Why Aligno?</a>
            <a href="#pricing">Pricing</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            ⭐ New AI Feature
          </div>
          <h1 className="hero-title">Aligno</h1>
          <p className="hero-subtitle">
            Prioritise What Matters - Streamline Your<br />
            Workflow and Focus on What Drives<br />
            Success!
          </p>
          <button className="hero-cta">Buy Template</button>
        </div>
        
        {/* Panel flotante que se mueve con scroll */}
        <div 
          className="floating-panel"
          style={{
            transform: `translateY(${scrollY * 0.3}px) translateX(${scrollY * 0.1}px)`
          }}
        >
          <div className="panel-content">
            <div className="panel-header">
              <div className="panel-tabs">
                <span className="tab active">Website</span>
                <span className="tab">Mobile</span>
                <span className="tab">Desktop</span>
              </div>
              <div className="panel-controls">
                <div className="control-dot red"></div>
                <div className="control-dot yellow"></div>
                <div className="control-dot green"></div>
              </div>
            </div>
            <div className="panel-body">
              <div className="panel-sidebar">
                <div className="sidebar-item active">
                  <div className="item-icon">📊</div>
                  <span>Analytics</span>
                </div>
                <div className="sidebar-item">
                  <div className="item-icon">👥</div>
                  <span>Team</span>
                </div>
                <div className="sidebar-item">
                  <div className="item-icon">⚙️</div>
                  <span>Settings</span>
                </div>
                <div className="sidebar-item">
                  <div className="item-icon">📈</div>
                  <span>Reports</span>
                </div>
              </div>
              <div className="panel-main">
                <div className="main-header">
                  <h3>Dashboard Overview</h3>
                  <button className="btn-primary">New Project</button>
                </div>
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-value">2.4k</div>
                    <div className="stat-label">Active Users</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">$12.5k</div>
                    <div className="stat-label">Revenue</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">98.2%</div>
                    <div className="stat-label">Uptime</div>
                  </div>
                </div>
                <div className="chart-placeholder">
                  <div className="chart-bars">
                    <div className="bar" style={{height: '60%'}}></div>
                    <div className="bar" style={{height: '80%'}}></div>
                    <div className="bar" style={{height: '45%'}}></div>
                    <div className="bar" style={{height: '90%'}}></div>
                    <div className="bar" style={{height: '70%'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección adicional para demostrar el scroll */}
      <section className="content-section">
        <div className="content-wrapper">
          <h2>Características Principales</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>Generación Automática</h3>
              <p>Crea código de alta calidad automáticamente con IA avanzada.</p>
            </div>
            <div className="feature-card">
              <h3>Múltiples Frameworks</h3>
              <p>Soporte para React, Vue, Angular y más tecnologías modernas.</p>
            </div>
            <div className="feature-card">
              <h3>Optimización Inteligente</h3>
              <p>Código optimizado para rendimiento y mejores prácticas.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;