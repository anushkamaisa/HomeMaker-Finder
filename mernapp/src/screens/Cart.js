import React, { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { ShoppingCart, Trash2, Minus, Plus, ArrowLeft, ShoppingBag, Tag, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CheckoutModal from "../components/CheckoutModal"; // Import the new modal
import "./Cart.css";

// Resolves image from item — matches FoodCard logic
const BACKEND_URL = process.env.REACT_APP_API_URL;
const resolveImg = (item) => {
  let raw = item.imageUrl || item.img || item.image || null;

  if (!raw) return null;

  if (raw.includes("localhost:5000")) {
    raw = raw.replace(/https?:\/\/localhost:5000/, BACKEND_URL);
    return raw;
  }

  // full URL
  if (raw.startsWith("http") || raw.startsWith("data:")) return raw;

  // clean uploads path
  const cleanPath = raw.replace(/^\/?uploads\//, "");

  return `${BACKEND_URL}/uploads/${cleanPath}`;
};

const FALLBACK_SVG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Crect width='80' height='80' fill='%23F3F4F6' rx='8'/%3E%3Ctext x='40' y='50' font-size='30' text-anchor='middle'%3E%F0%9F%8D%BD%EF%B8%8F%3C/text%3E%3C/svg%3E`;

const Cart = () => {
  // ── All logic remains intact ────────────────────────────────
  const { cartItems = [], updateQuantity, removeFromCart } = useContext(CartContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const subtotal = cartItems ? cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0) : 0;
  const deliveryFee = subtotal > 0 ? 40 : 0;
  const hasDiscount = subtotal >= 500;
  const discount = hasDiscount ? 50 : 0;
  const total = subtotal + deliveryFee - discount;

  const handleCheckout = () => {
    setIsModalOpen(true); // Open the modern checkout modal
  };
  // ─────────────────────────────────────────────────────────────

  if (!cartItems || cartItems.length === undefined) {
    return (
      <div className="cart-loading">
        <div className="spinner" />
        <p>Loading your cart…</p>
      </div>
    );
  }

  return (
    <div className="cart-page">
      
      {/* ── Sticky Header ── */}
      <div className="cart-page-header">
        <button className="cart-back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} />
          Back
        </button>
        <h1 className="cart-page-title">
          <ShoppingCart size={22} />
          Your Cart
          {cartItems.length > 0 && (
            <span className="cart-item-count-badge">{cartItems.length}</span>
          )}
        </h1>
      </div>

      {/* ── Content ── */}
      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <div className="empty-cart-emoji">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added any delicious homemade food to your cart yet.</p>
          <button className="browse-menu-btn" onClick={() => navigate("/menu")}>
            Explore Menu
          </button>
        </div>
      ) : (
        <div className="cart-layout">

          <div className="cart-items-panel">
            <div className="panel-header">
              <h3>Order Items</h3>
              <span className="panel-count">
                {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
              </span>
            </div>

            {cartItems.map((item, index) => {
              const imgSrc = resolveImg(item) || FALLBACK_SVG;
              return (
                <div key={item._id || index} className="cart-item">
                  <img
                    src={imgSrc}
                    alt={item.name}
                    className="cart-item-img"
                    onError={(e) => { e.target.src = FALLBACK_SVG; }}
                  />
                  <div className="cart-item-info">
                    <p className="cart-item-name">{item.name}</p>
                    {item.category && (
                      <span className="cart-item-tag">{item.category}</span>
                    )}
                  </div>

                  <div className="cart-item-right">
                    <span className="cart-item-price">
                      ₹{(item.price * item.quantity).toFixed(0)}
                    </span>

                    <div className="cart-item-controls">
                      <button
                        className="qty-btn"
                        onClick={() => updateQuantity(item._id || item.name, Math.max(1, item.quantity - 1))}
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={14} />
                      </button>
                      <span className="qty-value">{item.quantity}</span>
                      <button
                        className="qty-btn"
                        onClick={() => updateQuantity(item._id || item.name, item.quantity + 1)}
                      >
                        <Plus size={14} />
                      </button>
                      <button
                        className="remove-item-btn"
                        onClick={() => removeFromCart(item._id || item.name)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="cart-summary-panel">
            <div className="summary-header">
              <h3>Order Summary</h3>
            </div>

            <div className="summary-body">
              <div className="summary-row">
                <span>Subtotal ({cartItems.length} items)</span>
                <span>₹{subtotal.toFixed(0)}</span>
              </div>
              <div className="summary-row">
                <span>Delivery Fee</span>
                <span>₹{deliveryFee.toFixed(0)}</span>
              </div>

              {hasDiscount && (
                <div className="summary-discount">
                  <span>
                    <Tag size={14} style={{ marginRight: 4, verticalAlign: "middle" }} />
                    Discount Applied
                  </span>
                  <span>-₹50.00</span>
                </div>
              )}

              <hr className="summary-divider" />

              <div className="summary-total">
                <span>Total Amount</span>
                <span>₹{total.toFixed(0)}</span>
              </div>

              {!hasDiscount && (
                <div className="promo-bar">
                  <p>Add ₹{(500 - subtotal).toFixed(0)} more to unlock ₹50 off!</p>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${Math.min((subtotal / 500) * 100, 100)}%` }} />
                  </div>
                </div>
              )}

              {/* Redesigned Button */}
              <button className="checkout-cta" onClick={handleCheckout}>
                <ShoppingBag size={18} />
                Order Now
                <ArrowRight size={18} style={{ marginLeft: "auto" }} />
              </button>

              <div className="delivery-info">
                <p>🚀 Superfast delivery in 30–45 mins</p>
                <p>✨ 100% Homemade and Hygienic</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modern Checkout Modal */}
      <CheckoutModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        totalAmount={total}
        itemCount={cartItems.length}
      />

    </div>
  );
};

export default Cart;