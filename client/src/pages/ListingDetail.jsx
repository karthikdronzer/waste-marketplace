import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';

function ListingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await API.get(`/listings/${id}`);
        setListing(response.data);
      } catch (err) {
        setError('Listing not found');
      }
    };
    fetchListing();
  }, [id]);

  if (error) {
    return <p className="text-center text-red-500 mt-10">{error}</p>;
  }

  if (!listing) {
    return <p className="text-center text-gray-400 mt-10">Loading...</p>;
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <button
        onClick={() => navigate('/listings')}
        className="text-green-700 font-medium mb-6 hover:underline"
      >
        ← Back to Listings
      </button>

      <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100">
        <span className="inline-block bg-green-100 text-green-700 text-sm font-semibold px-3 py-1 rounded-full mb-4">
          {listing.wasteType}
        </span>

        <h1 className="text-3xl font-bold text-gray-800 mb-3">{listing.title}</h1>
        <p className="text-gray-600 mb-6">{listing.description}</p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-stone-50 rounded-lg p-4">
            <p className="text-xs text-gray-400 mb-1">Quantity</p>
            <p className="text-lg font-semibold text-gray-800">{listing.quantity} {listing.unit}</p>
          </div>
          <div className="bg-stone-50 rounded-lg p-4">
            <p className="text-xs text-gray-400 mb-1">Price</p>
            <p className="text-lg font-semibold text-amber-600">₹{listing.pricePerUnit} / {listing.unit}</p>
          </div>
        </div>

        <div className="border-t pt-4 flex justify-between text-sm text-gray-500">
          <span>📍 {listing.location}</span>
          <span>Posted by {listing.postedBy?.name}</span>
        </div>

        <div className="mt-2 text-xs text-gray-400">
          {listing.postedBy?.email}
        </div>
      </div>
    </div>
  );
}

export default ListingDetail;