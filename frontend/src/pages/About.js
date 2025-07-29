import React, { useState,useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaHome,
  FaInfoCircle,
  FaTh,
  FaPhone,
  FaBars,
  FaTimes,
  FaCogs,
  FaRocket,
  FaSmile,
  FaStar
} from "react-icons/fa";

function AboutPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);
  function Base64Background({ filename }) {
  const [img, setImg] = useState(null);

  useEffect(() => {
    fetch(`http://13.60.50.211/api/image-base64/${filename}`)
      .then((res) => res.json())
      .then((data) => setImg(data.image))
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


  return (
    <div className="relative font-sans min-h-screen flex flex-col overflow-hidden">
  <Base64Background filename="bgimage.jpg" />
  <div className="absolute inset-0 bg-black bg-opacity-30 z-10" />

      
      {/* ✅ Navbar */}
      <nav className="sticky top-0 z-20 bg-pink-700 text-white py-4 px-6 flex justify-between items-center shadow-md">
        <div className="text-xl font-bold">
          <Link to="/" className="hover:text-gray-200 transition duration-200">
            Tech Gadgets Store
          </Link>
        </div>
        <div className="md:hidden">
          <button
            className="text-2xl"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
        <div className="hidden md:flex gap-6 text-lg font-medium">
          <Link to="/" className="flex items-center gap-2 hover:text-gray-200">
            <FaHome /> Home
          </Link>
          <Link to="/about" className="flex items-center gap-2 hover:text-gray-200">
            <FaInfoCircle /> About
          </Link>
          <Link to="/products" className="flex items-center gap-2 hover:text-gray-200">
            <FaTh /> Products
          </Link>
          <Link to="/contact" className="flex items-center gap-2 hover:text-gray-200">
            <FaPhone /> Contact
          </Link>
        </div>
      </nav>

      {/* ✅ Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden flex flex-col gap-4 text-white text-center bg-pink-600 py-4 z-20">
          <Link to="/" onClick={toggleMenu} className="text-lg">
            <FaHome className="inline mr-2" /> Home
          </Link>
          <Link to="/about" onClick={toggleMenu} className="text-lg">
            <FaInfoCircle className="inline mr-2" /> About
          </Link>
          <Link to="/products" onClick={toggleMenu} className="text-lg">
            <FaTh className="inline mr-2" /> Products
          </Link>
          <Link to="/contact" onClick={toggleMenu} className="text-lg">
            <FaPhone className="inline mr-2" /> Contact
          </Link>
        </div>
      )}

      {/* ✅ About Content */}
      <main className="relative z-10 py-12 px-6 md:px-12 flex-grow">
        <div className="max-w-6xl mx-auto bg-white p-10 md:p-16 rounded-3xl shadow-2xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-center text-pink-700 mb-10">
            About Tech Gadgets Store
          </h1>
          <p className="text-gray-700 text-lg leading-relaxed mb-8 text-center">
            At <strong>Tech Gadgets Store</strong>, we bring you the future of technology, today. Our mission is to empower everyday lives with top-tier gadgets and modern electronics that make life easier, faster, and more fun!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Feature Card 1 */}
            <div className="bg-pink-50 rounded-xl p-6 shadow hover:shadow-lg transition">
              <div className="flex items-center gap-4 mb-4 text-pink-700">
                <FaCogs className="text-3xl" />
                <h3 className="text-2xl font-bold">Cutting-Edge Tech</h3>
              </div>
              <p className="text-gray-700">
                Stay ahead with our handpicked selection of the latest and most innovative tech gadgets available on the market.
              </p>
            </div>

            {/* Feature Card 2 */}
            <div className="bg-pink-50 rounded-xl p-6 shadow hover:shadow-lg transition">
              <div className="flex items-center gap-4 mb-4 text-pink-700">
                <FaRocket className="text-3xl" />
                <h3 className="text-2xl font-bold">Fast Delivery</h3>
              </div>
              <p className="text-gray-700">
                We ensure lightning-fast delivery so you can start using your new gadgets without any delay.
              </p>
            </div>

            {/* Feature Card 3 */}
            <div className="bg-pink-50 rounded-xl p-6 shadow hover:shadow-lg transition">
              <div className="flex items-center gap-4 mb-4 text-pink-700">
                <FaSmile className="text-3xl" />
                <h3 className="text-2xl font-bold">Happy Customers</h3>
              </div>
              <p className="text-gray-700">
                Your satisfaction is our top priority. We provide full support and assistance to make your experience wonderful.
              </p>
            </div>

            {/* Feature Card 4 */}
            <div className="bg-pink-50 rounded-xl p-6 shadow hover:shadow-lg transition">
              <div className="flex items-center gap-4 mb-4 text-pink-700">
                <FaStar className="text-3xl" />
                <h3 className="text-2xl font-bold">Top-Rated Products</h3>
              </div>
              <p className="text-gray-700">
                We feature only the best-rated products based on user feedback and expert reviews to ensure quality.
              </p>
            </div>
          </div>

          <p className="text-center text-gray-800 text-lg mt-12">
            Thank you for being part of our tech family! ✨ We’re excited to help you explore more.
          </p>
        </div>
      </main>

      {/* ✅ Footer */}
      <footer className="bg-pink-700 text-white text-center py-4 mt-10">
        <p className="text-sm sm:text-base">© 2025 Tech Gadgets Store. All rights reserved.</p>
        <div className="flex justify-center gap-6 mt-2 text-sm flex-wrap">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/about" className="hover:underline">About</Link>
          <Link to="/products" className="hover:underline">Products</Link>
          <Link to="/contact" className="hover:underline">Contact</Link>
        </div>
      </footer>
    </div>
  );
}

export default AboutPage;
