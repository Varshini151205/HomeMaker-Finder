import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Clock, Award, Star, MapPin } from "lucide-react";
import HeroSection from "../components/HeroSection";
import FoodCard from "../components/FoodCard";
import "../screens/Home.css";

const Home = () => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  // Reveal animation on scroll
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = 1;
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      el.style.opacity = 0;
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'all 0.6s ease-out';
      observer.observe(el);
    });
    
    return () => observer.disconnect();
  }, []);

  const foodItems = [
    { name: "Paneer Butter Masala", img: "https://images.unsplash.com/photo-1631452180519-c014fe946bc0?q=80&w=600&auto=format&fit=crop", desc: "Rich, creamy, and full of flavor. Prepared in authentic North Indian home style.", price: 220, rating: 4.8 },
    { name: "Mutton Curry", img: "https://images.unsplash.com/photo-1589301760014-d929f39ce9b0?q=80&w=600&auto=format&fit=crop", desc: "Slow-cooked, tender mutton in flavorful ground spices. A Sunday special.", price: 350, rating: 4.9 },
    { name: "Natu Kodi Pulusu", img: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=600&auto=format&fit=crop", desc: "Traditional country chicken curry with bold Andhra flavors.", price: 320, rating: 4.7 },
    { name: "Hyderabadi Chicken Biryani", img: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=600&auto=format&fit=crop", desc: "Fragrant basmati rice cooked with marinated chicken and aromatic spices.", price: 280, rating: 4.9 },
  ];

  return (
    <div className="home-container">
      {/* Hero Section */}
      <HeroSection />

      {/* Popular Dishes Section */}
      <section className="section bg-white">
        <div className="section-header animate-on-scroll">
          <h2 className="section-title">
            Popular <span className="section-title-highlight">Homemade</span> Dishes
          </h2>
          <p className="section-subtitle">
            Explore our most loved recipes, prepared fresh daily by expert homemakers in your area.
          </p>
        </div>
        
        <div className="dishes-grid">
          {foodItems.map((food, index) => (
            <div key={index} className="animate-on-scroll" style={{ transitionDelay: `${index * 100}ms` }}>
              <FoodCard food={food} />
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section section">
        <div className="section-header animate-on-scroll">
          <h2 className="section-title">Why Choose Us?</h2>
          <p className="section-subtitle">
            We bring you the comfort, taste, and hygiene of traditional home cooking.
          </p>
        </div>
        
        <div className="features-grid">
          <div className="feature-card animate-on-scroll">
            <div className="feature-icon-wrapper">
              <ShieldCheck size={40} />
            </div>
            <h3 className="feature-title">100% Authentic Homemade</h3>
            <p className="feature-desc">
              Every dish is prepared in a real home kitchen, ensuring the authentic taste you miss.
            </p>
          </div>
          
          <div className="feature-card animate-on-scroll" style={{ transitionDelay: '100ms' }}>
            <div className="feature-icon-wrapper">
              <Award size={40} />
            </div>
            <h3 className="feature-title">Trusted Home Chefs</h3>
            <p className="feature-desc">
              Our homemakers are carefully vetted for hygiene and culinary excellence.
            </p>
          </div>
          
          <div className="feature-card animate-on-scroll" style={{ transitionDelay: '200ms' }}>
            <div className="feature-icon-wrapper">
              <Clock size={40} />
            </div>
            <h3 className="feature-title">Fast Delivery</h3>
            <p className="feature-desc">
              Get your favorite meals delivered fresh and hot right to your doorstep.
            </p>
          </div>
        </div>
      </section>

      {/* Top Homemakers Section */}
      <section className="homemakers-section section">
        <div className="section-header animate-on-scroll">
          <h2 className="section-title">Meet Our <span className="section-title-highlight">Top Chefs</span></h2>
          <p className="section-subtitle">
            The passionate homemakers behind the delicious meals you love.
          </p>
        </div>
        
        <div className="homemaker-grid">
          {/* Mock Homemaker Cards for preview */}
          {[
            { name: "Priya Sharma", specialty: "North Indian, Thali", location: "Banjara Hills", rating: 4.9, img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop" },
            { name: "Lakshmi Reddy", specialty: "Authentic Andhra", location: "Madhapur", rating: 4.8, img: "https://images.unsplash.com/photo-1531123897727-8f129e1bfa82?q=80&w=200&auto=format&fit=crop" },
            { name: "Anita Desai", specialty: "Gujarati, Snacks", location: "Gachibowli", rating: 4.7, img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop" },
          ].map((chef, idx) => (
            <div key={idx} className="homemaker-card animate-on-scroll" style={{ transitionDelay: `${idx * 100}ms` }}>
              <img src={chef.img} alt={chef.name} className="homemaker-avatar" />
              <div className="homemaker-info">
                <h4>{chef.name}</h4>
                <p>{chef.specialty}</p>
                <div className="homemaker-stats">
                  <div className="stat">
                    <Star size={16} className="stat-icon" fill="currentColor" /> {chef.rating}
                  </div>
                  <div className="stat">
                    <MapPin size={16} className="stat-icon" /> {chef.location}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Login Modal */}
      {showModal && (
        <div className="auth-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="auth-modal" onClick={e => e.stopPropagation()}>
            <button className="auth-modal-close" onClick={() => setShowModal(false)}>✕</button>
            <h3 className="auth-modal-title">Welcome to HomeMade Meals</h3>
            <p className="auth-modal-subtitle">Log in to continue</p>
            
            <div className="auth-modal-options">
              <button 
                className="auth-btn auth-btn-customer" 
                onClick={() => navigate("/customer-login")}
              >
                Continue as Customer
              </button>
              <button 
                className="auth-btn auth-btn-homemaker" 
                onClick={() => navigate("/homemaker-login")}
              >
                Login as Homemaker
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Home;