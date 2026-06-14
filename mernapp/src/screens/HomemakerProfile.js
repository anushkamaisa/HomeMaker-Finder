/* src/screens/HomemakerProfile.js */
import React, { useEffect, useState, useLayoutEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, MapPin, ChefHat, Info, ShoppingBag } from "lucide-react";
import axios from 'axios';
import FoodCard from "../components/FoodCard";
import "./HomemakerProfile.css";
const BASE_URL = process.env.REACT_APP_API_URL;

const HomemakerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [homemaker, setHomemaker] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        // Fetch homemaker info
        const hmRes = await axios.get(`${BASE_URL}/api/auth/${id}`);
        setHomemaker(hmRes.data);

        // Fetch homemaker's products
        const prodRes = await axios.get(`${BASE_URL}/api/products/homemaker/${id}`);
        setProducts(prodRes.data?.products || (Array.isArray(prodRes.data) ? prodRes.data : []));
      } catch (error) {
        console.error('Error fetching chef profile', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, [id]);

  const resolveImg = (chef) => {
    if (!chef.profilePic) return null;
    if (chef.profilePic.startsWith("http")) return chef.profilePic;
    return `${BASE_URL}/images/${chef.profilePic}`;
  };

  const FALLBACK_IMG = "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=2670&auto=format&fit=crop";

  if (loading) return (
    <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
      <ChefHat size={48} className="animate-bounce" style={{ color: '#F97316' }} />
      <p className="mt-3">Preparing chef's profile...</p>
    </div>
  );

  if (!homemaker) return (
    <div className="text-center py-5">
      <Info size={48} color="#EF4444" className="mb-3" />
      <h2>Chef not found</h2>
      <button className="btn btn-primary mt-3" onClick={() => navigate('/chefs')}>Back to Chefs</button>
    </div>
  );

  return (
    <div className="chef-profile-page">
      {/* Hero Banner */}
      <div className="chef-profile-hero">
        <div className="chef-profile-hero-overlay" />
        <div className="back-btn-wrap">
          <button className="back-btn" onClick={() => navigate('/chefs')}>
            <ArrowLeft size={18} />
            Back to Chefs
          </button>
        </div>
      </div>

      {/* Profile Header section */}
      <div className="chef-info-container">
        <div className="chef-info-card">
          <div className="chef-profile-top">
            <div className="chef-profile-img-wrap">
              <img 
                src={resolveImg(homemaker) || FALLBACK_IMG} 
                alt={homemaker.name} 
                className="chef-profile-img" 
              />
            </div>
            
            <div className="chef-profile-details">
              <h1 className="chef-profile-name">{homemaker.name}</h1>
              <div className="chef-profile-meta">
                <div className="meta-item rating">
                  <Star size={18} fill="#F59E0B" color="#F59E0B" />
                  {homemaker.rating || "4.8"} Chef Rating
                </div>
                <div className="meta-item">
                  <MapPin size={18} color="#F97316" />
                  {homemaker.address || "Location unavailable"}
                </div>
                <div className="meta-item">
                  <ChefHat size={18} color="#F97316" />
                  {homemaker.experience || "Expert Cook"}
                </div>
              </div>

              <div className="chef-card-cuisines">
                {(homemaker.cuisines || []).map((cuisine, i) => (
                  <span key={i} className={`cuisine-tag ${i === 0 ? 'active' : ''}`} style={{ fontSize: '0.85rem', padding: '4px 12px' }}>{cuisine}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Bio Section */}
          <div className="chef-profile-bio">
            {homemaker.bio || `Welcome to my kitchen! I love sharing my passion for authentic ${homemaker.cuisines?.[0] || 'homemade'} cooking with you. Every dish is prepared with fresh ingredients and a double portion of love.`}
          </div>
        </div>
      </div>

      {/* Menu / Products section */}
      <div className="chef-menu-container">
        <h2 className="section-title">
          <ShoppingBag size={24} color="#F97316" />
          Chef's Special Menu
        </h2>

        {products.length === 0 ? (
          <div className="text-center py-5" style={{ background: 'white', borderRadius: '20px', border: '1px dashed #D1D5DB' }}>
            <Info size={32} color="#9CA3AF" className="mb-2" />
            <p className="text-muted">No items available right now. Check back soon!</p>
          </div>
        ) : (
          <div className="chef-product-grid">
            {products.map((food) => (
              <FoodCard key={food._id} food={{...food, rating: (Math.random() * 2 + 3).toFixed(1)}} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomemakerProfile;
