import { useState, useEffect, useCallback, useReducer } from 'react';

import { useAuth } from '../auth';

import api from '../../api';

import { CartContext } from './CartContext';
import { CartReducer } from './CartReducer';

const initialState = null;

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(CartReducer, initialState);
  const [isCartLoading, setIsCartLoading] = useState(true);
  const { isLogin, user } = useAuth();

  const fetchCartData = useCallback(async () => {
    if (!user) return;
    const cartRes = await api.get(`/carts?userId=${user.id}&_embed=cart_items`);

    return cartRes?.data[0] || null;
  }, [user]);

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

  const addCartItem = useCallback((item, index) => {
    dispatch({ type: 'ADD_CART_ITEM', payload: { item, index } });
  }, []);

  const updateCartItem = useCallback((itemId, patch) => {
    dispatch({ type: 'UPDATE_CART_ITEM', payload: { itemId, patch } });
  }, []);

  const removeCoupon = useCallback((updatedAt) => {
    dispatch({ type: 'REMOVE_COUPON', payload: { updatedAt } });
  }, []);

  const refreshCart = useCallback(async () => {
    if (!user) {
      clearCart();
      setIsCartLoading(false);
      return;
    }

    try {
      const userCart = await fetchCartData();

      setCart(userCart);
    } catch (error) {
      console.error('取得購物車失敗', error?.message);
    } finally {
      setIsCartLoading(false);
    }
  }, [user, fetchCartData, setCart, clearCart]);

  useEffect(() => {
    // 避免 isLogin/user 短時間內連續變化時（如快速切換帳號），
    // 較舊的請求較晚回來、蓋掉較新的購物車資料。
    // effect 重新執行前，React 會先呼叫 cleanup 把 isIgnore 設為 true，
    // 讓過期的回應不再觸發 dispatch。
    let isIgnore = false;

    const loadCart = async () => {
      if (!isLogin) {
        clearCart();
        setIsCartLoading(false);
        return;
      }

      setIsCartLoading(true);

      try {
        const userCart = await fetchCartData();

        if (!isIgnore) {
          setCart(userCart);
        }
      } catch (error) {
        console.error('取得購物車失敗', error?.message);

        if (!isIgnore) {
          clearCart();
        }
      } finally {
        if (!isIgnore) {
          setIsCartLoading(false);
        }
      }
    };

    loadCart();

    return () => {
      isIgnore = true;
    };
  }, [isLogin, fetchCartData, setCart, clearCart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        isCartLoading,
        refreshCart,
        setCart,
        setCartItems,
        clearCart,
        updateCartMeta,
        removeCartItem,
        addCartItem,
        updateCartItem,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
