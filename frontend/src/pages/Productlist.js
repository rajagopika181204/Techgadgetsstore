// ✅ Full ProductList.js with Left-to-Right Mobile Menu
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Slider from "react-slick";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaHeart,
  FaRegHeart,
  FaSearch,
  FaUser,
  FaShoppingCart,
  FaInfo,
  FaTimes
} from "react-icons/fa";
import { UserContext } from "../context/UserContext";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function Base64Image({ filename, alt = "Image", className = "" }) {
  const [img, setImg] = useState(null);
  useEffect(() => {
    axios
      .get(`http://13.60.50.211/api/image-base64/${filename}`)
      .then((res) => setImg(res.data.image))
      .catch((err) => console.error("Image load error:", err));
  }, [filename]);
  return img ? (
    <img src={img} alt={alt} className={className} />
  ) : (
    <div className={`bg-gray-200 ${className}`}>Loading...</div>
  );
}

function TopCarousel({ products }) {
  const navigate = useNavigate();
  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    autoplay: true,
    autoplaySpeed: 2500,
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: true,
    arrows: false,
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 mt-6 mb-12 rounded-xl overflow-hidden shadow-2xl">
      <Slider {...settings}>
        {products.slice(0, 5).map((product) => (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            key={product.id}
            className="relative group cursor-pointer"
            onClick={() => navigate(`/products/${product.id}`)}
          >
            <div className="bg-white h-[300px] md:h-[500px] flex items-center justify-center">
              <Base64Image
                filename={product.image_url}
                alt={product.name}
                className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col justify-end p-6">
              <motion.h2
                className="text-white text-2xl font-bold mb-2 drop-shadow-lg"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                {product.name} – ₹{product.price}
              </motion.h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-sm px-4 py-1.5 rounded-full backdrop-blur bg-white/70 text-pink-700 font-semibold shadow-md hover:bg-white hover:text-pink-800 transition-all duration-300"
              >
                Shop Now
              </motion.button>
            </div>
          </motion.div>
        ))}
      </Slider>
    </div>
  );
}

function ProductList() {
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem("wishlist");
    return saved ? JSON.parse(saved) : [];
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [bgImage, setBgImage] = useState(null);

  useEffect(() => {
    axios
      .get("http://13.60.50.211/api/image-base64/bgimage.jpg")
      .then((res) => setBgImage(res.data.image))
      .catch((err) => console.error("BG load error:", err));
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

  const toggleWishlist = (id) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className="min-h-screen flex flex-col text-gray-900 bg-cover bg-center"
      style={{
        backgroundImage: bgImage ? `url(${bgImage})` : "none",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Top Navbar */}
      <div className="bg-pink-700 text-white px-6 py-4 shadow-md flex justify-between items-center relative">
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
            onClick={() => setMobileMenuOpen(true)}
          >
            ☰
          </button>

          {/* Desktop Menu */}
          <nav className="hidden md:flex space-x-6 text-lg font-medium">
            {user ? (
              <Link to="/profile" className="hover:text-pink-200 flex items-center">
                <FaUser className="mr-1" /> My Profile
              </Link>
            ) : (
              <Link to="/login" className="hover:text-pink-200">Login</Link>
            )}
            <Link to="/cart" className="hover:text-pink-200 flex items-center">
              Cart <FaShoppingCart className="ml-1" />
            </Link>
            <Link to="/wishlist" className="hover:text-pink-200">Wishlist ❤️</Link>
            <Link to="/about" className="hover:text-pink-200 flex items-center">
              <FaInfo className="mr-1" /> About
            </Link>
          </nav>
        </div>
      </div>

      {/* ✅ Mobile Side Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 w-64 h-full bg-pink-800 text-white z-50 shadow-lg p-6 flex flex-col space-y-6"
          >
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold">Menu</span>
              <button onClick={() => setMobileMenuOpen(false)}>
                <FaTimes size={24} />
              </button>
            </div>
            {user ? (
              <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="hover:text-pink-200 flex items-center">
                <FaUser className="mr-2" /> My Profile
              </Link>
            ) : (
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="hover:text-pink-200">
                Login
              </Link>
            )}
            <Link to="/cart" onClick={() => setMobileMenuOpen(false)} className="hover:text-pink-200 flex items-center">
              <FaShoppingCart className="mr-2" /> Cart
            </Link>
            <Link to="/wishlist" onClick={() => setMobileMenuOpen(false)} className="hover:text-pink-200">
              ❤️ Wishlist
            </Link>
            <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="hover:text-pink-200 flex items-center">
              <FaInfo className="mr-2" /> About
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Bar */}
      <div className="flex items-center justify-center my-6 px-4">
        <div className="relative w-full max-w-lg">
          <FaSearch className="absolute left-3 top-3 text-gray-400 text-lg" />
          <input
            type="text"
            placeholder="Search for products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg shadow-md focus:outline-none focus:ring focus:ring-pink-300 bg-white"
          />
        </div>
      </div>

      {/* Carousel */}
      <TopCarousel products={filteredProducts} />

      {/* Product Grid */}
      <div className="flex-1 px-6">
        <h1 className="text-center text-4xl font-bold mb-8 text-pink-700">
          Explore Our Latest Tech Gadgets!
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="rounded-xl shadow-lg p-4 bg-white transform transition-transform hover:scale-105 hover:shadow-pink-400 border border-transparent"
              >
                <div onClick={() => navigate(`/products/${product.id}`)}>
                  <Base64Image
                    filename={product.image_url}
                    className="w-full h-48 object-contain rounded-lg"
                  />
                </div>
                <div className="mt-3">
                  <h3 className="text-lg font-semibold text-gray-800 truncate">
                    {product.name}
                  </h3>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-xl font-bold text-green-600">
                      ₹{product.price}
                    </p>
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className="text-red-500 text-xl"
                    >
                      {wishlist.includes(product.id) ? <FaHeart /> : <FaRegHeart />}
                    </button>
                  </div>
                  <Link
                    to={`/products/${product.id}`}
                    className="block text-center py-2 mt-4 rounded-md bg-pink-600 text-white hover:bg-pink-700 transition-colors duration-300 font-semibold"
                  >
                    Shop Now
                  </Link>
                </div>
              </motion.div>
            ))
          ) : (
            <p className="text-center text-gray-500 text-xl">No products found!</p>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-pink-700 text-white text-center py-4 mt-10">
        <p className="font-medium">© 2025 Tech Gadgets Store. All rights reserved.</p>
        <div className="mt-2 space-x-4">
          <Link to="/" className="hover:text-pink-200">Home</Link>
          <Link to="/about" className="hover:text-pink-200">About</Link>
          <Link to="/contact" className="hover:text-pink-200">Contact</Link>
        </div>
      </footer>
    </div>
  );
}

export default ProductList;
