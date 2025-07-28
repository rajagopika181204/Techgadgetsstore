import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaShoppingCart,
  FaTrashAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import axios from "axios";

// ✅ Base64 Image Component
function Base64Image({ filename, alt = "", className = "" }) {
  const [img, setImg] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/image-base64/${filename}`)
      .then((res) => setImg(res.data.image))
      .catch((err) => console.error("Image load error:", err));
  }, [filename]);

  return img ? (
    <img src={img} alt={alt} className={className} />
  ) : (
    <div className={`bg-gray-200 animate-pulse ${className}`} />
  );
}

// ✅ Background Image Loader
function Base64Background({ filename }) {
  const [img, setImg] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/image-base64/${filename}`)
      .then((res) => setImg(res.data.image))
      .catch((err) => console.error("Image load error:", err));
  }, [filename]);

  return img ? (
    <img
      src={img}
      alt="Background"
      className="absolute inset-0 w-full h-full object-cover z-0"
    />
  ) : null;
}

const Wishlist = () => {
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem("wishlist");
    return saved ? JSON.parse(saved) : [];
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://13.60.50.211/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err));
  }, []);

  const removeFromWishlist = (productId) => {
    const updated = wishlist.filter((id) => id !== productId);
    setWishlist(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
  };

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));
  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <div className="relative font-sans min-h-screen flex flex-col overflow-hidden">
      {/* ✅ Background Image */}
      <Base64Background filename="bgimage.jpg" />
      <div className="absolute inset-0 bg-black bg-opacity-30 z-10" />

      {/* ✅ Navbar */}
      <header className="relative z-20 bg-pink-700 shadow-md py-4 px-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Link to="/">
            <Base64Image
              filename="logo.jpeg"
              alt="Tech Gadgets Store"
              className="w-12 h-12 rounded-full border-2 border-white"
            />
          </Link>
          <h1 className="text-2xl font-bold text-white">Tech Gadgets Store</h1>
        </div>

        <div className="md:hidden">
          <button
            className="text-white text-2xl"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        <nav className="hidden md:flex gap-6">
          <Link to="/about" className="text-white hover:text-gray-200 text-lg">
            About
          </Link>
          <Link to="/products" className="text-white hover:text-gray-200 text-lg flex items-center gap-1">
            <FaHome /> Home
          </Link>
          <Link to="/cart" className="text-white hover:text-gray-200 text-lg flex items-center gap-1">
            <FaShoppingCart /> Cart
          </Link>
        </nav>
      </header>

      {/* ✅ Mobile Dropdown */}
      {menuOpen && (
        <nav className="relative z-20 md:hidden flex flex-col bg-pink-600 text-white text-center px-6 py-4 shadow-lg space-y-4">
          <Link to="/about" onClick={toggleMenu} className="text-lg">
            About
          </Link>
          <Link to="/products" onClick={toggleMenu} className="text-lg">
            <FaHome className="inline mr-2" />
            Home
          </Link>
          <Link to="/cart" onClick={toggleMenu} className="text-lg">
            <FaShoppingCart className="inline mr-2" />
            Cart
          </Link>
        </nav>
      )}

      {/* ✅ Wishlist Section */}
      <main className="relative z-20 py-10 px-4 md:px-8 flex-grow">
        <h2 className="text-4xl font-extrabold text-white mb-8 text-center drop-shadow">
          Your Wishlist
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {wishlistProducts.length > 0 ? (
            wishlistProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white shadow-xl rounded-xl overflow-hidden hover:shadow-2xl transform hover:scale-105 transition"
              >
                <div onClick={() => navigate(`/products/${product.id}`)}>
                  <Base64Image
                    filename={product.image_url}
                    alt={product.name}
                    className="w-full h-64 object-cover cursor-pointer"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-800">
                    {product.name}
                  </h3>
                  <p className="text-pink-700 font-semibold mt-2 text-base">
                    ₹{product.price}
                  </p>
                  <button
                    className="mt-4 w-full bg-pink-700 text-white py-2 rounded-lg flex justify-center items-center gap-2 hover:bg-pink-600 transition"
                    onClick={() => removeFromWishlist(product.id)}
                  >
                    <FaTrashAlt /> Remove
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-white text-lg col-span-full bg-pink-600 py-4 rounded-lg shadow">
              Your wishlist is empty. Start adding items!
            </p>
          )}
        </div>
      </main>

      {/* ✅ Footer */}
      <footer className="relative z-20 bg-pink-700 text-white py-6 px-4 text-center mt-auto">
        <p className="text-md font-semibold mb-3">
          © 2025 Tech Gadgets Store. All rights reserved.
        </p>
        <div className="flex justify-center gap-6 flex-wrap text-sm">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/about" className="hover:underline">About</Link>
          <Link to="/contact" className="hover:underline">Contact</Link>
        </div>
      </footer>
    </div>
  );
};

export default Wishlist;
