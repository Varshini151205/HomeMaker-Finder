import React, { useState, useEffect } from "react";
// Remove the Navbar import since it's already in your layout
// import Navbar from "../components/Navbar";
import axios from "axios";
import { Calendar, Package2, CreditCard, TrendingUp, CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  // Enhanced food-themed colors
  const colors = {
    primary: "#FF5A00", // Orange like Swiggy
    secondary: "#2B1B17", // Dark brown
    accent: "#60B246", // Green for success states
    error: "#E23744", // Red for error states
    light: "#FFF9F5", // Warmer light background with a hint of orange
    cardBg: "#FFFFFF", // Card background
    border: "#FFE8D6", // Warmer border color
    text: "#3D3D3D", // Main text
    textLight: "#7E808C", // Secondary text
    backgroundGradient: "linear-gradient(to bottom, #FFF3E0, #FFF9F5)" // Warm food-themed gradient
  };

  useEffect(() => {
    // Fetch orders from API
    setIsLoading(true);
    axios.get("http://localhost:5000/api/orders")
      .then(response => {
        setOrders(response.data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Error fetching orders:", error);
        setIsLoading(false);
      });
  }, []);

  // Status badge style and icon
  const getStatusDetails = (status) => {
    switch(status) {
      case "delivered":
        return {
          icon: <CheckCircle size={16} />,
          color: colors.accent,
          text: "Delivered"
        };
      case "cancelled":
        return {
          icon: <XCircle size={16} />,
          color: colors.error,
          text: "Cancelled"
        };
      case "pending":
        return {
          icon: <Clock size={16} />,
          color: "#F5A623", // Amber
          text: "Pending"
        };
      default:
        return {
          icon: <AlertCircle size={16} />,
          color: colors.textLight,
          text: status
        };
    }
  };

  // Payment method icon
  const getPaymentIcon = (method) => {
    switch(method?.toLowerCase()) {
      case "credit card":
        return <CreditCard size={18} />;
      case "debit card":
        return <CreditCard size={18} />;
      case "upi":
        return <TrendingUp size={18} />;
      case "cash":
        return <i className="fas fa-money-bill-wave" style={{ fontSize: "18px" }}></i>;
      default:
        return <CreditCard size={18} />;
    }
  };

  const filteredOrders = filter === "all" ? orders : orders.filter(order => order.status === filter);

  return (
    <div style={{ 
      background: colors.backgroundGradient, 
      minHeight: "100vh",
      paddingTop: "1rem", // Add some top padding to separate from navbar
    }}>
      {/* Removed the Navbar component from here */}
      
      <div className="container py-4">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <h2 style={{ color: colors.secondary, fontWeight: "700" }}>My Orders</h2>
          
          {/* Filter Orders */}
          <div className="d-flex align-items-center">
            <label className="me-2" style={{ color: colors.textLight, marginBottom: "0" }}>Filter:</label>
            <select 
              className="form-select" 
              onChange={(e) => setFilter(e.target.value)}
              style={{ 
                border: `1px solid ${colors.border}`,
                borderRadius: "8px",
                padding: "8px 16px",
                boxShadow: "none",
                fontWeight: "500"
              }}
            >
              <option value="all">All Orders</option>
              <option value="pending">Pending</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="d-flex justify-content-center py-5">
            <div className="spinner-border" role="status" style={{ color: colors.primary }}>
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-5" style={{ color: colors.textLight }}>
            <Package2 size={64} style={{ color: colors.textLight, opacity: 0.5, marginBottom: "16px" }} />
            <h4>No orders found</h4>
            <p>You haven't placed any orders yet or no orders match your filter.</p>
          </div>
        ) : (
          <div className="row">
            {filteredOrders.map((order) => {
              const statusDetails = getStatusDetails(order.status);
              return (
                <div className="col-12 mb-4" key={order.id}>
                  <div 
                    className="card border-0 shadow-sm"
                    style={{ 
                      borderRadius: "16px", 
                      backgroundColor: colors.cardBg,
                      overflow: "hidden"
                    }}
                  >
                    {/* Order Header */}
                    <div className="card-header d-flex justify-content-between align-items-center" 
                      style={{ 
                        backgroundColor: colors.light, 
                        borderBottom: `1px solid ${colors.border}`,
                        padding: "16px 20px"
                      }}
                    >
                      <div className="d-flex align-items-center">
                        <Calendar size={18} style={{ color: colors.textLight, marginRight: "8px" }} />
                        <span style={{ color: colors.textLight, fontSize: "14px" }}>
                          {order.date || "May 4, 2025"}
                        </span>
                      </div>
                      <div className="d-flex align-items-center">
                        <span style={{ fontSize: "14px", marginRight: "8px", color: colors.textLight }}>
                          Order #{order.id}
                        </span>
                        <div 
                          className="d-flex align-items-center" 
                          style={{ 
                            backgroundColor: statusDetails.color + "20", // 20% opacity
                            color: statusDetails.color,
                            padding: "4px 12px",
                            borderRadius: "50px",
                            fontWeight: "500",
                            fontSize: "13px"
                          }}
                        >
                          <span style={{ marginRight: "4px" }}>{statusDetails.icon}</span>
                          {statusDetails.text}
                        </div>
                      </div>
                    </div>
                    
                    {/* Order Content */}
                    <div className="card-body" style={{ padding: "20px" }}>
                      <div className="row">
                        {/* Order Items */}
                        <div className="col-md-8">
                          <div className="d-flex mb-3">
                            <div 
                              style={{ 
                                width: "60px", 
                                height: "60px", 
                                backgroundColor: "#F0F0F0",
                                borderRadius: "8px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                marginRight: "16px"
                              }}
                            >
                              <img 
                                src={order.image || "/api/placeholder/60/60"} 
                                alt={order.item}
                                style={{ 
                                  maxWidth: "100%", 
                                  maxHeight: "100%", 
                                  borderRadius: "8px",
                                  objectFit: "cover"
                                }}
                                onError={(e) => {
                                  e.target.src = "/api/placeholder/60/60";
                                }}
                              />
                            </div>
                            <div>
                              <h5 style={{ 
                                color: colors.text, 
                                marginBottom: "4px", 
                                fontWeight: "600",
                                fontSize: "16px"
                              }}>
                                {order.item}
                              </h5>
                              <div className="d-flex">
                                <span style={{ color: colors.textLight, fontSize: "14px", marginRight: "16px" }}>
                                  Qty: {order.quantity}
                                </span>
                                <span style={{ 
                                  color: colors.primary, 
                                  fontWeight: "600", 
                                  fontSize: "14px" 
                                }}>
                                  ₹{order.price}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Delivery Address if available */}
                          {order.address && (
                            <div style={{ 
                              fontSize: "14px", 
                              color: colors.textLight, 
                              marginTop: "12px",
                              borderTop: `1px dashed ${colors.border}`,
                              paddingTop: "12px"
                            }}>
                              <div style={{ fontWeight: "500", marginBottom: "4px", color: colors.text }}>
                                Delivery Address
                              </div>
                              {order.address}
                            </div>
                          )}
                        </div>
                        
                        {/* Order Summary */}
                        <div className="col-md-4">
                          <div style={{ 
                            backgroundColor: colors.light, 
                            borderRadius: "12px",
                            padding: "16px"
                          }}>
                            <h6 style={{ 
                              color: colors.text, 
                              fontWeight: "600", 
                              marginBottom: "12px" 
                            }}>
                              Order Summary
                            </h6>
                            
                            <div className="d-flex justify-content-between mb-2" style={{ fontSize: "14px" }}>
                              <span style={{ color: colors.textLight }}>Item Total</span>
                              <span style={{ color: colors.text }}>₹{order.price * order.quantity}</span>
                            </div>
                            
                            <div className="d-flex justify-content-between mb-2" style={{ fontSize: "14px" }}>
                              <span style={{ color: colors.textLight }}>Delivery Fee</span>
                              <span style={{ color: colors.text }}>₹{order.deliveryFee || 40}</span>
                            </div>
                            
                            {order.discount && (
                              <div className="d-flex justify-content-between mb-2" style={{ fontSize: "14px" }}>
                                <span style={{ color: colors.accent }}>Discount</span>
                                <span style={{ color: colors.accent }}>-₹{order.discount}</span>
                              </div>
                            )}
                            
                            <div style={{ 
                              borderTop: `1px dashed ${colors.border}`, 
                              margin: "8px 0", 
                              paddingTop: "8px" 
                            }}>
                              <div className="d-flex justify-content-between" style={{ fontWeight: "600" }}>
                                <span>Total</span>
                                <span>₹{(order.price * order.quantity) + (order.deliveryFee || 40) - (order.discount || 0)}</span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Payment Method */}
                          <div style={{ 
                            marginTop: "16px", 
                            backgroundColor: colors.light,
                            borderRadius: "12px",
                            padding: "16px"
                          }}>
                            <h6 style={{ 
                              color: colors.text, 
                              fontWeight: "600", 
                              marginBottom: "12px" 
                            }}>
                              Payment Details
                            </h6>
                            
                            <div className="d-flex align-items-center" style={{ marginBottom: "8px" }}>
                              <div style={{ 
                                width: "40px", 
                                height: "40px", 
                                backgroundColor: colors.primary + "15", // 15% opacity
                                borderRadius: "8px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                marginRight: "12px",
                                color: colors.primary
                              }}>
                                {getPaymentIcon(order.paymentMethod)}
                              </div>
                              <div>
                                <div style={{ fontWeight: "500", fontSize: "14px" }}>
                                  {order.paymentMethod || "Online Payment"}
                                </div>
                                <div style={{ color: colors.textLight, fontSize: "12px" }}>
                                  {order.paymentStatus === "paid" ? 
                                    "Payment Successful" : 
                                    order.paymentStatus || "Pending"}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Order Footer with Actions */}
                    {order.status === "delivered" && (
                      <div className="card-footer d-flex justify-content-end" 
                        style={{ 
                          backgroundColor: colors.cardBg, 
                          borderTop: `1px solid ${colors.border}`,
                          padding: "12px 20px"  
                        }}
                      >
                        <button 
                          className="btn" 
                          style={{ 
                            backgroundColor: "transparent", 
                            border: `1px solid ${colors.border}`,
                            color: colors.text,
                            marginRight: "10px",
                            borderRadius: "8px",
                            fontWeight: "500",
                            padding: "8px 16px"
                          }}
                        >
                          Help
                        </button>
                        <button 
                          className="btn" 
                          style={{ 
                            backgroundColor: colors.primary, 
                            border: "none",
                            color: "white",
                            borderRadius: "8px",
                            fontWeight: "500",
                            padding: "8px 16px"
                          }}
                        >
                          Reorder
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
    </div>
  );
}