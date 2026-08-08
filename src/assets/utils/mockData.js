// 第一盒甜
export const firstSweetBox = [
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

// 食用建議
export const usageTips = [
  { icon: 'Icon_openbook', alt: 'openbook icon', text: '開箱後，請先確認甜點品項與保存方式' },
  { icon: 'Icon_tea-cup', alt: 'tea-cup icon', text: '搭配一杯茶或咖啡，更能襯托出甜點的風味' },
  { icon: 'Icon_curtain', alt: 'curtain icon', text: '常溫甜點請置於陰涼乾燥處保存' },
  { icon: 'Icon_eat', alt: 'eat icon', text: '開封後建議盡快食用，以確保最佳風味' },
];

// 評分分布
export const ratingDistribution = [
  { star: 5, count: 5050, percent: '80%' },
  { star: 4, count: 700, percent: '12%' },
  { star: 3, count: 150, percent: '5%' },
  { star: 2, count: 30, percent: '2%' },
  { star: 1, count: 7, percent: '1%' },
];

export const desktopSortOptions = [
  { label: '評價由高至低', direction: '↓', value: 'desc' },
  { label: '評價由低至高', direction: '↑', value: 'asc' },
];

export const mobileSortOptions = [
  { label: '預設排序', value: '' },
  { label: '評價最高', value: 'desc' },
  { label: '評價最低', value: 'asc' },
];

// 甜點特色
export const featureCards = [
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
