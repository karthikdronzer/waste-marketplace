import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav style={{ display: 'flex', gap: '15px', padding: '10px', borderBottom: '1px solid #ccc' }}>
      <Link to="/listings">Browse Listings</Link>
      {user ? (
  <>
    <span>Hi, {user.name} ({user.role})</span>
    {user.role === 'industry' && (
  <>
    <Link to="/post-listing">Post a Listing</Link>
    <Link to="/my-listings">My Listings</Link>
  </>
)}
    <button onClick={handleLogout}>Logout</button>
  </>
) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
}

export default Navbar;