import React, { useState } from "react";
import "./AddProduct.css"; // optional, for custom styling

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: "",
    img: "",
    price: "",
    category: "",
  });
  const [message, setMessage] = useState("");

  // replace with actual homemaker ID or fetch from context/state
  const homemakerId = "67f12e4bfb99ad1c6b38eb2c";

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newProduct = {
      ...formData,
      price: Number(formData.price),
      homemakerId,
    };

    try {
      const res = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProduct),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Product added successfully!");
        setFormData({ name: "", img: "", price: "", category: "" });
      } else {
        setMessage(data.error || "Something went wrong.");
      }
    } catch (err) {
      console.error("Error adding product:", err);
      setMessage("Failed to add product.");
    }
  };

  return (
    <div className="add-product-container">
      <h2>Add New Product</h2>

      <form onSubmit={handleSubmit} className="product-form">
        <input
          type="text"
          name="name"
          placeholder="Food Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="img"
          placeholder="Image URL"
          value={formData.img}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="price"
          placeholder="Price (₹)"
          value={formData.price}
          onChange={handleChange}
          required
        />

        <select name="category" value={formData.category} onChange={handleChange} required>
          <option value="">Select Category</option>
          <option value="Vegetarian">Vegetarian</option>
          <option value="Non-Vegetarian">Non-Vegetarian</option>
          <option value="Seafood">Seafood</option>
          <option value="Snacks">Snacks</option>
          <option value="Sweets">Sweets</option>
          <option value="Sambar">Sambar</option>
          <option value="Roti">Roti</option>
        </select>

        <button type="submit">Add Product</button>
      </form>

      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default AddProduct;
