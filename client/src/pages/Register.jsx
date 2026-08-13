import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';

function Register() {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: 'buyer', companyName: '', phone: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      await API.post('/auth/register', formData);
      setSuccess('Registered successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  const inputClass = "w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 py-10">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">Create Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelClass}>Name</label>
            <input name="name" value={formData.name} onChange={handleChange} required className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>I am a</label>
            <select name="role" value={formData.role} onChange={handleChange} className={inputClass}>
              <option value="buyer">Buyer</option>
              <option value="industry">Industry</option>
            </select>
          </div>
          {formData.role === 'industry' && (
            <div>
              <label className={labelClass}>Company Name</label>
              <input name="companyName" value={formData.companyName} onChange={handleChange} className={inputClass} />
            </div>
          )}
          <div>
            <label className={labelClass}>Phone</label>
            <input name="phone" value={formData.phone} onChange={handleChange} className={inputClass} />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-600 text-sm">{success}</p>}

          <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition font-semibold">
            Register
          </button>
        </form>
        <p className="text-sm text-gray-500 mt-4 text-center">
          Already have an account? <Link to="/login" className="text-green-700 font-semibold">Login here</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;