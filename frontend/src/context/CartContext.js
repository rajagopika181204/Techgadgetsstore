import React, { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

// ✅ Cart Context
export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem("cartItems");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // ✅ Safe addToCart
  const addToCart = (product, quantity = 1) => {
    if (!product || !product.id) {
      console.error("❌ Invalid product:", product);
      return;
    }

    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item?.product?.id === product.id
      );

      if (existingItem) {
        return prevItems.map((item) =>
          item?.product?.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevItems, { product, quantity }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item?.product?.id !== productId)
    );
  };

  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// ✅ User Context
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
