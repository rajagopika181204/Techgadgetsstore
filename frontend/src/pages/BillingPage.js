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
      .get("https://techgadgetsstore-backend.onrender.com/api/image-base64/bgimage.jpg")
      .then((res) => setBgImage(res.data.image))
      .catch((err) =>
        console.error("Background image load error (billing):", err.message)
      );
  }, []);

  const generateInvoice = async () => {
  try {
    const logoRes = await axios.get(
      "https://techgadgetsstore-backend.onrender.com/api/image-base64/logo.jpeg"
    );
    const logoBase64 = logoRes.data.image;

    const doc = new jsPDF();

    // === Logo inside circle at top-left (moved slightly down) ===
    doc.setFillColor(255, 255, 255);
    doc.circle(20, 25, 12, "F"); // Y increased from 20 → 25
    doc.addImage(logoBase64, "JPEG", 8, 13, 24, 24); // Y increased from 8 → 13

    // === Company Info (right aligned) ===
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(199, 21, 133); // Dark pink (Deep rose)
    doc.text("Tech Gadgets Store", 200, 20, { align: "right" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(80, 80, 80);
    doc.text("Your Trusted Electronics Partner", 200, 27, { align: "right" });
    doc.text("Email: support@techgadgets.com", 200, 33, { align: "right" });
    doc.text("Phone: +91 98765 43210", 200, 39, { align: "right" });

    // === Divider line ===
    doc.setDrawColor(199, 21, 133);
    doc.setLineWidth(1);
    doc.line(10, 45, 200, 45);

    // === Invoice Title ===
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(199, 21, 133);
    doc.text("INVOICE", 105, 55, { align: "center" });

    // === Order Details ===
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 60, 60);
    doc.text(`Order ID: ${orderId}`, 10, 65);
    doc.text(`Tracking ID: ${trackingId}`, 10, 71);
    doc.text(`Transaction ID: ${transactionId || "-"}`, 10, 77);
    doc.text(`Payment Method: ${paymentMethod || "-"}`, 10, 83);

    // === BILL TO Box ===
    doc.setFillColor(255, 182, 193); // Darker light pink
    doc.roundedRect(10, 91, 90, 40, 3, 3, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(199, 21, 133);
    doc.text("BILL TO:", 12, 97);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(60, 60, 60);
    doc.text(userDetails?.name || "N/A", 12, 103);
    doc.text(userDetails?.address || "N/A", 12, 109);
    doc.text(userDetails?.city || "N/A", 12, 115);
    doc.text(userDetails?.email || "N/A", 12, 121);
    doc.text(userDetails?.phone || "N/A", 12, 127);

    // === Product Table ===
    autoTable(doc, {
      startY: 141,
      head: [["Product", "Qty", "Price", "Total"]],
      body: items.map((item) => [
        item.product.name,
        item.quantity,
        `${item.product.price}`,
        `${item.quantity * item.product.price}`,
      ]),
      theme: "striped",
      headStyles: {
        fillColor: [199, 21, 133], // Dark pink header
        textColor: [255, 255, 255],
        fontSize: 11,
      },
      bodyStyles: { fontSize: 10, textColor: 60 },
      alternateRowStyles: { fillColor: [255, 228, 232] },
      styles: {
        halign: "center",
        cellPadding: 3,
      },
    });

    // === Total Amount ===
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(199, 21, 133);
    doc.text(`Total Amount: ${total || 0}`, 10, finalY);

    // === Footer ===
    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.setTextColor(120);
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
