import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

// 台灣時間
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Asia/Taipei');

// api
import api from '../api';

export function useAppliedCoupon({ cart, subTotal, updateCartMeta }) {
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // 先從 cart 的 couponId 取得優惠券資料
  useEffect(() => {
    if (!cart?.couponId) return;

    let ignore = false;

    const fetchCoupon = async () => {
      try {
        const res = await api.get(`/coupons/${cart.couponId}`);
        if (ignore) return;
        setAppliedCoupon(res.data);
      } catch (err) {
        if (ignore) return;
        console.error('優惠券已不存在，自動移除', err);
        setAppliedCoupon(null);

        try {
          await api.put(`/carts/${cart.id}`, {
            id: cart.id,
            userId: cart.userId,
            createdAt: cart.createdAt,
            updatedAt: dayjs().format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
          });
          updateCartMeta({ couponId: null });
        } catch (patchErr) {
          console.error('清除失效優惠券失敗', patchErr);
        }
      }
    };

    fetchCoupon();

    return () => {
      ignore = true;
    };
  }, [cart?.couponId, cart?.id, cart?.userId, cart?.createdAt, updateCartMeta]);

  // 檢查優惠券是否符合使用門檻
  const isCouponValid = !!appliedCoupon && subTotal >= appliedCoupon.minSpend;

  // 計算優惠券的折扣金額
  const getDiscountTotal = () => {
    if (!appliedCoupon || !isCouponValid) return 0;
    if (appliedCoupon.type === 'fixed') {
      return appliedCoupon.discountValue;
    } else if (appliedCoupon.type === 'percentage') {
      return Math.round(subTotal * appliedCoupon.discountValue);
    }
    return 0;
  };

  const discountTotal = getDiscountTotal();

  return { appliedCoupon, isCouponValid, discountTotal, setAppliedCoupon };
}
