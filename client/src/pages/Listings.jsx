import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import { wasteTypes } from '../data/wasteTypes';

function Listings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ wasteType: '', location: '', minPrice: '', maxPrice: '' });
  const navigate = useNavigate();

  const fetchListings = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.wasteType) params.wasteType = filters.wasteType;
      if (filters.location) params.location = filters.location;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;

      const response = await API.get('/listings', { params });
      setListings(response.data);
    } catch (err) {
      setError('Failed to load listings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchListings(); }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = (e) => {
    e.preventDefault();
    fetchListings();
  };

  const clearFilters = () => {
    setFilters({ wasteType: '', location: '', minPrice: '', maxPrice: '' });
    setTimeout(fetchListings, 0);
  };

  const inputClass = "border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500";

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold text-green-800 mb-2">Browse Waste Listings</h2>
      <p className="text-gray-500 mb-6">Find reusable industrial byproducts near you</p>

      <form onSubmit={applyFilters} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-8 flex flex-wrap gap-3 items-end">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Waste Type</label>
          <select name="wasteType" value={filters.wasteType} onChange={handleFilterChange} className={inputClass}>
            <option value="">All Types</option>
            {wasteTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Location</label>
          <input name="location" value={filters.location} onChange={handleFilterChange} placeholder="e.g. Chennai" className={inputClass} />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Min Price</label>
          <input type="number" name="minPrice" value={filters.minPrice} onChange={handleFilterChange} className={`${inputClass} w-24`} />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Max Price</label>
          <input type="number" name="maxPrice" value={filters.maxPrice} onChange={handleFilterChange} className={`${inputClass} w-24`} />
        </div>
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-green-700 transition">
          Apply
        </button>
        <button type="button" onClick={clearFilters} className="text-gray-500 text-sm hover:text-gray-700 px-2">
          Clear
        </button>
      </form>

      {loading && <LoadingSpinner />}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && listings.length === 0 && (
        <div className="text-center py-16">
          <p className="text-5xl mb-4">♻️</p>
          <p className="text-gray-500 font-medium">No listings match your filters.</p>
          <p className="text-gray-400 text-sm mt-1">Try clearing filters or check back soon.</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((listing) => (
          <div
            key={listing._id}
            onClick={() => navigate(`/listings/${listing._id}`)}
            className="bg-white rounded-xl shadow-sm hover:shadow-lg transition overflow-hidden border border-gray-100 cursor-pointer"
          >
            {listing.imageUrl ? (
              <img src={listing.imageUrl} alt={listing.title} className="w-full h-40 object-cover" />
            ) : (
              <div className="w-full h-40 bg-green-50 flex items-center justify-center text-green-300 text-3xl">♻️</div>
            )}
            <div className="p-5">
              <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full mb-3">
                {listing.wasteType}
              </span>
              <h3 className="text-lg font-bold text-gray-800 mb-1">{listing.title}</h3>
              <p className="text-gray-500 text-sm mb-4 line-clamp-2">{listing.description}</p>
              <div className="flex justify-between items-center text-sm text-gray-600 mb-3">
                <span>{listing.quantity} {listing.unit}</span>
                <span className="text-amber-600 font-bold text-base">₹{listing.pricePerUnit}/{listing.unit}</span>
              </div>
              <div className="text-xs text-gray-400 border-t pt-3 flex justify-between">
                <span>📍 {listing.location}</span>
                <span>{listing.postedBy?.name}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Listings;