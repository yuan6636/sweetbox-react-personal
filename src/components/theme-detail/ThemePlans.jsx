// 外部工具
import { Swiper, SwiperSlide } from 'swiper/react';
import { Thumbs, Autoplay, FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/free-mode';
import 'swiper/css/thumbs';
import { useEffect, useState, useRef } from 'react';
import { useParams, NavLink, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { message } from 'antd';

// 內部元件
import api from '../../api';
import SideMenuFloat from '../../components/SideMenuFloat';
import Loading from '../../components/Loading';
import ThemeDesktopSwiper from './ThemeDesktopSwiper';

// hook
import useThemeData from '../../hooks/useThemeData';
import { useCart } from '../../contexts/cart';

// data
import { usageTips } from './mockData';

// 台灣時間
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Asia/Taipei');

function ThemePlans() {
  const { id } = useParams();
  const [activePlan, setActivePlan] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
  const { themes, currentTheme, isLoading } = useThemeData(id, setActivePlan);
  const { refreshCart } = useCart();

  const mainSwiperRef = useRef(null);
  const thumbsSwiperRef = useRef(null);
  const mobileSwiperRef = useRef(null);
  const lastMenuItemRef = useRef(null);

  const handleSubscribe = async () => {
    if (!activePlan || !currentTheme) return;

    try {
      // 取得使用者資料
      const userData = localStorage.getItem('user');
      const userObj = userData ? JSON.parse(userData) : null;

      if (!userObj) {
        message.warning('請先登入或註冊會員！');
        navigate('/login');
        return;
      }
      // 先抓購物車
      const res = await api.get('/carts');
      let cart = res.data.find((c) => c.userId === userObj.id);

      // 如果沒有購物車，建立一筆新的
      if (!cart) {
        cart = {
          userId: userObj.id,
          createdAt: new Date().toISOString(),
        };

        const cartRes = await api.post('/carts', cart);
        cart = cartRes.data;
      }

      // 取得 cart_items
      const itemsRes = await api.get('/cart_items');
      const cartItems = itemsRes.data.filter((item) => item.cartId === cart.id);

      const existingItem = cartItems.find((item) => item.planId === activePlan.id);

      let updatedCart;
      if (existingItem) {
        const updatedItem = {
          ...existingItem,
          quantity: existingItem.quantity + quantity,
        };

        await api.put(`/cart_items/${existingItem.id}`, updatedItem);

        updatedCart = {
          ...cart,
          updatedAt: dayjs().format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
        };
      } else {
        const newCartItem = {
          cartId: cart.id,
          planId: activePlan.id,
          quantity,
        };

        await api.post('/cart_items', newCartItem);

        updatedCart = {
          ...cart,
          updatedAt: dayjs().format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
        };
      }

      await api.put(`/carts/${cart.id}`, updatedCart);

      await refreshCart();
      navigate('/cart');
    } catch (err) {
      console.error('錯誤:', err);
    }
  };

  useEffect(() => {
    // 主題切換後，重製 Swiper 到第一張(speed = 0 表示瞬間跳轉，不播放滑動動畫)
    if (mainSwiperRef.current && thumbsSwiperRef.current) {
      // 主題詳細大圖
      mainSwiperRef.current.slideToLoop(0, 0);
      // 主題詳細小圖
      thumbsSwiperRef.current.slideToLoop(0, 0);
    }

    // 手機版
    if (mobileSwiperRef.current) {
      // 增加時間回到第一張主題圖，避免切換主題停止 autoplay
      mobileSwiperRef.current.slideToLoop(0, 10);
    }
  }, [id]);

  return (
    <section className="pie-bg">
      {isLoading ? (
        <Loading text="載入甜點主題中..." />
      ) : (
        <>
          {/* 主題選單-mobile */}
          <div className="theme-menu">
            <ul className="nav side-menu gap-2 py-2 px-3">
              {themes.map((theme) => {
                const { id, title } = theme;
                return (
                  <li key={id} className="nav-item">
                    <NavLink
                      to={`/themeDetail/${id}`}
                      className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
                    >
                      {title}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
          {/* 主題 swiper-mobile */}
          <div className="mt-19 d-lg-none">
            {currentTheme && (
              <Swiper
                className="theme-detail-pics-sm"
                modules={[Autoplay]}
                autoplay={{ delay: 1000, disableOnInteraction: false }}
                grabCursor={true}
                loop
                onSwiper={(swiper) => {
                  mobileSwiperRef.current = swiper;
                }}
              >
                {currentTheme?.images.detail.map((image, index) => (
                  <SwiperSlide key={index}>
                    <img src={image} alt={`${currentTheme.title}圖片}`} />
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </div>
          {/* 內容：主題menu + 訂閱方案 */}
          <div className="container py-lg-11">
            {/* 桌機 side-menu-float */}
            {/* scroll up才顯示  */}
            <SideMenuFloat themes={themes} lastMenuItemRef={lastMenuItemRef} />
            <div className="row">
              {/* 左區塊：Menu + Swiper */}
              <div className="col-xl-8 col-lg-7">
                <div className="d-flex">
                  {/*  menu */}
                  <nav className="me-lg-6 d-none d-lg-block">
                    <h5 className="fw-bold fs-lg-7 text-nowrap ls-1 py-lg-5 ps-2">主題一覽</h5>
                    <ul className="nav flex-column side-menu">
                      {themes.map((theme, index) => {
                        const { id, title } = theme;
                        return (
                          <li
                            key={id}
                            className="nav-item"
                            ref={index === themes.length - 1 ? lastMenuItemRef : null}
                          >
                            <NavLink
                              to={`/themeDetail/${id}`}
                              className={({ isActive }) =>
                                'nav-link d-flex align-items-center' + (isActive ? ' active' : '')
                              }
                            >
                              {title}
                            </NavLink>
                          </li>
                        );
                      })}
                    </ul>
                  </nav>
                  {/* 中間 Swiper */}
                  <div className="theme-detail-pics d-lg-block d-none flex-grow-1">
                    <ThemeDesktopSwiper
                      currentTheme={currentTheme}
                      mainSwiperRef={mainSwiperRef}
                      thumbsSwiperRef={thumbsSwiperRef}
                    />
                  </div>
                </div>
              </div>

              {/* 右區塊：訂閱方案 */}
              <div className="col-xl-4 col-lg-5 plan-opts mb-17 mb-lg-11 pt-6 pt-lg-4 px-lg-5">
                <div className="mb-9 mb-lg-5">
                  <div className="theme-topic">
                    <h1 className="mb-5 fs-3 fs-lg-2 fw-bold ls-1">{`${currentTheme?.title}盒`}</h1>
                    <h2 className="mb-3 fs-7 ls-1 fw-bold">{`${currentTheme?.subtitle}`}</h2>
                    <p>{`${currentTheme?.description}`}</p>
                  </div>
                  <div className="plan-area">
                    {/* plan選項 */}

                    <ul className="my-6">
                      {currentTheme?.plans?.map((plan, idx) => {
                        // 原始價 - 優惠價，算出節省金額
                        const savedAmount = plan.originalPrice - plan.discountPrice;

                        return (
                          <li key={plan.id} className="mb-3">
                            <button
                              className={`card-plan ${activePlan?.id === plan.id ? 'active' : ''}`}
                              type="button"
                              onClick={() => setActivePlan(plan)}
                            >
                              <div className="subtitle">
                                <p>
                                  {idx === 0 ? '初嚐首選' : idx === 1 ? '人氣推薦' : '鑑賞家專屬'}
                                </p>
                                <p className="text-cta-200">節省 ${savedAmount}</p>
                              </div>
                              <div className="title">
                                <p>{plan.durationMonths} 個月方案</p>
                                <p className="align-bottom">
                                  NT$ {plan.discountPrice}
                                  <span>/月</span>
                                </p>
                              </div>
                            </button>
                          </li>
                        );
                      })}
                    </ul>

                    {/* 數量 */}
                    <div className="quantity mb-lg-6 d-flex align-items-center">
                      {/* 減少按鈕 */}
                      <button
                        className="btn-icon-lg"
                        type="button"
                        aria-label="Decrease"
                        onClick={() => setQuantity((prev) => Math.max(prev - 1, 1))}
                        disabled={quantity <= 1}
                      >
                        <Icon className="sub" icon="ic:round-minus" width="24" height="24" />
                      </button>

                      {/* spinner 顯示數量 */}
                      <input
                        className="spinner mx-3 fs-7 fw-bold ls-1 border-0 bg-transparent text-center"
                        type="text"
                        role="spinbutton"
                        aria-live="assertive"
                        aria-valuenow={quantity}
                        value={quantity}
                        readOnly
                      />

                      {/* 增加按鈕 */}
                      <button
                        className="btn-icon-lg"
                        type="button"
                        aria-label="Increase"
                        onClick={() => setQuantity((prev) => prev + 1)}
                      >
                        <Icon className="sub" icon="ic:round-plus" width="24" height="24" />
                      </button>
                    </div>

                    {/* 訂閱按鈕固定欄位 */}
                    <div className="subscribe-fixed-bar d-flex justify-content-between align-items-center">
                      <div className="pb-4">
                        {/* 節省金額 */}
                        <p className="mb-1 fs-9 text-cta-200">
                          {activePlan
                            ? `節省 $${(activePlan.originalPrice - activePlan.discountPrice) * quantity}`
                            : ''}
                        </p>
                        {/* 總金額 */}
                        <p className="fs-4 fw-bold ls-1">
                          {activePlan ? `NT$ ${activePlan.discountPrice * quantity}` : ''}
                        </p>
                      </div>
                      <div className="pt-3">
                        <button
                          type="button"
                          className="btn-primary-icon align-items-center ls-1 lh-sm"
                          onClick={handleSubscribe}
                          disabled={!activePlan}
                        >
                          立刻訂閱
                          <Icon className="ms-2" icon="tdesign:swap-right" width="24" height="24" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                {/* 食用建議advice */}
                <div className="advice px-3 px-lg-0">
                  <h6 className="ls-1 fw-bold fs-7 mb-5">食用建議</h6>
                  <ul>
                    {usageTips.map((tip) => (
                      <li key={tip.icon} className="fs-8 mb-2 d-flex align-items-center">
                        <img
                          className="me-3"
                          src={`./images/Theme_Detail/Feature/${tip.icon}.svg`}
                          alt={tip.alt}
                        />
                        <p>{tip.text}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

export default ThemePlans;
