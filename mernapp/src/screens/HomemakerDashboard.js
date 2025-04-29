import React, { useState, useEffect } from "react";
import axios from "axios";

export default function HomemakerDashboard() {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    imgFile: null, // For the image file
  });
  const [foods, setFoods] = useState([]);
  const homemakerId = localStorage.getItem("homemakerId") || "";

  // Fetching the products (food items) when the component is mounted
  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const { data } = await axios.get(`/api/products/homemaker/${homemakerId}`);
        setFoods(data.products || []);
      } catch (err) {
        console.error("Error fetching foods:", err);
      }
    };

    if (homemakerId) {
      fetchFoods();
    }
  }, [homemakerId]);

  // Handle form data changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle image file change
  const handleFileChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      imgFile: e.target.files[0],
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const homemakerId = localStorage.getItem("homemakerId"); // Retrieve homemakerId from localStorage
    if (!homemakerId) {
      alert("Homemaker ID is missing. Please log in first.");
      return;
    }

    const { name, price, category, imgFile } = formData;

    const formDataToSend = new FormData();
    formDataToSend.append("name", name);
    formDataToSend.append("price", price);
    formDataToSend.append("category", category);
    formDataToSend.append("homemakerId", homemakerId);
    formDataToSend.append("img", imgFile);

    try {
      const response = await axios.post("/api/products", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Response from server:", response.data);
      alert("Item added successfully!");

      // Reset form fields after successful submission
      setFormData({ name: "", price: "", category: "", imgFile: null });

      // Optionally, fetch updated list of products after adding
      const { data } = await axios.get(`/api/products/homemaker/${homemakerId}`);
      setFoods(data.products || []);
    } catch (err) {
      console.error("Error adding item:", err);
      alert("Failed to add item.");
    }
  };

  return (
    <div className="container py-5">
      <h2 className="text-center mb-4">Homemaker Dashboard</h2>

      {/* Form to Add New Product */}
      <div className="card p-4 mb-5">
        <h5>Add New Product</h5>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <input
            type="text"
            placeholder="Product Name"
            className="form-control mb-2"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            placeholder="Price"
            className="form-control mb-2"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
          {/* Dropdown for Category */}
          <select
            className="form-control mb-2"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            <option value="Veg">Vegetarian</option>
            <option value="Non-Veg">Non-Vegetarian</option>
            <option value="Dessert">Dessert</option>
            <option value="Snack">Snack</option>
            <option value="Beverage">Beverage</option>
          </select>
          <input
            type="file"
            accept="image/*"
            className="form-control mb-2"
            onChange={handleFileChange}
            required
          />
          <button className="btn btn-success me-2" type="submit">
            Add Item
          </button>
        </form>
      </div>

      {/* Listing the Products (Food Items) */}
      <div className="row">
        {foods.length > 0 ? (
          foods.map((item) => (
            <div className="col-md-4 mb-4" key={item._id}>
              <div className="card h-100 shadow-sm">
                <img
                  src={item.img || "https://via.placeholder.com/300x200"}
                  alt={item.name}
                  className="card-img-top"
                />
                <div className="card-body">
                  <h5>{item.name}</h5>
                  <p className="text-muted">{item.category}</p>
                  <p className="fw-bold">₹{item.price}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center">No products found</div>
        )}
      </div>
    </div>
  );
}
