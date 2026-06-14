import { useState } from "react";
import axios from "axios";

function CaloriesSuggestion() {
  const [foodName, setFoodName] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const getCalories = async () => {
    setLoading(true);
    try {
      const res = await axios.post("/api/ai/calories", { foodName });
      setResponse(res.data.result);
    } catch (err) {
      setResponse("Error fetching data.");
    }
    setLoading(false);
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-2">Calorie Suggestion</h2>
      <input
        type="text"
        value={foodName}
        onChange={(e) => setFoodName(e.target.value)}
        placeholder="Enter a dish (e.g., Aloo Paratha)"
        className="w-full p-2 border rounded mb-2"
      />
      <button
        onClick={getCalories}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Thinking..." : "Get Calorie Info"}
      </button>

      {response && (
        <div className="mt-4 whitespace-pre-line bg-gray-100 p-3 rounded">
          {response}
        </div>
      )}
    </div>
  );
}

export default CaloriesSuggestion;
