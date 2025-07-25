import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { UserContext } from "../context/UserContext";
import axios from "axios";
import {
  FaArrowLeft,
  FaStar,
  FaShoppingCart,
  FaHome,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(UserContext); // 👈 for login check
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    axios.get("http://13.60.50.211/products").then((res) => {
      const found = res.data.find((p) => p.id === parseInt(id));
      setProduct(found);
      setRecommendedProducts(
        res.data.filter((p) => p.id !== parseInt(id)).slice(0, 4)
      );
    });

    axios
      .get(`http://13.60.50.211/reviews/${id}`)
      .then((res) => setReviews(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  const handleAddToCart = () => {
    try {
      addToCart(product, parseInt(quantity));
      toast.success("Added to cart successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart.");
    }
  };

  const handleAddReview = () => {
    if (newReview.trim()) {
      const review = {
        productId: id,
        text: newReview,
        date: new Date().toISOString(),
      };
      axios
        .post("http://13.60.50.211/reviews", review)
        .then((res) => {
          setReviews([...reviews, res.data]);
          setNewReview("");
          toast.success("Review added successfully!");
        })
        .catch((err) => console.error(err));
    }
  };

  const handleBuyNow = () => {
    if (!user) {
      localStorage.setItem(
        "buyNowRedirect",
        JSON.stringify({
          product,
          quantity: parseInt(quantity),
        })
      );
      toast.info("Please login to continue purchase");
      navigate("/login");
    } else {
      navigate("/buy-now", {
        state: { product, quantity: parseInt(quantity) },
      });
    }
  };

  if (!product) return <div className="p-6 text-center">Loading...</div>;

  return (
     <div
      className="font-sans bg-cover bg-center bg-no-repeat min-h-screen flex flex-col"
      style={{ backgroundImage: "url('/images/bgimage.jpg')" }}
    >
      <ToastContainer />

      {/* Navbar */}
      <nav className="bg-pink-700 text-white py-4 px-6 shadow-md flex justify-between items-center">
        <h1 className="text-xl font-bold">Tech Gadgets Store</h1>
        <div className="md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-2xl"
          >
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
        <div className="hidden md:flex space-x-4">
          <button
            onClick={() => navigate("/")}
            className="flex items-center hover:text-pink-200 transition"
          >
            <FaHome className="mr-2" /> Home
          </button>
          <button
            onClick={() => navigate("/cart")}
            className="flex items-center hover:text-pink-200 transition"
          >
            <FaShoppingCart className="mr-2" /> Cart
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="bg-pink-600 text-white flex flex-col px-6 py-4 md:hidden space-y-3 shadow-md">
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              navigate("/");
            }}
            className="flex items-center hover:text-pink-200"
          >
            <FaHome className="mr-2" /> Home
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              navigate("/cart");
            }}
            className="flex items-center hover:text-pink-200"
          >
            <FaShoppingCart className="mr-2" /> Cart
          </button>
        </div>
      )}

      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-pink-700 text-lg font-medium hover:text-pink-700 transition mt-4 ml-4"
      >
        <FaArrowLeft className="mr-2" /> Back
      </button>

      {/* Product Details */}
      <div className="container mx-auto px-6 py-8 flex-1">
        <div className="flex flex-col lg:flex-row bg-gray-100 p-6 rounded-lg shadow-lg">
          <div className="flex-1 mb-6 lg:mb-0 text-center">
            <img
              src={`/images/${product.image_url}`}
              alt={product.name}
              className="w-full h-auto rounded-lg cursor-pointer"
              onClick={() => setIsModalOpen(true)}
            />
          </div>

          <div className="flex-1 lg:pl-20">
            <h2 className="text-2xl font-bold mb-4">{product.name}</h2>
            <p className="text-gray-700 text-lg mb-4">{product.description}</p>
            <p className="text-xl font-semibold text-green-600 mb-4">
              ₹{product.price}
            </p>
            <p
              className={`text-lg mb-4 ${
                product.quantity > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {product.quantity > 0
                ? `In Stock (${product.quantity} available)`
                : "Out of Stock"}
            </p>

            <div className="flex items-center space-x-4 mb-6">
              <label htmlFor="quantity" className="text-lg font-medium">
                Quantity:
              </label>
              <input
                id="quantity"
                type="number"
                value={quantity}
                min={1}
                max={product.quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-16 text-center p-2 border rounded-lg text-black focus:outline-none focus:ring focus:ring-pink-700"
              />
            </div>

            <div className="mb-6">
              <p className="text-lg font-medium mb-2">Rate this product:</p>
              <div className="flex">
                {[...Array(5)].map((_, index) => {
                  const value = index + 1;
                  return (
                    <FaStar
                      key={value}
                      size={24}
                      color={
                        value <= (hoverRating || rating) ? "#FFD700" : "#ddd"
                      }
                      onClick={() => setRating(value)}
                      onMouseEnter={() => setHoverRating(value)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="cursor-pointer mr-1"
                    />
                  );
                })}
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                className="px-6 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition"
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>
              <button
                className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
                onClick={handleBuyNow}
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-10">
          <h3 className="text-2xl font-bold mb-4">Customer Reviews</h3>
          <div className="bg-white p-6 rounded-lg shadow mb-4">
            {reviews.length > 0 ? (
              reviews.map((review, index) => (
                <div
                  key={index}
                  className="border-b border-gray-200 pb-4 mb-4"
                >
                  <p className="text-gray-700">{review.text}</p>
                  <p className="text-gray-500 text-sm">
                    {new Date(review.date).toLocaleString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-600">
                No reviews yet. Be the first to review this product!
              </p>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <input
              type="text"
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
              placeholder="Write your review..."
              className="flex-1 p-2 border rounded-lg text-black focus:outline-none focus:ring focus:ring-pink-700"
            />
            <button
              onClick={handleAddReview}
              className="px-6 py-2 bg-pink-700 text-white rounded-lg shadow hover:bg-pink-600 transition"
            >
              Submit
            </button>
          </div>
        </div>

        {/* Recommendations */}
        <div className="mt-10">
          <h3 className="text-2xl font-bold mb-4">You May Also Like</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {recommendedProducts.map((recProduct) => (
              <div
                key={recProduct.id}
                className="bg-gray-100 p-4 rounded-lg shadow hover:shadow-lg transition"
              >
                <img
                  src={`/images/${recProduct.image_url}`}
                  alt={recProduct.name}
                  className="w-full h-40 object-cover rounded-lg mb-4 cursor-pointer"
                  onClick={() => navigate(`/products/${recProduct.id}`)}
                />
                <h4 className="text-lg font-semibold">{recProduct.name}</h4>
                <p className="text-pink-700 font-bold">₹{recProduct.price}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50"
          onClick={() => setIsModalOpen(false)}
        >
          <img
            src={`/images/${product.image_url}`}
            alt={product.name}
            className="max-w-full max-h-full rounded-lg"
          />
        </div>
      )}

      {/* Footer */}
      <footer className="bg-pink-700 text-white text-center py-6 mt-10">
        <p>© 2025 Tech Gadgets Store. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default ProductDetails;
