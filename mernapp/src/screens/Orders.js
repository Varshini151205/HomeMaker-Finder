import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    // Fetch orders from API
    axios.get("http://localhost:5000/api/orders")
      .then(response => setOrders(response.data))
      .catch(error => console.error("Error fetching orders:", error));
  }, []);

  const filteredOrders = filter === "all" ? orders : orders.filter(order => order.status === filter);

  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <h2 className="text-center">My Orders</h2>
        
        {/* Filter Orders */}
        <div className="mb-3">
          <label>Filter by Status:</label>
          <select className="form-select w-50" onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Orders Table */}
        <table className="table table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th>Item</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order, index) => (
              <tr key={order.id}>
                <td>{index + 1}</td>
                <td>{order.item}</td>
                <td>{order.quantity}</td>
                <td>${order.price}</td>
                <td>{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Footer />
    </div>
  );
}
