import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';

// 載入 swiper 樣式
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Desktop
const desktopBrands = [
  './images/Home_Page/brand/brand-1.png',
  './images/Home_Page/brand/brand-2.png',
  './images/Home_Page/brand/brand-3.png',
  './images/Home_Page/brand/brand-4.png',
  './images/Home_Page/brand/brand-5.png',
  './images/Home_Page/brand/brand-6.png',
  './images/Home_Page/brand/brand-7.png',
  './images/Home_Page/brand/brand-8.png',
  './images/Home_Page/brand/brand-9.png',
  './images/Home_Page/brand/brand-10.png',
  './images/Home_Page/brand/brand-11.png',
  './images/Home_Page/brand/brand-12.png',
  './images/Home_Page/brand/brand-13.png',
  './images/Home_Page/brand/brand-14.png',
  './images/Home_Page/brand/brand-15.png',
  './images/Home_Page/brand/brand-16.png',
];

const desktopBrandsRow1 = desktopBrands.slice(0, 8);
const desktopBrandsRow2 = desktopBrands.slice(8, 16);

// Mobile
const mobileBrandsRow1 = [
  './images/Home_Page/brand-mobile/01.png',
  './images/Home_Page/brand-mobile/02.png',
  './images/Home_Page/brand-mobile/16.png',
  './images/Home_Page/brand-mobile/15.png',
  './images/Home_Page/brand-mobile/03.png',
  './images/Home_Page/brand-mobile/04.png',
];

const mobileBrandsRow2 = [
  './images/Home_Page/brand-mobile/05.png',
  './images/Home_Page/brand-mobile/11.png',
  './images/Home_Page/brand-mobile/12.png',
  './images/Home_Page/brand-mobile/06.png',
  './images/Home_Page/brand-mobile/13.png',
];

const mobileBrandsRow3 = [
  './images/Home_Page/brand-mobile/09.png',
  './images/Home_Page/brand-mobile/10.png',
  './images/Home_Page/brand-mobile/14.png',
  './images/Home_Page/brand-mobile/07.png',
  './images/Home_Page/brand-mobile/08.png',
];

function BrandsSwiper() {
  return (
    <section className="bg-neutral-200 position-relative">
      <div className="container brands-partner">
        {/* 上半部-partners合作夥伴字樣&圖 */}
        <div className="mb-9 mb-lg-10 text-center position-relative z-1">
          <p className="en-font fs-7 fs-lg-5 ls-1 fw-bold mb-lg-6 mb-3 text-primary-600">
            Partners
          </p>
          <h2>
            <span className="visually-hidden">合作夥伴</span>
            <picture>
              <source
                media="(max-width: 576px)"
                srcSet="./images/Home_Page/title_section07_mobile.png"
              />
              <img className="brands-img" src="./images/Home_Page/title_section07.svg" alt="" />
            </picture>
          </h2>
        </div>
        {/* 下半部-品牌 swiper */}
        {/* desktop */}
        <div className="d-none d-lg-block">
          <Swiper
            className="brands-swiper mb-5"
            modules={[Autoplay]}
            slidesPerView={'auto'}
            spaceBetween={4}
            autoplay={true}
            loop
            speed={800}
            breakpoints={{
              576: { spaceBetween: 20 },
            }}
            grabCursor={true}
          >
            {desktopBrandsRow1.map((img, index) => (
              <SwiperSlide key={index} className="swiper-slide">
                <img src={img} alt={`合作品牌 Logo`} className="align-bottom" />
              </SwiperSlide>
            ))}
          </Swiper>
          <Swiper
            className="brands-swiper"
            dir="rtl"
            modules={[Autoplay]}
            slidesPerView={'auto'}
            spaceBetween={4}
            autoplay={true}
            loop
            speed={800}
            breakpoints={{
              576: { spaceBetween: 20 },
            }}
            grabCursor={true}
          >
            {desktopBrandsRow2.map((img, index) => (
              <SwiperSlide key={index} className="swiper-slide">
                <img src={img} alt={`合作品牌 Logo`} className="align-bottom" />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        {/* mobile */}
        <div className="d-block d-lg-none">
          {/* mobile-1 */}
          <Swiper
            className="brands-swiper"
            modules={[Autoplay]}
            slidesPerView={'auto'}
            spaceBetween={4}
            autoplay={true}
            loop
            speed={800}
            grabCursor={true}
          >
            {mobileBrandsRow1.map((img, index) => (
              <SwiperSlide key={index} className="swiper-slide">
                <img src={img} alt={`合作品牌 Logo`} className="align-bottom" />
              </SwiperSlide>
            ))}
          </Swiper>
          {/* mobile-2 */}
          <Swiper
            className="brands-swiper"
            dir="rtl"
            modules={[Autoplay]}
            slidesPerView={'auto'}
            spaceBetween={4}
            autoplay={true}
            loop
            speed={800}
            grabCursor={true}
          >
            {mobileBrandsRow2.map((img, index) => (
              <SwiperSlide key={index} className="swiper-slide">
                <img src={img} alt={`合作品牌 Logo`} className="align-bottom" />
              </SwiperSlide>
            ))}
          </Swiper>
          {/* mobile-3 */}
          <Swiper
            className="brands-swiper"
            modules={[Autoplay]}
            slidesPerView={'auto'}
            spaceBetween={4}
            autoplay={true}
            loop
            speed={800}
            grabCursor={true}
          >
            {mobileBrandsRow3.map((img, index) => (
              <SwiperSlide key={index} className="swiper-slide">
                <img src={img} alt={`合作品牌 Logo`} className="align-bottom" />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}

export default BrandsSwiper;
