import dayjs from 'dayjs';

// utils
import { generateSubNumber } from '../utils/checkoutHelpers';

import api from '../api';

export const createSubscriptionWithOrder = async ({
  item,
  userId,
  finalPaymentMethodId,
  formData,
  paymentSnapshot,
  shippingInfo,
  todayStr,
  nowIsoString,
}) => {
  const { firstOrderAmount } = item; //折扣前小計
  const subNo = generateSubNumber(item.theme?.titleAbbr, item.plan?.durationMonths);
  const endDateStr = dayjs()
    .add(item.plan?.durationMonths - 1, 'month')
    .format('YYYY-MM-DD');
  const nextPaymentStr = dayjs().add(1, 'month').format('YYYY-MM-DD');
  const firstOrderNo = `${subNo}01`;

  const subscriptionPayload = {
    userId,
    planId: item.planId,
    themeId: item.theme?.id,
    subscriptionNumber: subNo,
    quantity: item.quantity,
    unitPrice: item.plan?.discountPrice || 0,
    durationMonths: item.plan?.durationMonths,
    startDate: todayStr,
    endDate: endDateStr,
    nextPaymentDate: nextPaymentStr,
    status: 'active',
    isProcessed: false,
    note: formData.note || '',
    createdAt: nowIsoString,
    paymentMethodId: finalPaymentMethodId,
    paymentSnapshot,
    shippingInfo,
    invoiceInfo: {
      type: formData.type,
      carrier: formData.carrier || '',
      taxId: formData.taxId || '',
      companyName: formData.companyName || '',
      companyEmail: formData.companyEmail || '',
      donateCode: formData.donateCode || '',
    },
  };

  // 先 POST Subscription 取得 ID
  const subRes = await api.post('/subscriptions', subscriptionPayload);

  const realSubId = subRes.data.id; // ← 拿真實 id

  // POST Order
  await api.post('/orders', {
    subscriptionId: realSubId,
    orderNo: firstOrderNo,
    cycle: 1,
    amount: firstOrderAmount,
    createdAt: nowIsoString,
    paymentDueDate: todayStr,
    paymentStatus: 'paid',
    paymentDate: todayStr,
    shippingStatus: 'pending',
    shippingDate: null,
    paymentSnapshot,
    invoice: {
      number: `AB-${Math.floor(Math.random() * 100000000)}`,
      date: nowIsoString,
      fileUrl: null,
    },
    isArchived: false,
  });

  return subRes.data;
};
