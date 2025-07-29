import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  FaHeart,
  FaRegHeart,
  FaSearch,
  FaUser,
  FaShoppingCart,
  FaInfo,
} from "react-icons/fa";
import { UserContext } from "../context/UserContext";

// ✅ Reusable Base64Image component with className support
function Base64Image({ filename, alt = "Image", className = "" }) {
  const [img, setImg] = useState(null);

  useEffect(() => {
    axios
      .get(`http://13.60.50.211/api/image-base64/${filename}`)
      .then((res) => setImg(res.data.image))
      .catch((err) => {
        console.error("Image load error:", err);
      });
  }, [filename]);

  return img ? (
    <img
      src={img}
      alt={alt}
      className={
        className || "w-full h-48 object-contain rounded-md cursor-pointer mb-4"
      }
    />
  ) : (
    <div className={className}>Loading...</div>
  );
}

function ProductList() {
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState(() => {
    const savedWishlist = localStorage.getItem("wishlist");
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  // ✅ Background image base64
  const [bgImage, setBgImage] = useState(null);

  useEffect(() => {
    axios
      .get("http://13.60.50.211/api/image-base64/bgimage.jpg")
      .then((res) => setBgImage(res.data.image))
      .catch((err) =>
        console.error("Background image load error:", err.message)
      );
  }, []);

  useEffect(() => {
    axios
      .get("http://13.60.50.211/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = (productId) => {
    setWishlist((prevWishlist) =>
      prevWishlist.includes(productId)
        ? prevWishlist.filter((id) => id !== productId)
        : [...prevWishlist, productId]
    );
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className="min-h-screen flex flex-col text-gray-900 bg-cover bg-center"
      style={{
        backgroundImage: bgImage ? `url(${bgImage})` : "none",
        backgroundAttachment: "fixed",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* ✅ Navbar with base64 logo */}
      <div className="bg-pink-700 text-white px-6 py-4 shadow-md flex justify-between items-center">
        <div className="flex items-center">
          <Base64Image
            filename="logo.jpeg"
            alt="Logo"
            className="w-12 h-12 rounded-full mr-3"
          />
          <span className="text-2xl font-bold">Tech Gadgets Store</span>
        </div>

        <div className="flex items-center space-x-4">
          <button
            className="md:hidden text-3xl"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            ☰
          </button>

          <nav className="hidden md:flex space-x-6 text-lg font-medium">
            {user ? (
              <Link
                to="/profile"
                className="hover:text-pink-200 flex items-center"
              >
                <FaUser className="mr-1" /> My Profile
              </Link>
            ) : (
              <Link to="/login" className="hover:text-pink-200">
                Login
              </Link>
            )}
            <Link
              to="/cart"
              className="hover:text-pink-200 flex items-center"
            >
              Cart <FaShoppingCart className="ml-1" />
            </Link>
            <Link to="/wishlist" className="hover:text-pink-200">
              Wishlist ❤️
            </Link>
            <Link
              to="/about"
              className="hover:text-pink-200 flex items-center"
            >
              <FaInfo className="mr-1" /> About
            </Link>
          </nav>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-pink-600 text-white px-6 py-2 flex flex-col space-y-2 text-lg font-medium shadow-md z-50">
          {user ? (
            <Link
              to="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-pink-200 flex items-center"
            >
              <FaUser className="mr-1" /> My Profile
            </Link>
          ) : (
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-pink-200"
            >
              Login
            </Link>
          )}
          <Link
            to="/cart"
            onClick={() => setMobileMenuOpen(false)}
            className="hover:text-pink-200 flex items-center"
          >
            Cart <FaShoppingCart className="ml-1" />
          </Link>
          <Link
            to="/wishlist"
            onClick={() => setMobileMenuOpen(false)}
            className="hover:text-pink-200"
          >
            Wishlist ❤️
          </Link>
          <Link
            to="/products"
            onClick={() => setMobileMenuOpen(false)}
            className="hover:text-pink-200"
          >
            Products
          </Link>
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="hover:text-pink-200"
          >
            About
          </Link>
        </div>
      )}

      {/* Search Bar */}
      <div className="flex items-center justify-center my-6 px-4">
        <div className="relative w-full max-w-lg">
          <FaSearch className="absolute left-3 top-3 text-gray-400 text-lg" />
          <input
            type="text"
            placeholder="Search for products, brands, and more..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg shadow-md focus:outline-none focus:ring focus:ring-pink-300 bg-white"
          />
        </div>
      </div>

      {/* Product Section */}
      <div className="flex-1 px-6">
        <h1 className="text-center text-4xl font-bold mb-8 text-pink-700">
          Explore Our Latest Tech Gadgets!
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div
                key={product.id}
                className="rounded-lg shadow-md p-4 bg-white"
              >
                <div onClick={() => navigate(`/products/${product.id}`)}>
                  <Base64Image
                    filename={product.image_url}
                    alt={product.name}
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-xl font-semibold text-green-600">
                      ₹{product.price}
                    </p>
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className="text-red-500 text-xl"
                    >
                      {wishlist.includes(product.id) ? (
                        <FaHeart />
                      ) : (
                        <FaRegHeart />
                      )}
                    </button>
                  </div>
                  <Link
                    to={`/products/${product.id}`}
                    className="block text-center py-2 mt-4 rounded-md bg-pink-700 text-white hover:bg-pink-800 transition-colors"
                  >
                    Shop Now
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 text-xl">
              No products found matching your search!
            </p>
          )}
        </div>
      </div>

      <footer className="bg-pink-700 text-white text-center py-4 mt-10">
        <p className="font-medium">
          © 2025 Tech Gadgets Store. All rights reserved.
        </p>
        <div className="mt-2 space-x-4">
          <Link to="/" className="hover:text-pink-200">
            Home
          </Link>
          <Link to="/about" className="hover:text-pink-200">
            About
          </Link>
          <Link to="/contact" className="hover:text-pink-200">
            Contact
          </Link>
        </div>
      </footer>
    </div>
  );
}

export default ProductList;
