import React, { useState, useEffect, useContext } from 'react';
import { Heart, Star, ShoppingCart, Clock } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import '../styles/FoodCard.css';

// Backend base URL for resolving relative image paths
const BASE_URL = process.env.REACT_APP_API_URL;

// ✅ FIXED: more robust image resolver
const resolveImageSrc = (food) => {
  const raw = food.imageUrl || food.img || food.image || food.photo;

  if (!raw) return null;

  if (raw.startsWith('http') || raw.startsWith('data:')) return raw;

  if (raw.includes('/uploads/')) {
    return `${BASE_URL}${raw}`;
  }

  return `${BASE_URL}/uploads/${raw}`;
};

const FALLBACK_SVG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'%3E%3Crect width='300' height='200' fill='%23FFF7ED'/%3E%3Ctext x='150' y='90' font-family='sans-serif' font-size='48' text-anchor='middle'%3E%F0%9F%8D%B2%3C/text%3E%3Ctext x='150' y='130' font-family='sans-serif' font-size='14' fill='%23FF6B35' text-anchor='middle'%3EDelicious meal coming up%3C/text%3E%3C/svg%3E`;

const FoodCard = ({ food, onToggleFavorite }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [added, setAdded] = useState(false);
  const [imgSrc, setImgSrc] = useState(null);
  const [imgLoaded, setImgLoaded] = useState(false);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setIsFavorite(storedFavorites.some(item => item.name === food.name));
  }, [food.name]);

  // ✅ FIXED: ensure image is stored properly
  const handleFavoriteToggle = (e) => {
    e.stopPropagation();
    e.preventDefault();

    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    let updatedFavorites;

    if (isFavorite) {
      updatedFavorites = storedFavorites.filter(item => item.name !== food.name);
    } else {
      const enrichedFood = {
        ...food,
        imageUrl: food.imageUrl || food.img || food.image || food.photo || ""
      };

      updatedFavorites = [...storedFavorites, enrichedFood];
    }

    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    setIsFavorite(!isFavorite);

    if (onToggleFavorite) {
      onToggleFavorite(food, !isFavorite);
    }
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(food);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  useEffect(() => {
    const resolved = resolveImageSrc(food);
    setImgSrc(resolved || FALLBACK_SVG);
    setImgLoaded(false);
  }, [food]);

  const price = food.price || 150;
  const rating = food.rating || (3.5 + Math.random() * 1.5).toFixed(1);
  const prepTime = food.prepTime || "25-30";

  return (
    <div className="modern-food-card">
      <div className="food-card-img-wrapper">
        {!imgLoaded && <div className="food-card-skeleton" />}
        <img
          src={imgSrc || FALLBACK_SVG}
          alt={food.name}
          className={`food-card-img ${imgLoaded ? 'img-visible' : 'img-hidden'}`}
          onLoad={() => setImgLoaded(true)}
          onError={(e) => {
            if (e.target.src !== FALLBACK_SVG) {
              e.target.src = FALLBACK_SVG;
            }
            setImgLoaded(true);
          }}
        />

        <button
          className={`food-card-badge ${isFavorite ? 'is-favorite' : ''}`}
          onClick={handleFavoriteToggle}
        >
          <Heart
            size={20}
            fill={isFavorite ? "#EF4444" : "none"}
            strokeWidth={isFavorite ? 0 : 2}
          />
        </button>
      </div>

      <div className="food-card-content">
        <div className="food-card-header">
          <h3 className="food-card-title">{food.name}</h3>
          <div className="food-card-rating">
            <Star size={14} fill="#FF6B35" strokeWidth={0} />
            <span>{rating}</span>
          </div>
        </div>

        <p className="food-card-desc">
          {food.desc || food.description || "A delicious homemade specialty prepared with fresh ingredients and traditional techniques."}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px', color: '#888', fontSize: '0.8rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={14} /> {prepTime} mins
          </span>
          <span style={{ height: '4px', width: '4px', borderRadius: '50%', background: '#ccc' }}></span>
          <span>Authentic</span>
        </div>

        <div className="food-card-footer">
          <div className="food-card-price">{price}</div>
          <button
            className="food-card-btn"
            onClick={handleAddToCart}
            disabled={added}
          >
            {added ? (
              <>Added ✓</>
            ) : (
              <>
                <ShoppingCart size={18} />
                Add
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;