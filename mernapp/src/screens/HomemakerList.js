import { useEffect, useState } from 'react';
import axios from 'axios';
const BASE_URL = process.env.REACT_APP_API_URL;

function HomemakerList() {
  const [homemakers, setHomemakers] = useState([]);
  const [filters, setFilters] = useState({
    cuisine: '',
    isVeg: '',
    location: '',
    minRating: '',
    delivers: '',
  });

  const fetchHomemakers = async () => {
    const res = await axios.get(
    `${BASE_URL}/api/auth/all`,
    { params: filters }
  );
    setHomemakers(res.data);
  };

  useEffect(() => {
    fetchHomemakers();
  }, [filters]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Find Homemakers</h2>

      {/* Filters */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-6">
        <input
          className="border p-2"
          placeholder="Cuisine (e.g., Bengali)"
          onChange={(e) => setFilters({ ...filters, cuisine: e.target.value })}
        />
        <input
          className="border p-2"
          placeholder="Location (e.g., Hyderabad)"
          onChange={(e) => setFilters({ ...filters, location: e.target.value })}
        />
        <select
          className="border p-2"
          onChange={(e) => setFilters({ ...filters, isVeg: e.target.value })}
        >
          <option value="">All</option>
          <option value="true">Veg Only</option>
          <option value="false">Includes Non-Veg</option>
        </select>
        <select
          className="border p-2"
          onChange={(e) => setFilters({ ...filters, delivers: e.target.value })}
        >
          <option value="">Delivery?</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
        <input
          className="border p-2"
          placeholder="Min Rating (1-5)"
          type="number"
          onChange={(e) => setFilters({ ...filters, minRating: e.target.value })}
        />
      </div>

      {/* Homemaker Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {homemakers.map((hm) => (
          <div key={hm._id} className="p-4 border rounded-xl shadow-md">
            <h3 className="text-lg font-semibold">{hm.name}</h3>
            <p className="text-sm text-gray-600">{hm.address}</p>
            <p className="mt-2"><strong>Cuisines:</strong> {hm.cuisines.join(', ')}</p>
            <p><strong>Type:</strong> {hm.isVeg ? 'Veg Only' : 'Includes Non-Veg'}</p>
            <p><strong>Rating:</strong> ⭐ {hm.rating}</p>
            <p><strong>Delivery:</strong> {hm.delivers ? 'Available' : 'Not Available'}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomemakerList;
