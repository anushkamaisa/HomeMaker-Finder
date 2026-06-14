import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Star, Award, ChefHat, MapPin, Utensils } from "lucide-react";
import "../screens/ViewHomemakers.css"; // Your existing CSS file
const BASE_URL = process.env.REACT_APP_API_URL;

const ViewHomemakers = () => {
  const [homemakers, setHomemakers] = useState([]);
  const [filteredHomemakers, setFilteredHomemakers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCuisine, setSelectedCuisine] = useState("All");
  
  // Pre-defined cuisine options
  const defaultCuisines = ["All", "North Indian", "South Indian", "Chinese", "Continental", "Italian", "Mexican", "Thai", "Bengali", "Gujarati", "Punjabi", "Rajasthani"];
  const [cuisinesList, setCuisinesList] = useState(defaultCuisines);
  const [searchQuery, setSearchQuery] = useState("");

  // Food-themed colors
  const colors = {
    primary: "#FF5A00", // Orange like Swiggy
    secondary: "#2B1B17", // Dark brown
    accent: "#60B246", // Green for success
    light: "#FFF9F5", // Warm light background
    highlight: "#FFE8D6", // Warm highlight color
    cardBg: "#FFFFFF",
    textPrimary: "#3D3D3D",
    textSecondary: "#7E808C",
    gold: "#FFD700", // For stars/awards
    backgroundGradient: "linear-gradient(to bottom, #FFF3E0, #FFF9F5)"
  };

  useEffect(() => {
    // Function to fetch homemakers
    const fetchHomemakers = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${BASE_URL}/api/homemakers`);
        
        
        // Sort homemakers by rating (highest first)
        const sortedHomemakers = response.data.sort((a, b) => b.rating - a.rating);
        setHomemakers(sortedHomemakers);
        setFilteredHomemakers(sortedHomemakers);
        
        // Extract unique cuisines for the filter
        const allCuisines = [...defaultCuisines];
        response.data.forEach(homemaker => {
          homemaker.cuisines.forEach(cuisine => {
            if (!allCuisines.includes(cuisine)) {
              allCuisines.push(cuisine);
            }
          });
        });
        setCuisinesList(allCuisines);
      } catch (err) {
        console.error("Error fetching homemakers:", err);
        setError("Failed to load homemakers");
      } finally {
        setLoading(false);
      }
    };

    fetchHomemakers();
  }, []); 

  // Filter homemakers based on selected cuisine and search query
  useEffect(() => {
    let filtered = [...homemakers];
    
    // Filter by cuisine
    if (selectedCuisine !== "All") {
      filtered = filtered.filter(homemaker => 
        homemaker.cuisines.includes(selectedCuisine)
      );
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(homemaker => 
        homemaker.name.toLowerCase().includes(query) || 
        homemaker.address.toLowerCase().includes(query) ||
        homemaker.cuisines.some(cuisine => cuisine.toLowerCase().includes(query))
      );
    }
    
    setFilteredHomemakers(filtered);
  }, [selectedCuisine, searchQuery, homemakers]);

  // Function to render star ratings
  const renderRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<Star key={i} fill={colors.gold} color={colors.gold} size={16} />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <span key={i} style={{ position: "relative" }}>
            <Star color={colors.gold} size={16} style={{ opacity: 0.3 }} />
            <Star fill={colors.gold} color={colors.gold} size={16} style={{ position: "absolute", left: 0, clipPath: "polygon(0 0, 50% 0, 50% 100%, 0 100%)" }} />
          </span>
        );
      } else {
        stars.push(<Star key={i} color={colors.gold} size={16} style={{ opacity: 0.3 }} />);
      }
    }
    return <div className="stars-container">{stars} <span className="rating-text">({rating.toFixed(1)})</span></div>;
  };

  // Find the top homemaker of the week (highest rated)
  const topHomemaker = homemakers.length > 0 ? homemakers[0] : null;

  return (
    <div style={{ 
      background: colors.backgroundGradient,
      minHeight: "100vh",
      paddingBottom: "40px"
    }}>
      <div className="homemakers-container" style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
        <h1 style={{ 
          color: colors.secondary, 
          textAlign: "center", 
          marginBottom: "10px",
          fontWeight: "700",
          fontSize: "32px"
        }}>
          Discover Local Homemakers
        </h1>
        <p style={{ 
          textAlign: "center", 
          color: colors.textSecondary,
          marginBottom: "30px"
        }}>
          Find authentic home-cooked meals from passionate chefs in your neighborhood
        </p>

        {/* Search and Filter */}
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between",
          flexWrap: "wrap",
          marginBottom: "24px",
          gap: "16px"
        }}>
          <div style={{ 
            position: "relative",
            flex: "1",
            minWidth: "280px"
          }}>
            <input
              type="text"
              placeholder="Search by name, location or cuisine..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: "8px",
                border: `1px solid ${colors.highlight}`,
                backgroundColor: colors.cardBg,
                fontSize: "14px"
              }}
            />
          </div>
          <select
            value={selectedCuisine}
            onChange={(e) => setSelectedCuisine(e.target.value)}
            style={{
              padding: "12px 16px",
              borderRadius: "8px",
              border: `1px solid ${colors.highlight}`,
              backgroundColor: colors.cardBg,
              cursor: "pointer",
              minWidth: "200px"
            }}
          >
            {cuisinesList.map(cuisine => (
              <option key={cuisine} value={cuisine}>
                {cuisine === "All" ? "All Cuisines" : cuisine}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <div style={{ 
            padding: "16px", 
            backgroundColor: "#FFEBEE", 
            color: "#D32F2F",
            borderRadius: "8px", 
            marginBottom: "24px",
            textAlign: "center"
          }}>
            {error}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <div className="spinner" style={{ 
              width: "40px", 
              height: "40px", 
              border: `4px solid ${colors.highlight}`,
              borderTopColor: colors.primary,
              borderRadius: "50%",
              margin: "0 auto",
              animation: "spin 1s linear infinite"
            }}></div>
            <p style={{ marginTop: "16px", color: colors.textSecondary }}>Loading homemakers...</p>
          </div>
        ) : (
          <>
            {/* Top Homemaker of the Week Section */}
            {topHomemaker && (
              <div style={{ 
                backgroundColor: colors.cardBg,
                borderRadius: "16px",
                padding: "24px",
                marginBottom: "32px",
                boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
                border: `2px solid ${colors.gold}`,
                position: "relative",
                overflow: "hidden"
              }}>
                <div style={{
                  position: "absolute",
                  top: "24px",
                  right: "24px",
                  backgroundColor: colors.gold,
                  color: colors.secondary,
                  padding: "8px 16px",
                  borderRadius: "20px",
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "14px"
                }}>
                  <Award size={18} />
                  Top Homemaker of the Week
                </div>
                
                <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
                  <div style={{ flex: "0 0 180px" }}>
                    <div style={{
                      width: "180px",
                      height: "180px",
                      borderRadius: "12px",
                      overflow: "hidden",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                    }}>
                      <img
                        src={`/images/${topHomemaker.profilePic}`}
                        alt={topHomemaker.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                        onError={(e) => {
                          e.target.src = "/api/placeholder/180/180";
                        }}
                      />
                    </div>
                  </div>
                  
                  <div style={{ flex: "1" }}>
                    <h2 style={{ 
                      fontSize: "28px", 
                      fontWeight: "700", 
                      color: colors.secondary,
                      marginBottom: "12px"
                    }}>
                      {topHomemaker.name}
                    </h2>
                    
                    {renderRating(topHomemaker.rating || 4.9)}
                    
                    <div style={{ 
                      display: "flex", 
                      alignItems: "center", 
                      marginTop: "12px",
                      color: colors.textSecondary
                    }}>
                      <MapPin size={18} style={{ marginRight: "8px" }} />
                      {topHomemaker.address}
                    </div>
                    
                    <div style={{ 
                      display: "flex", 
                      alignItems: "center", 
                      marginTop: "8px",
                      marginBottom: "12px",
                      color: colors.textSecondary
                    }}>
                      <ChefHat size={18} style={{ marginRight: "8px" }} />
                      <span style={{ fontWeight: "500" }}>Specialties:</span> {topHomemaker.specialties || "Traditional Home Cooking"}
                    </div>
                    
                    <div style={{ marginTop: "16px" }}>
                      <div style={{ marginBottom: "12px", fontWeight: "500", color: colors.textPrimary }}>
                        Cuisines:
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                        {topHomemaker.cuisines.map((cuisine, index) => (
                          <span key={index} style={{
                            backgroundColor: colors.highlight,
                            color: colors.primary,
                            padding: "6px 12px",
                            borderRadius: "50px",
                            fontSize: "14px",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px"
                          }}>
                            <Utensils size={14} />
                            {cuisine}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div style={{ marginTop: "24px" }}>
                      <Link to={`/homemaker/${topHomemaker._id}`}>
                        <button style={{
                          backgroundColor: colors.primary,
                          color: "white",
                          border: "none",
                          borderRadius: "8px",
                          padding: "12px 24px",
                          fontSize: "16px",
                          fontWeight: "600",
                          cursor: "pointer",
                          transition: "all 0.2s ease"
                        }}>
                          View Full Menu
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* All Homemakers Grid */}
            <h2 style={{ 
              color: colors.secondary, 
              fontWeight: "600", 
              fontSize: "24px",
              marginBottom: "24px"
            }}>
              All Homemakers {selectedCuisine !== "All" ? `- ${selectedCuisine} Cuisine` : ""}
            </h2>
            
            {filteredHomemakers.length === 0 ? (
              <div style={{
                textAlign: "center",
                padding: "40px",
                backgroundColor: colors.cardBg,
                borderRadius: "12px",
                color: colors.textSecondary
              }}>
                No homemakers found for your search criteria.
              </div>
            ) : (
              <div style={{ 
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "24px"
              }}>
                {filteredHomemakers.map((homemaker) => (
                  <div 
                    key={homemaker._id} 
                    style={{
                      backgroundColor: colors.cardBg,
                      borderRadius: "12px",
                      overflow: "hidden",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                      cursor: "pointer",
                      position: "relative"
                    }}
                    className="homemaker-card-hover"
                  >
                    <div style={{
                      height: "180px",
                      position: "relative",
                      overflow: "hidden"
                    }}>
                      <img
                        src={`/images/${homemaker.profilePic}`}
                        alt={homemaker.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover"
                        }}
                        onError={(e) => {
                          e.target.src = "/api/placeholder/280/180";
                        }}
                      />
                      
                      {/* Rating badge */}
                      <div style={{
                        position: "absolute",
                        top: "12px",
                        right: "12px",
                        backgroundColor: "rgba(0,0,0,0.7)",
                        color: "white",
                        borderRadius: "4px",
                        padding: "4px 8px",
                        fontSize: "14px",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px"
                      }}>
                        <Star fill="white" color="white" size={14} />
                        {homemaker.rating?.toFixed(1) || "4.0"}
                      </div>
                    </div>
                    
                    <div style={{ padding: "16px" }}>
                      <h3 style={{ 
                        fontSize: "18px", 
                        fontWeight: "600",
                        marginBottom: "8px",
                        color: colors.secondary
                      }}>
                        {homemaker.name}
                      </h3>
                      
                      <div style={{ 
                        display: "flex", 
                        alignItems: "center", 
                        marginBottom: "8px",
                        fontSize: "14px",
                        color: colors.textSecondary
                      }}>
                        <MapPin size={14} style={{ marginRight: "4px" }} />
                        {homemaker.address}
                      </div>
                      
                      <div style={{ marginBottom: "16px" }}>
                        <div style={{ 
                          display: "flex", 
                          flexWrap: "wrap", 
                          gap: "6px", 
                          marginTop: "8px"
                        }}>
                          {homemaker.cuisines.slice(0, 3).map((cuisine, index) => (
                            <span key={index} style={{
                              backgroundColor: colors.highlight,
                              color: colors.primary,
                              padding: "4px 10px",
                              borderRadius: "50px",
                              fontSize: "13px"
                            }}>
                              {cuisine}
                            </span>
                          ))}
                          {homemaker.cuisines.length > 3 && (
                            <span style={{
                              backgroundColor: colors.light,
                              color: colors.textSecondary,
                              padding: "4px 10px",
                              borderRadius: "50px",
                              fontSize: "13px"
                            }}>
                              +{homemaker.cuisines.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <Link to={`/homemaker/${homemaker._id}`} style={{ textDecoration: "none" }}>
                        <button style={{
                          width: "100%",
                          backgroundColor: "transparent",
                          color: colors.primary,
                          border: `2px solid ${colors.primary}`,
                          borderRadius: "8px",
                          padding: "10px",
                          fontSize: "15px",
                          fontWeight: "600",
                          cursor: "pointer",
                          transition: "all 0.2s ease"
                        }}>
                          View Menu
                        </button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ViewHomemakers;