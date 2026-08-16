import { useState, useEffect } from 'react';
import API from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';

function MyListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  const fetchMyListings = async () => {
    setLoading(true);
    try {
      const response = await API.get('/listings/my-listings', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setListings(response.data);
    } catch (err) {
      setError('Failed to load your listings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMyListings(); }, []);

  const handleDelete = async (id) => {
    try {
      await API.delete(`/listings/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchMyListings();
    } catch (err) {
      setError('Failed to delete listing');
    }
  };

  const handleMarkSold = async (id) => {
    try {
      await API.put(`/listings/${id}`, { status: 'sold' }, { headers: { Authorization: `Bearer ${token}` } });
      fetchMyListings();
    } catch (err) {
      setError('Failed to update listing');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold text-green-800 mb-8">My Listings</h2>

      {loading && <LoadingSpinner />}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && listings.length === 0 && (
        <div className="text-center py-16">
          <p className="text-5xl mb-4">📦</p>
          <p className="text-gray-500 font-medium">You haven't posted any listings yet.</p>
          <p className="text-gray-400 text-sm mt-1">Use "Post a Listing" to add your first one.</p>
        </div>
      )}

      <div className="space-y-4">
        {listings.map((listing) => (
          <div key={listing._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex justify-between items-center">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-bold text-gray-800">{listing.title}</h3>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  listing.status === 'available' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'
                }`}>
                  {listing.status}
                </span>
              </div>
              <p className="text-sm text-gray-500">{listing.quantity} {listing.unit} • ₹{listing.pricePerUnit}/{listing.unit}</p>
            </div>

            <div className="flex gap-2">
              {listing.status === 'available' && (
                <button
                  onClick={() => handleMarkSold(listing._id)}
                  className="bg-amber-500 text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-amber-600 transition"
                >
                  Mark as Sold
                </button>
              )}
              <button
                onClick={() => handleDelete(listing._id)}
                className="bg-red-500 text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyListings;