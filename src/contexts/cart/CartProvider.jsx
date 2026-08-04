import { useState, useEffect, useCallback, useReducer } from 'react';

// hooks
import { useAuth } from '../auth';

// api
import api from '../../api';

// contexts
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

  const addPlanToCart = useCallback(
    async (planId, quantity) => {
      if (!user) throw new Error('請先登入會員');
      // 先檢查購物車是否存在，不存在就建立購物車
      let currentCart = cart;
      if (!currentCart) {
        const newCartRes = await api.post('/carts', {
          userId: user.id,
          createdAt: new Date().toISOString(),
        });
        // 更新 cart 狀態
        currentCart = { ...newCartRes.data, cart_items: [] };
        setCart(currentCart);
      }

      // 是否有相同方案，若有更新方案數量，沒有就新增
      const existingItem = (currentCart?.cart_items || []).find((item) => item.planId === planId);

      if (existingItem) {
        // 更新方案數量
        const patch = { quantity: existingItem.quantity + quantity };
        await api.patch(`/cart_items/${existingItem.id}`, patch);
        updateCartItem(existingItem.id, patch);
      } else {
        // 新增方案
        const cartItemRes = await api.post('/cart_items', {
          cartId: currentCart.id,
          planId,
          quantity,
        });
        addCartItem(cartItemRes.data);
      }
      // 更新購物車時間
      const updatedAt = new Date().toISOString();
      await api.patch(`/carts/${currentCart.id}`, { updatedAt });
      updateCartMeta({ updatedAt });
    },
    [cart, user, setCart, updateCartItem, addCartItem, updateCartMeta],
  );

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
        addPlanToCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
