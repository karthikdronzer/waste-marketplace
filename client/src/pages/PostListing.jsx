import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

function PostListing() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    wasteType: '',
    quantity: '',
    unit: '',
    pricePerUnit: '',
    location: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const token = localStorage.getItem('token');

    try {
      await API.post('/listings', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate('/listings');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post listing');
    }
  };

  return (
    <div>
      <h2>Post a Waste Listing</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title</label>
          <input name="title" value={formData.title} onChange={handleChange} required />
        </div>
        <div>
          <label>Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} required />
        </div>
        <div>
          <label>Waste Type</label>
          <input name="wasteType" value={formData.wasteType} onChange={handleChange} required />
        </div>
        <div>
          <label>Quantity</label>
          <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} required />
        </div>
        <div>
          <label>Unit</label>
          <input name="unit" value={formData.unit} onChange={handleChange} placeholder="kg, tons, liters" required />
        </div>
        <div>
          <label>Price Per Unit</label>
          <input type="number" name="pricePerUnit" value={formData.pricePerUnit} onChange={handleChange} required />
        </div>
        <div>
          <label>Location</label>
          <input name="location" value={formData.location} onChange={handleChange} required />
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <button type="submit">Post Listing</button>
      </form>
    </div>
  );
}

export default PostListing;