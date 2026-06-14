import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import axios from "axios";
import { 
  Calendar, 
  Package2, 
  CreditCard, 
  TrendingUp, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle, 
  ShoppingBag, 
  ArrowRight,
  HelpCircle,
  RotateCcw,
  MapPin
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import "./Orders.css";

const BASE_URL = process.env.REACT_APP_API_URL;

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        
        // Fetch from Backend (Cloud API)
        const response = await axios.get(`${BASE_URL}/api/orders`);
        setOrders(response.data);
        
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusDetails = (status) => {
    switch(status?.toLowerCase()) {
      case "placed":
        return { icon: <Package2 size={14} />, class: "pending", text: "Order Placed" };
      case "delivered":
        return { icon: <CheckCircle size={14} />, class: "delivered", text: "Delivered" };
      case "cancelled":
        return { icon: <XCircle size={14} />, class: "cancelled", text: "Cancelled" };
      case "pending":
        return { icon: <Clock size={14} />, class: "pending", text: "Pending" };
      case "preparing":
        return { icon: <TrendingUp size={14} />, class: "preparing", text: "Preparing" };
      default:
        return { icon: <AlertCircle size={14} />, class: "default", text: status || "Unknown" };
    }
  };

  const getPaymentIcon = (method) => {
    switch(method?.toLowerCase()) {
      case "upi": return <TrendingUp size={18} />;
      case "cash": return <ShoppingBag size={18} />;
      default: return <CreditCard size={18} />;
    }
  };

  const filteredOrders = filter === "all" ? orders : orders.filter(order => order.status?.toLowerCase() === filter);

  return (
    <div className="orders-page">
      <div className="orders-container">
        
        {/* Page Header */}
        <header className="orders-header">
          <div className="header-left">
            <motion.h1 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
            >
              My Orders
            </motion.h1>
            <motion.p
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              Track and manage your delicious meals
            </motion.p>
          </div>
          
          <motion.div 
            className="filter-wrapper"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <label htmlFor="order-filter">Filter:</label>
            <select 
              id="order-filter"
              className="orders-filter-select" 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Orders</option>
              <option value="placed">Placed</option>
              <option value="pending">Pending</option>
              <option value="preparing">Preparing</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </motion.div>
        </header>

        {/* Content Body */}
        {isLoading ? (
          <div className="d-flex justify-content-center py-5">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="spinner-border" 
              style={{ color: "#FF6B35" }}
            />
          </div>
        ) : filteredOrders.length === 0 ? (
          <motion.div 
             initial={{ scale: 0.9, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             className="orders-empty-state"
          >
            <div className="empty-illustration">
              <ShoppingBag size={48} />
            </div>
            <h2>No orders yet!</h2>
            <p>Looks like you haven't placed any orders. Browse our menu to find something delicious.</p>
            <button className="browse-menu-btn" onClick={() => navigate("/menu")}>
              Browse Menu <ArrowRight size={18} style={{ marginLeft: '8px', verticalAlign: 'middle' }} />
            </button>
          </motion.div>
        ) : (
          <div className="orders-list">
            <AnimatePresence mode='popLayout'>
              {filteredOrders.map((order, idx) => {
                const status = getStatusDetails(order.status);
                const isLocalOrder = Array.isArray(order.items);
                
                // Calculate display totals
                const subtotal = isLocalOrder 
                  ? order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
                  : (order.price * order.quantity);
                
                const totalAmount = isLocalOrder ? order.total : (subtotal + (order.deliveryFee || 40) - (order.discount || 0));
                
                const displayDate = order.createdAt 
                  ? new Date(order.createdAt).toLocaleString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true
                    })
                  : (order.date || "Just now");

                return (
                  <motion.div 
                    layout
                    key={order._id || idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: idx * 0.1 }}
                    className="order-card"
                  >
                    <div className="order-card-header">
                      <div className="order-meta">
                        <div className="order-date">
                          <Calendar size={14} />
                          {displayDate}
                        </div>
                        <span className="order-id">Order ID: #{order._id?.slice(-8).toUpperCase() || 'N/A'}</span>
                      </div>
                      <div className={`status-badge ${status.class}`}>
                        {status.icon}
                        {status.text}
                      </div>
                    </div>

                    <div className="order-card-body">
                      <div className="order-main-content">
                        
                        {/* Main Info - Support for multiple items */}
                        <div className="order-details-col">
                          <div className="order-items-list">
                            {isLocalOrder ? (
                              order.items.map((item, itemIdx) => (
                                <div key={item._id || itemIdx} className="order-item-row mini">
                                  <div className="item-thumb-wrapper small">
                                    <img 
                                      src={item.imageUrl || item.img || item.image || "https://via.placeholder.com/64?text=Food"} 
                                      alt={item.name} 
                                      className="item-thumb"
                                      onError={(e) => e.target.src = "https://via.placeholder.com/64?text=Food"}
                                    />
                                  </div>
                                  <div className="item-info">
                                    <h3>{item.name}</h3>
                                    <div className="item-meta">
                                      <span>Quantity: {item.quantity}</span>
                                      <span className="item-price">₹{item.price} each</span>
                                    </div>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="order-item-row">
                                <div className="item-thumb-wrapper">
                                  <img 
                                    src={order.profilePic || order.image || "https://via.placeholder.com/64?text=Food"} 
                                    alt={order.item} 
                                    className="item-thumb"
                                    onError={(e) => e.target.src = "https://via.placeholder.com/64?text=Food"}
                                  />
                                </div>
                                <div className="item-info">
                                  <h3>{order.item}</h3>
                                  <div className="item-meta">
                                    <span>Quantity: {order.quantity}</span>
                                    <span className="item-price">₹{order.price} each</span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          {(order.address || order.userDetails?.address) && (
                            <div className="delivery-address-section">
                              <h4>Delivery Address</h4>
                              <p>
                                <MapPin size={12} style={{ marginRight: '4px' }} /> 
                                {order.userDetails?.address || order.address}
                              </p>
                              {order.userDetails?.instructions && (
                                <p className="cooking-instructions-text">
                                  <strong>Note:</strong> {order.userDetails.instructions}
                                </p>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Summary Info */}
                        <div className="order-summary-col">
                          <div className="order-summary-panel">
                            <div className="summary-row">
                              <span>Subtotal</span>
                              <span>₹{subtotal.toFixed(0)}</span>
                            </div>
                            <div className="summary-row">
                              <span>Delivery Fee</span>
                              <span>₹{order.deliveryFee || (isLocalOrder ? 40 : 40)}</span>
                            </div>
                            {(order.discount > 0) && (
                              <div className="summary-row" style={{ color: '#10B981' }}>
                                <span>Discount</span>
                                <span>-₹{order.discount}</span>
                              </div>
                            )}
                            <div className="summary-row total">
                              <span>Total Amount</span>
                              <span>₹{totalAmount.toFixed(0)}</span>
                            </div>

                            <div className="payment-method-row">
                              <div className="payment-icon-box">
                                {getPaymentIcon(order.userDetails?.paymentMethod || order.paymentMethod)}
                              </div>
                              <div className="payment-text">
                                <span>Payment Mode</span>
                                <strong style={{ textTransform: 'capitalize' }}>
                                  {order.userDetails?.paymentMethod || order.paymentMethod || "Online"}
                                </strong>
                              </div>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>

                    <div className="order-card-footer">
                      <button className="btn-order-action help">
                        <HelpCircle size={16} /> Help
                      </button>
                      <button 
                        className="btn-order-action reorder"
                        onClick={() => navigate("/menu")}
                      >
                        <RotateCcw size={16} /> Reorder
                      </button>
                    </div>

                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

      </div>
      <Footer />
    </div>
  );
}