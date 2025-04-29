import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";
import "./Cart.css"; // optional styling

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart } = useContext(CartContext);

  if (!cartItems) return <p>Loading cart...</p>;

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Your Cart</h2>

      {cartItems.length === 0 ? (
        <p className="text-center">Your cart is empty.</p>
      ) : (
        <div className="cart-items">
          {cartItems.map((item, index) => (
            <div key={index} className="card p-3 mb-3">
              <h5>{item.name}</h5>
              <p>Price: ₹{item.price}</p>
              <div className="d-flex align-items-center gap-2">
                <button onClick={() => updateQuantity(item.name, item.quantity - 1)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.name, item.quantity + 1)}>+</button>
                <button onClick={() => removeFromCart(item.name)} className="btn btn-danger ms-3">
                  Remove
                </button>
              </div>
            </div>
          ))}

          {/* Total */}
          <h4 className="mt-4">
            Total: ₹
            {cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)}
          </h4>
        </div>
      )}
    </div>
  );
};

export default Cart;
