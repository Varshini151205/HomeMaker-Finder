import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const HomemakerProfile = () => {
  const { id } = useParams();
  const [homemaker, setHomemaker] = useState(null);

  useEffect(() => {
    const fetchHomemaker = async () => {
      try {
        const response = await axios.get(`/api/homemakers/${id}`);
        setHomemaker(response.data);
      } catch (error) {
        console.error('Error fetching homemaker', error);
      }
    };
    fetchHomemaker();
  }, [id]);

  if (!homemaker) return <div>Loading...</div>;

  return (
    <div>
      <h2>{homemaker.name} - {homemaker.location}</h2>
      <p>⭐ {homemaker.rating}</p>

      <h3>Menu Items</h3>
      <ul>
        {homemaker.menuItems.map((item) => (
          <li key={item._id}>
            {item.name} - ₹{item.price}
            <button>Add to Cart</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HomemakerProfile;
