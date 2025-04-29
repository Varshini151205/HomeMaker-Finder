import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "./context/CartContext";

import Navbar from "./components/Navbar";
import Home from "./screens/Home";
import Menu from "./screens/Menu";
import Orders from "./screens/Orders";
import Favorites from "./screens/Favorites";
import Cart from "./screens/Cart";
import Checkout from "./screens/Checkout";
import { CustomerLogin, HomemakerLogin, AdminLogin } from "./screens/Login";
import CustomerSignup from "./screens/CustomerSignup";
import HomemakerSignup from "./screens/HomemakerSignup";
import HomemakerDashboard from "./screens/HomemakerDashboard"; 
import ForgotPassword from "./screens/ForgotPassword";
import ResetPassword from "./screens/ResetPassword";
import Homemakers from "./screens/Homemakers";
import HomemakerProfile from "./screens/HomemakerProfile";


const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      setIsAuthenticated(!!token);
    };

    checkAuth();
    window.addEventListener("storage", checkAuth);
    
    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  return (
    <CartProvider>
      <Router>
        <Navbar />
        <div className="container mt-4">
          <h1 style={{ textAlign: "center", color: "blue" }}>Home Food App</h1>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/orders" element={isAuthenticated ? <Orders /> : <Navigate to="/customer-login" />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />


            {/* Authentication Routes */}
            <Route path="/customer-login" element={<CustomerLogin />} />
            <Route path="/homemaker-login" element={<HomemakerLogin />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/customer-signup" element={<CustomerSignup />} />
            <Route path="/homemaker-signup" element={<HomemakerSignup />} />
            <Route path="/homemaker-dashboard" element={<HomemakerDashboard />} />
            <Route path="/homemakers" element={<Homemakers />} />
            <Route path="/homemaker/:id" element={<HomemakerProfile />} />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
};

export default App;