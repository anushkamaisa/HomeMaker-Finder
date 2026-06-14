// src/screens/Favorites.js
import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Star } from "lucide-react";
import { CartContext } from "../context/CartContext";
import "./Favorites.css";

const BACKEND_URL = process.env.REACT_APP_API_URL;

const resolveImg = (food) => {
  const raw = food.imageUrl || food.img || food.image || null;

  if (!raw) return null;

  // full URL
  if (raw.startsWith("http") || raw.startsWith("data:")) return raw;

  // remove duplicate 'uploads/' if present
  const cleanPath = raw.replace(/^\/?uploads\//, "");

  return `${BACKEND_URL}/uploads/${cleanPath}`;
};

const FALLBACK_SVG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'%3E%3Crect width='300' height='200' fill='%23F3F4F6'/%3E%3Ctext x='150' y='90' font-family='sans-serif' font-size='40' text-anchor='middle'%3E%F0%9F%8D%BD%EF%B8%8F%3C/text%3E%3Ctext x='150' y='130' font-family='sans-serif' font-size='13' fill='%236B7280' text-anchor='middle'%3EImage unavailable%3C/text%3E%3C/svg%3E`;

const Favorites = () => {
  // ── Logic unchanged ──────────────────────────────────────────
  const [favoriteItems, setFavoriteItems] = useState([]);
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const [addedMap, setAddedMap] = useState({});

  useEffect(() => {
    // Read favorites directly from localStorage which already contains the full objects
    const favs = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavoriteItems(favs);
  }, []);
  // ─────────────────────────────────────────────────────────────

  const handleRemoveFavorite = (foodName) => {
    const updated = favoriteItems.filter((f) => f.name !== foodName);
    setFavoriteItems(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  const handleAddToCart = (food) => {
    addToCart(food);
    setAddedMap((prev) => ({ ...prev, [food.name]: true }));
    setTimeout(() => {
      setAddedMap((prev) => ({ ...prev, [food.name]: false }));
    }, 1500);
  };

  return (
    <div className="fav-page">

      {/* ── Hero Header ── */}
      <div className="fav-hero">
        <div className="fav-hero-inner">
          <div className="fav-hero-text">
            <h1>Your Favourites ❤️</h1>
            <p>Quick access to all your most-loved homemade dishes</p>
          </div>
          {favoriteItems.length > 0 && (
            <span className="fav-hero-count">
              {favoriteItems.length} {favoriteItems.length === 1 ? "dish" : "dishes"} saved
            </span>
          )}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="fav-grid-container">
        {favoriteItems.length === 0 ? (
          <div className="fav-empty">
            <div className="fav-empty-emoji">💔</div>
            <h2>No favourites yet!</h2>
            <p>Tap the ❤️ on any dish to save it here for quick ordering later.</p>
            <button className="fav-explore-btn" onClick={() => navigate("/menu")}>
              Explore Menu
            </button>
          </div>
        ) : (
          <div className="fav-grid">
            {favoriteItems.map((food, idx) => {
              const imgSrc = resolveImg(food) || FALLBACK_SVG;
              const isAdded = addedMap[food.name];
              const rating = food.rating || (Math.random() * 1.5 + 3.5).toFixed(1);

              return (
                <div key={idx} className="fav-card">

                  {/* Image */}
                  <div className="fav-card-img-wrap">
                    <img
                      src={imgSrc}
                      alt={food.name}
                      className="fav-card-img"
                      onError={(e) => { e.target.src = FALLBACK_SVG; }}
                    />

                    {/* Heart remove button */}
                    <button
                      className="fav-heart-btn"
                      onClick={() => handleRemoveFavorite(food.name)}
                      aria-label="Remove from favourites"
                      title="Remove from favourites"
                    >
                      ❤️
                    </button>

                    {/* Rating badge */}
                    <div className="fav-rating-badge">
                      <Star size={11} fill="#FBBF24" color="#FBBF24" />
                      {rating}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="fav-card-body">
                    <h3 className="fav-card-name">{food.name}</h3>
                    <p className="fav-card-desc">
                      {food.desc || food.description || "Delicious homemade dish made with love."}
                    </p>

                    <div className="fav-card-footer">
                      <span className="fav-card-price">₹{food.price}</span>
                      <button
                        className={`fav-add-btn ${isAdded ? "added" : ""}`}
                        onClick={() => handleAddToCart(food)}
                      >
                        <ShoppingCart size={14} />
                        {isAdded ? "Added ✓" : "Add"}
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};

export default Favorites;
