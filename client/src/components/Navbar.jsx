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
    <nav className="bg-green-800 text-white px-6 py-4 flex items-center justify-between shadow-md">
      <Link to="/listings" className="text-xl font-bold tracking-tight">
        ♻️ WasteMarket
      </Link>

      <div className="flex items-center gap-6 text-sm font-medium">
        <Link to="/listings" className="hover:text-amber-300 transition">Browse</Link>

        {user ? (
          <>
            {user.role === 'industry' && (
              <>
                <Link to="/post-listing" className="hover:text-amber-300 transition">Post a Listing</Link>
                <Link to="/my-listings" className="hover:text-amber-300 transition">My Listings</Link>
              </>
            )}
            <span className="text-green-200">Hi, {user.name}</span>
            <button
              onClick={handleLogout}
              className="bg-amber-500 text-green-900 px-4 py-1.5 rounded-md font-semibold hover:bg-amber-400 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-amber-300 transition">Login</Link>
            <Link
              to="/register"
              className="bg-amber-500 text-green-900 px-4 py-1.5 rounded-md font-semibold hover:bg-amber-400 transition"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;