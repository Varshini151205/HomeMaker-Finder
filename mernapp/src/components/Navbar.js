import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { CartContext } from "../context/CartContext";
import "../styles/Navbar.css";

const Navbar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { cartItems = [], updateQuantity, removeFromCart } = useContext(CartContext); // ✅ Default empty array

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
    <nav className="navbar navbar-expand-lg navbar-dark bg-success">
      <div className="container-fluid">
        <Link className="navbar-brand fs-1 fst-italic" to="/">HomeMade Meals</Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ms-auto align-items-center gap-2">
  <li className="nav-item">
    <Link
      to="/"
      className="btn btn-warning fw-semibold shadow-sm px-3"
      style={{ borderRadius: "30px", fontSize: "1rem" }}
    >
       Home
    </Link>
  </li>
  <li className="nav-item">
    <Link
      to="/menu"
      className="btn btn-warning fw-semibold shadow-sm px-3"
      style={{ borderRadius: "30px", fontSize: "1rem" }}
    >
       Menu
    </Link>
  </li>
  <li className="nav-item">
    <Link
      to="/favorites"
      className="btn btn-warning fw-semibold shadow-sm px-3"
      style={{ borderRadius: "30px", fontSize: "1rem" }}
    >
       Favorites
    </Link>
  </li>
  {isAuthenticated && (
    <li className="nav-item">
      <Link
        to="/orders"
        className="btn btn-warning fw-semibold shadow-sm px-3"
        style={{ borderRadius: "30px", fontSize: "1rem" }}
      >
         My Orders
      </Link>
    </li>
  )}
</ul>


          {/* ✅ Cart Button with Updated Count */}
          <div className="cart-container me-3 position-relative">
          <button
  className="btn btn-warning fw-semibold shadow-sm px-3 position-relative"
  style={{ borderRadius: "30px", fontSize: "1rem" }}
  onClick={() => setIsCartOpen(!isCartOpen)}
>
  🛒 My Cart
  <span
    className="badge bg-danger position-absolute top-0 start-100 translate-middle"
    style={{ fontSize: "0.75rem" }}
  >
    {cartItems?.length || 0}
  </span>
</button>


            {isCartOpen && (
              <div className="cart-modal position-absolute bg-white shadow rounded p-3" style={{ width: "300px", right: 0 }}>
                <h5 className="mb-3 text-center">Your Cart</h5>
                {cartItems.length > 0 ? (
                  cartItems.map((item, index) => (
                    <div key={index} className="d-flex justify-content-between align-items-center mb-3">
                      <div className="d-flex align-items-center">
                        {item.img && <img src={item.img} alt={item.name} width="50" height="50" className="rounded me-2" />}
                        <div>
                          <p className="m-0 fw-bold">{item.name}</p>
                          <p className="m-0 text-muted">₹{item.price} x {item.quantity}</p>
                        </div>
                      </div>
                      <div className="d-flex align-items-center">
                        <button className="btn btn-sm btn-outline-primary me-2" onClick={() => updateQuantity(item.name, item.quantity + 1)}>+</button>
                        <button className="btn btn-sm btn-outline-secondary" onClick={() => updateQuantity(item.name, item.quantity - 1)}>-</button>
                        <button className="btn btn-sm btn-danger ms-2" onClick={() => removeFromCart(item.name)}>✖</button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted">Your cart is empty.</p>
                )}
                {cartItems.length > 0 && <Link to="/cart" className="btn btn-primary btn-sm d-block mt-2" onClick={() => setIsCartOpen(false)}>View Full Cart</Link>}
              </div>
            )}
          </div>

          {/* ✅ Profile/Login Section */}
          {isAuthenticated ? (
            <div className="profile-container position-relative">
              <button className="profile-button btn btn-light" onClick={() => setIsProfileOpen(!isProfileOpen)}>
                <FaUserCircle size={25} />
              </button>
              {isProfileOpen && (
                <div className="profile-dropdown position-absolute bg-white shadow rounded p-2">
                  <Link to="/profile" className="dropdown-item">View Profile</Link>
                  <button className="dropdown-item text-danger" onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn btn-outline-light ms-3">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
