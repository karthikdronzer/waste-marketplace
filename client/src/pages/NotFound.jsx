import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 text-center px-6">
      <p className="text-6xl mb-4">🔍</p>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Page not found</h1>
      <p className="text-gray-500 mb-6">The page you're looking for doesn't exist.</p>
      <Link to="/listings" className="bg-green-600 text-white px-5 py-2 rounded-md font-semibold hover:bg-green-700 transition">
        Back to Listings
      </Link>
    </div>
  );
}

export default NotFound;