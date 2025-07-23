import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaHome, FaInfoCircle, FaTh, FaPhone, FaBars, FaTimes } from "react-icons/fa";

function AboutPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <div
  className="font-sans bg-cover bg-center bg-no-repeat min-h-screen flex flex-col"
  style={{ backgroundImage: "url('/images/bgimage.jpg')" }}
>
      {/* ✅ Responsive Navbar */}
      <nav className="bg-pink-700 text-white py-4 px-6 flex justify-between items-center shadow-md sticky top-0 z-50">
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

      {/* ✅ Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden flex flex-col gap-4 text-white text-center bg-pink-600 py-4">
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
      <main className="py-10 px-4 md:px-8 flex-grow">
        <div className="max-w-5xl mx-auto bg-white p-6 md:p-10 rounded-lg shadow-lg">
          <h1 className="text-center text-4xl font-bold text-pink-700 mb-6">About Us</h1>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Welcome to <strong>Tech Gadgets Store</strong>! We are passionate about offering cutting-edge gadgets and technology to enhance your lifestyle.
            Since our establishment in <strong>2025</strong>, we’ve been dedicated to delivering innovative products that blend functionality with style.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <img
              src="/images/aboutus.jpg"
              alt="About Tech Gadgets Store"
              className="rounded-lg shadow-md w-full object-cover"
            />
            <div className="flex flex-col justify-center">
              <p className="text-lg text-gray-700 leading-relaxed">
                At <strong>Tech Gadgets Store</strong>, we believe in:
              </p>
              <ul className="list-disc pl-6 mt-4 space-y-2 text-gray-700">
                <li>Providing top-notch quality products.</li>
                <li>Ensuring exceptional customer service.</li>
                <li>Offering fast and reliable delivery.</li>
                <li>Keeping up with the latest tech trends.</li>
              </ul>
            </div>
          </div>

          <p className="text-lg text-gray-700 leading-relaxed mt-6">
            Whether you're looking for smart devices, accessories, or must-have tech essentials,
            we have a wide range of products to meet your needs. Your satisfaction is our priority,
            and we strive to make your shopping experience enjoyable and hassle-free.
          </p>

          <p className="text-lg text-gray-700 leading-relaxed mt-4">
            Thank you for choosing <strong>Tech Gadgets Store</strong>. We look forward to serving you with the best in technology today and in the future!
          </p>
        </div>
      </main>

     {/* Sticky Footer */}
  <footer className="bg-pink-700 text-white text-center py-4">
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
