import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { motion } from "framer-motion"; // Import Framer Motion

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
import ViewHomemakers from "./screens/ViewHomemakers";
import HomemakerList from "./screens/HomemakerList";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status when app loads or on storage change (e.g., token update)
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      setIsAuthenticated(!!token); // Set authentication status based on token presence
    };

    checkAuth();
    window.addEventListener("storage", checkAuth); // Listen for changes in storage (useful for other tabs)

    return () => {
      window.removeEventListener("storage", checkAuth); // Clean up event listener on component unmount
    };
  }, []);

  return (
    <CartProvider>
      <Router>
        <Navbar />
        <div className="container mt-4">
          <h1 style={{ textAlign: "center", color: "blue" }}>Home Food App</h1>

          <motion.div
            key={window.location.pathname} // Ensure each route has its own animation
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }} // Adjust duration as needed
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/cart" element={<Cart />} />
              <Route
                path="/orders"
                element={isAuthenticated ? <Orders /> : <Navigate to="/customer-login" />}
              />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              <Route path="/view-homemakers" element={<ViewHomemakers />} />
              <Route path="/list-homemakers" element={<HomemakerList />} />
              {/* Authentication Routes */}
              <Route path="/customer-login" element={<CustomerLogin />} />
              <Route path="/homemaker-login" element={<HomemakerLogin />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/customer-signup" element={<CustomerSignup />} />
              <Route path="/homemaker-signup" element={<HomemakerSignup />} />

              {/* Routes requiring authentication */}
              <Route
                path="/homemaker-dashboard"
                element={isAuthenticated ? <HomemakerDashboard /> : <Navigate to="/homemaker-login" />}
              />
              <Route
                path="/homemakers"
                element={isAuthenticated ? <Homemakers /> : <Navigate to="/homemaker-login" />}
              />
              <Route path="/homemaker/:id" element={<HomemakerProfile />} />

              {/* Catch-all route to redirect to home */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </motion.div>
        </div>
      </Router>
    </CartProvider>
  );
};

export default App;
