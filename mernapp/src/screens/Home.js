import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import Footer from "../components/Footer";
import { CartContext } from "../context/CartContext";
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../screens/Home.css";

export default function Home() {
  const [favorites, setFavorites] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [addedIndex, setAddedIndex] = useState(null);
  const navigate = useNavigate();
  const { cart, addToCart } = useContext(CartContext);

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(storedFavorites);
  }, []);

  const toggleFavorite = (food) => {
    const isAlreadyFavorite = favorites.some((item) => item.name === food.name);
    const updatedFavorites = isAlreadyFavorite
      ? favorites.filter((item) => item.name !== food.name)
      : [...favorites, food];

    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  const handlePlaceOrder = async (food) => {
    try {
      const orderData = {
        foodName: food.name,
        foodDesc: food.desc,
        quantity: 1,
        price: 100, // Example price
        user: "Customer Info or ID", // Replace with actual user info
      };

      const response = await axios.post("http://localhost:5000/api/orders", orderData);

      if (response.status === 200) {
        alert("Order placed successfully!");
        navigate("/order-confirmation");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("There was an error placing your order.");
    }
  };

  const handleOrderNow = (food) => {
    handlePlaceOrder(food);
    navigate("/checkout", { state: { meal: food } });
  };

  const handleLoginClick = () => setShowModal(true);

  const foodItems = [
    { name: "Paneer Butter Masala", img: "/images/paneer-butter-masala.jpg", desc: "Rich, creamy, and full of flavor!" },
    { name: "Mutton Curry", img: "/images/mutton-curry.jpg", desc: "Slow-cooked, tender mutton in flavorful spices." },
    { name: "Natu Kodi", img: "/images/natu-kodi.jpg", desc: "Traditional country chicken curry with bold flavors." },
    { name: "Boti Curry", img: "/images/boti-curry.jpg", desc: "A delicious and spicy mutton delicacy." },
    { name: "Royyala Iguru", img: "/images/royyala-iguru.jpg", desc: "A delicious prawn curry rich in Andhra-style flavors." },
  ];

  return (
    <div className="home-fullscreen">
      {/* Hero Section */}
      <section className="hero-section text-center py-5 bg-light">
        <div className="container-fluid px-4">
          <h1 className="fw-bold display-5">Welcome to HomeMade Meals</h1>
          <p className="lead text-muted">Delicious homemade food at your doorstep!</p>
          <div className="d-flex justify-content-center gap-3 mt-4 flex-wrap">
            <button className="btn btn-primary px-4" onClick={handleLoginClick}>
              Login
            </button>
            <button
              className="btn btn-warning px-4 fw-semibold shadow-sm"
              style={{ fontSize: "1.1rem", borderRadius: "30px" }}
              onClick={() => navigate("/menu")}
            >
              Explore Menu
            </button>
            <Link to="/view-homemakers">
              <button
                className="btn btn-success px-4 fw-semibold shadow-sm"
                style={{ fontSize: "1.1rem", borderRadius: "30px" }}
              >
                View Homemakers
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Food Listing */}
      <section className="food-listing py-5">
        <div className="container">
          <h2 className="text-center fw-bold mb-5">Our Special Homemade Meals</h2>
          <div className="row justify-content-center g-4">
            {foodItems.map((food, index) => (
              <div key={index} className="col-sm-10 col-md-6 col-lg-4">
                <div className="card food-card shadow-sm border-0 rounded-4 h-100">
                  <img
                    src={food.img}
                    className="card-img-top rounded-top"
                    alt={food.name}
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/300x200";
                    }}
                  />
                  <div className="card-body text-center">
                    <h5 className="card-title fw-semibold">{food.name}</h5>
                    <p className="card-text text-muted">{food.desc}</p>

                    <div className="d-flex flex-column align-items-center gap-2 mt-3">
                      <button className="btn btn-outline-light border" onClick={() => toggleFavorite(food)}>
                        <Heart
                          size={20}
                          color={favorites.some((item) => item.name === food.name) ? "red" : "gray"}
                          fill={favorites.some((item) => item.name === food.name) ? "red" : "none"}
                        />
                      </button>

                      <button
                        className="btn btn-sm btn-primary w-100"
                        onClick={() => {
                          addToCart(food);
                          setAddedIndex(index);
                          setTimeout(() => setAddedIndex(null), 1000);
                        }}
                        disabled={addedIndex === index}
                      >
                        {addedIndex === index ? "✅ Added!" : "🛒 Add to Cart"}
                      </button>

                      <button className="btn btn-sm btn-success w-100" onClick={() => handleOrderNow(food)}>
                        Order Now
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 shadow">
              <div className="modal-header">
                <h5 className="modal-title">Choose Login Type</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body text-center">
                <p>Select the type of user you want to login as:</p>
                <div className="d-flex justify-content-center gap-3">
                  <button className="btn btn-primary" onClick={() => navigate("/customer-login")}>
                    Customer Login
                  </button>
                  <button className="btn btn-success" onClick={() => navigate("/homemaker-login")}>
                    Homemaker Login
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

