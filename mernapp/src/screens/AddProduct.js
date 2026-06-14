import React, { useState } from "react";
import "./AddProduct.css"; // optional, for custom styling
const BASE_URL = process.env.REACT_APP_API_URL;

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: "",
    img: null,  // Changed from string to null, as it's an image file
    price: "",
    category: "",
  });
  const [message, setMessage] = useState("");

  // replace with actual homemaker ID or fetch from context/state
  const homemakerId = "680de8473ef4cbcba654fc52";

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value, // For image file, store the file object
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare form data for image upload
    const form = new FormData();
    form.append("name", formData.name);
    form.append("img", formData.img);  // Append the file object
    form.append("price", Number(formData.price));
    form.append("category", formData.category);
    form.append("homemakerId", homemakerId);

    try {
      const res = await fetch(`${BASE_URL}/api/products`, {
        method: "POST",
        body: form,  // Use FormData directly as body
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Product added successfully!");
        setFormData({ name: "", img: null, price: "", category: "" });
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

        {/* File input for image */}
        <input
          type="file"
          name="img"
          accept="image/*"
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
