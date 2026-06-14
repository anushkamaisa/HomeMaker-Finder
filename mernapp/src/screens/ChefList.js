/* src/screens/ChefList.js */
import React, { useLayoutEffect, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Star, MapPin, Search, ChefHat, Info, ChevronRight, Award } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import "./ChefList.css";

const BASE_URL = process.env.REACT_APP_API_URL;

const ChefList = () => {
    const [chefs, setChefs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState("All");
    const navigate = useNavigate();

    const filters = ["All", "South Indian", "North Indian", "Continental", "Desserts", "Healthy"];

    useLayoutEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        const fetchChefs = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${BASE_URL}/api/view-homemakers`);
                setChefs(response.data || []);
            } catch (error) {
                console.error("Error fetching chefs:", error);
                setChefs([]);
            } finally {
                setLoading(false);
            }
        };
        fetchChefs();
    }, []);

    const filteredChefs = chefs.filter(chef => {
        const matchesSearch = chef.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            chef.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (chef.cuisines && chef.cuisines.some(c => c.toLowerCase().includes(searchQuery.toLowerCase())));
        
        const matchesFilter = activeFilter === "All" || 
            (chef.cuisines && chef.cuisines.some(c => c.toLowerCase().includes(activeFilter.toLowerCase())));
            
        return matchesSearch && matchesFilter;
    });

    const resolveImg = (chef) => {
        if (!chef.profilePic) return null;
        if (chef.profilePic.startsWith("http")) return chef.profilePic;
        return `${BASE_URL}/images/${chef.profilePic}`;
    };

    const FALLBACK_IMG = "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=2670&auto=format&fit=crop";

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="chef-list-page"
        >
            <section className="chef-hero">
                <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="chef-hero-content"
                >
                    <h1>Meet Our Chefs</h1>
                    <p>Discover talented home chefs preparing authentic, hygienic, and heartwarming meals delivered right to your doorstep.</p>
                </motion.div>
            </section>

            <div className="chef-controls">
                <div className="chef-search-container">
                    <Search className="chef-search-icon" size={20} />
                    <input 
                        type="text" 
                        placeholder="Search by name, cuisine, or area..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="chef-search-input"
                    />
                </div>

                <div className="chef-filters">
                    {filters.map(filter => (
                        <button 
                            key={filter}
                            className={`filter-chip ${activeFilter === filter ? 'active' : ''}`}
                            onClick={() => setActiveFilter(filter)}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
            </div>

            <div className="chef-grid-container">
                {loading ? (
                    <div className="text-center py-5">
                       <motion.div
                         animate={{ rotate: 360 }}
                         transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                         style={{ display: 'inline-block', marginBottom: '15px' }}
                       >
                         <ChefHat size={48} color="#FF6B35" />
                       </motion.div>
                       <p style={{ color: '#666', fontWeight: 500 }}>Curating the best chefs for you...</p>
                    </div>
                ) : filteredChefs.length === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="chef-empty"
                    >
                        <Info size={64} color="#ccc" strokeWidth={1} style={{ marginBottom: '20px' }} />
                        <h2>No chefs found</h2>
                        <p>Try adjusting your search or filters to find more talented chefs.</p>
                    </motion.div>
                ) : (
                    <div className="chef-grid">
                        <AnimatePresence mode='popLayout'>
                            {filteredChefs.map((chef, index) => (
                                <motion.div 
                                    layout
                                    key={chef._id} 
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                    className="chef-card" 
                                    onClick={() => navigate(`/homemaker/${chef._id}`)}
                                >
                                    <div className="chef-card-img-wrap">
                                        <img 
                                            src={resolveImg(chef) || FALLBACK_IMG} 
                                            alt={chef.name} 
                                            className="chef-card-img" 
                                        />
                                    </div>
                                    
                                    <h3 className="chef-card-name">{chef.name}</h3>
                                    
                                    <div className="chef-card-location">
                                        <MapPin size={12} />
                                        {chef.address || "Serving your neighborhood"}
                                    </div>

                                    <div className="cuisine-tags">
                                        {(chef.cuisines || ["Authentic"]).slice(0, 2).map((cuisine, i) => (
                                            <span key={i} className="cuisine-tag">{cuisine}</span>
                                        ))}
                                    </div>

                                    <p className="chef-card-desc">
                                        Specializing in traditional home-cooked delicacies with fresh, local ingredients.
                                    </p>
                                    
                                    <div className="chef-card-stats">
                                        <div className="chef-stat">
                                            <div className="stat-value">
                                                <Star size={14} fill="#FF6B35" strokeWidth={0} />
                                                {chef.rating || "4.8"}
                                            </div>
                                            <span className="stat-label">Rating</span>
                                        </div>
                                        <div className="chef-stat">
                                            <div className="stat-value">
                                                <Award size={14} color="#FF6B35" />
                                                {chef.experience?.split(' ')[0] || "3+"}
                                            </div>
                                            <span className="stat-label">Exp (Yrs)</span>
                                        </div>
                                    </div>

                                    <button className="chef-view-btn">
                                        View Menu <ChevronRight size={16} />
                                    </button>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default ChefList;
