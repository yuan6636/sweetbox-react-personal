export function CartReducer(state, action) {
  switch (action.type) {
    case 'SET_CART':
      return action.payload;

    case 'SET_CART_ITEMS':
      if (!state) return state;

      return {
        ...state,
        cart_items: action.payload.cart_items,
      };

    case 'CLEAR_CART':
      return null;

    case 'UPDATE_CART_META':
      if (!state) return state;

      return {
        ...state,
        ...action.payload,
      };

    case 'REMOVE_CART_ITEM':
      if (!state) return state;

      return {
        ...state,
        cart_items: (state.cart_items || []).filter((item) => item.id !== action.payload.itemId),
      };

    case 'ADD_CART_ITEM': {
      if (!state) return state;

      const { item, index } = action.payload;
      const items = [...(state.cart_items || [])];

      if (typeof index === 'number' && index >= 0 && index <= items.length) {
        items.splice(index, 0, item);
      } else {
        items.push(item);
      }

      return { ...state, cart_items: items };
    }

    case 'UPDATE_CART_ITEM':
      if (!state) return state;

      return {
        ...state,
        cart_items: (state.cart_items || []).map((item) =>
          item.id === action.payload.itemId ? { ...item, ...action.payload.patch } : item,
        ),
      };

    case 'REMOVE_COUPON': {
      if (!state) return state;
      // { key: _ } 為 JS 慣例寫法，會忽略這個變數，避免 ESLint 警告提示
      // couponId 從 state 移除，避免 delete 報錯
      const { couponId: _, ...rest } = state;

      return { ...rest, discountTotal: 0, updatedAt: action.payload.updatedAt };
    }

    default:
      return state;
  }
}
