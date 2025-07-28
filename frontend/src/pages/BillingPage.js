import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  FaFileInvoice,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhone,
  FaShoppingCart,
  FaCheckCircle,
  FaArrowLeft,
  FaFilePdf,
  FaUser,
} from "react-icons/fa";
import axios from "axios";

const BillingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    orderId,
    trackingId,
    transactionId,
    userDetails,
    items,
    total,
    paymentMethod,
  } = location.state || {};

  const [bgImage, setBgImage] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/image-base64/bgimage.jpg")
      .then((res) => setBgImage(res.data.image))
      .catch((err) =>
        console.error("Background image load error (billing):", err.message)
      );
  }, []);

  const generateInvoice = async () => {
  try {
    const logoRes = await axios.get("http://localhost:5000/api/image-base64/logo.jpeg");
    const logoBase64 = logoRes.data.image;

    const doc = new jsPDF();
   // ✅ 1. White circle background
doc.setFillColor(255, 255, 255);
doc.circle(30, 30, 18, "F"); // circle behind

// ✅ 2. Add logo image slightly smaller to simulate border
doc.addImage(logoBase64, "JPEG", 15, 15, 30, 30); // 30x30 fits into circle


    // ✅ Company Info (aligned right)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("Tech Gadgets Store", 105, 20, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text("Your Trusted Electronics Partner", 105, 28, { align: "center" });
    

    doc.line(15, 42, 195, 42); // horizontal line

    // ✅ Invoice Title - Centered
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("INVOICE", 105, 52, { align: "center" });

    // ✅ Order Details
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Order ID: ${orderId}`, 15, 65);
    doc.text(`Tracking ID: ${trackingId}`, 15, 73);
    doc.text(`Transaction ID: ${transactionId || "-"}`, 15, 81);
    doc.text(`Payment Method: ${paymentMethod || "-"}`, 15, 89);

    // ✅ Customer Info
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Customer Details", 15, 105);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`Name: ${userDetails?.name || "N/A"}`, 15, 113);
    doc.text(`Address: ${userDetails?.address || "N/A"}`, 15, 121);
    doc.text(`City: ${userDetails?.city || "N/A"}`, 15, 129);
    doc.text(`Email: ${userDetails?.email || "N/A"}`, 15, 137);
    doc.text(`Phone: ${userDetails?.phone || "N/A"}`, 15, 145);

    // ✅ Order Table
    doc.setFontSize(13);
    doc.text("Order Items", 15, 160);
    autoTable(doc, {
      startY: 165,
      head: [["Product", "Qty", "Price", "Total"]],
      body: items.map((item) => [
        item.product.name,
        item.quantity,
        `${item.product.price}`,
        `${item.quantity * item.product.price}`,
      ]),
      theme: "grid",
      styles: {
        font: "helvetica",
        fontSize: 11,
        halign: "center",
      },
      headStyles: { fillColor: [255, 105, 180] }, // pink header
    });

    // ✅ Total Amount at Bottom
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(`Total Amount: ${total || 0}`, 15, finalY);

    // ✅ Footer
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(100);
    doc.text(
      "Thank you for shopping with Tech Gadgets Store!",
      105,
      290,
      { align: "center" }
    );

    doc.save(`Invoice_Order_${orderId}.pdf`);
  } catch (err) {
    console.error("Invoice generation error:", err.message);
  }
};


  return (
    <div
      className="font-sans bg-cover bg-center bg-no-repeat min-h-screen pb-12"
      style={{
        backgroundImage: bgImage ? `url(${bgImage})` : "none",
      }}
    >
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-center text-3xl font-bold text-pink-700 mb-6">
          Billing Details <FaFileInvoice className="inline-block ml-2" />
        </h1>

        {/* Order Details */}
        <div className="bg-pink-100 p-5 rounded-lg shadow-md mb-6">
          <h2 className="text-pink-700 font-bold text-lg mb-3">Order Details:</h2>
          <p>
            <FaShoppingCart className="inline-block text-pink-700 mr-2" />
            <strong>Order ID:</strong> {orderId || "N/A"}
          </p>
          <p>
            <FaCheckCircle className="inline-block text-pink-700 mr-2" />
            <strong>Tracking ID:</strong> {trackingId || "N/A"}
          </p>
          <p>
            <FaCheckCircle className="inline-block text-pink-700 mr-2" />
            <strong>Transaction ID:</strong> {transactionId || "N/A"}
          </p>
          <p>
            <FaCheckCircle className="inline-block text-pink-700 mr-2" />
            <strong>Payment Method:</strong> {paymentMethod || "NULL"}
          </p>
        </div>

        {/* Shipping Details */}
        <div className="bg-pink-100 p-5 rounded-lg shadow-md mb-6">
          <h2 className="text-pink-700 font-bold text-lg mb-3">
            Shipping Details:
          </h2>
          <p>
            <FaUser className="inline-block text-pink-700 mr-2" />
            {userDetails?.name || "N/A"}
          </p>
          <p>
            <FaMapMarkerAlt className="inline-block text-pink-700 mr-2" />
            {userDetails?.address || "N/A"}, {userDetails?.city || "N/A"}
          </p>
          <p>
            <FaEnvelope className="inline-block text-pink-700 mr-2" />
            {userDetails?.email || "N/A"}
          </p>
          <p>
            <FaPhone className="inline-block text-pink-700 mr-2" />
            {userDetails?.phone || "N/A"}
          </p>
        </div>

        {/* Order Items */}
        <div className="bg-pink-100 p-5 rounded-lg shadow-md mb-6">
          <h2 className="text-pink-700 font-bold text-lg mb-3">Order Items:</h2>
          {items?.length > 0 ? (
            <ul>
              {items.map((item, index) => (
                <li key={index} className="mb-2">
                  <FaCheckCircle className="inline-block text-pink-700 mr-2" />
                  {item.product.name} (x{item.quantity}) — ₹
                  {item.quantity * item.product.price}
                </li>
              ))}
            </ul>
          ) : (
            <p>No items found.</p>
          )}
        </div>

        <h3 className="text-center text-xl font-bold text-gray-800 mb-6">
          Total Amount: <span className="text-pink-700">₹{total || 0}</span>
        </h3>

        {/* Buttons */}
        <div className="flex justify-between">
          <button
            className="bg-pink-700 text-white px-6 py-3 rounded-lg hover:bg-pink-600 transition duration-300"
            onClick={generateInvoice}
          >
            <FaFilePdf className="inline-block mr-2" />
            Download Invoice
          </button>
          <button
            className="bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition duration-300"
            onClick={() => navigate("/")}
          >
            <FaArrowLeft className="inline-block mr-2" />
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default BillingPage;
