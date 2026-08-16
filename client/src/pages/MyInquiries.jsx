import { useState, useEffect } from 'react';
import API from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';

function MyInquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const response = await API.get('/inquiries/received', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInquiries(response.data);
    } catch (err) {
      setError('Failed to load inquiries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchInquiries(); }, []);

  const respond = async (id, status) => {
    try {
      await API.put(`/inquiries/${id}`, { status }, { headers: { Authorization: `Bearer ${token}` } });
      fetchInquiries();
    } catch (err) {
      setError('Failed to update inquiry');
    }
  };

  const statusColor = {
    pending: 'bg-amber-100 text-amber-700',
    accepted: 'bg-green-100 text-green-700',
    declined: 'bg-red-100 text-red-700',
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold text-green-800 mb-8">Inquiries Received</h2>

      {loading && <LoadingSpinner />}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && inquiries.length === 0 && (
        <div className="text-center py-16">
          <p className="text-5xl mb-4">💬</p>
          <p className="text-gray-500 font-medium">No inquiries yet.</p>
          <p className="text-gray-400 text-sm mt-1">Buyers who message you about your listings will show up here.</p>
        </div>
      )}

      <div className="space-y-4">
        {inquiries.map((inquiry) => (
          <div key={inquiry._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-bold text-gray-800">{inquiry.listing?.title}</h3>
              <span className={`text-xs px-2 py-1 rounded-full font-semibold ${statusColor[inquiry.status]}`}>
                {inquiry.status}
              </span>
            </div>
            <p className="text-gray-600 mb-3">"{inquiry.message}"</p>
            <div className="text-sm text-gray-500 border-t pt-3 mb-3">
              <p>From: <span className="font-medium text-gray-700">{inquiry.buyer?.name}</span></p>
              <p>{inquiry.buyer?.email} {inquiry.buyer?.phone && `• ${inquiry.buyer.phone}`}</p>
            </div>
            {inquiry.status === 'pending' && (
              <div className="flex gap-2">
                <button
                  onClick={() => respond(inquiry._id, 'accepted')}
                  className="bg-green-600 text-white px-4 py-1.5 rounded-md text-sm font-medium hover:bg-green-700 transition"
                >
                  Accept
                </button>
                <button
                  onClick={() => respond(inquiry._id, 'declined')}
                  className="bg-gray-200 text-gray-700 px-4 py-1.5 rounded-md text-sm font-medium hover:bg-gray-300 transition"
                >
                  Decline
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyInquiries;