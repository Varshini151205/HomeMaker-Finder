import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { CartContext } from "../context/CartContext";
import Footer from "../components/Footer";
import "./Menu.css";

const Menu = () => {
  const [favorites, setFavorites] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
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
        if (Array.isArray(data)) {
          setFoodItems(data);
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

      const response = await fetch("http://localhost:5000/api/orders/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Order placed successfully!");
        navigate("/order-confirmation");
      } else {
        alert(result.message || "Failed to place order.");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Something went wrong while placing the order.");
    }
  };

  const filteredItems = foodItems.filter((food) =>
    (filter === "All" || food.category === filter) &&
    food.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="menu-container">
      <h1 className="text-center">Explore Our Menu</h1>

      {/* Search & Filter */}
      <div className="menu-controls">
        <input
          type="text"
          placeholder="Search food..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-bar"
        />

        <select className="filter-dropdown" onChange={(e) => setFilter(e.target.value)}>
          <option value="All">All Categories</option>
          <option value="Vegetarian">Vegetarian</option>
          <option value="Non-Vegetarian">Non-Vegetarian</option>
          <option value="Seafood">Seafood</option>
          <option value="Sweets">Sweets</option>
          <option value="Snacks">Snacks</option>
          <option value="Sambar">Sambar</option>
        </select>
      </div>

      {/* Loading */}
      {loading && <p className="text-center">Loading food items...</p>}

      {/* Food Cards */}
      <div className="food-grid">
        {filteredItems.map((food) => (
          <div key={food._id} className="food-card">
            <img
              src={food.imageUrl || "https://via.placeholder.com/150"}
              alt={food.name}
              className="food-image"
            />
            <div className="food-details">
              <h3>{food.name}</h3>
              <p className="price">₹{food.price}</p>

              {/* Favorite */}
              <button
                className="favorite-btn"
                onClick={() => toggleFavorite(food)}
                aria-label={`Add ${food.name} to favorites`}
              >
                <Heart
                  size={20}
                  color={favorites.some((item) => item._id === food._id) ? "red" : "gray"}
                  fill={favorites.some((item) => item._id === food._id) ? "red" : "none"}
                />
              </button>

              {/* Cart and Order Buttons */}
              <button className="cart-btn" onClick={() => addToCart(food)}>🛒 Add to Cart</button>
              <button className="order-btn" onClick={() => handlePlaceOrder(food)}>Order Now</button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Menu;
