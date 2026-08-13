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
    <div>
      <h2>Browse Waste Listings</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {listings.length === 0 && !error && <p>No listings available yet.</p>}

      {listings.map((listing) => (
        <div key={listing._id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
          <h3>{listing.title}</h3>
          <p>{listing.description}</p>
          <p>Waste Type: {listing.wasteType}</p>
          <p>Quantity: {listing.quantity} {listing.unit}</p>
          <p>Price: ₹{listing.pricePerUnit} per {listing.unit}</p>
          <p>Location: {listing.location}</p>
          <p>Posted by: {listing.postedBy?.name}</p>
        </div>
      ))}
    </div>
  );
}

export default Listings;