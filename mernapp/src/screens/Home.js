import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Clock, Award, Star, MapPin } from "lucide-react";
import HeroSection from "../components/HeroSection";
import FoodCard from "../components/FoodCard";
import "../screens/Home.css";
import axios from "axios"; // ✅ added

const BASE_URL = process.env.REACT_APP_API_URL; // ✅ added

const Home = () => {
  const [showModal, setShowModal] = useState(false);
  const [foodItems, setFoodItems] = useState([]); // ✅ changed to state
  const navigate = useNavigate();

  // Reveal animation (UNCHANGED)
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = 1;
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      el.style.opacity = 0;
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'all 0.6s ease-out';
      observer.observe(el);
    });
    
    return () => observer.disconnect();
  }, []);

  // 🔥 NEW: Fetch top-rated foods
  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/products`);
        const products = res.data.products || [];

        // Sort by rating (fallback random)
        const sorted = products.sort(
          (a, b) => (b.rating || Math.random() * 2 + 3) - (a.rating || Math.random() * 2 + 3)
        );

        setFoodItems(sorted.slice(0, 4)); // top 4
      } catch (err) {
        console.error("Error fetching foods", err);
      }
    };

    fetchFoods();
  }, []);

  // 🔥 NEW: Image fix
  const resolveImg = (item) => {
    let raw = item.img || item.image || item.imageUrl || null;

    if (!raw) return "https://via.placeholder.com/150";

    if (raw.includes("localhost:5000")) {
      return raw.replace(/https?:\/\/localhost:5000/, BASE_URL);
    }

    if (raw.startsWith("http")) return raw;

    const clean = raw.replace(/^\/?uploads\//, "");
    return `${BASE_URL}/uploads/${clean}`;
  };

  return (
    <div className="home-container">
      {/* Hero Section */}
      <HeroSection />

      {/* Popular Dishes Section */}
      <section className="section bg-white">
        <div className="section-header animate-on-scroll">
          <h2 className="section-title">
            Popular <span className="section-title-highlight">Homemade</span> Dishes
          </h2>
          <p className="section-subtitle">
            Explore our most loved recipes, prepared fresh daily by expert homemakers in your area.
          </p>
        </div>
        
        <div className="dishes-grid">
          {foodItems.map((food, index) => (
            <div key={index} className="animate-on-scroll" style={{ transitionDelay: `${index * 100}ms` }}>
              
              {/* 🔥 pass fixed image */}
              <FoodCard food={{ ...food, img: resolveImg(food) }} />

            </div>
          ))}
        </div>
      </section>

      {/* Features Section (UNCHANGED) */}
      <section className="features-section section">
        <div className="section-header animate-on-scroll">
          <h2 className="section-title">Why Choose Us?</h2>
          <p className="section-subtitle">
            We bring you the comfort, taste, and hygiene of traditional home cooking.
          </p>
        </div>
        
        <div className="features-grid">
          <div className="feature-card animate-on-scroll">
            <div className="feature-icon-wrapper">
              <ShieldCheck size={40} />
            </div>
            <h3 className="feature-title">100% Authentic Homemade</h3>
            <p className="feature-desc">
              Every dish is prepared in a real home kitchen, ensuring the authentic taste you miss.
            </p>
          </div>
          
          <div className="feature-card animate-on-scroll" style={{ transitionDelay: '100ms' }}>
            <div className="feature-icon-wrapper">
              <Award size={40} />
            </div>
            <h3 className="feature-title">Trusted Home Chefs</h3>
            <p className="feature-desc">
              Our homemakers are carefully vetted for hygiene and culinary excellence.
            </p>
          </div>
          
          <div className="feature-card animate-on-scroll" style={{ transitionDelay: '200ms' }}>
            <div className="feature-icon-wrapper">
              <Clock size={40} />
            </div>
            <h3 className="feature-title">Fast Delivery</h3>
            <p className="feature-desc">
              Get your favorite meals delivered fresh and hot right to your doorstep.
            </p>
          </div>
        </div>
      </section>

      {/* Rest of your code UNCHANGED */}
    </div>
  );
};

export default Home;