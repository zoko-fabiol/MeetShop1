import React, { createContext, useContext, useState, useEffect } from 'react';
import { calculateWholesaleTier } from '../services/wholesaleService';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const local = localStorage.getItem('meetshop_cart');
      return local ? JSON.parse(local) : [];
    } catch {
      return [];
    }
  });

  const [orders, setOrders] = useState(() => {
    try {
      const local = localStorage.getItem('meetshop_orders');
      return local ? JSON.parse(local) : [];
    } catch {
      return [];
    }
  });

  const [liteMode, setLiteMode] = useState(() => {
    try {
      return localStorage.getItem('meetshop_lite_mode') === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    localStorage.setItem('meetshop_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('meetshop_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('meetshop_lite_mode', liteMode);
  }, [liteMode]);

  const addToCart = (product, qty = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      return [...prev, { ...product, quantity: qty }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, delta) => {
    setCart(prev =>
      prev
        .map(item => {
          if (item.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const addOrder = (order) => {
    const newOrders = [order, ...orders];
    setOrders(newOrders);
  };

  // Calcul du montant total avec prise en compte automatique des remises grossistes dégressives
  const totalAmount = cart.reduce((sum, item) => {
    const tier = calculateWholesaleTier(item, item.quantity);
    return sum + (tier.unitPrice * item.quantity);
  }, 0);

  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const toggleLiteMode = () => {
    setLiteMode(prev => !prev);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalAmount,
        totalCount,
        orders,
        addOrder,
        liteMode,
        toggleLiteMode
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
