import { useState, useEffect } from 'react';
import API from '../api/axios';

function MyListings() {
  const [listings, setListings] = useState([]);
  const [error, setError] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  const fetchMyListings = async () => {
    try {
      const response = await API.get('/listings');
      const mine = response.data.filter((listing) => listing.postedBy?._id === user?.id);
      setListings(mine);
    } catch (err) {
      setError('Failed to load your listings');
    }
  };

  useEffect(() => {
    fetchMyListings();
  }, []);

  const handleDelete = async (id) => {
    try {
      await API.delete(`/listings/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchMyListings();
    } catch (err) {
      setError('Failed to delete listing');
    }
  };

  const handleMarkSold = async (id) => {
    try {
      await API.put(
        `/listings/${id}`,
        { status: 'sold' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchMyListings();
    } catch (err) {
      setError('Failed to update listing');
    }
  };

  return (
    <div>
      <h2>My Listings</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {listings.length === 0 && !error && <p>You haven't posted any listings yet.</p>}

      {listings.map((listing) => (
        <div key={listing._id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
          <h3>{listing.title}</h3>
          <p>Status: {listing.status}</p>
          <p>Quantity: {listing.quantity} {listing.unit}</p>
          <p>Price: ₹{listing.pricePerUnit} per {listing.unit}</p>

          {listing.status === 'available' && (
            <button onClick={() => handleMarkSold(listing._id)}>Mark as Sold</button>
          )}
          <button onClick={() => handleDelete(listing._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default MyListings;