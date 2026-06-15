import { Swiper, SwiperSlide } from 'swiper/react';
import { Thumbs, Autoplay, FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/free-mode';
import 'swiper/css/thumbs';
import { useEffect, useState, Fragment, useRef } from 'react';
import { useParams, NavLink, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

import api from '../api';
import SideMenuFloat from '../components/SideMenuFloat';
import Pagination from '../components/Pagination';
import Dropdown from '../components/Dropdown';
import ReviewItem from '../components/theme-detail/ReviewItem';
import Loading from '../components/Loading';

// 台灣時間
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Asia/Taipei');

const themes = [
  { id: 1, label: '精選甜點' },
  { id: 2, label: '季節限定' },
  { id: 3, label: '在地甜點' },
  { id: 4, label: '異國風味' },
  { id: 5, label: '無負擔甜點' },
  { id: 6, label: '素食甜點' },
];

// 食用建議
const usageTips = [
  { icon: 'Icon_openbook', alt: 'openbook icon', text: '開箱後，請先確認甜點品項與保存方式' },
  { icon: 'Icon_tea-cup', alt: 'tea-cup icon', text: '搭配一杯茶或咖啡，更能襯托出甜點的風味' },
  { icon: 'Icon_curtain', alt: 'curtain icon', text: '常溫甜點請置於陰涼乾燥處保存' },
  { icon: 'Icon_eat', alt: 'eat icon', text: '開封後建議盡快食用，以確保最佳風味' },
];

// 甜點特色
const featureCards = [
  {
    icon: 'Icon_popular',
    alt: '熱門話題甜點',
    title: '熱門話題甜點',
    description: '壓扁可頌、脆皮泡芙、爆紅 8 字蛋捲等近期甜點圈的明星商品',
  },
  {
    icon: 'Icon_brand',
    alt: '品牌聯名限定',
    title: '品牌聯名限定',
    description: '甜點品牌與飲品、文創等聯名合作款，期間限定風味搶先嚐',
  },
  {
    icon: 'Icon_classic',
    alt: '經典人氣烘焙',
    title: '經典人氣烘焙',
    description: '布朗尼、磅蛋糕、餅乾、蛋捲等口感豐富、常溫好保存的精緻選擇',
  },
];

// 第一盒甜
const firstSweetBox = [
  {
    id: 1,
    name: '奶油夾心餅',
    enName: 'Butterly Cookies',
    desc: '鬆脆餅乾夾入濃郁奶油餡，層次豐富。酥香與滑順並存，入口充滿溫潤奶香。',
    img: {
      mobile: './images/Theme_Detail/Feature/pic_cookie_mobile.jpg',
      desktop: './images/Theme_Detail/Feature/pic_cookie_desktop.jpg',
    },
  },
  {
    id: 2,
    name: '經典濃巧布朗尼',
    enName: 'Choco & Mood',
    desc: '嚴選比利時 70% 黑巧克力與法國奶油，加入核桃與海鹽，甜中帶苦，層次迷人。',
    img: {
      mobile: './images/Theme_Detail/Feature/pic_brownie_mobile.jpg',
      desktop: './images/Theme_Detail/Feature/pic_brownie_desktop.jpg',
    },
  },
  {
    id: 3,
    name: '經典椒鹽餅乾',
    enName: 'Salt&Crust Bakery',
    desc: '外層撒上細緻椒鹽，酥脆中帶有鹹香，簡單卻耐吃，讓人一口接一口的經典小食。',
    img: {
      mobile: './images/Theme_Detail/Feature/pic_pretzels_mobile.jpg',
      desktop: './images/Theme_Detail/Feature/pic_pretzels_desktop.jpg',
    },
  },
  {
    id: 4,
    name: '開心果牛軋糖',
    enName: 'Pistachio Lane',
    desc: '以綿軟牛軋糖揉入滿滿開心果仁。堅果香脆與甜蜜嚼感，讓人愈嚼愈香。',
    img: {
      mobile: './images/Theme_Detail/Feature/pic_candy_mobile.jpg',
      desktop: './images/Theme_Detail/Feature/pic_candy_desktop.jpg',
    },
  },
  {
    id: 5,
    name: '草莓雪球',
    enName: 'Snowberry Patisserie',
    desc: '滿佈糖粉的雪球外型，入口酥鬆輕盈。帶有淡雅草莓香氣，甜美而不膩。',
    img: {
      mobile: './images/Theme_Detail/Feature/pic_snowball_mobile.jpg',
      desktop: './images/Theme_Detail/Feature/pic_snowball_desktop.jpg',
    },
  },
  {
    id: 6,
    name: '醇厚奶香磅蛋糕',
    enName: 'Heritage Pound Cake Co.',
    desc: '傳統比例製作，口感綿密紮實。濃厚奶油香氣，經典耐吃不退流行。',
    img: {
      mobile: './images/Theme_Detail/Feature/pic_cake_mobile.jpg',
      desktop: './images/Theme_Detail/Feature/pic_cake_desktop.jpg',
    },
  },
  {
    id: 7,
    name: '經典手工蛋捲',
    enName: 'Choco & Mood',
    desc: '手工蛋捲，層層酥香，每一口都保留傳統蛋香，清雅迷人，簡單卻令人回味無窮。',
    img: {
      mobile: './images/Theme_Detail/Feature/pic_eggroll_mobile.jpg',
      desktop: './images/Theme_Detail/Feature/pic_eggroll_desktop.jpg',
    },
  },
  {
    id: 8,
    name: '焦糖綜合堅果塔',
    enName: 'Caramel & Nut Atelier',
    desc: '以焦糖拌炒多種堅果，填入香酥塔皮。層層堆疊的堅果香氣，口感豐富紮實。',
    img: {
      mobile: './images/Theme_Detail/Feature/pic_tart_mobile.jpg',
      desktop: './images/Theme_Detail/Feature/pic_tart_desktop.jpg',
    },
  },
  {
    id: 9,
    name: '花生麻糬',
    enName: 'Mochi & Nut House',
    desc: '軟Q麻糬包裹綿密花生餡，香濃順口。經典台式甜點，軟糯與堅果香完美交織。',
    img: {
      mobile: './images/Theme_Detail/Feature/pic_mochi_mobile.jpg',
      desktop: './images/Theme_Detail/Feature/pic_mochi_desktop.jpg',
    },
  },
];

const ratingDistribution = [
  { star: 5, count: 5050, percent: '80%' },
  { star: 4, count: 700, percent: '12%' },
  { star: 3, count: 150, percent: '5%' },
  { star: 2, count: 30, percent: '2%' },
  { star: 1, count: 7, percent: '1%' },
];

// 評論分享選單
const desktopCategories = [
  { label: '全部', count: 3452, value: '' },
  { label: '精選甜點', count: 1280, value: 'select' },
  { label: '異國風味', count: 742, value: 'global' },
  { label: '季節限定', count: 598, value: 'seasonal' },
  { label: '無負擔甜點', count: 410, value: 'guilt-free' },
  { label: '在地甜點', count: 230, value: 'local' },
  { label: '素食甜點', count: 192, value: 'veggie' },
];

const desktopSortOptions = [
  { label: '評價由高至低', direction: '↓', value: 'desc' },
  { label: '評價由低至高', direction: '↑', value: 'asc' },
];

const mobileCategories = [
  { label: '全部主題', value: '' },
  { label: '精選甜點', value: 'select' },
  { label: '異國風味', value: 'global' },
  { label: '季節限定', value: 'seasonal' },
  { label: '無負擔甜點', value: 'guilt-free' },
  { label: '在地甜點', value: 'local' },
  { label: '素食甜點', value: 'veggie' },
];

const mobileSortOptions = [
  { label: '預設排序', value: '' },
  { label: '評價最高', value: 'desc' },
  { label: '評價最低', value: 'asc' },
];

// 評論區
const reviews = [
  {
    id: 1,
    avatar: './images/Theme_Detail/Feature/custom-1.jpg',
    name: '奶茶抹太厚',
    date: '2025/9/27',
    rating: 5,
    products: '精選甜點盒 (12個月)、在地甜點盒(3個月)',
    title: '終於不用再開甜點單選半天了',
    body: `以前每天滑社群軟體收藏各種甜點照片，看到漂亮的蛋糕、餅乾、布丁就會想試試看，但真的要下單時卻又猶豫半天，最後常常什麼都沒買，收藏清單越來越長卻始終沒動作。有時候甚至會因為選項太多，反而覺得壓力很大，乾脆放棄不買🙈。\n後來開始訂「一盒甜」之後，真的完全解決了我的選擇障礙！每個月的主題都超用心💝，從包裝設計到甜點搭配都很有驚喜感✨。打開盒子的瞬間，就像在拆生日禮物一樣療癒，會忍不住拍照分享給朋友。\n而且最重要的是，吃了好幾個月下來，每次都覺得品質很穩定，完全沒有踩過雷，每個品項都好吃又有特色😍，常常讓我發現新的喜好。現在已經養成習慣，變成每月最期待的小確幸🥰！`,
    images: [
      './images/Theme_Detail/Feature/pic_review 01 (2).jpg',
      './images/Theme_Detail/Feature/pic_review 01 (1).jpg',
      './images/Theme_Detail/Feature/pic_review 01 (3).jpg',
      './images/Theme_Detail/Feature/pic_review 01 (5).jpg',
      './images/Theme_Detail/Feature/pic_review 01 (4).jpg',
      './images/Theme_Detail/Feature/pic_review 01 (2).jpg',
      './images/Theme_Detail/Feature/pic_review 01 (1).jpg',
      './images/Theme_Detail/Feature/pic_review 01 (3).jpg',
      './images/Theme_Detail/Feature/pic_review 01 (5).jpg',
    ],
    initialLikeCount: 3,
  },
  {
    id: 2,
    avatar: './images/Theme_Detail/Feature/custom-2.jpg',
    name: '焦糖人生好焦慮',
    date: '2025/9/20',
    rating: 5,
    products: '精選甜點盒 (6個月)、異國風味甜點盒(3個月)',
    title: '我媽一開始說浪費錢，現在都比我還期待開箱',
    body: '本來是我自己訂的，結果有次甜點分享給家人吃後，我媽居然主動問我「這個月什麼時候送來？」！甜點的品質很好，而且會搭配保存方式與建議食用方式，真的很貼心。',
    images: [
      './images/Theme_Detail/Feature/pic_review 02 (1).jpg',
      './images/Theme_Detail/Feature/pic_review 02 (2).jpg',
      './images/Theme_Detail/Feature/pic_review 02 (3).jpg',
    ],
    initialLikeCount: 0,
  },
  {
    id: 3,
    avatar: './images/Theme_Detail/Feature/custom-3.jpg',
    name: '胖到掉渣女神',
    date: '2025/9/13',
    rating: 4,
    products: '精選甜點盒 (3個月)、無負擔甜點盒(3個月)、季節限定甜點盒(12個月)',
    title: '愛吃甜點也很省腦，一盒甜是我的快樂密碼',
    body: '不是我在誇，一盒甜都懂甜點控在想什麼。不只每次內容都有驚喜，還能吃到那種限時聯名，有種 VIP 搶先嚐的爽感，連同事看到我午茶的甜點都問哪裡買！',
    images: [],
    initialLikeCount: 0,
  },
];

function ThemeDetail() {
  const { id } = useParams();
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [themeData, setThemeData] = useState(null);
  const [activePlan, setActivePlan] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortOption, setSortOption] = useState('desc');
  const [isLoading, setIsLoading] = useState(false);

  const mainSwiperRef = useRef(null);
  const thumbsSwiperRef = useRef(null);
  const mobileSwiperRef = useRef(null);

  const handleSubscribe = async () => {
    if (!activePlan || !themeData) return;
    try {
      // 取得使用者資料
      const userData = localStorage.getItem('user');
      const userObj = JSON.parse(userData);

      if (!userObj) {
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

      navigate('/cart');
    } catch (err) {
      console.error('錯誤:', err);
    }
  };

  useEffect(() => {
    const getThemeData = async () => {
      setIsLoading(true);
      setActivePlan(null);

      // 計算打 API 開始的時間
      const startTime = Date.now();

      try {
        const [themesRes, plansRes] = await Promise.all([api.get('/themes'), api.get('/plans')]);
        const theme = themesRes.data.find((item) => item.id === Number(id));
        const relatedPlans = plansRes.data.filter((plan) => plan.themeId === Number(id));

        const combinedThemeData = {
          ...theme,
          plans: relatedPlans,
        };
        setThemeData(combinedThemeData);
      } catch (error) {
        console.error('取得主題失敗：', error?.message);
      } finally {
        // 計算打 API 後過了多少時間 elapsed
        const elapsed = Date.now() - startTime;

        // 設定一個最少 loading 時間 minimumLoadingTime
        const minimumLoadingTime = 300;

        // 若 elapsed < minimumLoadingTime 則等待，反之直接結束
        if (elapsed < minimumLoadingTime) {
          await new Promise((resolve) => setTimeout(resolve, minimumLoadingTime - elapsed));
        }

        setIsLoading(false);
      }
    };
    getThemeData();
  }, [id]);

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

  // 渲染評價星星
  const renderStars = (rating, size = 24) => {
    return Array.from({ length: 5 }, (_, index) => index + 1).map((number) => (
      <Icon
        key={number}
        icon={Math.round(rating) >= number ? 'mingcute:star-fill' : 'mingcute:star-line'}
        width={size}
        height={size}
        className="text-semantic-rating"
      />
    ));
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleSortChange = (option) => {
    setSortOption(option);
  };

  return (
    <>
      <main className="main overflow-hidden">
        {/* section1 主題menu + 訂閱方案 */}
        <section className="pie-bg">
          {isLoading ? (
            <Loading text="載入甜點主題中..." />
          ) : (
            <>
              {/* mobile：fixed menu-bg-color */}
              <div className="theme-menu">
                <ul className="nav side-menu gap-2 py-2 px-3">
                  {themes.map((theme) => {
                    const { id, label } = theme;
                    return (
                      <li key={id} className="nav-item">
                        <NavLink
                          to={`/themeDetail/${id}`}
                          className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
                        >
                          {label}
                        </NavLink>
                      </li>
                    );
                  })}
                </ul>
              </div>
              {/*mobile 滿版swiper */}
              <div className="mt-19 d-lg-none">
                {themeData && (
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
                    {themeData?.images.detail.map((image, index) => (
                      <SwiperSlide key={index}>
                        <img src={image} alt={`${themeData.title}圖片}`} />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                )}
              </div>
              {/* 內容：主題menu + 訂閱方案 */}
              <div className="container py-lg-11">
                {/* 桌機 side-menu-float */}
                {/* scroll up才顯示  */}
                <SideMenuFloat />
                <div className="row">
                  {/* 左區塊：Menu + Swiper */}
                  <div className="col-xl-8 col-lg-7">
                    <div className="d-flex">
                      {/*  menu */}
                      <nav className="me-lg-6 d-none d-lg-block">
                        <h5 className="fw-bold fs-lg-7 text-nowrap ls-1 py-lg-5 ps-2">主題一覽</h5>
                        <ul className="nav flex-column side-menu">
                          {themes.map((theme) => {
                            const { id, label } = theme;
                            return (
                              <li key={id} className="nav-item">
                                <NavLink
                                  to={`/themeDetail/${id}`}
                                  className={({ isActive }) =>
                                    'nav-link d-flex align-items-center' +
                                    (isActive ? ' active' : '')
                                  }
                                >
                                  {label}
                                </NavLink>
                              </li>
                            );
                          })}
                        </ul>
                      </nav>
                      {/* 中間 Swiper */}
                      <div className="theme-detail-pics d-lg-block d-none flex-grow-1">
                        {/* 大圖 */}
                        <Swiper
                          className="swiperThemeDetail pb-3"
                          modules={[Thumbs, FreeMode]}
                          thumbs={{
                            swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
                          }}
                          grabCursor={true}
                          loop
                          onSwiper={(swiper) => {
                            // Swiper instance 賦值到 mainSwiperRef，才可用slideToLoop 方法
                            mainSwiperRef.current = swiper;
                          }}
                        >
                          {themeData?.images.detail.map((image, index) => (
                            <SwiperSlide key={index}>
                              <img src={image} alt={`${themeData.title}圖片}`} />
                            </SwiperSlide>
                          ))}
                        </Swiper>
                        {/* 小圖 */}
                        <Swiper
                          className="swiperThemeDetail2"
                          modules={[FreeMode, Thumbs]}
                          spaceBetween={8}
                          slidesPerView={3}
                          freeMode={true}
                          watchSlidesProgress={true}
                          resistanceRatio={0}
                          grabCursor={true}
                          onSwiper={(swiper) => {
                            thumbsSwiperRef.current = swiper;
                            // 因為大圖的 Swiper 的 thumbs.swiper 需要小圖 instance，使用 state 才能觸發更新，大圖才能連動小圖
                            setThumbsSwiper(swiper);
                          }}
                        >
                          {themeData?.images.detail.map((image, index) => (
                            <SwiperSlide key={index}>
                              <img src={image} alt={`${themeData.title}圖片}`} />
                            </SwiperSlide>
                          ))}
                        </Swiper>
                      </div>
                    </div>
                  </div>

                  {/* 右區塊：訂閱方案 */}
                  <div className="col-xl-4 col-lg-5 plan-opts mb-17 mb-lg-11 pt-6 pt-lg-4 px-lg-5">
                    <div className="mb-9 mb-lg-5">
                      <div className="theme-topic">
                        <h1 className="mb-5 fs-3 fs-lg-2 fw-bold ls-1">{`${themeData?.title}盒`}</h1>
                        <h2 className="mb-3 fs-7 ls-1 fw-bold">{`${themeData?.subtitle}`}</h2>
                        <p>{`${themeData?.description}`}</p>
                      </div>
                      <div className="plan-area">
                        {/* plan選項 */}

                        <ul className="my-6">
                          {themeData?.plans?.map((plan, idx) => {
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
                                      {idx === 0
                                        ? '初嚐首選'
                                        : idx === 1
                                          ? '人氣推薦'
                                          : '鑑賞家專屬'}
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
                              <Icon
                                className="ms-2"
                                icon="tdesign:swap-right"
                                width="24"
                                height="24"
                              />
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
        {/* section2 甜點盒裡有甚麼 */}
        <section className="bg-neutral-400 theme-feature position-relative mt-5 mt-lg-0">
          <div className="container-1076 py-17 py-lg-18">
            <div className="mb-15 mb-lg-14 text-center">
              <p className="en-font fw-bold ls-1 text-primary-600 fs-7 fs-lg-6 mb-3 mb-lg-6">
                What’s in the box
              </p>
              <div className="mb-6 mb-lg-9">
                <picture>
                  <source
                    media="(max-width: 992px)"
                    srcSet="
              ./images/Theme_Detail/Feature/Title_section02_mobile.svg
            "
                  />
                  <img
                    src="./images/Theme_Detail/Feature/Title_section02.svg"
                    alt="精選甜點盒裡有甚麼"
                  />
                </picture>
              </div>
              <p className="text-neutral-800">
                每盒精選甜點含 8-14 款話題甜點，精挑細選最新人氣與聯名熱品，甜點控嚐鮮首選！
              </p>
            </div>
            <div className="d-flex flex-lg-row flex-column gap-lg-8 gap-6">
              {/* features */}
              {featureCards.map((feature) => (
                <div key={feature.icon} className="detail-feature-card">
                  <div className="detail-feature-card-padding">
                    <img
                      src={`./images/Theme_Detail/Feature/${feature.icon}.svg`}
                      alt={feature.alt}
                      className="mb-3"
                    />
                    <p className="text-primary-600 fw-bold fs-5 mb-3">{feature.title}</p>
                    <p className="text-neutral-800 fs-lg-8">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* section3 第一盒甜內容 */}
        <section className="theme-content position-relative">
          <div className="container">
            {/* 第一盒甜標題 */}
            <div className="text-center first-sweet-box-title">
              <p className="en-font fw-bold ls-1 text-primary-600 fs-7 fs-lg-6 mb-3 mb-lg-6">
                The first sweet box
              </p>
              <div className="mb-6 mb-lg-9">
                <picture>
                  <source
                    media="(max-width: 992px)"
                    srcSet="./images/Theme_Detail/Feature/Title_section03_mobile.svg"
                  />
                  <img src="./images/Theme_Detail/Feature/Title_section03.svg" alt="你的第一盒甜" />
                </picture>
              </div>
              <p className="text-neutral-800 first-sweet-box-desc">
                首次訂閱一盒甜，即可獲得迎賓禮盒，內含精選、季節、在地三大主題共 9
                款人氣甜點，一次體驗多種甜點驚喜。
                <span className="d-none d-lg-inline">
                  點選甜點卡片，查看更多風味介紹與保存方式。
                </span>
              </p>
            </div>
            {/* 第一盒甜內容卡片 */}
            <div className="row row-gap-6 d-none d-lg-flex">
              {/* 桌面版 */}
              {firstSweetBox.map((item) => (
                <div key={item.id} className={`col-lg-4 ${item.className ?? 'position-relative'}`}>
                  <div className="first-sweet-box-content">
                    <img
                      src={item.img.desktop}
                      alt={item.name}
                      className="rounded-6 mb-4 mb-lg-0 w-100 d-none d-lg-block"
                    />
                    {/* 黑色屏幕 */}
                    <div className="overlay d-none d-lg-flex">
                      <h3 className="fw-bold fs-2 mb-3">{item.name}</h3>
                      <p className="fw-bold fs-5 mb-9">{item.enName}</p>
                      <p>{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* 手機版 */}
            <div className="d-flex flex-column gap-6 d-lg-none position-relative">
              {firstSweetBox.slice(0, 4).map((item) => (
                <div key={item.id}>
                  <img
                    src={item.img.mobile}
                    alt={item.name}
                    className="rounded-6 mb-4 mb-lg-0 w-100"
                  />
                  <div>
                    <div className="d-flex d-lg-none justify-content-between align-center mb-3 fw-bold">
                      <p className="fs-6">{item.name}</p>
                      <p>{item.enName}</p>
                    </div>
                    <p>{item.desc}</p>
                  </div>
                </div>
              ))}
              {/* 收合的甜點區塊 */}
              <div className="collapse d-lg-none" id="moreCards">
                <div className="d-flex flex-column gap-6">
                  {firstSweetBox.slice(4).map((item) => (
                    <div key={item.id}>
                      <img
                        src={item.img.mobile}
                        alt={item.name}
                        className="rounded-6 mb-4 mb-lg-0 w-100"
                      />
                      <div>
                        <div className="d-flex d-lg-none justify-content-between align-center mb-3 fw-bold">
                          <p className="fs-6">{item.name}</p>
                          <p>{item.enName}</p>
                        </div>
                        <p>{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 收合按鈕 */}
              <div
                className={`text-center d-block d-lg-none ${isExpanded ? '' : 'position-absolute bottom-0 start-0 end-0 card-mask'}`}
              >
                <button
                  className="btn-outline-primary moreCards w-100"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#moreCards"
                  aria-expanded="false"
                  aria-controls="moreCards"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? '收合內容' : '展開全部'}
                </button>
              </div>
            </div>
          </div>
        </section>
        {/* section4 好評分享 */}
        <section className="py-lg-11 py-17 bg-neutral-400 position-relative review-section">
          <div className="container">
            {/* 標題 */}
            <div className="text-center mb-lg-14 mb-15">
              <p className="en-font text-primary-600 fs-7 fs-lg-6 ls-1 fw-bold mb-lg-6 mb-3">
                sweet words
              </p>
              <picture>
                <source
                  media="(max-width: 992px)"
                  srcSet="./images/Theme_Detail/Feature/Title_section04_mobile.svg"
                />
                <img
                  src="./images/Theme_Detail/Feature/Title_section04.svg"
                  alt="Title_section04"
                />
              </picture>
            </div>
            {/* 主題評分區 */}
            <div className="bg-neutral-250 p-6 py-lg-8 px-lg-16 d-flex justify-content-center flex-column flex-lg-row rounded-8 mb-lg-14 mb-15">
              {/* 評分區左側 */}
              <div className="rate-left p-0 py-lg-5 text-center mb-5 mb-lg-0">
                <div className="d-flex flex-row flex-lg-column align-items-center justify-content-start">
                  <p className="noto_sans text-neutral-800 fs-lg-1 fs-4 fw-bold ls-1 lh-sm mb-lg-5 mb-0 me-3 me-lg-0">
                    4.8
                  </p>
                  <div className="rate d-flex justify-content-center gap-1 mb-lg-3 mb-0 me-3 me-lg-0">
                    {renderStars(4.8, 24)}
                  </div>
                  <p className="text-neutral-600 fs-lg-6 fs-9">5,937 則評價</p>
                </div>
              </div>
              {/* 分隔線 */}
              <div className="rating-divider d-lg-block d-none"></div>
              {/* 評分區右側 */}
              <div className="p-0 py-lg-5 px-lg-9 d-flex flex-column gap-3 flex-grow-1">
                {ratingDistribution.map((item) => (
                  <div key={item.star} className="d-flex align-items-center gap-lg-6 gap-2">
                    {/* 星星數 */}
                    <div className="d-flex align-items-center gap-1">
                      <span className="text-neutral-800 fs-lg-6 fs-8 lh-sm ls-1 fw-bold noto_sans">
                        {item.star}
                      </span>
                      <Icon icon="mage:star-fill" className="text-semantic-rating star" />
                    </div>
                    {/* 進度條 */}
                    <div className="progress flex-grow-1">
                      <div
                        className="progress-bar"
                        role="progressbar"
                        style={{ width: item.percent }}
                      ></div>
                    </div>
                    {/* 評論總數 */}
                    <p className="text-neutral-600 fs-8 text-nowrap rating-counts">{`${item.count} 則 (${item.percent})`}</p>
                  </div>
                ))}
              </div>
            </div>
            {/* 評論類別與排序 - desktop */}
            <div className="d-none d-lg-flex justify-content-between align-items-center mb-17">
              <ul className="d-flex gap-2">
                {desktopCategories.map((category) => (
                  <li key={category.label}>
                    <button
                      type="button"
                      className={`btn btn-tag ${selectedCategory === category.value ? 'active' : ''}`}
                      onClick={() => handleCategoryChange(category.value)}
                    >
                      {category.label} ({category.count})
                    </button>
                  </li>
                ))}
              </ul>
              <ul className="d-flex align-items-center">
                {desktopSortOptions.map((option, index) => (
                  <Fragment key={option.value}>
                    {index !== 0 && <li className="sortOption-divider"></li>}
                    <li>
                      <button
                        type="button"
                        className={`btn-text ${sortOption === option.value ? 'active' : ''} p-3 fs-8`}
                        onClick={() => handleSortChange(option.value)}
                      >
                        {option.label} {option.direction}
                      </button>
                    </li>
                  </Fragment>
                ))}
              </ul>
            </div>
            {/* 評論類別與排序 - mobile */}
            <div className="d-flex d-lg-none justify-content-end gap-2 mb-6">
              <Dropdown
                options={mobileCategories}
                width="auto"
                value={selectedCategory}
                onChange={handleCategoryChange}
                buttonClass="text-neutral-800"
              />
              <Dropdown
                options={mobileSortOptions}
                value={sortOption}
                onChange={handleSortChange}
                buttonClass="text-neutral-800"
              />
            </div>
            {/* 評論區 */}
            <div className="d-flex flex-column mb-lg-17 mb-15 position-relative z-1">
              {reviews.map((review, index) => (
                <Fragment key={review.id}>
                  <ReviewItem key={review.id} review={review} renderStars={renderStars} />
                  {index !== reviews.length - 1 && (
                    <hr className="border-neutral-500 border-1 my-lg-4 my-3" />
                  )}
                </Fragment>
              ))}
            </div>
            {/* 分頁 */}
            <div className="d-flex justify-content-center">
              <Pagination
                currentPage={1}
                totalItems={reviews.length} // 評論總數
                itemsPerPage={5} // 每頁顯示幾筆
              />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
export default ThemeDetail;
