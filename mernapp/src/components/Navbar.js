import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaUserCircle, FaShoppingCart, FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa";
import { CartContext } from "../context/CartContext";
import "../styles/Navbar.css";

const Navbar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(localStorage.getItem("userRole") || "");
  
  const { cartItems = [], updateQuantity, removeFromCart } = useContext(CartContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      setIsAuthenticated(!!token);
      setUserRole(localStorage.getItem("userRole") || "");
    };

    checkAuth();
    // Fires when another tab changes localStorage
    window.addEventListener("storage", checkAuth);
    // Fires within the same tab (dispatched by handleLogout)
    window.addEventListener("localAuthChange", checkAuth);
    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("localAuthChange", checkAuth);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("homemakerId");
    localStorage.removeItem("customerId");
    setIsAuthenticated(false);
    setUserRole("");
    // Notify same-tab listeners
    window.dispatchEvent(new Event("localAuthChange"));
    navigate("/login");
  };

  return (
    <nav className="custom-navbar">
      <div className="custom-navbar-container">
        
        {/* LEFT COMPONENT - BRAND/LOGO */}
        <Link className="navbar-brand-link" to="/">
          <div className="navbar-logo-bubble">
            🍽️
          </div>
          <span className="navbar-brand-text">
            <span className="brand-dark">HomeMade</span>
            <span className="brand-accent"> Meals</span>
          </span>
        </Link>

        {/* CENTER COMPONENT - DESKTOP LINKS */}
        <div className="desktop-nav-menu">
          <Link to="/" className={`nav-item-link ${location.pathname === '/' ? 'active' : ''}`}>
            Home
          </Link>
          <Link to="/menu" className={`nav-item-link ${location.pathname === '/menu' ? 'active' : ''}`}>
            Menu
          </Link>
          <Link to="/favorites" className={`nav-item-link ${location.pathname === '/favorites' ? 'active' : ''}`}>
            Favorites
          </Link>
          <Link to="/chefs" className={`nav-item-link ${location.pathname === '/chefs' ? 'active' : ''}`}>
            Chefs
          </Link>
          {isAuthenticated && userRole === "Customer" && (
            <Link to="/orders" className={`nav-item-link ${location.pathname === '/orders' ? 'active' : ''}`}>
              My Orders
            </Link>
          )}
          {isAuthenticated && userRole === "Homemaker" && (
            <Link to="/homemaker-dashboard" className={`nav-item-link ${location.pathname === '/homemaker-dashboard' ? 'active' : ''}`}>
              My Kitchen
            </Link>
          )}
          {isAuthenticated && userRole === "Admin" && (
            <Link to="/admin-dashboard" className={`nav-item-link ${location.pathname === '/admin-dashboard' ? 'active' : ''}`}>
              Admin Panel
            </Link>
          )}
        </div>

        {/* RIGHT COMPONENT - ACTIONS */}
        <div className="navbar-actions">
          
          {/* Cart Dropdown Container */}
          <div style={{ position: 'relative' }}>
            <button 
              className="icon-action-btn cart-icon-btn" 
              onClick={() => { setIsCartOpen(!isCartOpen); setIsProfileOpen(false); }}
            >
              <FaShoppingCart size={20} />
              {cartItems?.length > 0 && (
                <span className="cart-notification-badge">{cartItems.length}</span>
              )}
            </button>

            {/* Cart Modal rendering */}
            {isCartOpen && (
              <div className="cart-modal">
                <h5 className="mb-3 text-center" style={{ color: "#F97316", fontWeight: "700" }}>Your Cart</h5>
                <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                  {cartItems.length > 0 ? (
                    cartItems.map((item, index) => (
                      <div key={index} className="cart-item" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #F3F4F6", marginBottom: "8px" }}>
                        <div className="d-flex align-items-center">
                          {item.img && <img 
                            src={item.img} 
                            alt={item.name} 
                            style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "8px", marginRight: "10px", border: "1px solid #F3F4F6" }} 
                          />}
                          <div>
                            <p className="m-0 fw-bold" style={{ color: "#111827", fontSize: "0.9rem" }}>{item.name}</p>
                            <p className="m-0 text-muted" style={{ fontSize: "0.8rem" }}>₹{item.price} x {item.quantity}</p>
                          </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          {/* Pill-style qty control */}
                          <div className="mini-cart-qty-pill">
                            <button
                              className="mini-cart-qty-btn"
                              onClick={() => updateQuantity(item.name, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              aria-label="Decrease quantity"
                            >−</button>
                            <span className="mini-cart-qty-num">{item.quantity}</span>
                            <button
                              className="mini-cart-qty-btn"
                              onClick={() => updateQuantity(item.name, item.quantity + 1)}
                              aria-label="Increase quantity"
                            >+</button>
                          </div>
                          <button 
                            className="mini-cart-remove-btn"
                            onClick={() => removeFromCart(item.name)}
                            aria-label="Remove item"
                          >✖</button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted m-0 py-3">Your cart is empty.</p>
                  )}
                </div>
                {cartItems.length > 0 && (
                  <Link 
                    to="/cart" 
                    onClick={() => setIsCartOpen(false)}
                    style={{ display: "block", textAlign: "center", background: "#F97316", color: "white", padding: "10px", borderRadius: "8px", marginTop: "16px", textDecoration: "none", fontWeight: "600" }}
                  >
                    View Full Cart
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Authentication Component */}
          {isAuthenticated ? (
            <div style={{ position: 'relative' }}>
              <button 
                className="icon-action-btn auth-icon-btn"
                onClick={() => { setIsProfileOpen(!isProfileOpen); setIsCartOpen(false); }}
              >
                <FaUserCircle size={22} />
              </button>
              {isProfileOpen && (
                <div className="profile-dropdown">
                  <Link to="/profile" className="dropdown-item" onClick={() => setIsProfileOpen(false)}>
                    <FaUserCircle /> View Profile
                  </Link>
                  <button onClick={handleLogout} className="dropdown-item logout-btn mt-1">
                    <FaSignOutAlt /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="icon-action-btn auth-icon-btn">
              <FaUserCircle size={22} />
            </Link>
          )}

          {/* Mobile Menu Toggler */}
          <button 
            className="mobile-toggler"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>

        </div>
      </div>

      {/* MOBILE MENU OVERLAY */}
      {isMobileMenuOpen && (
        <div className="mobile-nav-overlay">
          <Link
            to="/"
            className={`mobile-nav-link ${location.pathname === '/' ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >Home</Link>
          <Link
            to="/menu"
            className={`mobile-nav-link ${location.pathname === '/menu' ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >Menu</Link>
          <Link
            to="/favorites"
            className={`mobile-nav-link ${location.pathname === '/favorites' ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >Favorites</Link>
          <Link
            to="/chefs"
            className={`mobile-nav-link ${location.pathname === '/chefs' ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >Chefs</Link>

          {/* Role-based links — mirrors desktop nav exactly */}
          {isAuthenticated && userRole === "Customer" && (
            <Link
              to="/orders"
              className={`mobile-nav-link ${location.pathname === '/orders' ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >My Orders</Link>
          )}
          {isAuthenticated && userRole === "Homemaker" && (
            <Link
              to="/homemaker-dashboard"
              className={`mobile-nav-link ${location.pathname === '/homemaker-dashboard' ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >My Kitchen</Link>
          )}
          {isAuthenticated && userRole === "Admin" && (
            <Link
              to="/admin-dashboard"
              className={`mobile-nav-link ${location.pathname === '/admin-dashboard' ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >Admin Panel</Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;