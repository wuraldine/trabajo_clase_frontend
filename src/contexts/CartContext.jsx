import React, { createContext, useEffect, useState } from 'react';
import { cartService } from '../services';

export const CartContext = createContext({ cart: [], addItem: () => {}, removeItem: () => {} });

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    let mounted = true;
    cartService
      .getCart()
      .then((data) => {
        if (mounted) setCart(Array.isArray(data) ? data : []);
      })
      .catch(() => {});
    return () => (mounted = false);
  }, []);

  const addItem = async (item) => {
    try {
      await cartService.addItem(item);
      const updated = await cartService.getCart();
      setCart(Array.isArray(updated) ? updated : []);
    } catch (e) {
      console.error('addItem error', e);
    }
  };

  const removeItem = async (itemId) => {
    try {
      await cartService.removeItem(itemId);
      const updated = await cartService.getCart();
      setCart(Array.isArray(updated) ? updated : []);
    } catch (e) {
      console.error('removeItem error', e);
    }
  };

  return (
    <CartContext.Provider value={{ cart, addItem, removeItem }}>
      {children}
    </CartContext.Provider>
  );
}

export default CartProvider;
