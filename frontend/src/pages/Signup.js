import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { FaUserAlt, FaEnvelope, FaLock } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ✅ Base64 image loader component
function Base64Image({ filename, alt = "", className = "" }) {
  const [img, setImg] = useState(null);

  useEffect(() => {
    axios
      .get(`http://13.60.50.211/api/image-base64/${filename}`)
      .then((res) => setImg(res.data.image))
      .catch((err) => console.error("Image load error:", err));
  }, [filename]);

  return img ? <img src={img} alt={alt} className={className} /> : null;
}

function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://13.60.50.211/signup", {
        username,
        email,
        password,
      });

      toast.success(res.data.message, {
        position: "top-right",
        autoClose: 3000,
      });

      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      toast.error(err.response?.data?.error || "Signup failed", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="relative font-sans min-h-screen flex items-center justify-center overflow-hidden">
      {/* ✅ Backend background image */}
      <Base64Image
        filename="bgimage.jpg"
        alt="Signup Background"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* Toast Notifications */}
      <ToastContainer />

      {/* Signup Card */}
      <div className="relative z-10 bg-white shadow-2xl rounded-2xl w-full max-w-lg p-10">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-pink-700">
            <FaUserAlt className="inline-block mb-1 mr-2" /> TechGadget Store
          </h1>
          <p className="text-lg text-gray-600 mt-3">Create a new account today!</p>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSignup} className="space-y-8">
          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-lg font-semibold text-gray-700 mb-2">
              Username
            </label>
            <div className="flex items-center bg-gray-50 border border-gray-300 rounded-lg">
              <FaUserAlt className="text-pink-700 mx-4 text-xl" />
              <input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
                className="w-full py-3 px-4 text-lg bg-transparent border-none focus:outline-none"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-lg font-semibold text-gray-700 mb-2">
              Email
            </label>
            <div className="flex items-center bg-gray-50 border border-gray-300 rounded-lg">
              <FaEnvelope className="text-pink-700 mx-4 text-xl" />
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full py-3 px-4 text-lg bg-transparent border-none focus:outline-none"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-lg font-semibold text-gray-700 mb-2">
              Password
            </label>
            <div className="flex items-center bg-gray-50 border border-gray-300 rounded-lg">
              <FaLock className="text-pink-700 mx-4 text-xl" />
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                className="w-full py-3 px-4 text-lg bg-transparent border-none focus:outline-none"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-4 text-xl bg-gradient-to-r from-pink-600 to-pink-700 text-white font-bold rounded-full hover:shadow-lg transition duration-300"
          >
            Signup
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-lg text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-pink-700 font-bold hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
