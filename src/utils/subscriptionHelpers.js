export const calculatePenalty = (subscription) => {
  const { orders, plan, quantity } = subscription;

  const deliveredCount = orders.length ? Math.max(...orders.map((order) => order.cycle)) : 0;

  const { discountPrice, originalPrice } = plan;
  const unitDifference = Math.abs(discountPrice - originalPrice);
  const difference = unitDifference * quantity;

  const penalty = deliveredCount * difference;

  return { unitDifference, difference, deliveredCount, penalty };
};
