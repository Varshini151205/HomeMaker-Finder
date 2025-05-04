import React, { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { ShoppingCart, Trash2, Minus, Plus, ArrowLeft, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Cart.css";

const Cart = () => {
  const { cart: cartItems, updateQuantity, removeFromCart } = useContext(CartContext);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const navigate = useNavigate();
  
  // Calculate totals
  const subtotal = cartItems ? cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0) : 0;
  const deliveryFee = subtotal > 0 ? 40 : 0;
  const total = subtotal + deliveryFee;

  if (!cartItems) return (
    <div className="cart-loading">
      <div className="spinner"></div>
      <p>Loading your cart...</p>
    </div>
  );

  const handleCheckout = () => {
    setIsCheckingOut(true);
    // Simulate checkout process
    setTimeout(() => {
      setIsCheckingOut(false);
      alert("Your order has been placed successfully!");
      navigate("/order-confirmation");
    }, 2000);
  };

  return (
    <div className="cart-page">
      {/* Header */}
      <div className="cart-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
          <span>Back to Menu</span>
        </button>
        <h1>
          <ShoppingCart size={28} className="cart-title-icon" />
          Your Food Cart
        </h1>
      </div>

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <div className="empty-cart-icon">
            <ShoppingBag size={80} />
          </div>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added any delicious food to your cart yet.</p>
          <button className="browse-menu-btn" onClick={() => navigate("/menu")}>
            Browse Menu
          </button>
        </div>
      ) : (
        <div className="cart-container">
          <div className="cart-items-container">
            <div className="cart-items-header">
              <h3>Cart Items</h3>
              <span className="items-count">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}</span>
            </div>
            
            <div className="cart-items-list">
              {cartItems.map((item, index) => (
                <div key={index} className="cart-item">
                  <div className="item-image">
                    <img 
                      src={item.imageUrl || "https://via.placeholder.com/80x80?text=Food"} 
                      alt={item.name} 
                    />
                  </div>
                  
                  <div className="item-details">
                    <h4 className="item-name">{item.name}</h4>
                    {item.category && <span className={`item-tag ${item.category.toLowerCase().replace('-', '')}`}>{item.category}</span>}
                    {item.description && <p className="item-desc">{item.description.substring(0, 60)}{item.description.length > 60 ? '...' : ''}</p>}
                  </div>
                  
                  <div className="item-price">
                    <span className="price">₹{item.price}</span>
                  </div>
                  
                  <div className="item-actions">
                    <div className="quantity-controls">
                      <button 
                        className="quantity-btn"
                        onClick={() => updateQuantity(item._id || item.name, Math.max(1, item.quantity - 1))}
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={16} />
                      </button>
                      
                      <span className="quantity">{item.quantity}</span>
                      
                      <button 
                        className="quantity-btn"
                        onClick={() => updateQuantity(item._id || item.name, item.quantity + 1)}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    
                    <button 
                      className="remove-btn"
                      onClick={() => removeFromCart(item._id || item.name)}
                      aria-label="Remove item"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="cart-summary">
            <h3>Order Summary</h3>
            
            <div className="summary-details">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              
              <div className="summary-row">
                <span>Delivery Fee</span>
                <span>₹{deliveryFee.toFixed(2)}</span>
              </div>
              
              {subtotal >= 500 && (
                <div className="discount-row">
                  <span>Discount</span>
                  <span>-₹50.00</span>
                </div>
              )}
              
              <div className="summary-total">
                <span>Total</span>
                <span>₹{(subtotal >= 500 ? total - 50 : total).toFixed(2)}</span>
              </div>
            </div>
            
            {subtotal < 500 && (
              <div className="promo-alert">
                <p>Add ₹{(500 - subtotal).toFixed(2)} more to get ₹50 off on your order!</p>
                <div className="progress-bar">
                  <div className="progress" style={{ width: `${(subtotal / 500) * 100}%` }}></div>
                </div>
              </div>
            )}
            
            <button 
              className={`checkout-btn ${isCheckingOut ? 'loading' : ''}`} 
              onClick={handleCheckout}
              disabled={isCheckingOut}
            >
              {isCheckingOut ? (
                <>
                  <div className="btn-spinner"></div>
                  Processing...
                </>
              ) : (
                'Proceed to Checkout'
              )}
            </button>
            
            <div className="delivery-info">
              <p>Expected delivery time: 30-45 minutes</p>
              <p>Free delivery on orders above ₹300</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Recommended items - can be added if needed */}
      {cartItems.length > 0 && (
        <div className="recommended-section">
          <h3>You might also like</h3>
          <div className="recommended-items">
            {/* This would contain recommended food items based on cart */}
            {/* Placeholder for now */}
            <div className="recommended-placeholder">
              <p>Recommended items feature coming soon!</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;