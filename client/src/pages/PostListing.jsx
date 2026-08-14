import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { cities } from '../data/cities';

function PostListing() {
  const [formData, setFormData] = useState({
    title: '', description: '', wasteType: '', quantity: '', unit: '', pricePerUnit: '', location: '',
  });
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    if (e.target.name === 'location') {
      const value = e.target.value.toLowerCase();
      if (value.length > 0) {
        const filtered = cities.filter((city) =>
          city.toLowerCase().includes(value)
        );
        setSuggestions(filtered);
      } else {
        setSuggestions([]);
      }
    }
  };

  const selectCity = (city) => {
    setFormData({ ...formData, location: city });
    setSuggestions([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const token = localStorage.getItem('token');
    try {
      await API.post('/listings', formData, { headers: { Authorization: `Bearer ${token}` } });
      navigate('/listings');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post listing');
    }
  };

  const inputClass = "w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="min-h-screen bg-stone-50 py-10 px-6">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-green-700 mb-6">Post a Waste Listing</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelClass}>Title</label>
            <input name="title" value={formData.title} onChange={handleChange} required className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} required rows="3" className={inputClass} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Waste Type</label>
              <input name="wasteType" value={formData.wasteType} onChange={handleChange} required className={inputClass} />
            </div>
            <div className="relative">
              <label className={labelClass}>Location</label>
              <input
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                autoComplete="off"
                className={inputClass}
              />
              {suggestions.length > 0 && (
                <ul className="absolute z-10 bg-white border border-gray-200 rounded-md mt-1 w-full max-h-40 overflow-y-auto shadow-md">
                  {suggestions.map((city) => (
                    <li
                      key={city}
                      onClick={() => selectCity(city)}
                      className="px-3 py-2 text-sm hover:bg-green-50 cursor-pointer"
                    >
                      {city}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Quantity</label>
              <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} required className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Unit</label>
              <input name="unit" value={formData.unit} onChange={handleChange} placeholder="kg, tons" required className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Price/Unit</label>
              <input type="number" name="pricePerUnit" value={formData.pricePerUnit} onChange={handleChange} required className={inputClass} />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition font-semibold">
            Post Listing
          </button>
        </form>
      </div>
    </div>
  );
}

export default PostListing;