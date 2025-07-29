import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaArrowLeft,
  FaSignOutAlt,
  FaBoxOpen,
  FaUserCircle,
} from "react-icons/fa";
import { UserContext } from "../context/UserContext";

// ✅ Reusable base64 image component
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
    <img src={img} alt={alt} className={className} />
  ) : null;
}

const Profile = () => {
  const { user, setUser } = useContext(UserContext);
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        navigate("/login");
        return;
      }
      setUser(JSON.parse(storedUser));
    }

    const fetchOrders = async () => {
      try {
        const response = await fetch(
          `http://13.60.50.211/api/order?email=${user?.email}`
        );
        const data = await response.json();
        setOrders(data);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      }
    };

    if (user?.email) {
      fetchOrders();
    }
  }, [user, setUser, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  if (!user) return null;

  return (
    <div className="relative font-sans min-h-screen pb-12 overflow-hidden">
      {/* ✅ Background image from backend */}
      <Base64Image
        filename="bgimage.jpg"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* ✅ Decorative overlay image (optional) */}
      <Base64Image
        filename="profilebgpattern.png" // change this to your decorative image name
        alt="Decoration"
        className="absolute top-10 left-1/2 transform -translate-x-1/2 w-72 opacity-20 z-0"
      />

      {/* ✅ Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 mt-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-500 hover:text-pink-700 transition duration-200 text-2xl"
            aria-label="Go Back"
          >
            <FaArrowLeft />
          </button>
          <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
        </div>

        {/* User Info */}
        <div className="relative bg-gradient-to-r from-pink-700 via-pink-400 to-pink-700 p-8 rounded-2xl shadow-lg text-white mb-10">
          <div className="flex items-center space-x-6">
            <FaUserCircle className="text-9xl text-white shadow-lg" />
            <div>
              <p className="text-xl font-semibold">
                {user.username || "User Name"}
              </p>
              <p className="text-sm">{user.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="mt-6 bg-white text-pink-700 py-2 px-6 rounded-lg shadow-md hover:bg-gray-200 transition"
          >
            <FaSignOutAlt className="inline-block mr-2" />
            Logout
          </button>
        </div>

        {/* Order History */}
        <h2 className="text-2xl font-semibold text-gray-800 flex items-center mb-6">
          <FaBoxOpen className="mr-3 text-pink-700" />
          Order History
        </h2>
        <div className="grid gap-6">
          {orders.length === 0 ? (
            <p className="text-gray-500 text-lg text-center">
              No orders found.
            </p>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="bg-white border border-gray-200 shadow-md rounded-xl p-6 hover:shadow-lg transition-shadow duration-200"
              >
                <p className="text-gray-700">
                  <strong>Order ID:</strong> {order.id}
                </p>
                <p className="text-gray-700">
                  <strong>Amount:</strong> ₹{order.total_amount}
                </p>
                <p className="text-gray-700">
                  <strong>Payment Method:</strong> {order.payment_method}
                </p>
                <p className="text-gray-700">
                  <strong>Transaction ID:</strong>{" "}
                  {order.transaction_id || "NULL"}
                </p>
                <p className="text-gray-700">
                  <strong>Tracking ID:</strong> {order.tracking_id || "N/A"}
                </p>
                <p className="text-gray-700">
                  <strong>Order Date:</strong>{" "}
                  {new Date(order.created_at).toLocaleString()}
                </p>
                <p className="text-gray-700">
                  <strong>Delivery Address:</strong> {order.address},{" "}
                  {order.city}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
