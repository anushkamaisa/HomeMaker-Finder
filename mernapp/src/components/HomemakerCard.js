// src/components/HomemakerCard.js
import React from "react";
import { Star } from "lucide-react";
import { Card, CardContent } from "../components/ui/card"; // Make sure this matches your file structure
import Button from "../components/ui/button"; // Assuming you are exporting default Button

const HomemakerCard = ({ homemaker, onViewDetails }) => {
  return (
    <Card className="w-full min-h-[360px] rounded-2xl overflow-hidden">
      <img
        src={homemaker.image}
        alt={homemaker.dish}
        className="w-full h-40 object-cover"
      />
      <CardContent className="p-4">
        <h3 className="text-lg font-bold">{homemaker.name}</h3>
        <p className="text-sm text-gray-700">
          Cuisine: {homemaker.cuisine} ({homemaker.type})
        </p>
        <p className="mt-2 font-medium">Dish: {homemaker.dish}</p>
        <p className="text-sm">Calories: {homemaker.calories} kcal</p>

        <div className="flex items-center mt-2 text-yellow-600">
          <Star className="w-4 h-4 mr-1" /> {homemaker.rating} ★
        </div>

        <div className="mt-2 flex flex-wrap gap-2">
          {homemaker.tags?.map((tag, idx) => (
            <span
              key={idx}
              className="bg-green-200 text-green-800 rounded-full px-2 py-1 text-xs"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="mt-4 flex space-x-2">
          <Button className="flex-1" disabled={!homemaker.available}>
            {homemaker.available ? "Order Now" : "Not Available"}
          </Button>
          <Button className="flex-1" variant="outline" onClick={() => onViewDetails(homemaker)}>
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default HomemakerCard;
