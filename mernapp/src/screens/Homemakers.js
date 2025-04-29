import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Homemakers = () => {
  const [homemakers, setHomemakers] = useState([]);

  useEffect(() => {
    axios.get('/api/homemakers')
      .then(res => setHomemakers(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Available Homemakers</h2>
      <div className="grid grid-cols-2 gap-4">
        {homemakers.map(h => (
          <Link to={`/homemaker/${h._id}`} key={h._id} className="border p-2 rounded shadow">
            <h3 className="text-lg font-semibold">{h.name}</h3>
            <p>Cuisine: {h.cuisine.join(', ')}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Homemakers;
