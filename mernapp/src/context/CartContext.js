import { createContext, useState, useEffect } from "react";

export const CartContext = createContext({
  cartItems: [], // ✅ Provide default empty array
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
});

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(storedCart);
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (food) => {
    setCartItems((prevCart) => {
      const existingItem = prevCart.find((item) => item.name === food.name);
      if (existingItem) {
        return prevCart.map((item) =>
          item.name === food.name ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...food, quantity: 1 }];
    });
  };

  const removeFromCart = (name) => {
    setCartItems((prevCart) => prevCart.filter((item) => item.name !== name));
  };

  const updateQuantity = (name, quantity) => {
    if (quantity <= 0) {
      removeFromCart(name);
    } else {
      setCartItems((prevCart) =>
        prevCart.map((item) =>
          item.name === name ? { ...item, quantity } : item
        )
      );
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity }}>
      {children}
    </CartContext.Provider>
  );
};
