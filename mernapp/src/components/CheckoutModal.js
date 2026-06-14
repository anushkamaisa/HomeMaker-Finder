/* src/components/CheckoutModal.js */
import React, { useState, useContext, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  User, 
  Phone, 
  MapPin, 
  MessageSquare, 
  CreditCard, 
  Banknote, 
  Smartphone,
  CheckCircle,
  ArrowRight
} from "lucide-react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // ✅ Import axios
import "./CheckoutModal.css";

const BASE_URL = process.env.REACT_APP_API_URL; // ✅ Define BASE_URL

const CheckoutModal = ({ isOpen, onClose, totalAmount, itemCount }) => {
  const { cartItems, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    instructions: "",
    paymentMethod: "cash"
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // 🔥 Fix: Prevent background scroll when modal is open
    useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // ── Validation ──
  const validateForm = () => {
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Full name is required";
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Enter a valid 10-digit number";
    }
    if (!formData.address.trim()) newErrors.address = "Delivery address is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      // 1. Group items by homemakerId
      const groupedOrders = {};
      
      cartItems.forEach(item => {
        // Handle both populated and unpopulated homemakerId
        const hmId = item.homemakerId?._id || item.homemakerId;
        
        if (!hmId) {
          console.error("Item missing homemakerId:", item);
          return;
        }

        if (!groupedOrders[hmId]) {
          groupedOrders[hmId] = [];
        }
        groupedOrders[hmId].push(item);
      });

      // 2. Create separate orders for each homemaker
      const orderPromises = Object.keys(groupedOrders).map(hmId => {
        const itemsForHm = groupedOrders[hmId];
        const subtotal = itemsForHm.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        const orderData = {
          homemakerId: hmId,
          items: itemsForHm,
          total: subtotal + 40, // Adding base delivery fee per split order or adjust as needed
          userDetails: {
            name: formData.name,
            phone: formData.phone,
            address: formData.address,
            instructions: formData.instructions,
            paymentMethod: formData.paymentMethod
          },
          status: "Placed",
          createdAt: new Date().toISOString()
        };

        return axios.post(`${BASE_URL}/api/orders`, orderData);
      });

      // 3. Wait for all orders to be placed
      await Promise.all(orderPromises);

      setIsSubmitting(false);
      setIsSuccess(true);
      if (clearCart) clearCart(); 
      
      setTimeout(() => {
        onClose();
        navigate("/orders");
      }, 2000);
    } catch (err) {
      console.error("Order process failed:", err);
      setIsSubmitting(false);
      alert("Something went wrong while placing your order. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="checkout-modal-overlay" onClick={isSuccess ? null : onClose}>
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="checkout-modal-container"
          onClick={(e) => e.stopPropagation()}
        >
          {!isSuccess ? (
            <div className="modal-content-scroller">
              {/* Header - Fixed internally */}
              <div className="checkout-modal-header">
                <h2>Secure Checkout</h2>
                <button className="close-modal-btn" onClick={onClose}>
                  <X size={20} />
                </button>
              </div>

              {/* Form - Scrollable */}
              <form onSubmit={handleSubmit} className="checkout-form">
                <div className="form-group">
                  <label>Full Name *</label>
                  <div className="input-with-icon">
                    <User className="input-icon" size={18} />
                    <input 
                      type="text" 
                      name="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`checkout-input ${errors.name ? 'input-error' : ''}`}
                    />
                  </div>
                  {errors.name && <span className="error-message">{errors.name}</span>}
                </div>

                <div className="form-group">
                  <label>Phone Number *</label>
                  <div className="input-with-icon">
                    <Phone className="input-icon" size={18} />
                    <input 
                      type="tel" 
                      name="phone"
                      placeholder="10-digit mobile number"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`checkout-input ${errors.phone ? 'input-error' : ''}`}
                    />
                  </div>
                  {errors.phone && <span className="error-message">{errors.phone}</span>}
                </div>

                <div className="form-group">
                  <label>Delivery Address *</label>
                  <div className="input-with-icon">
                    <MapPin className="input-icon" size={18} style={{ top: '15px', transform: 'none' }} />
                    <textarea 
                      name="address"
                      placeholder="House no, Building, Area, Street..."
                      value={formData.address}
                      onChange={handleChange}
                      className={`checkout-textarea ${errors.address ? 'input-error' : ''}`}
                    />
                  </div>
                  {errors.address && <span className="error-message">{errors.address}</span>}
                </div>

                <div className="form-group">
                  <label>Cooking Instructions (Optional)</label>
                  <div className="input-with-icon">
                    <MessageSquare className="input-icon" size={18} style={{ top: '15px', transform: 'none' }} />
                    <textarea 
                      name="instructions"
                      placeholder="E.g. Less spicy, no onion..."
                      value={formData.instructions}
                      onChange={handleChange}
                      className="checkout-textarea"
                    />
                  </div>
                </div>

                <div className="payment-section">
                  <label>Select Payment Method</label>
                  <div className="payment-options">
                    <div 
                      className={`payment-card ${formData.paymentMethod === 'cash' ? 'active' : ''}`}
                      onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'cash' }))}
                    >
                      <Banknote size={20} />
                      <span>Cash</span>
                    </div>
                    <div 
                      className={`payment-card ${formData.paymentMethod === 'upi' ? 'active' : ''}`}
                      onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'upi' }))}
                    >
                      <Smartphone size={20} />
                      <span>UPI</span>
                    </div>
                    <div 
                      className={`payment-card ${formData.paymentMethod === 'card' ? 'active' : ''}`}
                      onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'card' }))}
                    >
                      <CreditCard size={20} />
                      <span>Card</span>
                    </div>
                  </div>
                </div>
              </form>

              {/* Bottom Summary & Button - Sticky */}
              <div className="modal-order-summary">
                <div className="summary-details">
                  <div className="summary-info">
                    <span>Total Amount ({itemCount} items)</span>
                    <strong>₹{totalAmount.toFixed(0)}</strong>
                  </div>
                </div>
                <button 
                  type="submit" 
                  className="place-order-btn" 
                  disabled={isSubmitting}
                  onClick={handleSubmit}
                >
                  {isSubmitting ? (
                    <>
                      <div className="loader-spinner" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Place Order <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="success-container">
              <motion.div 
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="success-icon-wrapper"
              >
                <CheckCircle size={80} strokeWidth={1.5} />
              </motion.div>
              <h2>Order Placed Successfully! 🎉</h2>
              <p>Your delicious homemade meal is being prepared with love. Redirecting you to your orders...</p>
              <button className="browse-menu-btn" onClick={() => navigate("/orders")}>
                My Orders
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CheckoutModal;
