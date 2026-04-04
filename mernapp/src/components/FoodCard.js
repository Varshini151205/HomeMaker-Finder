import React, { useState, useEffect, useContext } from 'react';
import { Heart, Star, ShoppingCart } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import '../styles/FoodCard.css';

// Backend base URL for resolving relative image paths
const BACKEND_URL = 'http://localhost:5000';

/**
 * Resolves the best available image src from a food item.
 * Handles: full URLs, relative /uploads/ paths, and both field names.
 */
const resolveImageSrc = (food) => {
  // Try every possible field in priority order
  const raw = food.imageUrl || food.img || food.image || null;

  if (!raw) return null;

  // Already a full URL (http/https or data URI)
  if (raw.startsWith('http') || raw.startsWith('data:')) return raw;

  // Relative path from backend (e.g. "/uploads/abc.jpg")
  return `${BACKEND_URL}${raw.startsWith('/') ? '' : '/'}${raw}`;
};

// Inline SVG used as the fallback — never breaks, no network request needed
const FALLBACK_SVG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'%3E%3Crect width='300' height='200' fill='%23F3F4F6'/%3E%3Ctext x='150' y='90' font-family='sans-serif' font-size='48' text-anchor='middle'%3E%F0%9F%8D%BD%EF%B8%8F%3C/text%3E%3Ctext x='150' y='130' font-family='sans-serif' font-size='14' fill='%236B7280' text-anchor='middle'%3EImage unavailable%3C/text%3E%3C/svg%3E`;

const FoodCard = ({ food }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [added, setAdded] = useState(false);
  const [imgSrc, setImgSrc] = useState(null);      // null = still loading
  const [imgLoaded, setImgLoaded] = useState(false); // controls skeleton visibility
  const { addToCart } = useContext(CartContext);

  // ── Favorites logic (unchanged) ─────────────────────────────────
  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setIsFavorite(storedFavorites.some(item => item.name === food.name));
  }, [food.name]);

  const handleFavoriteToggle = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    let updatedFavorites;
    if (isFavorite) {
      updatedFavorites = storedFavorites.filter(item => item.name !== food.name);
    } else {
      updatedFavorites = [...storedFavorites, food];
    }
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    setIsFavorite(!isFavorite);
  };

  // ── Cart logic (unchanged) ───────────────────────────────────────
  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(food);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  // ── Image resolution ─────────────────────────────────────────────
  useEffect(() => {
    const resolved = resolveImageSrc(food);

    // Debug: log what fields are present on the item
    if (!resolved) {
      console.warn(`[FoodCard] No image found for "${food.name}". Item keys:`, Object.keys(food));
    }

    setImgSrc(resolved || FALLBACK_SVG);
    setImgLoaded(false); // reset skeleton whenever food changes
  }, [food]);

  // ── Safe defaults ────────────────────────────────────────────────
  const price = food.price || 150;
  const rating = food.rating || 4.5;

  return (
    <div className="modern-food-card">
      {/* Image area */}
      <div className="food-card-img-wrapper">
        {/* Skeleton shown until image fires onLoad */}
        {!imgLoaded && <div className="food-card-skeleton" aria-hidden="true" />}

        <img
          src={imgSrc || FALLBACK_SVG}
          alt={food.name}
          className={`food-card-img ${imgLoaded ? 'img-visible' : 'img-hidden'}`}
          onLoad={() => setImgLoaded(true)}
          onError={(e) => {
            // Prevent infinite loop if the fallback itself somehow fails
            if (e.target.src !== FALLBACK_SVG) {
              console.warn(`[FoodCard] Image failed to load for "${food.name}":`, e.target.src);
              e.target.src = FALLBACK_SVG;
            }
            setImgLoaded(true); // hide skeleton even on error
          }}
        />

        <button
          className="food-card-badge"
          onClick={handleFavoriteToggle}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart
            size={18}
            color={isFavorite ? "#EF4444" : "#6B7280"}
            fill={isFavorite ? "#EF4444" : "none"}
          />
        </button>
      </div>

      {/* Content */}
      <div className="food-card-content">
        <div className="food-card-header">
          <h3 className="food-card-title">{food.name}</h3>
          <div className="food-card-rating">
            <Star size={14} fill="currentColor" color="currentColor" />
            <span>{rating}</span>
          </div>
        </div>

        <p className="food-card-desc">{food.desc || food.description}</p>

        <div className="food-card-footer">
          <div className="food-card-price">₹{price}</div>
          <button
            className="food-card-btn"
            onClick={handleAddToCart}
            disabled={added}
          >
            {added ? (
              <>Added ✓</>
            ) : (
              <>
                <ShoppingCart size={16} />
                Add
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
