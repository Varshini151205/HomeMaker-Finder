import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Homemakers = () => {
  const [homemakers, setHomemakers] = useState([]);

  useEffect(() => {
    const fetchHomemakers = async () => {
      try {
        const response = await axios.get('/api/homemakers'); // Backend API
        setHomemakers(response.data);
      } catch (error) {
        console.error('Error fetching homemakers', error);
      }
    };
    fetchHomemakers();
  }, []);

  return (
    <div>
      <h1>Our Homemakers</h1>
      <div className="homemakers-grid">
        {homemakers.map((homemaker) => (
          <div key={homemaker._id} className="homemaker-card">
            <img src={`/images/${homemaker.profilePic}`} alt={homemaker.name} />
            <h3>{homemaker.name}</h3>
            <p>📍 {homemaker.address}</p>
            <p>⭐ {homemaker.rating || 'No rating yet'}</p>
            <Link to={`/homemaker/${homemaker._id}`}>
              <button>View Menu</button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Homemakers;
