export const generateSubNumber = (abbr, durationMonths) => {
  const durationStr = String(durationMonths).padStart(2, '0'); // 期數補齊兩碼
  // 產生 6 碼隨機英文數字(大寫)
  const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase().padEnd(6, '0');
  return `${abbr || 'XX'}${durationStr}${randomStr}`;
};

export const calculateDisplayCart = (cart, enrichedCartItems) => {
  const subTotal = enrichedCartItems.reduce(
    (sum, item) => sum + (item.plan?.discountPrice || 0) * item.quantity,
    0,
  );
  const discountTotal = cart?.discountTotal || 0;
  const finalTotal = Math.max(0, subTotal - discountTotal);
  const displayCart = {
    ...cart,
    subTotal,
    discountTotal,
    finalTotal,
  };
  return { subTotal, discountTotal, displayCart };
};
