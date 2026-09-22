export const generateSubNumber = (abbr, durationMonths) => {
  const durationStr = String(durationMonths).padStart(2, '0'); // 期數補齊兩碼
  // 產生 6 碼隨機英文數字(大寫)
  const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase().padEnd(6, '0');
  return `${abbr || 'XX'}${durationStr}${randomStr}`;
};

export const calculateDisplayCart = (subTotal, discountTotal) => {
  const finalTotal = Math.max(0, subTotal - discountTotal);
  const displayCart = {
    subTotal,
    discountTotal,
    finalTotal,
  };
  return { displayCart };
};

export const allocateDiscountToItems = ({ enrichedCartItems, subTotal, discountTotal }) => {
  let remainingDiscount = discountTotal;

  return enrichedCartItems.map((item, index) => {
    const itemSubTotal = (item.plan?.discountPrice || 0) * item.quantity; //折扣前小計
    let itemDiscount = 0;

    if (subTotal > 0) {
      if (index === enrichedCartItems.length - 1) {
        // 最後品項扣除「剩餘折扣額」
        itemDiscount = remainingDiscount;
      } else {
        // 前面的品項按比例四捨五入計算
        itemDiscount = Math.round((itemSubTotal / subTotal) * discountTotal);
        remainingDiscount -= itemDiscount; // 扣除已經分配出去的折扣
      }
    }

    return {
      ...item,
      itemSubTotal,
      itemDiscount,
      firstOrderAmount: itemSubTotal - itemDiscount,
    };
  });
};
