import { useState, useEffect } from 'react';
import API from '../api/axios';

function Listings() {
  const [listings, setListings] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await API.get('/listings');
        setListings(response.data);
      } catch (err) {
        setError('Failed to load listings');
      }
    };
    fetchListings();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold text-green-800 mb-2">Browse Waste Listings</h2>
      <p className="text-gray-500 mb-8">Find reusable industrial byproducts near you</p>

      {error && <p className="text-red-500">{error}</p>}
      {listings.length === 0 && !error && (
        <p className="text-gray-400 italic">No listings available yet.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((listing) => (
          <div
            key={listing._id}
            className="bg-white rounded-xl shadow-sm hover:shadow-lg transition p-5 border border-gray-100"
          >
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
        ))}
      </div>
    </div>
  );
}

export default Listings;