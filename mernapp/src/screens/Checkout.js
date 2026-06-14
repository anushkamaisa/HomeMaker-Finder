import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
const BASE_URL = process.env.REACT_APP_API_URL;
export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const meal = location.state?.meal; // Get the selected meal

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    quantity: 1,
    suggestions: "",
  });

  if (!meal) {
    return <div className="text-center text-xl">No meal selected.</div>;
  }

  const totalPrice = formData.quantity * meal.price;

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Function to place an order
  const handlePlaceOrder = async () => {
    try {
      await axios.post(`${BASE_URL}/api/order`, {
        name: formData.name,
        address: formData.address,
        quantity: formData.quantity,
        price: totalPrice,
        foodName: meal.name,
        suggestion: formData.suggestions,
      });
      alert("Order placed successfully!");
      navigate("/orders");
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  // Razorpay Payment Integration
  const handlePayment = async () => {
    if (!formData.name || !formData.address || !formData.phone) {
      alert("Please fill all required fields!");
      return;
    }

    try {
  const { data } = await axios.post(
    `${BASE_URL}/api/orders/create-order`,
    {
      amount: totalPrice,
    });
      const options = {
        key: "YOUR_RAZORPAY_KEY_ID", // Replace with your Razorpay key
        amount: data.amount,
        currency: "INR",
        name: "Homemade Food Delivery",
        description: "Order Payment",
        order_id: data.id,
        handler: function (response) {
          alert("Payment Successful!");
          handlePlaceOrder(); // Call order placement after successful payment
        },
        prefill: {
          name: formData.name,
          email: "customer@example.com",
          contact: formData.phone,
        },
        theme: {
          color: "#28a745",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment failed", error);
      alert("Payment failed, please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg text-center">
        <h2 className="text-2xl font-bold mb-4">Checkout</h2>
        <img src={meal.image} alt={meal.name} className="w-64 h-64 object-cover mx-auto rounded-lg" />
        <h3 className="text-xl font-semibold mt-4">{meal.name}</h3>
        <p className="text-gray-600">By {meal.chef}</p>
        <span className="text-2xl font-bold text-green-600 mt-2 block">₹{totalPrice}</span>

        {/* User Input Form */}
        <div className="mt-4">
          <input type="text" name="name" placeholder="Full Name" className="form-control" value={formData.name} onChange={handleChange} required />
          <textarea name="address" placeholder="Delivery Address" className="form-control mt-3" value={formData.address} onChange={handleChange} required />
          <input type="tel" name="phone" placeholder="Phone Number" className="form-control mt-3" value={formData.phone} onChange={handleChange} required />
          <input type="number" name="quantity" min="1" className="form-control mt-3" value={formData.quantity} onChange={handleChange} required />
          <textarea name="suggestions" placeholder="Any cooking suggestions?" className="form-control mt-3" value={formData.suggestions} onChange={handleChange} />
        </div>

        {/* Payment & Order Buttons */}
        <button className="mt-5 bg-blue-600 text-white px-6 py-2 rounded-md" onClick={handlePayment}>
          Pay Now with Razorpay
        </button>
        <button className="mt-2 bg-green-600 text-white px-6 py-2 rounded-md" onClick={handlePlaceOrder}>
          Place Order without Payment
        </button>
      </div>
    </div>
  );
}
