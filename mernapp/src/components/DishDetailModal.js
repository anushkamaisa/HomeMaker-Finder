// components/DishDetailModal.js
import React from "react";

const DishDetailModal = ({ dish, onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-2xl font-bold mb-4">{dish.dish} - Details</h2>
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800">X</button>
        <img src={dish.image} alt={dish.dish} className="w-full h-40 object-cover mb-4" />
        <h3 className="font-semibold">Description</h3>
        <p>{dish.description}</p>
        <h3 className="font-semibold mt-4">Ingredients</h3>
        <ul className="list-disc ml-5">
          {dish.ingredients.map((ingredient, idx) => (
            <li key={idx}>{ingredient}</li>
          ))}
        </ul>
        <h3 className="font-semibold mt-4">Cooking Hygiene Info</h3>
        <p>{dish.hygieneInfo}</p>
        <h3 className="font-semibold mt-4">Ratings & Reviews</h3>
        <p>⭐⭐⭐⭐⭐ (4.7 Average Rating)</p>
      </div>
    </div>
  );
};

export default DishDetailModal;
