import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Search, ShoppingCart, Filter, Star, Clock, AlertCircle } from "lucide-react";
import { CartContext } from "../context/CartContext";
import Footer from "../components/Footer";
import "./Menu.css";

const Menu = () => {
  const [favorites, setFavorites] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [sortBy, setSortBy] = useState("popularity");
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const navigate = useNavigate();
  const { cart, addToCart } = useContext(CartContext);

  // Get homemaker ID from localStorage (set during homemaker login)
  const homemaker = JSON.parse(localStorage.getItem("homemaker"));
  const homemakerId = homemaker?._id;

  // Get customer details from localStorage (set during customer login)
  const customer = JSON.parse(localStorage.getItem("customer"));
  const customerId = customer?._id;
  const customerName = customer?.name;
  const customerEmail = customer?.email;

  useEffect(() => {
    if (!homemakerId) {
      console.warn("No homemaker ID found.");
      return;
    }

    const fetchMenu = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/products/homemaker/${homemakerId}`);
        const data = await res.json();
        
        // Add mock ratings and preparation time for UI enhancement
        if (Array.isArray(data)) {
          const enhancedData = data.map(item => ({
            ...item,
            rating: (Math.random() * 2 + 3).toFixed(1), // Random rating between 3.0 and 5.0
            prepTime: Math.floor(Math.random() * 30) + 10, // Random prep time between 10-40 minutes
            popularity: Math.floor(Math.random() * 100) // Random popularity score for sorting
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

    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(storedFavorites);
  }, [homemakerId]);

  const toggleFavorite = (food) => {
    const isAlreadyFavorite = favorites.some((item) => item._id === food._id);
    const updatedFavorites = isAlreadyFavorite
      ? favorites.filter((item) => item._id !== food._id)
      : [...favorites, food];

    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    
    // Show notification
    showToast(isAlreadyFavorite ? "Removed from favorites" : "Added to favorites");
  };

  const handlePlaceOrder = async (food) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login to place an order.");
        navigate("/customer-login");
        return;
      }

      // Order data including customer and homemaker info
      const orderData = {
        customerName,  // From the logged-in customer
        customerEmail, // From the logged-in customer
        homemakerId,   // From the logged-in homemaker
        items: [
          {
            foodName: food.name,
            foodDesc: food.description,
            quantity: 1,
            price: food.price,
          },
        ],
        totalAmount: food.price,
      };

      setLoading(true);
      const response = await fetch("http://localhost:5000/api/orders/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();
      setLoading(false);

      if (response.ok) {
        showToast("Order placed successfully!");
        navigate("/order-confirmation");
      } else {
        showToast(result.message || "Failed to place order.");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      setLoading(false);
      showToast("Something went wrong while placing the order.");
    }
  };

  const showToast = (message) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  const handleAddToCart = (food) => {
    addToCart(food);
    showToast(`${food.name} added to cart!`);
  };

  // Sort and filter items
  const sortAndFilterItems = () => {
    let items = [...foodItems];
    
    // Filter by category
    if (filter !== "All") {
      items = items.filter(food => food.category === filter);
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
        <div className="search-container">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search for dishes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-sort-container">
          <div className="filter-section">
            <Filter size={18} className="filter-icon" />
            <select className="filter-select" value={filter} onChange={(e) => setFilter(e.target.value)}>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="sort-section">
            <label htmlFor="sort-select">Sort by:</label>
            <select 
              id="sort-select"
              className="sort-select" 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="popularity">Popularity</option>
              <option value="rating">Rating</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Pills */}
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

      {/* Loading Spinner */}
      {loading && (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading delicious options...</p>
        </div>
      )}

      {/* No Results Message */}
      {!loading && filteredItems.length === 0 && (
        <div className="no-results">
          <AlertCircle size={48} />
          <h3>No dishes found</h3>
          <p>Try changing your search or filter options</p>
        </div>
      )}

      {/* Food Cards Grid */}
      <div className="food-grid">
        {filteredItems.map((food) => (
          <div key={food._id} className="food-card">
            <div className="food-image-container">
              <img
                src={food.imageUrl || "https://via.placeholder.com/300x200?text=Delicious+Food"}
                alt={food.name}
                className="food-image"
              />
              
              <button
                className="favorite-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(food);
                }}
                aria-label={`${favorites.some(item => item._id === food._id) ? 'Remove from' : 'Add to'} favorites`}
              >
                <Heart
                  size={22}
                  className={favorites.some(item => item._id === food._id) ? "heart-filled" : "heart-outline"}
                />
              </button>
              
              {food.category && (
                <span className={`category-tag ${food.category.toLowerCase().replace('-', '')}`}>
                  {food.category}
                </span>
              )}
            </div>

            <div className="food-details">
              <div className="food-header">
                <h3 className="food-title">{food.name}</h3>
                <div className="food-rating">
                  <Star size={16} className="star-icon" />
                  <span>{food.rating}</span>
                </div>
              </div>
              
              {food.description && (
                <p className="food-description">{food.description.substring(0, 80)}
                  {food.description.length > 80 ? '...' : ''}
                </p>
              )}
              
              <div className="food-meta">
                <span className="food-price">₹{food.price}</span>
                <span className="prep-time">
                  <Clock size={14} />
                  {food.prepTime} mins
                </span>
              </div>

              <div className="food-actions">
                <button className="cart-btn" onClick={() => handleAddToCart(food)}>
                  <ShoppingCart size={16} />
                  Add to Cart
                </button>
                <button className="order-btn" onClick={() => handlePlaceOrder(food)}>
                  Order Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Notification Toast */}
      <div className={`notification-toast ${showNotification ? 'show' : ''}`}>
        {notificationMessage}
      </div>

      {/* Cart Preview */}
      {cart && cart.length > 0 && (
        <div className="cart-preview" onClick={() => navigate('/cart')}>
          <div className="cart-icon">
            <ShoppingCart size={24} />
            <span className="cart-count">{cart.length}</span>
          </div>
          <span>View Cart</span>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Menu;