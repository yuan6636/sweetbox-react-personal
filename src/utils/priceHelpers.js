export const calculateDiscount = (originalPrice, discountPrice) => {
  if (!originalPrice || !discountPrice) return 0;
  return Math.max(0, originalPrice - discountPrice);
};
