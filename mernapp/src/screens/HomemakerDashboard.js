import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  AlertCircle, CheckCircle, Edit, Trash2, ChefHat, 
  Plus, X, Save, Tag, DollarSign, Package, Layout, User 
} from "lucide-react";
import "../styles/HomemakerDashboard.css";

const BACKEND_URL = "http://localhost:5000";
const FALLBACK_SVG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'%3E%3Crect width='300' height='200' fill='%23F3F4F6'/%3E%3Ctext x='150' y='90' font-family='sans-serif' font-size='48' text-anchor='middle'%3E%F0%9F%8D%BD%EF%B8%8F%3C/text%3E%3Ctext x='150' y='130' font-family='sans-serif' font-size='14' fill='%236B7280' text-anchor='middle'%3EImage unavailable%3C/text%3E%3C/svg%3E`;

const resolveImageSrc = (img) => {
  if (!img) return FALLBACK_SVG;
  if (img.startsWith("http") || img.startsWith("data:")) return img;
  return `${BACKEND_URL}${img.startsWith("/") ? "" : "/"}${img}`;
};

export default function HomemakerDashboard() {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    imgFile: null,
  });
  const [foods, setFoods] = useState([]);
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
        const prodData = await axios.get(`/api/products/homemaker/${homemakerId}`);
        setFoods(prodData.data.products || []);

        // Fetch homemaker profile for bio
        const hmData = await axios.get(`/api/auth/${homemakerId}`);
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

  const handleBioUpdate = async () => {
    try {
      setIsUpdatingBio(true);
      const token = localStorage.getItem("token");
      await axios.put(`/api/auth/profile/${homemakerId}`, { bio }, {
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
      await axios.delete(`/api/products/${itemId}`, {
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
        response = await axios.put(`/api/products/${currentItemId}`, formDataToSend, {
          headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` },
        });
        showNotification("Item updated!", "success");
      } else {
        response = await axios.post("/api/products", formDataToSend, {
          headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` },
        });
        showNotification("Item added!", "success");
      }
      resetForm();
      const { data } = await axios.get(`/api/products/homemaker/${homemakerId}`);
      setFoods(data.products || []);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.error("Error saving product:", err);
      showNotification("Failed to save product.", "error");
    }
  };

  return (
    <div className="dashboard-wrapper">
      {/* ── TOP HEADER ─────────────────────────────────────────── */}
      <header className="dashboard-header">
        <div className="header-left">
          <h1>Welcome back, Chef 👨‍🍳</h1>
          <p>Manage your menu and grow your kitchen</p>
        </div>
        <div className="header-right">
          <div className="user-badge" style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#F1F5F9', padding: '6px 12px', borderRadius: '100px' }}>
             <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary-orange)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
               <User size={18} />
             </div>
             <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>My Kitchen</span>
          </div>
        </div>
      </header>

      <div className="dashboard-container">
        
        {/* ── SIDEBAR (LEFT) ────────────────────────────────────── */}
        <aside className="dashboard-sidebar">
          
          {/* Kitchen Profile Card */}
          <div className="dashboard-card">
            <div className="card-title-row">
              <ChefHat size={20} className="card-icon" />
              <h3>Kitchen Profile</h3>
            </div>
            <p className="text-muted" style={{ fontSize: '0.8rem', marginBottom: '1rem' }}>
              Your bio helps customers get to know your cooking style.
            </p>
            <div className="form-field">
              <textarea
                className="dashboard-textarea"
                placeholder="E.g., Authentic North Indian home-cooked meals..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows="4"
              />
            </div>
            <button
              className="primary-btn"
              onClick={handleBioUpdate}
              disabled={isUpdatingBio}
              style={{ width: '100%' }}
            >
              {isUpdatingBio ? "Saving..." : "Update Bio"}
            </button>
          </div>

          {/* Add/Edit Product Card */}
          <div className="dashboard-card" style={{ borderLeft: `4px solid ${isEditing ? '#0EA5E9' : 'var(--primary-orange)'}` }}>
            <div className="card-title-row">
              {isEditing ? <Edit size={20} className="card-icon" style={{ color: '#0EA5E9' }} /> : <Plus size={20} className="card-icon" />}
              <h3>{isEditing ? "Edit Dish" : "Add New Dish"}</h3>
            </div>
            
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <div className="form-field">
                <label>Dish Name</label>
                <div className="input-with-icon">
                  <Package size={18} className="field-icon" />
                  <input
                    type="text"
                    name="name"
                    placeholder="E.g. Butter Chicken"
                    className="dashboard-input"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="input-grid">
                <div className="form-field">
                  <label>Price (₹)</label>
                  <div className="input-with-icon">
                    <DollarSign size={18} className="field-icon" />
                    <input
                      type="number"
                      name="price"
                      placeholder="0.00"
                      className="dashboard-input"
                      value={formData.price}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label>Category</label>
                  <div className="input-with-icon">
                    <Tag size={18} className="field-icon" />
                    <select
                      name="category"
                      className="dashboard-select"
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
              </div>

              <div className="form-field">
                <label>Dish Image {isEditing && "(Optional)"}</label>
                <input
                  id="product-image"
                  type="file"
                  accept="image/*"
                  className="dashboard-input"
                  style={{ paddingLeft: '0.75rem' }}
                  onChange={handleFileChange}
                  required={!isEditing}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  className="primary-btn"
                  type="submit"
                  disabled={isLoading}
                  style={{ flex: 2, backgroundColor: isEditing ? '#0EA5E9' : 'var(--primary-orange)' }}
                >
                  {isLoading ? "Processing..." : (isEditing ? "Save Changes" : "Add to Menu")}
                </button>
                {isEditing && (
                  <button
                    className="cancel-btn"
                    type="button"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </aside>

        {/* ── MAIN CONTENT (RIGHT) ───────────────────────────────── */}
        <main className="dashboard-main">
          
          {/* Quick Stats Overlay (Optional Modern Touch) */}
          <div className="stats-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
             <div className="dashboard-card" style={{ padding: '1rem 1.5rem', marginBottom: 0 }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>TOTAL DISHES</span>
                <div style={{ fontSize: '1.5rem', fontWeight: '800' }}>{foods.length}</div>
             </div>
             <div className="dashboard-card" style={{ padding: '1rem 1.5rem', marginBottom: 0 }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>ACTIVE MENTU</span>
                <div style={{ fontSize: '1.5rem', fontWeight: '800' }}>Live</div>
             </div>
             <div className="dashboard-card" style={{ padding: '1rem 1.5rem', marginBottom: 0 }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>REVIEWS</span>
                <div style={{ fontSize: '1.5rem', fontWeight: '800' }}>4.8 ★</div>
             </div>
          </div>

          <div className="section-header" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
             <Layout size={20} color="var(--primary-orange)" />
             <h2 style={{ fontSize: '1.25rem', fontWeight: '700', margin: 0 }}>Your Products</h2>
          </div>

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
                    {/* Debug: console.log(`Rendering item ${item.name} with img:`, item.img) */}
                    <img
                      src={resolveImageSrc(item.img)}
                      alt={item.name}
                      className="item-img"
                      onError={(e) => {
                        if (e.target.src !== FALLBACK_SVG) {
                           console.warn(`Failed to load image for ${item.name}, using fallback. URL tried: ${e.target.src}`);
                           e.target.src = FALLBACK_SVG;
                        }
                      }}
                    />
                  </div>
                  <div className="item-content">
                    <div className="item-meta">
                      <h5 className="item-name">{item.name}</h5>
                      <span className="item-price">₹{item.price}</span>
                    </div>
                    
                    <span className={`item-category-badge ${
                      item.category === 'Vegetarian' ? 'badge-veg' : 
                      item.category === 'Non-Vegetarian' ? 'badge-non-veg' : 'badge-default'
                    }`}>
                      {item.category}
                    </span>

                    <div className="item-actions">
                      <button
                        className="action-icon-btn btn-edit"
                        onClick={() => handleEditClick(item)}
                        disabled={isLoading}
                      >
                        <Edit size={16} /> Edit
                      </button>
                      <button
                        className="action-icon-btn btn-delete"
                        onClick={() => handleDeleteClick(item._id)}
                        disabled={isLoading}
                      >
                        <Trash2 size={16} /> Delete
                      </button>
                    </div>

                    {/* Delete Overlay */}
                    {showDeleteConfirm === item._id && (
                      <div style={{
                        position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.96)',
                        zIndex: 10, display: 'flex', flexDirection: 'column', 
                        justifyContent: 'center', alignItems: 'center', padding: '1rem',
                        textAlign: 'center', borderRadius: 'var(--radius-md)'
                      }}>
                        <AlertCircle size={32} color="#be123c" style={{ marginBottom: '0.5rem' }} />
                        <p style={{ fontWeight: '600', fontSize: '0.9rem' }}>Delete this dish?</p>
                        <div style={{ display: 'flex', gap: '8px', marginTop: '1rem' }}>
                           <button 
                             onClick={() => handleConfirmDelete(item._id)}
                             style={{ background: '#be123c', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: '600', fontSize: '0.8rem' }}
                           >Confirm</button>
                           <button 
                             onClick={handleCancelDelete}
                             style={{ background: '#f1f5f9', color: '#475569', border: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: '600', fontSize: '0.8rem' }}
                           >Cancel</button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="dashboard-card" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
              <Package size={48} strokeWidth={1} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
              <p>No dishes found in your kitchen yet.</p>
              <p style={{ fontSize: '0.85rem' }}>Use the form on the left to start adding your delicious meals!</p>
            </div>
          )}
        </main>
      </div>

      {/* Notifications */}
      {notification.show && (
        <div className={`notification-toast ${notification.type}`} style={{
          position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 1000,
          background: notification.type === 'success' ? '#10b981' : '#ef4444',
          color: 'white', padding: '1rem 1.5rem', borderRadius: '12px',
          boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', display: 'flex', 
          alignItems: 'center', gap: '10px', fontWeight: '600',
          animation: 'slideIn 0.3s ease'
        }}>
          {notification.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          {notification.message}
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @media (max-width: 768px) {
          .stats-row { grid-template-columns: 1fr; }
          .dashboard-header { padding: 1rem; flex-direction: column; align-items: flex-start; gap: 1rem; }
        }
      `}</style>
    </div>
  );


}