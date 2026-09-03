// 外部資源
import { useEffect, useState, useRef } from 'react';
import { Icon } from '@iconify/react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { message } from 'antd';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

// utils
import taiwanData from '../data/taiwanDistricts.json';
import { creditCardYears, creditCardMonths } from '../data/formOptions';
import { formatCardNumber, getCardType } from '../utils/payment';
import { calculateDisplayCart, allocateDiscountToItems } from '../utils/checkoutHelpers';

// components
import InvoiceSection from '../components/cart/InvoiceSection';
import ReceiverSection from '../components/cart/ReceiverSection';
import PaymentSection from '../components/cart/PaymentSection';
import OrderSummary from '../components/cart/OrderSummary';

// api
import api from '../api';

// hooks
import { useCart } from '../contexts/cart';
import { useAuth } from '../contexts/auth';
import { useMatchedSavedCard } from '../hooks/useMatchedSavedCard';
import { useQuickNotes } from '../hooks/useQuickNotes';
import { useAppliedCoupon } from '../hooks/useAppliedCoupon';

// services
import { createSubscriptionWithOrder } from '../services/subscriptionService';

// 設定台灣時區
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Asia/Taipei');

function CartCheckout() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    control,
    trigger,
    clearErrors,
    formState: { errors },
  } = useForm({ mode: 'onTouched' });

  const [enrichedCartItems, setEnrichedCartItems] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [savedCards, setSavedCards] = useState([]);

  // 避免 useEffect 重新取得購物車資料，跳轉到空的購物車頁
  const hasCheckoutRef = useRef(false);

  const { user } = useAuth();
  const { cart, clearCart, updateCartMeta } = useCart();
  const matchedSavedCard = useMatchedSavedCard({ watch, savedCards });
  const { selectedChips, currentNote, quickNoteChips, toggleChip } = useQuickNotes({
    watch,
    getValues,
    setValue,
  });

  const subTotal = enrichedCartItems.reduce(
    (sum, item) => sum + (item.plan?.discountPrice || 0) * item.quantity,
    0,
  );

  const { appliedCoupon, discountTotal, isCouponValid } = useAppliedCoupon({
    cart,
    subTotal,
    updateCartMeta,
  });

  // 金額
  const { displayCart } = calculateDisplayCart(subTotal, discountTotal);

  useEffect(() => {
    if (!user) return;
    // 結帳成功後，cart 變 null，也不重新抓資料，避免誤判並跳轉到 /cart
    if (hasCheckoutRef.current) return;

    let isIgnore = false;
    const fetchData = async () => {
      setIsLoading(true); // 重新抓資料前才設定 isLoading 為 true
      try {
        // 防呆：非結帳成功情境下，如果沒有購物車 or 購物車是空的，導回 '/cart'
        if (!cart || !cart.cart_items || cart.cart_items.length === 0) {
          navigate('/cart');
          return;
        }

        const [themesRes, plansRes, savedCardsRes] = await Promise.all([
          api.get('/themes'),
          api.get('/plans'),
          api.get(`/payment_methods?userId=${user.id}`),
        ]);
        const plansData = plansRes.data;
        const themesData = themesRes.data;

        // 結帳當下重新組合商品明細（含 plan、theme 詳細資料）並鎖定為價格快照
        const enrichedItems = cart.cart_items.map((item) => {
          const planDetail = plansData.find((p) => p.id === item.planId);
          const themeDetail = themesData.find((t) => t.id === planDetail?.themeId);
          return {
            ...item,
            plan: planDetail || null,
            theme: themeDetail || null,
          };
        });

        if (!isIgnore) {
          setSavedCards(savedCardsRes.data);
          setEnrichedCartItems(enrichedItems);
        }
      } catch (err) {
        console.error('資料讀取失敗', err);
        if (!isIgnore) message.error('無法取得訂單資訊');
      } finally {
        if (!isIgnore) setIsLoading(false);
      }
    };
    fetchData();
    return () => {
      isIgnore = true;
    };
  }, [navigate, user, cart]);

  const onSubmit = async (formData) => {
    if (!enrichedCartItems || enrichedCartItems.length === 0) {
      message.warning('您的購物車裡還沒有甜點呢！');
      navigate('/cartEmpty');
      return;
    }
    // 若優惠券失效，中斷結帳
    if (appliedCoupon && !isCouponValid) {
      message.error('您的優惠券已不符合使用資格，請重新確認購物車金額。');
      return;
    }

    setIsSubmitting(true); //UX優化
    message.loading({ content: '安全連線中，正在處理訂閱...', key: 'checkout' });

    try {
      const userId = user?.id;
      const todayStr = dayjs().format('YYYY-MM-DD');
      // 是否要儲存新的信用卡
      const shouldSaveNewCard = formData.saveCard && !matchedSavedCard;
      let finalPaymentMethodId = null; //預留給新產生的卡片id

      // 信用卡資料轉換
      const currentCardBrand = getCardType(formData.cardNumber);
      const lastFour = formData.cardNumber.replace(/\s/g, '').slice(-4);

      // 抓取郵遞區號
      const { city, district } = formData;
      const zipCodeStr = taiwanData['台灣']?.[city]?.[district]?.postalCode || '';

      const nowIsoString = new Date().toISOString();

      // 儲存新卡
      if (shouldSaveNewCard) {
        // 儲存新卡資訊
        const newCardRes = await api.post('/payment_methods', {
          userId: userId,
          cardOwner: formData.cardOwner,
          cardBrand: currentCardBrand,
          lastFour: lastFour,
          expiryMonth: Number(formData.expiryMonth),
          expiryYear: Number(formData.expiryYear),
          isDeleted: false,
          createdAt: nowIsoString,
        });

        finalPaymentMethodId = newCardRes.data.id; // 獲取新卡 ID
      } else if (matchedSavedCard) {
        // 儲存舊卡 ID
        finalPaymentMethodId = matchedSavedCard.id || null;
      }

      const preCalculatedItems = allocateDiscountToItems({
        enrichedCartItems,
        subTotal,
        discountTotal,
      });

      const paymentSnapshot = {
        cardOwner: formData.cardOwner,
        cardBrand: currentCardBrand,
        lastFour,
        expiryMonth: Number(formData.expiryMonth),
        expiryYear: Number(formData.expiryYear),
      };

      const shippingInfo = {
        zipCode: zipCodeStr,
        city,
        district,
        street: formData.street,
        name: formData.name,
        phone: formData.phone,
      };

      // 使用迴圈依序執行(json server 不支援同時寫入)
      const results = [];
      for (const item of preCalculatedItems) {
        const couponSnapshot =
          appliedCoupon && isCouponValid
            ? {
                code: appliedCoupon.code,
                type: appliedCoupon.type,
                discountValue: appliedCoupon.discountValue,
                appliedDiscountAmount: item.itemDiscount,
              }
            : null;

        const result = await createSubscriptionWithOrder({
          item,
          userId,
          finalPaymentMethodId,
          formData,
          paymentSnapshot,
          couponSnapshot,
          shippingInfo,
          todayStr,
          nowIsoString,
        });
        results.push(result);
      }

      // 成功後導頁
      const subIds = results.map((sub) => sub.id).join(',');

      // 清理購物車
      for (const item of enrichedCartItems) {
        await api.delete(`/cart_items/${item.id}`);
      }
      if (cart?.id) {
        await api.delete(`/carts/${cart.id}`);
      }

      hasCheckoutRef.current = true;
      clearCart();
      navigate(`/cartFinish?sub_ids=${subIds}`, { replace: true, state: { showSuccess: true } });
    } catch (error) {
      console.error('結帳失敗:', error);
      message.error({
        content: '處理失敗，如已扣款請勿重複送出，請重新整理頁面後再試，如有疑慮請聯繫客服。',
        key: 'checkout',
        duration: 3,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSyncMemberData = async (e) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      try {
        const res = await api.get(`/users/${user?.id}?_embed=payment_methods`);
        const userData = res.data;

        setValue('name', userData.name, { shouldValidate: true });
        setValue('phone', userData.phone, { shouldValidate: true });

        if (!userData.address) {
          message.error('會員資料不完整，請手動填寫收件地址。');
          return;
        }

        setValue('city', userData.address.city, { shouldValidate: true });
        setValue('district', userData.address.district, { shouldValidate: true });
        setValue('street', userData.address.street, { shouldValidate: true });
      } catch (error) {
        console.error('取得會員資料失敗：', error);
        message.error('無法帶入會員資料，請稍後再試。');
      }
    } else {
      // 取消勾選，清空收件資料欄位
      setValue('name', '');
      setValue('phone', '');
      setValue('city', '');
      setValue('district', '');
      setValue('street', '');
    }
  };

  // 地址
  const currentCity = watch('city');
  const cities = Object.keys(taiwanData['台灣']);
  const districts = currentCity ? Object.keys(taiwanData['台灣'][currentCity]) : [];

  const handleCardNumberChange = (e) => {
    const formattedValue = formatCardNumber(e.target.value);
    setValue('cardNumber', formattedValue, { shouldValidate: true });
  };

  return (
    <>
      <div className="bg-neutral-300 cart-body">
        <div className="cart-main">
          <ol className="stepper mx-auto d-flex justify-content-center align-items-center">
            <li className="step-item d-flex flex-column align-items-center active">
              <div className="step mb-2">1</div>
              <span className="step-intro">購物車</span>
            </li>
            <li className="step-item d-flex flex-column align-items-center active">
              <div className="step mb-2">2</div>
              <span className="step-intro">填寫資料</span>
            </li>
            <li className="step-item d-flex flex-column align-items-center">
              <div className="step mb-2">3</div>
              <span className="step-intro">完成訂閱</span>
            </li>
          </ol>

          <form
            id="checkoutForm"
            className="container px-3 p-lg-0"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="d-flex justify-content-between align-items-center mb-2 mb-lg-6">
              <h1 className="cart-title p-3 py-lg-2 px-lg-4">填寫資料</h1>
              <Link to="/cart" className="btn py-3 px-4 px-lg-8 border-0 btn-shopping">
                返回購物車
              </Link>
            </div>
            <div className="row mx-0 mx-sm-n3">
              <div className="col-lg-8 px-0 px-lg-4 mb-2 mb-lg-0">
                {/* 收件資料 */}
                <ReceiverSection
                  register={register}
                  errors={errors}
                  control={control}
                  cities={cities}
                  districts={districts}
                  currentCity={currentCity}
                  setValue={setValue}
                  trigger={trigger}
                  handleSyncMemberData={handleSyncMemberData}
                />
                {/* 付款資料 */}
                <PaymentSection
                  register={register}
                  errors={errors}
                  control={control}
                  creditCardMonths={creditCardMonths}
                  creditCardYears={creditCardYears}
                  handleCardNumberChange={handleCardNumberChange}
                  getValues={getValues}
                  trigger={trigger}
                  matchedSavedCard={matchedSavedCard}
                />

                {/* 索取發票 */}
                <section className="cart-panel p-4 p-lg-6 mb-2 mb-lg-6">
                  <h2 className="cart-section-title mb-6">索取發票</h2>
                  <label htmlFor="invoice_info" className="form-label px-2">
                    發票類型
                  </label>
                  <InvoiceSection
                    register={register}
                    control={control}
                    errors={errors}
                    watch={watch}
                    setValue={setValue}
                    clearErrors={clearErrors}
                  />
                </section>

                {/* 訂閱備註 */}
                <section className="cart-panel p-4 p-lg-6 mb-2 mb-lg-6">
                  <h2 className="cart-section-title mb-6">訂閱備註</h2>
                  <div className="mb-4 mb-lg-6">
                    <div
                      className={`form-group-filled note-group ${errors.note ? 'border border-semantic-error' : ''}`}
                    >
                      <textarea
                        id="note"
                        className="form-control mb-3"
                        placeholder="有什麼想告訴我們的嗎？"
                        {...register('note', {
                          maxLength: {
                            value: 200,
                            message: '備註內容過長，請精簡至 200 字以內。',
                          },
                        })}
                      />
                      <div className="note-count text-end text-neutral-600">
                        <span className="current-count">{currentNote.length}</span>
                        <span className="total-count"> / 200</span>
                      </div>
                    </div>
                    {/*錯誤訊息 */}
                    {errors.note && (
                      <div className="px-2 error-message text-semantic-error mt-2">
                        <Icon
                          className="me-2"
                          icon="gridicons:notice-outline"
                          width="16"
                          height="16"
                        ></Icon>
                        {errors.note.message}
                      </div>
                    )}
                  </div>
                  {/* 快選備註 */}
                  <div className="order-note d-flex flex-wrap gap-2">
                    {quickNoteChips.map((chip, index) => (
                      <button
                        className={`btn btn-chip lh-sm ${selectedChips.includes(chip) ? 'active' : ''}`}
                        type="button"
                        key={index}
                        onClick={() => toggleChip(chip)}
                      >
                        <Icon className="me-1" icon="ic:round-plus" width="16" height="16"></Icon>
                        {chip}
                      </button>
                    ))}
                  </div>
                </section>
              </div>
              <div className="col-lg-4 px-0 px-lg-3">
                {/* 訂單明細 */}
                <OrderSummary
                  cartItems={enrichedCartItems}
                  displayCart={displayCart}
                  isSubmitting={isSubmitting}
                  isLoading={isLoading}
                />
                <section className="py-4 px-3 p-lg-8 cart-notice">
                  <h3 className="mb-3 mb-lg-4">購物須知</h3>
                  <ol>
                    <li className="mb-2">
                      註冊會員即可獲得 NT$100 入會購物金，立即加入會員，享受專屬優惠！
                    </li>
                    <li className="mb-2">
                      台灣地區訂單將於 7–10 個工作日
                      出貨（週末及國定假日順延）。如商品頁面標示為「預購商品」，則依照該頁公告日期出貨。
                    </li>
                  </ol>
                </section>
              </div>
            </div>
          </form>
          <div className="checkout-btn d-block d-sm-none">
            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              form="checkoutForm"
              className="btn-primary-text w-100"
            >
              {isSubmitting ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  處理中...
                </>
              ) : (
                '確認支付並下單'
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default CartCheckout;
