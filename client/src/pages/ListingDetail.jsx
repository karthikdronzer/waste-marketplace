import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';

function ListingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [inquirySent, setInquirySent] = useState(false);
  const [inquiryError, setInquiryError] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await API.get(`/listings/${id}`);
        setListing(response.data);
      } catch (err) {
        setError('Listing not found');
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  const handleInquiry = async (e) => {
    e.preventDefault();
    setInquiryError('');
    const token = localStorage.getItem('token');
    try {
      await API.post(
        '/inquiries',
        { listingId: id, message },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setInquirySent(true);
    } catch (err) {
      setInquiryError(err.response?.data?.message || 'Failed to send inquiry');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <p className="text-center text-red-500 mt-10">{error}</p>;
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
        {listing.imageUrl && (
          <img src={listing.imageUrl} alt={listing.title} className="w-full h-64 object-cover rounded-lg mb-6" />
        )}

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

        {user?.role === 'buyer' && (
          <div className="border-t mt-6 pt-6">
            {inquirySent ? (
              <p className="text-green-600 font-medium">✅ Interest sent to the seller!</p>
            ) : (
              <form onSubmit={handleInquiry} className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">Message to seller</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows="3"
                  placeholder="I'm interested in this listing, please share more details..."
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                {inquiryError && <p className="text-red-500 text-sm">{inquiryError}</p>}
                <button
                  type="submit"
                  className="bg-amber-500 text-white px-5 py-2 rounded-md font-semibold hover:bg-amber-600 transition"
                >
                  Express Interest
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ListingDetail;