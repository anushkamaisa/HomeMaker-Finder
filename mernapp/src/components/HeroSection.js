import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Utensils } from 'lucide-react';
import '../styles/HeroSection.css';

const HeroSection = () => {
  const navigate = useNavigate();

  // A high quality food image from an online placeholder service to use as the hero background
  const heroImage = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop";

  return (
    <section className="hero-wrapper">
      <img src={heroImage} alt="Delicious homemade food spread" className="hero-bg" />
      <div className="hero-overlay"></div>
      
      <div className="hero-content">
        <div className="hero-text-wrapper">
          <div className="hero-badge">100% Homemade Authenticity</div>
          
          <h1 className="hero-title">
            Your Favorite <br />
            <span className="hero-title-highlight">Homemade Meals</span>
          </h1>
          
          <p className="hero-subtitle">
            Skip the cooking, not the taste. Discover authentic, healthy, and hygienic meals prepared by expert home chefs near you, delivered fresh to your doorstep.
          </p>
          
          <div className="hero-buttons">
            <button 
              className="hero-btn-primary"
              onClick={() => navigate('/menu')}
            >
              Order Now <ChevronRight size={20} />
            </button>
            <button 
              className="hero-btn-secondary"
              onClick={() => navigate('/chefs')}
            >
              Meet Our Chefs
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
