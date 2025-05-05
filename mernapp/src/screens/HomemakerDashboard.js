import React, { useState, useEffect } from "react";
import axios from "axios";
import { AlertCircle, CheckCircle, Edit, Trash2, XCircle } from "lucide-react";

export default function HomemakerDashboard() {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    imgFile: null,
  });
  const [foods, setFoods] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [currentItemId, setCurrentItemId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const homemakerId = localStorage.getItem("homemakerId") || "";

  // Food-themed colors
  const colors = {
    primary: "#FF6F00", // Warm orange
    secondary: "#8D6E63", // Warm brown
    accent: "#4CAF50", // Fresh green
    light: "#FFF3E0", // Cream
    dark: "#5D4037", // Dark brown
    danger: "#F44336", // Red for delete actions
  };

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get(`/api/products/homemaker/${homemakerId}`);
        setFoods(data.products || []);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching foods:", err);
        setIsLoading(false);
        showNotification("Failed to load your products. Please refresh the page.", "error");
      }
    };

    if (homemakerId) {
      fetchFoods();
    }
  }, [homemakerId]);

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
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 5000);
  };

  // Reset form to default state
  const resetForm = () => {
    setFormData({ name: "", price: "", category: "", imgFile: null });
    setIsEditing(false);
    setCurrentItemId(null);
    // Reset file input
    const fileInput = document.getElementById("product-image");
    if (fileInput) fileInput.value = "";
  };

  // Set up form for editing a product
  const handleEditClick = (item) => {
    setFormData({
      name: item.name,
      price: item.price,
      category: item.category,
      imgFile: null, // Can't pre-fill the file input
    });
    setIsEditing(true);
    setCurrentItemId(item._id);
    
    // Scroll to form
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  // Cancel editing and reset form
  const handleCancelEdit = () => {
    resetForm();
  };

  // Initialize delete confirmation for an item
  const handleDeleteClick = (itemId) => {
    setShowDeleteConfirm(itemId);
  };

  // Cancel delete confirmation
  const handleCancelDelete = () => {
    setShowDeleteConfirm(null);
  };

  // Actually delete the item
  const handleConfirmDelete = async (itemId) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      await axios.delete(`/api/products/${itemId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      // Remove the item from the local state
      setFoods(foods.filter(item => item._id !== itemId));
      setShowDeleteConfirm(null);
      showNotification("Item deleted successfully!", "success");
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.error("Error deleting item:", err);
      const errorMessage = err.response?.data?.message || 
                          "Failed to delete item. Please try again.";
      showNotification(errorMessage, "error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!homemakerId) {
      showNotification("Homemaker ID is missing. Please log in first.", "error");
      return;
    }

    const { name, price, category, imgFile } = formData;
    
    if (!name || !price || !category) {
      showNotification("Please fill all required fields.", "error");
      return;
    }

    // We need image file for new products but it's optional for updates
    if (!isEditing && !imgFile) {
      showNotification("Please select an image for your product.", "error");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("name", name);
    formDataToSend.append("price", price);
    formDataToSend.append("category", category);
    formDataToSend.append("homemakerId", homemakerId);
    
    // Only append file if it exists (required for new items, optional for updates)
    if (imgFile) {
      formDataToSend.append("img", imgFile);
    }

    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      
      let response;
      if (isEditing) {
        // Update existing product
        response = await axios.put(`/api/products/${currentItemId}`, formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
        showNotification("Item updated successfully!", "success");
      } else {
        // Create new product
        response = await axios.post("/api/products", formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
        showNotification("Item added successfully!", "success");
      }

      console.log("Response from server:", response.data);
      
      // Reset form fields after successful submission
      resetForm();
      
      // Fetch updated list of products
      const { data } = await axios.get(`/api/products/homemaker/${homemakerId}`);
      setFoods(data.products || []);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.error("Error with product:", err);
      
      // More detailed error messaging
      const errorMessage = err.response?.data?.message || 
                          `Failed to ${isEditing ? 'update' : 'add'} item. Please check your connection and try again.`;
      showNotification(errorMessage, "error");
    }
  };

  return (
    <div style={{ 
      backgroundColor: colors.light, 
      minHeight: "100vh",
      backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MCIgaGVpZ2h0PSI1MCI+CjxyZWN0IHdpZHRoPSI1MCIgaGVpZ2h0PSI1MCIgZmlsbD0iI0ZGRjNFMCIvPgo8Y2lyY2xlIGN4PSIxMCIgY3k9IjEwIiByPSIyIiBmaWxsPSIjRkY2RjAwIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8Y2lyY2xlIGN4PSIzMCIgY3k9IjEwIiByPSIxIiBmaWxsPSIjNENBRjUwIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8Y2lyY2xlIGN4PSI1MCIgY3k9IjEwIiByPSIzIiBmaWxsPSIjOEQ2RTYzIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8Y2lyY2xlIGN4PSIyMCIgY3k9IjMwIiByPSIyIiBmaWxsPSIjNUQ0MDM3IiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8Y2lyY2xlIGN4PSI0MCIgY3k9IjMwIiByPSIxIiBmaWxsPSIjRkY2RjAwIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8L3N2Zz4=')",
    }}>
      <div className="container py-5">
        <div className="text-center mb-5">
          <h1 className="fw-bold display-4" style={{ color: colors.dark }}>
            <span className="text-highlight" style={{ 
              color: colors.primary, 
              fontWeight: "800", 
              fontSize: "3.5rem",
              textShadow: "2px 2px 4px rgba(0,0,0,0.1)"
            }}>HomeMade Meals</span>
          </h1>
          <h2 className="mt-2" style={{ color: colors.secondary }}>Homemaker Dashboard</h2>
        </div>

        {/* Notification Component */}
        {notification.show && (
          <div className={`alert ${notification.type === "success" ? "alert-success" : "alert-danger"} d-flex align-items-center`}
               role="alert"
               style={{
                 animation: "fadeIn 0.5s",
                 position: "fixed",
                 top: "20px",
                 right: "20px",
                 zIndex: 1050,
                 boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                 maxWidth: "400px"
               }}>
            {notification.type === "success" ? (
              <CheckCircle size={20} style={{ marginRight: "10px" }} />
            ) : (
              <AlertCircle size={20} style={{ marginRight: "10px" }} />
            )}
            {notification.message}
          </div>
        )}

        {/* Form to Add/Edit Product */}
        <div className="card p-4 mb-5 shadow" 
             style={{ 
               borderRadius: "15px", 
               borderLeft: `5px solid ${isEditing ? colors.accent : colors.primary}`,
               backgroundColor: "#fff",
               transition: "transform 0.3s",
             }}>
          <h3 style={{ color: isEditing ? colors.accent : colors.primary }}>
            {isEditing ? "Edit Product" : "Add New Product"}
          </h3>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="mb-3">
              <label htmlFor="product-name" className="form-label" style={{ color: colors.dark }}>Product Name</label>
              <input
                id="product-name"
                type="text"
                placeholder="Enter product name"
                className="form-control"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={{ borderColor: colors.secondary, padding: "10px" }}
              />
            </div>
            
            <div className="mb-3">
              <label htmlFor="product-price" className="form-label" style={{ color: colors.dark }}>Price (₹)</label>
              <input
                id="product-price"
                type="number"
                placeholder="Enter price"
                className="form-control"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                style={{ borderColor: colors.secondary, padding: "10px" }}
              />
            </div>
            
            <div className="mb-3">
              <label htmlFor="product-category" className="form-label" style={{ color: colors.dark }}>Category</label>
              <select
                id="product-category"
                className="form-control"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                style={{ borderColor: colors.secondary, padding: "10px" }}
              >
                <option value="">Select Category</option>
                <option value="Veg">Vegetarian</option>
                <option value="Non-Veg">Non-Vegetarian</option>
                <option value="Dessert">Dessert</option>
                <option value="Snack">Snack</option>
                <option value="Beverage">Beverage</option>
              </select>
            </div>
            
            <div className="mb-3">
              <label htmlFor="product-image" className="form-label" style={{ color: colors.dark }}>
                Product Image {isEditing && "(Leave empty to keep current image)"}
              </label>
              <input
                id="product-image"
                type="file"
                accept="image/*"
                className="form-control"
                onChange={handleFileChange}
                required={!isEditing}
                style={{ borderColor: colors.secondary }}
              />
            </div>
            
            <div className="d-flex gap-2">
              <button 
                className="btn btn-lg mt-2" 
                type="submit"
                disabled={isLoading}
                style={{ 
                  backgroundColor: isEditing ? colors.accent : colors.primary, 
                  color: "white",
                  borderRadius: "8px",
                  padding: "12px 24px",
                  fontWeight: "600",
                  transition: "all 0.3s",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
                }}
              >
                {isLoading ? (isEditing ? "Updating..." : "Adding...") : (isEditing ? "Update Item" : "Add Item")}
              </button>
              
              {isEditing && (
                <button 
                  className="btn btn-lg mt-2" 
                  type="button"
                  onClick={handleCancelEdit}
                  style={{ 
                    backgroundColor: "#6c757d", 
                    color: "white",
                    borderRadius: "8px",
                    padding: "12px 24px",
                    fontWeight: "600",
                    transition: "all 0.3s",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Products Section Header */}
        <div className="mb-4 text-center">
          <h3 style={{ color: colors.dark }}>Your Products</h3>
          <div style={{ width: "80px", height: "4px", backgroundColor: colors.primary, margin: "0 auto" }}></div>
        </div>

        {/* Listing the Products (Food Items) */}
        <div className="row">
          {isLoading && !foods.length ? (
            <div className="col-12 text-center py-5">
              <div className="spinner-border" role="status" style={{ color: colors.primary }}>
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : foods.length > 0 ? (
            foods.map((item) => (
              <div className="col-md-4 mb-4" key={item._id}>
                <div 
                  className="card h-100 shadow"
                  style={{ 
                    borderRadius: "12px", 
                    overflow: "hidden",
                    transition: "transform 0.3s",
                  }}
                >
                  <div style={{ height: "200px", overflow: "hidden" }}>
                    <img
                      src={item.img || "/api/placeholder/300/200"}
                      alt={item.name}
                      className="card-img-top"
                      style={{ objectFit: "cover", height: "100%", width: "100%" }}
                    />
                  </div>
                  <div className="card-body">
                    <h5 style={{ color: colors.dark, fontWeight: "600" }}>{item.name}</h5>
                    <div 
                      className="badge mb-2" 
                      style={{ 
                        backgroundColor: 
                          item.category === "Veg" ? "#4CAF50" : 
                          item.category === "Non-Veg" ? "#F44336" :
                          item.category === "Dessert" ? "#9C27B0" : 
                          item.category === "Snack" ? "#FF9800" : 
                          item.category === "Beverage" ? "#2196F3" : colors.secondary,
                        color: "white",
                        padding: "5px 10px",
                        borderRadius: "4px"
                      }}
                    >
                      {item.category}
                    </div>
                    <p className="fw-bold" style={{ color: colors.primary, fontSize: "1.2rem" }}>₹{item.price}</p>
                    
                    {/* Action buttons */}
                    <div className="d-flex mt-3">
                      <button
                        className="btn btn-sm me-2"
                        onClick={() => handleEditClick(item)}
                        style={{ 
                          backgroundColor: colors.accent, 
                          color: "white",
                          borderRadius: "6px",
                          transition: "all 0.2s",
                        }}
                        disabled={isLoading}
                      >
                        <Edit size={16} className="me-1" /> Edit
                      </button>
                      <button
                        className="btn btn-sm"
                        onClick={() => handleDeleteClick(item._id)}
                        style={{ 
                          backgroundColor: colors.danger, 
                          color: "white",
                          borderRadius: "6px",
                          transition: "all 0.2s",
                        }}
                        disabled={isLoading}
                      >
                        <Trash2 size={16} className="me-1" /> Delete
                      </button>
                    </div>
                    
                    {/* Delete confirmation overlay */}
                    {showDeleteConfirm === item._id && (
                      <div 
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          backgroundColor: "rgba(0,0,0,0.8)",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                          padding: "20px",
                          borderRadius: "12px",
                          animation: "fadeIn 0.2s",
                          zIndex: 10
                        }}
                      >
                        <p style={{ color: "white", fontWeight: "600", textAlign: "center" }}>
                          Are you sure you want to delete "{item.name}"?
                        </p>
                        <div className="d-flex gap-2 mt-3">
                          <button 
                            className="btn btn-danger"
                            onClick={() => handleConfirmDelete(item._id)}
                            disabled={isLoading}
                          >
                            {isLoading ? "Deleting..." : "Yes, Delete"}
                          </button>
                          <button 
                            className="btn btn-secondary"
                            onClick={handleCancelDelete}
                            disabled={isLoading}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center py-5" style={{ color: colors.secondary }}>
              <p>No products found. Add your first product above!</p>
            </div>
          )}
        </div>
      </div>
      
      {/* CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
      `}</style>
    </div>
  );
}