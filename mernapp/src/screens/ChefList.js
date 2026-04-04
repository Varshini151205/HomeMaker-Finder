/* src/screens/ChefList.js */
import React, { useLayoutEffect, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Star, MapPin, Search, ChefHat, Info } from "lucide-react";
import axios from "axios";
import "./ChefList.css";

const ChefList = () => {
    const [chefs, setChefs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    useLayoutEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        const fetchChefs = async () => {
            try {
                setLoading(true);
                const response = await axios.get("http://localhost:5000/api/view-homemakers");
                // The current viewHomemakersRoute.js returns the array directly
                setChefs(response.data || []);
            } catch (error) {
                console.error("Error fetching chefs:", error);
                setChefs([]);
            } finally {
                setLoading(false);
            }
        };

        fetchChefs();
    }, []);

    const filteredChefs = chefs.filter(chef => 
        chef.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chef.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (chef.cuisines && chef.cuisines.some(c => c.toLowerCase().includes(searchQuery.toLowerCase())))
    );

    const resolveImg = (chef) => {
        if (!chef.profilePic) return null;
        if (chef.profilePic.startsWith("http")) return chef.profilePic;
        return `http://localhost:5000/images/${chef.profilePic}`;
    };

    const FALLBACK_IMG = "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=2670&auto=format&fit=crop";

    return (
        <div className="chef-list-page">
            <div className="chef-hero">
                <div className="chef-hero-content">
                    <h1>Meet Our Chefs ❤️</h1>
                    <p>Discover the talented homemakers behind your favorite delicious homemade meals.</p>
                </div>
            </div>

            <div className="chef-grid-container">
                {/* Search Bar */}
                <div className="chef-search-bar mb-5" style={{ maxWidth: '600px', margin: '0 auto 3rem', position: 'relative' }}>
                    <Search className="search-icon" size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                    <input 
                        type="text" 
                        placeholder="Search by chef name, cuisine, or location..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ width: '100%', padding: '14px 14px 14px 48px', borderRadius: '14px', border: '1px solid #E5E7EB', outline: 'none', fontSize: '1rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', backgroundColor: 'white' }}
                    />
                </div>

                {loading ? (
                    <div className="text-center py-5">
                       <ChefHat size={48} className="animate-bounce" style={{ color: '#F97316', margin: '0 auto 1rem' }} />
                       <p>Finding our best chefs...</p>
                    </div>
                ) : filteredChefs.length === 0 ? (
                    <div className="chef-empty">
                        <Info size={48} className="mb-3" style={{ color: '#9CA3AF' }} />
                        <h2>No chefs found!</h2>
                        <p>Try searching for a different name, cuisine, or location.</p>
                    </div>
                ) : (
                    <div className="chef-grid">
                        {filteredChefs.map((chef) => (
                            <div key={chef._id} className="chef-card" onClick={() => navigate(`/homemaker/${chef._id}`)}>
                                <div className="chef-card-img-wrap">
                                    <img 
                                        src={resolveImg(chef) || FALLBACK_IMG} 
                                        alt={chef.name} 
                                        className="chef-card-img" 
                                    />
                                    <div className="chef-card-overlay">
                                        <div className="chef-card-location">
                                            <MapPin size={14} />
                                            {chef.address || "Location Hidden"}
                                        </div>
                                    </div>
                                </div>
                                <div className="chef-card-body">
                                    <h3 className="chef-card-name">{chef.name}</h3>
                                    <div className="chef-card-cuisines">
                                        {(chef.cuisines || []).slice(0, 3).map((cuisine, i) => (
                                            <span key={i} className="cuisine-tag">{cuisine}</span>
                                        ))}
                                        {chef.cuisines?.length > 3 && <span className="cuisine-tag">+{chef.cuisines.length - 3}</span>}
                                    </div>
                                    
                                    <div className="chef-card-stats">
                                        <div className="chef-stat rating">
                                            <Star size={16} fill="#F59E0B" color="#F59E0B" />
                                            {chef.rating || "4.8"}
                                        </div>
                                        <div className="chef-stat">
                                            <ChefHat size={16} />
                                            {chef.experience || "Expert"}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChefList;
