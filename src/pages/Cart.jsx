import useAuth from "../../hooks/useAuth";
import { useEffect, useState, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import api from "../api";
import { Icon } from "@iconify/react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

// 台灣時間
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Taipei");


function Cart() {
    const navigate = useNavigate();
    const { user, isLogin } = useAuth();
    const [cartMain, setCartMain] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [plans, setPlans] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [couponCode, setCouponCode] = useState("");
    const [discountTotal, setDiscountTotal] = useState(0);
    const [couponId, setCouponId] = useState(null);
    const [isRemoving, setIsRemoving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [openDropdownId, setOpenDropdownId] = useState(null);
    const timerRefs = useRef({});
    const cartItemsRef = useRef(cartItems);
    const discountTotalRef = useRef(0);
    const couponIdRef = useRef(null);
    const deletingItemsRef = useRef(new Set());
    const currentUserId = user?.id;
    const currentTwTime = dayjs().format('YYYY-MM-DDTHH:mm:ss.SSSZ');

    // 保持 Refs 與 最新 State 同步
    useEffect(() => {
        cartItemsRef.current = cartItems;
        discountTotalRef.current = discountTotal;
        couponIdRef.current = couponId;
    }, [cartItems, discountTotal, couponId]);

    useEffect(() => {
        const timers = timerRefs.current;

        return () => {
            // 取出 timerRefs 內所有的計時器 ID 並逐一清除
            Object.values(timers).forEach((timerId) => {
              if (timerId) clearTimeout(timerId);
            });
        };
    }, []);

    useEffect(() => {
      if (!isLogin) {
        navigate('/login');
        return;
      }

      const fetchData = async () => {
        try {
          const cartRes = await api.get(
            `/carts?userId=${currentUserId}&_embed=cart_items`,
          );
          const userCart = cartRes.data[0];
          setCartMain(userCart);

          if (userCart) {
            setCartMain(userCart);
            setDiscountTotal(userCart.discountTotal || 0);
            setCouponId(userCart.couponId || null);

            const [themesRes, plansRes] = await Promise.all([
              api.get('/themes'),
              api.get('/plans'),
            ]);
            const plansData = plansRes.data;
            const themesData = themesRes.data;
            setPlans(plansData);

            // 資料組合 (Cart > cart_items > plan + theme)
            const enrichedItems = userCart.cart_items.map((item) => {
              const planDetail = plansData.find((p) => p.id === item.planId);
              const themeDetail = themesData.find(
                (t) => t.id === planDetail?.themeId,
              );
              return {
                ...item,
                plan: planDetail || null,
                theme: themeDetail || null,
              };
            });
            setCartItems(enrichedItems);
          }
        } catch (err) {
          console.error('資料讀取失敗', err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }, [isLogin, currentUserId, navigate]);

    const syncCartTotals = async (currentCouponId) => {
        if (!cartMain) return;

        const currentTwTime = dayjs().format('YYYY-MM-DDTHH:mm:ss.SSSZ');

        // 確保前端的 cartMain 狀態與資料庫一致
        setCartMain(prev => ({
            ...prev,
            couponId: currentCouponId,
            updatedAt: currentTwTime
        }));
    };

    // 計算及時金額
    const subTotal = cartItems.reduce((sum, item) => sum + (item.plan?.discountPrice || 0) * item.quantity, 0);
    const finalTotal = Math.max(0, subTotal - discountTotal);

    // 移除商品
    const handleRemove = async (itemId) => {

        if (isRemoving || deletingItemsRef.current.has(itemId)) {
            console.warn(`重複點擊或正在刪除中，itemId: ${itemId} 執行緒被攔截`);
            return;
        }
        deletingItemsRef.current.add(itemId);
        try {

            await api.delete(`/cart_items/${itemId}`);
            const newCartItems = cartItems.filter(item => item.id !== itemId);
            setCartItems(newCartItems);
            syncCartTotals(couponIdRef.current);

        } catch (err) {
            console.error("刪除失敗", err);
            console.error(`刪除 itemId: ${itemId} 失敗，錯誤詳細資訊:`, err);
        } finally {
            setTimeout(() => {
                deletingItemsRef.current.delete(itemId);
                setIsRemoving(false);

            }, 100);
        }
    };


    // 編輯數量(防抖 & 樂觀更新)
    const handleQuantityChange = async (itemId, delta) => {

        const target = cartItems.find(item => item.id === itemId);
        if (!target) return;

        const newQty = target.quantity + delta;

        if (newQty === 0) {
            if (timerRefs.current[itemId]) {
                clearTimeout(timerRefs.current[itemId]);
                delete timerRefs.current[itemId];
            }
            handleRemove(itemId);
            return;
        }

        if (newQty < 1) return;
        if (target.quantity === newQty) return;

        // A. 樂觀更新: 立刻更新前端畫面與方案資料(不發API)
        setCartItems(prev => prev.map(item =>
            item.id === itemId
                ? { ...item, quantity: newQty } : item
        ));

        // B.防抖攔截
        // 若 500ms 內使用者再次點擊，則清除前一次的計時器
        if (timerRefs.current[itemId]) {
            clearTimeout(timerRefs.current[itemId]);
        }

        // 重設定時器
        timerRefs.current[itemId] = setTimeout(async () => {
            try {
                await api.patch(`/cart_items/${itemId}`, { quantity: newQty, updatedAt: currentTwTime });

                await syncCartTotals(couponIdRef.current);

            } catch (err) {
                console.error("更新數量失敗", err);
                // 錯誤回滾 Rollback (退回操作前狀態)
                setCartItems(prev => prev.map(item =>
                    item.id === itemId ? { ...item, quantity: target.quantity } : item
                ))
            } finally {
                delete timerRefs.current[itemId];

            }
        }, 500)

    };

    // 編輯方案
    const handlePlanChange = async (itemId, newPlanId) => {

        // 備份操作前狀態
        const previousItems = cartItemsRef.current;
        const newPlanDetail = plans.find(p => p.id === newPlanId);

        // 樂觀更新: 立刻更新前端畫面與方案資料(不發API)
        const newCartItems = previousItems.map(item =>
            item.id === itemId
                ? { ...item, planId: newPlanId, plan: newPlanDetail }
                : item
        );
        setCartItems(newCartItems);

        try {
            await api.patch(`/cart_items/${itemId}`, { planId: newPlanId, updatedAt: currentTwTime })
            await syncCartTotals(couponIdRef.current);

        } catch (err) {
            console.error("更新方案失敗", err)
            setCartItems(previousItems); //錯誤回滾
        }
    };

    // 套用優惠代碼
    const handleApplyCoupon = async () => {
        try {
            const res = await api.get("/coupons");
            const coupons = res.data;
            const coupon = coupons.find(c => c.code === couponCode.trim());

            if (!coupon || !coupon.isActive) {
                setError("此優惠代碼無效。");
                setSuccess(false);
                setDiscountTotal(0);
                setCouponId(null);
                return;
            }

            if (new Date(coupon.expiryDate) < new Date()) {
                setError("此優惠代碼已過期。");
                setSuccess(false);
                setDiscountTotal(0);
                setCouponId(null);
                return;
            }

            if (subTotal < coupon.minSpend) {
                setError(`需滿 ${coupon.minSpend} 元才能使用此代碼。`);
                setSuccess(false);
                setDiscountTotal(0);
                setCouponId(null);
                return;
            }

            let discount = 0;
            if (coupon.type === "fixed") {
                discount = coupon.discountValue;
            } else if (coupon.type === "percentage") {
                discount = subTotal * (1 - coupon.discountValue);
            }

            const finalDiscount = Math.round(discount);

            setDiscountTotal(Math.round(discount));
            setCouponId(coupon.id);
            setSuccess(true);
            setError("");

            await api.patch(`/carts/${cartMain.id}`, {
                couponId: coupon.id,
                discountTotal: finalDiscount,
                updatedAt: currentTwTime
            });
            setCartMain(prev => ({ ...prev, couponId: coupon.id, discountTotal: finalDiscount }));

            syncCartTotals(coupon.id);

        } catch (err) {
            console.error("優惠代碼驗證失敗。", err);
            setError("驗證過程發生錯誤。");
        }
    };

    // 刪除已套用優惠
    const handleCancelCoupon = async () => {
        try {
            setCouponCode("");
            setDiscountTotal(0);
            setCouponId(null);
            setSuccess(false);
            setError("");

            await api.put(`/carts/${cartMain.id}`, {
                id: cartMain.id,
                userId: cartMain.userId,
                discountTotal: 0,
                createdAt: cartMain.createdAt,
                updatedAt: currentTwTime
            });
            setCartMain(prev => {
                // { key: _ } 為 JS 慣例寫法，會忽略這個變數，避免 ESLint 警告提示
                const { couponId: _, ...rest } = prev;  // couponId 從 state 移除，避免 delete 報錯
                return { ...rest, discountTotal: 0, updatedAt: currentTwTime };
            });

            syncCartTotals(null);

        } catch (err) {
            console.error("取消優惠代碼失敗。", err);
            setError("取消優惠代碼發生錯誤。");
        }
    };

    // 前往結帳(更新carts資料表+導航)
    const handleGoToCheckout = async () => {
        if (!cartMain || cartItems.length === 0) return;
        try {
            await api.patch(`/carts/${cartMain.id}`, {
                ...(couponId && { couponId }),
                discountTotal,
                updatedAt: currentTwTime
            });
            navigate("/cartCheckout");
        } catch (err) {
            console.error("更新購物車總金額失敗", err);
        }
    }
    // 切換下拉選單顯示/隱藏
    useEffect(() => {
        const handleClickOutside = () => setOpenDropdownId(null);
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, [])

    const toggleDropdown = (itemId) => {
        setOpenDropdownId(prevId => prevId === itemId ? null : itemId);
    }

    if (isLoading) {
        return (
            <main className="bg-neutral-300 d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
                {/*  Bootstrap 內建的 Spinner 載入動畫 */}
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">載入中...</span>
                </div>
            </main>
        );
    }
    const isEmptyCart = cartItems.length === 0;

    //空購物車
    if (isEmptyCart) {
        return (
            <main className="bg-neutral-300">
                <div className="empty-cart-main bg-empty-cart">
                    <div className="container px-0">
                        <h1 className="cart-title p-3 py-lg-2 px-lg-4 cart-empty">購物車</h1>
                        <div className="empty-cart-wrapper text-center">
                            <div className="empty-cart-img mx-auto mb-6 mb-sm-8">
                                <img src="./images/Cart_Page/pic_empty.svg" alt="空的購物車圖片" />
                            </div>
                            <h1 className="empty-cart-title mb-2">購物車裡還沒有甜點呢</h1>
                            <p className="lh-base mb-6 mb-sm-8">快來挑選一盒，讓生活多一點甜</p>

                            <Link to="/themedetail/1" className="btn-primary-icon fw-bold px-lg-8">
                                帶我去挑甜點
                                <svg className="ms-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M15 7.586L22.414 15H2v-2h15.586l-4-4z" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    // 一般購物車
    return (
      <>
        <main className="bg-neutral-300 cart-body">
          <div className="cart-main">
            <ol className="stepper mx-auto d-flex justify-content-center align-items-center">
              <li className="step-item d-flex flex-column align-items-center active">
                <div className="step mb-2">1</div>
                <span className="step-intro">購物車</span>
              </li>
              <li className="step-item d-flex flex-column align-items-center">
                <div className="step mb-2">2</div>
                <span className="step-intro">填寫資料</span>
              </li>
              <li className="step-item d-flex flex-column align-items-center">
                <div className="step mb-2">3</div>
                <span className="step-intro">完成訂閱</span>
              </li>
            </ol>
            <form className="container px-3 p-lg-0" onSubmit={(e) => e.preventDefault()}>
              <div className="d-flex justify-content-between align-items-center mb-2 mb-lg-6">
                <h1 className="cart-title p-3 py-lg-2 px-lg-4">購物車</h1>
                <NavLink
                  to={`/themedetail/1`}
                  className="btn py-3 px-4 px-lg-8 border-0 btn-shopping"
                >
                  繼續購物
                </NavLink>
              </div>
              <div className="row mx-0 mx-sm-n3">
                <div className="col-lg-8 px-0 px-lg-4 mb-2 mb-lg-0">
                  <ul className="cart-list cart-panel p-lg-4 px-0 py-4">
                    {cartItems.map((item) => (
                      <li key={item.id} className="d-flex align-items-center cart-item">
                        <img
                          className="rounded-4 me-3 me-lg-6 d-block theme-img"
                          src={item.theme?.images?.square}
                          alt={`${item.theme?.title}圖片`}
                        />
                        <div className="cart-intro">
                          <div className="d-flex justify-content-between align-items-center px-2 mb-2">
                            <h2 className="fs-7 lh-sm fw-bold ls-1">{item.theme?.title}甜點盒</h2>
                            <button
                              type="button"
                              className="btn p-0 btn-remove ${isRemoving ? 'opacity-50' : ''}`"
                              onClick={() => handleRemove(item.id)}
                              disabled={isRemoving}
                            >
                              移除
                            </button>
                          </div>
                          {/* 方案選單 */}
                          <div className="dropdown plan-dropdown mb-2">
                            <button
                              className="btn dropdown-toggle border-0 d-flex align-items-center me-1"
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleDropdown(item.id);
                              }}
                            >
                              <span className="me-1">{item.plan?.durationMonths} 個月訂閱方案</span>
                              <Icon icon="iconamoon:arrow-down-2-light" width="16" height="16" />
                            </button>
                            {openDropdownId === item.id && (
                              <ul className="dropdown-menu show">
                                {plans
                                  .filter((p) => p.themeId === item.theme?.id)
                                  .map((plan) => (
                                    <li key={plan.id}>
                                      <button
                                        className="dropdown-item"
                                        type="button"
                                        onClick={() => {
                                          handlePlanChange(item.id, plan.id);
                                          setOpenDropdownId(null);
                                        }}
                                      >
                                        {plan.durationMonths} 個月訂閱方案
                                      </button>
                                    </li>
                                  ))}
                              </ul>
                            )}
                          </div>
                          <p className="px-2 theme-price mb-2 mb-sm-4">
                            單價：NT${item.plan?.discountPrice} / 盒
                          </p>
                          <div className="d-flex justify-content-between">
                            <span className="theme-total-price">
                              NT${item.plan?.discountPrice * item.quantity}
                            </span>
                            <div className="px-2 d-flex align-items-center">
                              <button
                                type="button"
                                className={`btn-minus ${item.quantity <= 1 ? 'text-neutral-500' : ''}`}
                                onClick={() => handleQuantityChange(item.id, -1)}
                                disabled={item.quantity <= 1}
                              >
                                <Icon icon="tabler:minus" width="24" height="24" />
                              </button>
                              <span className="py-2 px-4 mx-1">{item.quantity}</span>
                              <button
                                type="button"
                                className="btn-plus"
                                onClick={() => handleQuantityChange(item.id, +1)}
                              >
                                <Icon icon="tabler:plus" width="24" height="24" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="col-lg-4 px-0 px-lg-3">
                  <section className="cart-panel py-4 px-3 p-lg-8 mb-2 mb-lg-6">
                    <h2 className="cart-section-title mb-3 mb-lg-6">優惠代碼</h2>
                    <div className="input-group form-group-outline">
                      <span className="input-group-text ps-2 my-2 ms-2">
                        <Icon icon="tabler:tag-filled" width="24" height="24" />
                      </span>
                      <input
                        type="text"
                        className={`form-control ps-2 py-0 pe-0 ${success ? 'text-cta' : ''}`}
                        placeholder="請輸入優惠代碼"
                        aria-label="優惠代碼"
                        aria-describedby="button-addon2"
                        name="discount_number"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleApplyCoupon();
                          }
                        }}
                        disabled={success}
                      />
                      {/* 👈 動態渲染按鈕：依據 success 狀態切換「取消」與「套用」 */}
                      {success ? (
                        <button
                          className="btn d-block border-0 text-neutral-600"
                          type="button"
                          onClick={handleCancelCoupon}
                        >
                          取消
                        </button>
                      ) : (
                        <button
                          className="btn d-block border-0"
                          type="button"
                          onClick={handleApplyCoupon}
                          disabled={!couponCode.trim()}
                        >
                          套用
                        </button>
                      )}
                    </div>

                    {error && (
                      <div className="px-2 error-message text-semantic-error">
                        <Icon
                          className="me-2"
                          icon="gridicons:notice-outline"
                          width="16"
                          height="16"
                        />
                        {error}
                      </div>
                    )}
                  </section>
                  <section className="cart-panel py-4 px-3 p-lg-8 mb-2 mb-lg-6">
                    <h2 className="cart-section-title mb-3 mb-lg-6">訂單資料</h2>
                    <div className="px-2 px-lg-0 mb-0 mb-sm-6">
                      {/* 商品總數 */}
                      <p className="lh-base mb-2">
                        共 {cartItems.reduce((sum, i) => sum + Number(i.quantity), 0)} 件商品
                      </p>

                      {/* 商品清單 */}
                      <ul className="ps-4 subscription-list mb-6">
                        {cartItems.map((item) => {
                          return (
                            <li key={item.id}>
                              <span className="me-4">
                                {item.theme?.title}甜點盒
                                <span className="mx-1">-</span>
                                {item.plan?.durationMonths} 個月訂閱方案
                              </span>
                              <span>x {item.quantity}</span>
                            </li>
                          );
                        })}
                      </ul>

                      {/* 小計、折扣、合計 */}
                      <div className="lh-base pb-6 mb-6 border-bottom border-neutral-400">
                        <p className="d-flex justify-content-between align-items-center mb-2">
                          <span>小計</span>
                          <span>NT${subTotal}</span>
                        </p>
                        <p className="d-flex justify-content-between align-items-center">
                          <span>
                            折扣
                            {success && <span className="ms-2 text-cta-200">{couponCode}</span>}
                          </span>
                          <span className="text-cta-200">- NT${discountTotal}</span>
                        </p>
                      </div>
                      <p className="d-flex justify-content-between align-items-center lh-sm ls-1 fw-bold">
                        <span>合計</span>
                        <span className="fs-5 lh-base ls-1">NT${finalTotal}</span>
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleGoToCheckout}
                      className="btn-primary-text w-100 d-none d-sm-block text-center"
                    >
                      前往結帳
                    </button>
                  </section>

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
                type="button"
                onClick={handleGoToCheckout}
                className="btn-primary-text w-100 text-center d-block"
              >
                前往結帳
              </button>
            </div>
          </div>
        </main>
      </>
    );
}
export default Cart;
