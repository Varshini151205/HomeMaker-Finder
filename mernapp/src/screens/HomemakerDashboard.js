import React, { useState, useEffect } from "react";
import axios from "axios";
import { AlertCircle, CheckCircle } from "lucide-react";

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
  const homemakerId = localStorage.getItem("homemakerId") || "";

  // Food-themed colors
  const colors = {
    primary: "#FF6F00", // Warm orange
    secondary: "#8D6E63", // Warm brown
    accent: "#4CAF50", // Fresh green
    light: "#FFF3E0", // Cream
    dark: "#5D4037", // Dark brown
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!homemakerId) {
      showNotification("Homemaker ID is missing. Please log in first.", "error");
      return;
    }

    const { name, price, category, imgFile } = formData;
    
    if (!name || !price || !category || !imgFile) {
      showNotification("Please fill all required fields.", "error");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("name", name);
    formDataToSend.append("price", price);
    formDataToSend.append("category", category);
    formDataToSend.append("homemakerId", homemakerId);
    formDataToSend.append("img", imgFile);

    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.post("/api/products", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Response from server:", response.data);
      showNotification("Item added successfully!", "success");

      // Reset form fields after successful submission
      setFormData({ name: "", price: "", category: "", imgFile: null });
      
      // Reset file input
      const fileInput = document.getElementById("product-image");
      if (fileInput) fileInput.value = "";

      // Fetch updated list of products after adding
      const { data } = await axios.get(`/api/products/homemaker/${homemakerId}`);
      setFoods(data.products || []);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.error("Error adding item:", err);
      
      // More detailed error messaging
      const errorMessage = err.response?.data?.message || 
                          "Failed to add item. Please check your connection and try again.";
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

        {/* Form to Add New Product */}
        <div className="card p-4 mb-5 shadow" 
             style={{ 
               borderRadius: "15px", 
               borderLeft: `5px solid ${colors.primary}`,
               backgroundColor: "#fff",
               transition: "transform 0.3s",
             }}>
          <h3 style={{ color: colors.primary }}>Add New Product</h3>
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
              <label htmlFor="product-image" className="form-label" style={{ color: colors.dark }}>Product Image</label>
              <input
                id="product-image"
                type="file"
                accept="image/*"
                className="form-control"
                onChange={handleFileChange}
                required
                style={{ borderColor: colors.secondary }}
              />
            </div>
            
            <button 
              className="btn btn-lg mt-2" 
              type="submit"
              disabled={isLoading}
              style={{ 
                backgroundColor: colors.primary, 
                color: "white",
                borderRadius: "8px",
                padding: "12px 24px",
                fontWeight: "600",
                transition: "all 0.3s",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
              }}
            >
              {isLoading ? "Adding..." : "Add Item"}
            </button>
          </form>
        </div>

        {/* Products Section Header */}
        <div className="mb-4 text-center">
          <h3 style={{ color: colors.dark }}>Your Products</h3>
          <div style={{ width: "80px", height: "4px", backgroundColor: colors.primary, margin: "0 auto" }}></div>
        </div>

        {/* Listing the Products (Food Items) */}
        <div className="row">
          {isLoading ? (
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
                    cursor: "pointer"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-10px)"}
                  onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
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