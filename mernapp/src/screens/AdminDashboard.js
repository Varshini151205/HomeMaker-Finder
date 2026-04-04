/* src/screens/AdminDashboard.js */
import React, { useState, useEffect } from "react";
import { Users, ChefHat, Utensils, TrendingUp, AlertCircle, ShieldCheck } from "lucide-react";
import axios from "axios";

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalHomemakers: 0,
        totalFoodItems: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const response = await axios.post("http://localhost:5000/api/admin/stats");
                setStats(response.data);
            } catch (error) {
                console.error("Error fetching admin stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const StatCard = ({ icon: Icon, label, value, color }) => (
        <div className="card shadow-sm border-0 p-4" style={{ borderRadius: '20px', backgroundColor: 'white' }}>
            <div className="d-flex align-items-center gap-3">
                <div className="p-3 rounded-4" style={{ backgroundColor: `${color}15`, color: color }}>
                    <Icon size={32} />
                </div>
                <div>
                    <p className="text-muted mb-1 fw-medium" style={{ fontSize: '0.9rem' }}>{label}</p>
                    <h3 className="mb-0 fw-bold" style={{ color: '#111827' }}>{value}</h3>
                </div>
            </div>
            <div className="mt-3 pt-3 border-top d-flex align-items-center gap-2 text-success" style={{ fontSize: '0.8rem', fontWeight: '600' }}>
                <TrendingUp size={14} />
                <span>+12% from last month</span>
            </div>
        </div>
    );

    return (
        <div className="admin-dashboard-page" style={{ minHeight: '100vh', backgroundColor: '#F9FAFB', padding: '3rem 1.5rem' }}>
            <div className="container" style={{ maxWidth: '1000px' }}>
                <div className="d-flex align-items-center gap-3 mb-5">
                    <div className="p-2 rounded-3 bg-dark text-white">
                        <ShieldCheck size={32} />
                    </div>
                    <div>
                        <h1 className="fw-800 mb-0" style={{ fontSize: '2rem', letterSpacing: '-1px' }}>Admin Dashboard</h1>
                        <p className="text-muted mb-0">Platform performance and overview</p>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="row g-4 mb-5">
                            <div className="col-md-4">
                                <StatCard icon={Users} label="Total Customers" value={stats.totalUsers} color="#3B82F6" />
                            </div>
                            <div className="col-md-4">
                                <StatCard icon={ChefHat} label="Total Cooks" value={stats.totalHomemakers} color="#F97316" />
                            </div>
                            <div className="col-md-4">
                                <StatCard icon={Utensils} label="Total Dishes" value={stats.totalFoodItems} color="#10B981" />
                            </div>
                        </div>

                        <div className="alert alert-info border-0 shadow-sm d-flex align-items-center gap-3 p-4" style={{ borderRadius: '20px', backgroundColor: 'white' }}>
                            <AlertCircle className="text-info" size={24} />
                            <div>
                                <h5 className="mb-1 fw-bold">Admin Notice</h5>
                                <p className="mb-0 text-muted">This is a management overview. Further controls for user moderation and order tracking are under development.</p>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
