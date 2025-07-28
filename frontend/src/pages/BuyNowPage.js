import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import { QRCodeSVG } from "qrcode.react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaRupeeSign,
  FaCreditCard,
  FaQrcode,
  FaShoppingCart,
  FaPlus,
  FaCheck,
  FaArrowLeft,
  FaHome,
} from "react-icons/fa";

// Navbar Component
const Navbar = ({ onBack }) => {
  const navigate = useNavigate();

  return (
    <nav className="bg-gradient-to-r from-pink-600 to-pink-700 text-white py-4 px-6 shadow-md flex justify-between items-center">
      <div className="flex items-center">
        {onBack && (
          <button
            className="text-white text-xl mr-4 hover:text-gray-200"
            onClick={onBack}
          >
            <FaArrowLeft />
          </button>
        )}
        <h1 className="text-2xl font-bold">Tech Gadgets Store</h1>
      </div>
      <div className="flex space-x-6">
        <button
          className="flex items-center gap-2 text-lg hover:text-gray-200"
          onClick={() => navigate("/")}
        >
          <FaHome /> Home
        </button>
        <button
          className="flex items-center gap-2 text-lg hover:text-gray-200"
          onClick={() => navigate("/cart")}
        >
          <FaShoppingCart /> Cart
        </button>
      </div>
    </nav>
  );
};

const BuyNowPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { product, quantity, cartDetails, totalPrice } = location.state || {};
  const { user } = useContext(UserContext);

  const [userDetails, setUserDetails] = useState({
    name: "",
    address: "",
    city: "",
    email: user?.email || "",
    pincode: "",
    phone: "",
    paymentMethod: "creditCard",
  });

  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [upiPayment, setUpiPayment] = useState({
    show: false,
    link: "",
    qrData: "",
    qrVisible: false,
  });

  const [items, setItems] = useState([]); // ✅ Fixed missing state

  // 🔥 Fetch base64 image for each product
  const fetchBase64Images = async (items) => {
    const updatedItems = await Promise.all(
      items.map(async (item) => {
        try {
          const res = await axios.get(
            `http://localhost:5000/api/image-base64/${item.product.image_url}`
          );
          return {
            ...item,
            product: {
              ...item.product,
              base64Image: res.data.image,
            },
          };
        } catch (err) {
          console.error("Image fetch error:", err);
          return item;
        }
      })
    );
    return updatedItems;
  };

  useEffect(() => {
    const prepareItems = async () => {
      const baseItems = cartDetails || (product ? [{ product, quantity }] : []);
      const withImages = await fetchBase64Images(baseItems);
      setItems(withImages); // ✅ Now setItems will not throw error
    };
    prepareItems();
  }, [product, quantity, cartDetails]);

  useEffect(() => {
    const fetchAddresses = async () => {
      if (!user?.email) return;
      try {
        const res = await axios.get(`http://13.60.50.211/api/address/${user.email}`);
        if (res.data.success) {
          setSavedAddresses(
            Array.isArray(res.data.address) ? res.data.address : [res.data.address]
          );
        }
      } catch (err) {
        console.error("Fetch address error:", err);
      }
    };
    fetchAddresses();
  }, [user?.email]);

  const calculatedTotal = totalPrice || (product ? product.price * quantity : 0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressSelect = (address) => {
    setSelectedAddress(address.id);
    setUserDetails({ ...userDetails, ...address });
  };

  const handleSaveNewAddress = async () => {
    if (!userDetails.name || !userDetails.address || !userDetails.email) {
      toast.error("Please fill all required fields!");
      return;
    }
    try {
      const res = await axios.post("http://13.60.50.211/api/save-address", userDetails);
      if (res.data.success) {
        setSavedAddresses([res.data.address]);
        setShowNewAddressForm(false);
        toast.success("Address saved!");
      }
    } catch (err) {
      toast.error("Failed to save address");
    }
  };

  const handleGenerateUPI = async () => {
    try {
      const res = await axios.post("http://13.60.50.211/api/generate-upi-link", {
        amount: calculatedTotal,
        orderId: `ORDER_${Date.now()}`,
      });
      setUpiPayment({
        show: true,
        link: res.data.upiLink,
        qrData: res.data.qrData,
        qrVisible: false,
      });
      toast.success("UPI Payment Link Generated!");
    } catch (err) {
      toast.error("Failed to generate UPI link");
    }
  };

  const handlePlaceOrder = async () => {
    const orderId = `ORDER_${Date.now()}`;
    const trackingId = `TRK_${Date.now()}`;
    const transactionId = `TXN_${Date.now()}`;

    if (
      !userDetails.name ||
      !userDetails.address ||
      !userDetails.city ||
      !userDetails.email ||
      !userDetails.pincode ||
      !userDetails.phone
    ) {
      toast.error("Please fill out all required fields.");
      return;
    }

    if (userDetails.paymentMethod === "upi" && !upiPayment.show) {
      toast.error("Generate UPI link first");
      return;
    }

    if (userDetails.paymentMethod === "razorpay") {
      if (!window.Razorpay) {
      toast.error("Payment failed. Check your connection and try again.");
      return;
    }
      const options = {
        key: "rzp_test_EH1UEwLILEPXCj",
        amount: calculatedTotal * 100,
        currency: "INR",
        name: "Tech Gadgets Store",
        handler: () =>
          navigate("/payment-success", {
            state: {
              orderId,
              trackingId,
              transactionId,
              userDetails,
              items,
              total: calculatedTotal,
              paymentMethod: userDetails.paymentMethod,
            },
          }),
        prefill: {
          name: userDetails.name,
          email: userDetails.email,
          contact: userDetails.phone,
        },
        theme: { color: "#F37254" },
      };
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    }else {
        setTimeout(() => {
      navigate("/payment-success", {
        state: {
          orderId,
          trackingId,
          transactionId,
          userDetails,
          items,
          total: calculatedTotal,
          paymentMethod: userDetails.paymentMethod,
        },
      });
      }, 3000); 
    }

    try {
      const transactionId =
        userDetails.paymentMethod === "upi"  ? `TXN${Date.now()}` : null;
      const response = await axios.post("http://13.60.50.211/api/orders", {
        items,
        userDetails,
        total: calculatedTotal,
        paymentMethod: userDetails.paymentMethod,
        transactionId,
      });
      if (response.data && response.data.orderId) {
      toast.success("Order placed!");

      setTimeout(() => {
        navigate("/payment-success", {
          state: {
            orderId: response.data.orderId,
            trackingId: response.data.trackingId,
            transactionId: response.data.transactionId,
            userDetails,
            items,
            total: calculatedTotal,
            paymentMethod: userDetails.paymentMethod,
          },
        });
      }, 3000);
    } 
  }catch (err) {
      console.error("Order Placement Error:", err.response?.data || err.message);
      toast.success("Order Placed Successfully!.");
    }
  };

  return (
    <div
      className="font-sans bg-cover bg-center bg-no-repeat min-h-screen pb-12"
      style={{ backgroundImage: "url('/images/bgimage.jpg')" }}
    >
      <Navbar onBack={() => navigate(-1)} />
      <ToastContainer />
      <div className="py-10 px-6 max-w-4xl mx-auto">
        <h1 className="text-center text-3xl font-bold mb-8 text-gray-800">Checkout</h1>

        {/* Order Summary */}
        <div className="bg-gradient-to-r from-pink-100 to-pink-500 p-6 rounded-lg shadow-md mb-8">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-4 mb-4 bg-white p-3 rounded-lg shadow-md"
            >
              <img
                src={item.product.base64Image}
                alt={item.product.name}
                className="w-20 h-20 object-cover rounded"
              />
              <div>
                <p className="font-semibold text-gray-800">{item.product.name}</p>
                <p className="text-gray-600">Quantity: {item.quantity}</p>
                <p className="text-pink-700 font-bold">
                  ₹{item.product.price * item.quantity}
                </p>
              </div>
            </div>
          ))}
          <h3 className="text-lg font-semibold mt-4">Total: ₹{calculatedTotal}</h3>
        </div>

        {/* Address Form */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">Delivery Address 📦</h2>
          {savedAddresses.map((address) => (
            <div
              key={address.id}
              onClick={() => handleAddressSelect(address)}
              className={`p-4 border rounded-lg mb-4 cursor-pointer ${
                selectedAddress === address.id
                  ? "bg-pink-100 border-pink-400"
                  : "border-gray-300"
              }`}
            >
              <input
                type="radio"
                checked={selectedAddress === address.id}
                onChange={() => handleAddressSelect(address)}
                className="mr-2"
              />
              <strong>{address.name}</strong> — {address.address}, {address.city},{" "}
              {address.pincode} (Phone: {address.phone})
            </div>
          ))}
          <button
            onClick={() => setShowNewAddressForm(true)}
            className="mt-4 px-4 py-2 bg-pink-600 text-white rounded"
          >
            <FaPlus className="inline mr-2" />
            Add New Address
          </button>
        </div>

        {showNewAddressForm && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h3 className="font-semibold text-lg mb-3">New Address</h3>
            {["name", "address", "city", "email", "pincode", "phone"].map((field) => (
              <input
                key={field}
                name={field}
                placeholder={field[0].toUpperCase() + field.slice(1)}
                value={userDetails[field]}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg mb-3"
              />
            ))}
            <button
              onClick={handleSaveNewAddress}
              className="bg-green-600 text-white px-4 py-2 rounded mr-3"
            >
              <FaCheck className="inline mr-1" /> Save Address
            </button>
            <button
              onClick={() => setShowNewAddressForm(false)}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Payment Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">
             <FaCreditCard className="inline-block mr-2" /> Payment Method
             </h2>
          <select
            name="paymentMethod"
            value={userDetails.paymentMethod}
            onChange={handleInputChange}
            className="w-full p-3 border rounded-lg"
          >
            <option value="creditCard">Credit Card</option>
            <option value="upi">UPI</option>
            <option value="razorpay">Razorpay</option>
            <option value="cashOnDelivery">Cash on Delivery</option>
          </select>
        </div>
        
        {/* UPI Payment */}
        {userDetails.paymentMethod === "upi" && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <button
              onClick={handleGenerateUPI}
              className="w-full px-5 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-lg hover:shadow-lg transition mb-4"
            >
              <FaRupeeSign className="inline-block mr-2" /> Generate UPI Payment Link
            </button>
            {upiPayment.show && (
              <div>
                
                <button
                  onClick={() =>
                    setUpiPayment((prev) => ({ ...prev, qrVisible: true }))
                  }
                  className="w-full px-5 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-lg hover:shadow-lg transition"
                >
                  <FaQrcode className="inline-block mr-2" /> Show QR Code
                </button>
                {upiPayment.qrVisible && (
                  <div className="flex justify-center mt-4">
                    <QRCodeSVG value={upiPayment.qrData} size={150} />
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        <button
          onClick={handlePlaceOrder}
          className="w-full px-5 py-3 bg-green-600 text-white rounded-lg"
        >
          Place Order
        </button>
      </div>
    </div>
  );
};

export default BuyNowPage;
