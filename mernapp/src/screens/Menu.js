import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ShoppingCart, Filter, AlertCircle, ChevronDown } from "lucide-react";
import { CartContext } from "../context/CartContext";
import FoodCard from "../components/FoodCard";
import "./Menu.css";

const Menu = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [sortBy, setSortBy] = useState("popularity");
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { cartItems = [] } = useContext(CartContext); // Keep track of cart badge if needed

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/products`);
        const data = await res.json();

        // My new backend returns { products: [...] }
        const productsList = data.products || (Array.isArray(data) ? data : []);

        if (Array.isArray(productsList)) {
          const enhancedData = productsList.map(item => ({
            ...item,
            rating: (Math.random() * 2 + 3).toFixed(1), // Mock rating
            prepTime: Math.floor(Math.random() * 30) + 10, // Mock prep time
            popularity: Math.floor(Math.random() * 100) // Mock popularity
          }));
          setFoodItems(enhancedData);
        } else {
          setFoodItems([]);
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching food items:", err);
        setFoodItems([]);
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);


  // Sort and filter items
  const sortAndFilterItems = () => {
    let items = [...foodItems];

    // Filter by category
    if (filter !== "All") {
      items = items.filter(food => {
        if (!food.category) return false;
        const cat = food.category.toLowerCase();
        const fill = filter.toLowerCase();

        // Handle mapping for legacy category names
        if (fill === "vegetarian" && cat === "veg") return true;
        if (fill === "non-vegetarian" && cat === "non-veg") return true;

        return cat === fill;
      });
    }

    // Filter by search term
    if (search) {
      items = items.filter(food =>
        food.name.toLowerCase().includes(search.toLowerCase()) ||
        (food.description && food.description.toLowerCase().includes(search.toLowerCase()))
      );
    }

    // Sort items
    if (sortBy === "price-low") {
      items.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      items.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      items.sort((a, b) => b.rating - a.rating);
    } else {
      // Default sort by popularity
      items.sort((a, b) => b.popularity - a.popularity);
    }

    return items;
  };

  const filteredItems = sortAndFilterItems();
  const categories = ["All", "Vegetarian", "Non-Vegetarian", "Seafood", "Sweets", "Snacks", "Sambar"];

  return (
    <div className="menu-page">
      {/* Hero Banner */}
      <div className="menu-hero">
        <div className="hero-content">
          <h1>Authentic Homemade Food</h1>
          <p>Discover delicious meals prepared with love and tradition</p>
        </div>
      </div>

      {/* Controls Section */}
      <div className="controls-container">

        <div className="controls-top-row">
          <div className="search-container">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search for your favorite dishes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="sort-section">
            <select
              id="sort-select"
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="popularity">Sort by Relevance</option>
              <option value="rating">Top Rated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
            <ChevronDown size={18} className="sort-icon" />
          </div>
        </div>

        {/* Category Chips */}
        <div className="category-pills">
          {categories.map(category => (
            <button
              key={category}
              className={`category-pill ${filter === category ? 'active' : ''}`}
              onClick={() => setFilter(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Loading Spinner */}
      {loading && (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Finding delicious options...</p>
        </div>
      )}

      {/* No Results Message */}
      {!loading && filteredItems.length === 0 && (
        <div className="no-results">
          <AlertCircle size={48} />
          <h3>No dishes found</h3>
          <p>Try changing your search or category filters.</p>
        </div>
      )}

      {/* Food Cards Grid */}
      {!loading && filteredItems.length > 0 && (
        <div className="food-grid">
          {filteredItems.map((food) => (
            <FoodCard key={food._id || food.name} food={food} />
          ))}
        </div>
      )}

    </div>
  );
};

export default Menu;