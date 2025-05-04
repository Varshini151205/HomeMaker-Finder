import React from 'react';
import { Link } from 'react-router-dom';
import bg1 from '../assets/bg-food1.png'; // Add your food image here

const HeroSection = () => {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center text-center text-white bg-cover bg-center overflow-hidden" style={{ backgroundImage: `url(${bg1})` }}>
      <div className="absolute inset-0 bg-black opacity-60 z-0"></div>

      {/* Animated Logo */}
      <div className="z-10 text-5xl font-extrabold text-yellow-400 animate-bounce flex items-center gap-2">
        🍲 HomeMade Meals
      </div>

      {/* Subtitle */}
      <p className="z-10 text-lg mt-4 text-white font-medium">
        Delicious homemade food at your doorstep!
      </p>

      {/* Buttons */}
      <div className="z-10 mt-6 flex gap-4 flex-wrap justify-center">
        <Link to="/login" className="bg-blue-600 px-4 py-2 rounded-md text-white font-semibold hover:bg-blue-700">
          Login
        </Link>
        <Link to="/menu" className="bg-yellow-500 px-4 py-2 rounded-md text-black font-semibold hover:bg-yellow-600">
          Explore Menu
        </Link>
        <Link to="/homemakers" className="bg-green-600 px-4 py-2 rounded-md text-white font-semibold hover:bg-green-700">
          View Homemakers
        </Link>
      </div>
    </div>
  );
};

export default HeroSection;
