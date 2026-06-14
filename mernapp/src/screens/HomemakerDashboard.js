import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  AlertCircle, CheckCircle, Edit, Trash2, ChefHat, 
  Plus, X, Save, Tag, DollarSign, Package, Layout, User,
  TrendingUp, Star, List
} from "lucide-react";
import "../styles/HomemakerDashboard.css";
const BASE_URL = process.env.REACT_APP_API_URL;

const FALLBACK_SVG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'%3E%3Crect width='300' height='200' fill='%23F3F4F6'/%3E%3Ctext x='150' y='90' font-family='sans-serif' font-size='48' text-anchor='middle'%3E%F0%9F%8D%BD%EF%B8%8F%3C/text%3E%3Ctext x='150' y='130' font-family='sans-serif' font-size='14' fill='%236B7280' text-anchor='middle'%3EImage unavailable%3C/text%3E%3C/svg%3E`;

const resolveImageSrc = (img) => {
  if (!img) return FALLBACK_SVG;

  if (img.startsWith("http")) return img;

  return `${BASE_URL}${img}`;
};

export default function HomemakerDashboard() {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    imgFile: null,
  });
  const [foods, setFoods] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("products"); // 'products' or 'orders'
  const [bio, setBio] = useState("");
  const [isUpdatingBio, setIsUpdatingBio] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [currentItemId, setCurrentItemId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const homemakerId = localStorage.getItem("homemakerId") || "";

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        // Fetch products
        const prodData = await axios.get(`${BASE_URL}/api/products/homemaker/${homemakerId}`);
        setFoods(prodData.data.products || []);

        // Fetch orders
        const orderData = await axios.get(`${BASE_URL}/api/orders/homemaker/${homemakerId}`);
        setOrders(orderData.data || []);

        // Fetch homemaker profile for bio
        const hmData = await axios.get(`${BASE_URL}/api/auth/${homemakerId}`);
        setBio(hmData.data.bio || "");

        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setIsLoading(false);
        showNotification("Failed to load dashboard data. Please refresh.", "error");
      }
    };

    if (homemakerId) {
      fetchDashboardData();
    }
  }, [homemakerId]);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setIsLoading(true);
      await axios.put(`${BASE_URL}/api/orders/${orderId}/status`, { status: newStatus });
      
      // Update local state
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
      showNotification(`Order marked as ${newStatus}!`, "success");
    } catch (err) {
      console.error("Error updating status:", err);
      showNotification("Failed to update status", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBioUpdate = async () => {
    try {
      setIsUpdatingBio(true);
      const token = localStorage.getItem("token");
      await axios.put(`${BASE_URL}/api/auth/profile/${homemakerId}`, { bio }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showNotification("Kitchen bio updated successfully!", "success");
    } catch (err) {
      console.error("Error updating bio:", err);
      showNotification("Failed to update bio.", "error");
    } finally {
      setIsUpdatingBio(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      imgFile: e.target.files[0],
    }));
  };

  const showNotification = (message, type) => {
    if (window.notificationTimer) {
      clearTimeout(window.notificationTimer);
    }
    setNotification({ show: false, message: "", type: "" });
    setTimeout(() => {
      setNotification({ show: true, message, type });
      window.notificationTimer = setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
      }, 5000);
    }, 10);
  };

  const resetForm = () => {
    setFormData({ name: "", price: "", category: "", imgFile: null });
    setIsEditing(false);
    setCurrentItemId(null);
    const fileInput = document.getElementById("product-image");
    if (fileInput) fileInput.value = "";
  };

  const handleEditClick = (item) => {
    setFormData({
      name: item.name,
      price: item.price,
      category: item.category,
      imgFile: null,
    });
    setIsEditing(true);
    setCurrentItemId(item._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    resetForm();
  };

  const handleDeleteClick = (itemId) => {
    setShowDeleteConfirm(itemId);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(null);
  };

  const handleConfirmDelete = async (itemId) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      await axios.delete(`${BASE_URL}/api/products/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFoods(foods.filter(item => item._id !== itemId));
      setShowDeleteConfirm(null);
      showNotification("Item deleted successfully!", "success");
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.error("Error deleting item:", err);
      showNotification("Failed to delete item.", "error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!homemakerId) {
      showNotification("Please log in first.", "error");
      return;
    }
    const { name, price, category, imgFile } = formData;
    if (!name || !price || !category) {
      showNotification("Please fill required fields.", "error");
      return;
    }
    if (!isEditing && !imgFile) {
      showNotification("Please select an image.", "error");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("name", name);
    formDataToSend.append("price", price);
    formDataToSend.append("category", category);
    formDataToSend.append("homemakerId", homemakerId);
    if (imgFile) formDataToSend.append("img", imgFile);

    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      let response;
      if (isEditing) {
        response = await axios.put(`${BASE_URL}/api/products/${currentItemId}`, formDataToSend, {
          headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` },
        });
        showNotification("Item updated!", "success");
      } else {
        response = await axios.post(`${BASE_URL}/api/products`, formDataToSend, {
          headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` },
        });
        showNotification("Item added!", "success");
      }
      resetForm();
      const { data } = await axios.get(
  `${BASE_URL}/api/products/homemaker/${homemakerId}`
);
      setFoods(data.products || []);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.error("Error saving product:", err);
      showNotification("Failed to save product.", "error");
    }
  };

  const [showAddForm, setShowAddForm] = useState(false);


  // Adding toggle function for form
  const toggleAddForm = () => {
    if (isEditing) {
      resetForm();
    }
    setShowAddForm(!showAddForm);
  };

  return (
    <div className="dashboard-wrapper">
      {/* ── SIDEBAR (LEFT) ────────────────────────────────────── */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-logo">
          <ChefHat size={32} color="var(--primary-orange)" />
          <h2>HomeFood</h2>
        </div>
        
        <nav className="tab-menu">
          <button 
            className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            <Layout size={20} /> <span>My Products</span>
          </button>
          <button 
            className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <Package size={20} /> <span>Orders</span>
            {orders.filter(o => o.status === 'Placed').length > 0 && (
              <span className="badge-notification">
                {orders.filter(o => o.status === 'Placed').length}
              </span>
            )}
          </button>
        </nav>

        <div className="sidebar-footer" style={{ marginTop: 'auto', padding: '0 0.5rem' }}>
          <div className="user-badge">
             <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary-orange)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
               <User size={18} />
             </div>
             <span style={{ fontWeight: '600', fontSize: '0.85rem' }}>Chef Kitchen</span>
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT (RIGHT) ───────────────────────────────── */}
      <main className="dashboard-main">
        <header className="dashboard-header">
          <div className="header-left">
            <span className="header-badge">Host Dashboard</span>
            <h1>Welcome back, Chef 👨‍🍳</h1>
            <p>Manage your menu and grow your kitchen</p>
          </div>
          <div className="header-actions">
            {activeTab === 'products' && (
              <button 
                className={`primary-btn pulse-button ${showAddForm || isEditing ? 'secondary' : ''}`}
                onClick={toggleAddForm}
              >
                {showAddForm || isEditing ? <X size={18} /> : <Plus size={18} />}
                <span>{showAddForm || isEditing ? "Close Entry" : "Add New Dish"}</span>
              </button>
            )}
          </div>
        </header>

        {activeTab === 'products' ? (
          <div className="content-container">
            {/* 📊 1. Top Stats Section */}
            <div className="stats-row">
               <div className="stat-card">
                  <div className="stat-icon-wrapper blue">
                    <List size={22} />
                  </div>
                  <div className="stat-info">
                    <span className="stat-label">TOTAL DISHES</span>
                    <div className="stat-value">{foods.length}</div>
                  </div>
               </div>
               <div className="stat-card">
                  <div className="stat-icon-wrapper orange">
                    <TrendingUp size={22} />
                  </div>
                  <div className="stat-info">
                    <span className="stat-label">STATUS</span>
                    <div className="stat-value text-success">Live</div>
                  </div>
               </div>
               <div className="stat-card">
                  <div className="stat-icon-wrapper gold">
                    <Star size={22} />
                  </div>
                  <div className="stat-info">
                    <span className="stat-label">RATING</span>
                    <div className="stat-value">4.9 ★</div>
                  </div>
               </div>
            </div>

            {/* 🧾 2. Kitchen Profile Section */}
            <section className="kitchen-profile-section">
              <div className="dashboard-card">
                <div className="card-header">
                  <ChefHat size={24} color="var(--primary-orange)" />
                  <h3>Kitchen Profile</h3>
                </div>
                <div className="form-field">
                  <label>Bio (Visible to customers)</label>
                  <textarea
                    className="dashboard-textarea"
                    placeholder="E.g., Authentic North Indian home-cooked meals..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    className="primary-btn"
                    onClick={handleBioUpdate}
                    disabled={isUpdatingBio}
                  >
                    {isUpdatingBio ? "Saving..." : "Update Bio"}
                  </button>
                </div>
              </div>
            </section>

            {/* 🍽️ 3. Product Cards Section (MAIN FIX) */}
            <section className="menu-section">
              <div className="section-header">
                <div className="section-title">
                   <Package size={22} color="var(--primary-orange)" />
                   <h2>Your Menu</h2>
                </div>
              </div>

              {/* Add/Edit Product Form Section */}
              {(showAddForm || isEditing) && (
                <div className="dashboard-card" style={{ borderLeft: `6px solid ${isEditing ? '#2563eb' : 'var(--primary-orange)'}`, animation: 'fadeIn 0.3s ease' }}>
                  <div className="card-header">
                    {isEditing ? <Edit size={24} color="#2563eb" /> : <Plus size={24} color="var(--primary-orange)" />}
                    <h3>{isEditing ? "Edit Dish" : "Add New Dish"}</h3>
                  </div>
                  
                  <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className="form-field">
                      <label>Dish Name</label>
                      <input
                        type="text"
                        name="name"
                        placeholder="E.g. Butter Chicken"
                        className="dashboard-textarea"
                        style={{ minHeight: 'auto', padding: '0.875rem 1rem' }}
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                      <div className="form-field">
                        <label>Price (₹)</label>
                        <input
                          type="number"
                          name="price"
                          placeholder="0.00"
                          className="dashboard-textarea"
                          style={{ minHeight: 'auto', padding: '0.875rem 1rem' }}
                          value={formData.price}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="form-field">
                        <label>Category</label>
                        <select
                          name="category"
                          className="dashboard-textarea"
                          style={{ minHeight: 'auto', padding: '0.875rem 1rem' }}
                          value={formData.category}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select...</option>
                          <option value="Vegetarian">Vegetarian</option>
                          <option value="Non-Vegetarian">Non-Vegetarian</option>
                          <option value="Seafood">Seafood</option>
                          <option value="Sweets">Sweets</option>
                          <option value="Snacks">Snacks</option>
                          <option value="Sambar">Sambar</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-field">
                      <label>Dish Image {isEditing && "(Optional)"}</label>
                      <input
                        id="product-image"
                        type="file"
                        accept="image/*"
                        className="dashboard-textarea"
                        style={{ minHeight: 'auto', padding: '0.6rem 1rem' }}
                        onChange={handleFileChange}
                        required={!isEditing}
                      />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                      <button
                        className="primary-btn"
                        type="submit"
                        disabled={isLoading}
                        style={{ flex: 1, backgroundColor: isEditing ? '#2563eb' : 'var(--primary-orange)' }}
                      >
                        {isLoading ? "Processing..." : (isEditing ? "Save Changes" : "Add to Menu")}
                      </button>
                      {isEditing && (
                        <button
                          className="primary-btn"
                          type="button"
                          onClick={() => { resetForm(); setShowAddForm(false); }}
                          style={{ backgroundColor: '#64748b' }}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              )}

              {/* Product Grid */}
              {isLoading && !foods.length ? (
                <div style={{ textAlign: 'center', padding: '4rem' }}>
                  <div className="spinner-border" role="status" style={{ color: 'var(--primary-orange)' }}></div>
                  <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Fetching your kitchen menu...</p>
                </div>
              ) : foods.length > 0 ? (
                <div className="product-grid">
                  {foods.map((item) => (
                    <div className="modern-item-card" key={item._id}>
                      <div className="item-img-container">
                        <img
                          src={resolveImageSrc(item.img)}
                          alt={item.name}
                          className="item-img"
                          onError={(e) => {
                            const retrySrc = `${BASE_URL}${item.img}`;
                            if (e.target.src !== retrySrc) e.target.src = retrySrc;
                            else e.target.src = FALLBACK_SVG;
                          }}
                        />
                      </div>
                      <div className="item-content">
                        <div className="item-meta">
                          <h4 className="item-name">{item.name}</h4>
                          <span className="item-price">₹{item.price}</span>
                        </div>
                        
                        <span className={`item-category-badge ${
                          item.category === 'Vegetarian' ? 'badge-veg' : 
                          item.category === 'Non-Vegetarian' ? 'badge-non-veg' : 'badge-default'
                        }`}>
                          {item.category}
                        </span>

                        <div className="item-actions">
                          <button className="action-icon-btn btn-edit" onClick={() => { handleEditClick(item); setShowAddForm(false); }} disabled={isLoading}>
                            <Edit size={16} /> Edit
                          </button>
                          <button className="action-icon-btn btn-delete" onClick={() => handleDeleteClick(item._id)} disabled={isLoading}>
                            <Trash2 size={16} /> Delete
                          </button>
                        </div>

                        {showDeleteConfirm === item._id && (
                          <div className="delete-overlay">
                            <AlertCircle size={32} color="#e11d48" style={{ marginBottom: '0.5rem' }} />
                            <p style={{ fontWeight: '700', fontSize: '1rem' }}>Delete this dish?</p>
                            <div style={{ display: 'flex', gap: '8px', marginTop: '1rem' }}>
                               <button onClick={() => handleConfirmDelete(item._id)} className="primary-btn" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>Confirm</button>
                               <button onClick={handleCancelDelete} className="primary-btn" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem', background: '#e2e8f0', color: '#475569' }}>Cancel</button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state-card">
                  <div className="empty-icon-circle">
                    <Package size={48} color="var(--primary-orange)" />
                  </div>
                  <h3>No dishes in your menu yet</h3>
                  <p>Start your culinary journey by adding your first signature dish. Your customers are waiting!</p>
                  <button className="primary-btn outline-btn" onClick={toggleAddForm}>
                    <Plus size={18} /> Add Your First Dish
                  </button>
                </div>
              )}
            </section>
          </div>
        ) : (
          <div className="content-container">
            <div className="section-header">
               <div className="section-title">
                  <Package size={24} color="var(--primary-orange)" />
                  <h2>Active Orders</h2>
               </div>
               <div style={{ fontSize: '1rem', color: '#64748b', fontWeight: '600' }}>
                  Total: {orders.length}
               </div>
            </div>

            {isLoading && !orders.length ? (
              <div style={{ textAlign: 'center', padding: '4rem' }}>
                <div className="spinner-border" role="status" style={{ color: 'var(--primary-orange)' }}></div>
              </div>
            ) : orders.length > 0 ? (
              <div className="orders-container-list">
                {orders.map((order) => (
                  <div className={`order-panel-card ${order.status.toLowerCase()}`} key={order._id}>
                    <div className="order-panel-header">
                      <div className="order-id-block">
                        <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#94a3b8', letterSpacing: '0.05em' }}>ORDER</span>
                        <h3>#{order._id.slice(-6).toUpperCase()}</h3>
                      </div>
                      <div className={`order-status-tag ${order.status.toLowerCase()}`}>
                        {order.status}
                      </div>
                    </div>
                    
                    <div className="order-grid-details">
                      <div className="order-info-section">
                        <div className="order-info-label">Customer</div>
                        <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>{order.userDetails.name}</div>
                        <div style={{ color: '#64748b', fontSize: '0.9rem' }}>{order.userDetails.phone}</div>
                      </div>
                      <div className="order-info-section">
                        <div className="order-info-label">Delivery Address</div>
                        <div style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>{order.userDetails.address}</div>
                      </div>
                    </div>

                    <div className="order-info-section" style={{ marginBottom: '1.5rem' }}>
                      <div className="order-info-label">Items</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {order.items.map((item, idx) => (
                          <span key={idx} className="order-item-pill">
                            {item.quantity}x {item.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="order-panel-footer">
                      <div className="order-total-block">
                        <div className="order-info-label">Total Amount</div>
                        <div className="order-total-value">₹{order.total}</div>
                      </div>
                      <div className="order-action-group">
                        {order.status === 'Placed' && (
                          <button 
                            className="primary-btn"
                            onClick={() => updateOrderStatus(order._id, 'Preparing')}
                          >
                            Start Preparing
                          </button>
                        )}
                        {order.status === 'Preparing' && (
                          <button 
                            className="primary-btn"
                            style={{ background: '#10b981' }}
                            onClick={() => updateOrderStatus(order._id, 'Delivered')}
                          >
                            Mark Delivered
                          </button>
                        )}
                        {order.status === 'Delivered' && (
                          <div style={{ color: '#10b981', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <CheckCircle size={20} /> Order Delivered
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="dashboard-card" style={{ textAlign: 'center', padding: '4rem' }}>
                <Package size={64} color="#e2e8f0" style={{ marginBottom: '1.5rem' }} />
                <h3>No active orders</h3>
                <p style={{ color: 'var(--text-muted)' }}>Orders will appear here once customers place them.</p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Notifications */}
      {notification.show && (
        <div className={`notification-toast ${notification.type}`} style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          zIndex: 1000,
          background: notification.type === 'success' ? '#10b981' : '#ef4444',
          color: 'white',
          padding: '1rem 1.5rem',
          borderRadius: '12px',
          boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontWeight: '600'
        }}>
          {notification.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          {notification.message}
        </div>
      )}
    </div>
  );
}
