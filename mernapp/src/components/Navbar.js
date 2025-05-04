import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle, FaShoppingCart, FaHeart, FaHome, FaClipboardList, FaUtensils } from "react-icons/fa";
import { CartContext } from "../context/CartContext";
import "../styles/Navbar.css";

const Navbar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { cartItems = [], updateQuantity, removeFromCart } = useContext(CartContext);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark custom-navbar">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
          <img
            src="/logo.png"
            alt="Logo"
            className="navbar-logo"
          />
          <span className="brand-text">HomeMade Meals</span>
        </Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center nav-buttons">
            <li className="nav-item">
              <Link to="/" className="nav-btn">
                <FaHome className="nav-icon" />
                <span>Home</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/menu" className="nav-btn">
                <FaUtensils className="nav-icon" />
                <span>Menu</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/favorites" className="nav-btn">
                <FaHeart className="nav-icon" />
                <span>Favorites</span>
              </Link>
            </li>
            {isAuthenticated && (
              <li className="nav-item">
                <Link to="/orders" className="nav-btn">
                  <FaClipboardList className="nav-icon" />
                  <span>My Orders</span>
                </Link>
              </li>
            )}
          </ul>

          {/* Cart Button with Updated Count */}
          <div className="cart-container position-relative">
            <button
              className="cart-btn"
              onClick={() => setIsCartOpen(!isCartOpen)}
            >
              <FaShoppingCart className="nav-icon" />
              <span>My Cart</span>
              <span className="cart-badge">
                {cartItems?.length || 0}
              </span>
            </button>

            {isCartOpen && (
              <div className="cart-modal">
                <h5 className="mb-3 text-center">Your Cart</h5>
                {cartItems.length > 0 ? (
                  cartItems.map((item, index) => (
                    <div key={index} className="cart-item">
                      <div className="d-flex align-items-center">
                        {item.img && <img src={item.img} alt={item.name} className="cart-item-img" />}
                        <div>
                          <p className="m-0 fw-bold">{item.name}</p>
                          <p className="m-0 text-muted">₹{item.price} x {item.quantity}</p>
                        </div>
                      </div>
                      <div className="cart-item-controls">
                        <button className="btn-quantity" onClick={() => updateQuantity(item.name, item.quantity + 1)}>+</button>
                        <button className="btn-quantity" onClick={() => updateQuantity(item.name, item.quantity - 1)}>-</button>
                        <button className="btn-remove" onClick={() => removeFromCart(item.name)}>✖</button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted">Your cart is empty.</p>
                )}
                {cartItems.length > 0 && <Link to="/cart" className="view-cart-btn" onClick={() => setIsCartOpen(false)}>View Full Cart</Link>}
              </div>
            )}
          </div>

          {/* Profile/Login Section */}
          {isAuthenticated ? (
            <div className="profile-container position-relative">
              <button className="profile-btn" onClick={() => setIsProfileOpen(!isProfileOpen)}>
                <FaUserCircle className="nav-icon" />
                <span>Profile</span>
              </button>
              {isProfileOpen && (
                <div className="profile-dropdown">
                  <Link to="/profile" className="dropdown-item">View Profile</Link>
                  <button className="dropdown-item logout-btn" onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="login-btn">
              <FaUserCircle className="nav-icon" />
              <span>Login</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;