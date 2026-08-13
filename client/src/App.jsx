import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Listings from './pages/Listings';
import PostListing from './pages/PostListing';
import MyListings from './pages/MyListings';
import ListingDetail from './pages/ListingDetail';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/listings" element={<Listings />} />
        <Route path="/listings/:id" element={<ListingDetail />} />
        <Route
          path="/post-listing"
          element={
            <ProtectedRoute>
              <PostListing />
            </ProtectedRoute>
          }
        />
        <Route
  path="/my-listings"
  element={
    <ProtectedRoute>
      <MyListings />
    </ProtectedRoute>
  }
/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;