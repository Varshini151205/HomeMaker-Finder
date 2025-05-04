import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, ChevronRight } from "lucide-react";
import Footer from "../components/Footer";
import { CartContext } from "../context/CartContext";
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../screens/Home.css";

const Home = () => {
  const [favorites, setFavorites] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [addedIndex, setAddedIndex] = useState(null);
  const [animateHero, setAnimateHero] = useState(false);
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(storedFavorites);
    
    // Trigger hero animation after component mounts
    setTimeout(() => {
      setAnimateHero(true);
    }, 300);
    
    // Add scroll animation for cards
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
        }
      });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.food-card').forEach(card => {
      observer.observe(card);
    });
    
    return () => {
      document.querySelectorAll('.food-card').forEach(card => {
        observer.unobserve(card);
      });
    };
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

  // Food emoji backgrounds for food items
  const foodEmojis = ["🍛", "🍲", "🥘", "🍚", "🍜"];

  const foodItems = [
    { name: "Paneer Butter Masala", img: "/images/paneer-butter-masala.jpg", desc: "Rich, creamy, and full of flavor!" },
    { name: "Mutton Curry", img: "/images/mutton-curry.jpg", desc: "Slow-cooked, tender mutton in flavorful spices." },
    { name: "Natu Kodi", img: "/images/natu-kodi.jpg", desc: "Traditional country chicken curry with bold flavors." },
    { name: "Boti Curry", img: "/images/boti-curry.jpg", desc: "A delicious and spicy mutton delicacy." },
    { name: "Royyala Iguru", img: "/images/royyala-iguru.jpg", desc: "A delicious prawn curry rich in Andhra-style flavors." },
  ];

  return (
    <div className="home-wrapper">
      {/* Hero Section with Food Pattern Background */}
      <section className={`hero-section text-center py-5 ${animateHero ? 'hero-animate' : ''}`}>
        {/* Emoji food icons and decorative food images */}
        <div className="food-float food-1">{foodEmojis[0]}</div>
        <div className="food-float food-2">{foodEmojis[1]}</div>
        <div className="food-float food-3">{foodEmojis[2]}</div>
        <div className="food-float food-4">{foodEmojis[3]}</div>
        <div className="food-float food-5">{foodEmojis[4]}</div>
        
        <div className="hero-background-images">
          <div className="bg-food-image bg-food-1"></div>
          <div className="bg-food-image bg-food-2"></div>
          <div className="bg-food-image bg-food-3"></div>
        </div>
        
        <div className="container">
          <div className="hero-content">
          <h1 className="fw-bold display-1" style={{ color: "#5D4037", fontSize: "3.5rem" }}>
  Welcome to <span className="text-highlight" style={{ color: "#FF6F00", fontWeight: "800", fontSize: "6rem" }}>HomeMade Meals</span>
</h1>    <p className="lead" style={{ color: "#795548" }}>Delicious homemade food at your doorstep!</p>
            <div className="d-flex justify-content-center gap-3 mt-4 flex-wrap">
              <button className="btn btn-custom-login px-4 btn-pulse" onClick={handleLoginClick}>
                Login
              </button>
              <button
                className="btn btn-custom-explore px-4 fw-semibold shadow-sm btn-hover-effect"
                onClick={() => navigate("/menu")}
              >
                Explore Menu <ChevronRight size={16} />
              </button>
              <Link to="/view-homemakers">
                <button
                  className="btn btn-custom-view px-4 fw-semibold shadow-sm btn-hover-effect"
                >
                  View Homemakers <ChevronRight size={16} />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Special Features Section */}
      <section className="features-section py-4">
        <div className="container">
          <div className="row text-center">
            <div className="col-md-4 feature-item">
              <div className="feature-icon">🍲</div>
              <h4 className="feature-title">Authentic Homemade</h4>
              <p className="feature-text">Food cooked with love and care</p>
            </div>
            <div className="col-md-4 feature-item">
              <div className="feature-icon">🚚</div>
              <h4 className="feature-title">Fast Delivery</h4>
              <p className="feature-text">Fresh and hot to your doorstep</p>
            </div>
            <div className="col-md-4 feature-item">
              <div className="feature-icon">👨‍🍳</div>
              <h4 className="feature-title">Expert Cooks</h4>
              <p className="feature-text">Skilled homemakers with passion</p>
            </div>
          </div>
        </div>
      </section>

      {/* Food Listing */}
      <section className="food-listing py-5">
        <div className="container">
          <h1 className="text-center fw-bold mb-5" style={{ color: "#5D4037" }}>
            <span className="section-title-decoration">Our Special Homemade Meals</span>
          </h1>
          <div className="row g-4">
            {foodItems.map((food, index) => (
              <div key={index} className="col-sm-6 col-lg-4">
                <div className="card food-card shadow border-0 rounded-4 h-100 food-item-appear">
                  <div className="img-wrapper">
                    <img
                      src={food.img}
                      className="card-img-top rounded-top"
                      alt={food.name}
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/300x200?text=" + food.name;
                      }}
                    />
                    <div className="img-overlay">
                      <button className="btn btn-sm btn-light rounded-circle favorite-btn" onClick={() => toggleFavorite(food)}>
                        <Heart
                          size={20}
                          color={favorites.some((item) => item.name === food.name) ? "red" : "gray"}
                          fill={favorites.some((item) => item.name === food.name) ? "red" : "none"}
                          className={favorites.some((item) => item.name === food.name) ? "heart-beat" : ""}
                        />
                      </button>
                    </div>
                  </div>
                  <div className="card-body text-center">
                    <h5 className="card-title fw-semibold" style={{ color: "#5D4037" }}>{food.name}</h5>
                    <p className="card-text text-muted">{food.desc}</p>

                    <div className="d-flex flex-column align-items-center gap-2 mt-3">
                      <button
                        className="btn btn-sm btn-add-to-cart w-100"
                        onClick={() => {
                          addToCart(food);
                          setAddedIndex(index);
                          setTimeout(() => setAddedIndex(null), 1000);
                        }}
                        disabled={addedIndex === index}
                      >
                        {addedIndex === index ? "✅ Added!" : "🛒 Add to Cart"}
                      </button>

                      <button className="btn btn-sm btn-order-now w-100" onClick={() => handleOrderNow(food)}>
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

      {/* Customer Testimonials with Food Background */}
      <section className="testimonials py-5">
        <div className="testimonial-bg-images">
          <div className="bg-food-image testimonial-food-1"></div>
          <div className="bg-food-image testimonial-food-2"></div>
        </div>
        
        <div className="container">
          <h2 className="text-center fw-bold mb-4" style={{ color: "#5D4037" }}>
            <span className="section-title-decoration">Happy Customers</span>
          </h2>
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div id="testimonialCarousel" className="carousel slide" data-bs-ride="carousel">
                <div className="carousel-inner">
                  <div className="carousel-item active">
                    <div className="testimonial-card text-center p-4">
                      <p className="testimonial-text">"The food tastes just like my mom's cooking. Absolutely delicious!"</p>
                      <p className="testimonial-author">- Rahul M.</p>
                    </div>
                  </div>
                  <div className="carousel-item">
                    <div className="testimonial-card text-center p-4">
                      <p className="testimonial-text">"I order every week. The Paneer Butter Masala is my favorite!"</p>
                      <p className="testimonial-author">- Priya K.</p>
                    </div>
                  </div>
                  <div className="carousel-item">
                    <div className="testimonial-card text-center p-4">
                      <p className="testimonial-text">"Fresh ingredients and authentic taste. Can't recommend enough!"</p>
                      <p className="testimonial-author">- Ankit S.</p>
                    </div>
                  </div>
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#testimonialCarousel" data-bs-slide="prev">
                  <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                  <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#testimonialCarousel" data-bs-slide="next">
                  <span className="carousel-control-next-icon" aria-hidden="true"></span>
                  <span className="visually-hidden">Next</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 shadow">
              <div className="modal-header" style={{ backgroundColor: "#FFF8E1" }}>
                <h5 className="modal-title" style={{ color: "#5D4037" }}>Choose Login Type</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body text-center">
                <p>Select the type of user you want to login as:</p>
                <div className="d-flex justify-content-center gap-3">
                  <button className="btn btn-custom-login" onClick={() => navigate("/customer-login")}>
                    Customer Login
                  </button>
                  <button className="btn btn-custom-view" onClick={() => navigate("/homemaker-login")}>
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
};

export default Home;