import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../screens/ViewHomemakers.css"; // Your CSS file

const ViewHomemakers = () => {
  const [homemakers, setHomemakers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Function to fetch homemakers
    const fetchHomemakers = async () => {
      try {
        const response = await axios.get("/api/view-homemakers");
        setHomemakers(response.data);
      } catch (err) {
        console.error("Error fetching homemakers:", err);
        setError("Failed to load homemakers");
      }
    };

    fetchHomemakers();
  }, []); // Empty dependency array to fetch once on mount

  return (
    <div className="homemakers-container">
      <h1>View Homemakers</h1>
      {error && <div className="error-message">{error}</div>}
      <div className="homemakers-grid">
        {homemakers.length > 0 ? (
          homemakers.map((homemaker) => (
            <div key={homemaker._id} className="homemaker-card">
              <img
                src={`/images/${homemaker.profilePic}`}
                alt={homemaker.name}
                className="profile-pic"
              />
              <h3>{homemaker.name}</h3>
              <p>📍 {homemaker.address}</p>
              <p>🍽️ Cuisines: {homemaker.cuisines.join(", ")}</p>
              <Link to={`/homemaker/${homemaker._id}`}>
                <button>View Menu</button>
              </Link>
            </div>
          ))
        ) : (
          <p>No homemakers available.</p>
        )}
      </div>
    </div>
  );
};

export default ViewHomemakers;
