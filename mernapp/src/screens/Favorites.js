// src/screens/Favorites.js
import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(favs);

    // Fetch all products (or only from your homemaker for now)
    const fetchAllProducts = async () => {
      const res = await fetch(`http://localhost:5000/api/products/homemaker/67f12680d2b022da3fade548`);
      const data = await res.json();
      setAllProducts(data.products || []);
    };

    fetchAllProducts();
  }, []);
  const favoriteItems = allProducts.filter((food) =>
    favorites.includes(food.name)
  );
  


  return (
    <div className="container">
      <h2 className="text-center mt-3">Your Favorite Foods ❤️</h2>
      <div className="food-grid">
        {favoriteItems.length === 0 ? (
          <p className="text-center">No favorites yet! Click the ❤️ on a food item to add it.</p>
        ) : (
          favoriteItems.map((food, idx) => (
            <div key={idx} className="food-card">
              <img
                src={food.img}
                alt={food.name}
                className="food-image"
                onError={(e) => { e.target.src = "https://via.placeholder.com/150"; }}
              />
              <div className="food-details">
                <h3>{food.name}</h3>
                <p className="price">₹{food.price}</p>
              </div>
            </div>
          ))
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Favorites;
