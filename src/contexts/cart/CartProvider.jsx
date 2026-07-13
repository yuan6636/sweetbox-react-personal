import { useEffect, useCallback, useReducer } from 'react';

import { getUser } from '../../utils/auth';
import { useAuth } from '../auth';

import api from '../../api';

import { CartContext } from './CartContext';
import { CartReducer } from './CartReducer';

const initialState = null;

export function CartProvider({ children }) {
  const [cartMain, dispatch] = useReducer(CartReducer, initialState);
  const { isLogin } = useAuth();

  const refreshCart = useCallback(async () => {
    const user = getUser();

    if (!user) {
      dispatch({ type: 'CLEAR_CART' });
      return;
    }

    try {
      const cartRes = await api.get(`/carts?userId=${user.id}&_embed=cart_items`);
      const userCart = cartRes?.data[0] || null;

      dispatch({ type: 'SET_CART', payload: userCart });
    } catch (error) {
      console.error('取得購物車失敗', error?.message);
      dispatch({ type: 'CLEAR_CART' });
    }
  }, []);

  const setCart = useCallback((cart) => {
    dispatch({ type: 'SET_CART', payload: cart });
  }, []);

  const setCartItems = useCallback((cartItems) => {
    dispatch({ type: 'SET_CART_ITEMS', payload: { cart_items: cartItems } });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, []);

  const updateCartMeta = useCallback((meta) => {
    dispatch({ type: 'UPDATE_CART_META', payload: meta });
  }, []);

  const removeCartItem = useCallback((itemId) => {
    dispatch({ type: 'REMOVE_CART_ITEM', payload: { itemId } });
  }, []);

  const updateCartItem = useCallback((itemId, patch) => {
    dispatch({ type: 'UPDATE_CART_ITEM', payload: { itemId, patch } });
  }, []);

  const removeCoupon = useCallback((updatedAt) => {
    dispatch({ type: 'REMOVE_COUPON', payload: { updatedAt } });
  }, []);

  useEffect(() => {
    // 使用 IIFE 寫法暫時關閉 eslint 警告
    (async () => {
      if (!isLogin) {
        dispatch({ type: 'CLEAR_CART' });
        return;
      }

      await refreshCart();
    })();
  }, [isLogin, refreshCart]);

  // 3. 用 value 傳值到子元件
  return (
    <CartContext.Provider
      value={{
        cartMain,
        refreshCart,
        setCart,
        setCartItems,
        clearCart,
        updateCartMeta,
        removeCartItem,
        updateCartItem,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
