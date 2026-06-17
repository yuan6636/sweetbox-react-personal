import { Swiper, SwiperSlide } from 'swiper/react';
import { Thumbs, Autoplay, FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/free-mode';
import 'swiper/css/thumbs';
import { useState } from 'react';

function ThemeDesktopSwiper({ currentTheme, mainSwiperRef, thumbsSwiperRef }) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  return (
    <>
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
        {currentTheme?.images.detail.map((image, index) => (
          <SwiperSlide key={index}>
            <img src={image} alt={`${currentTheme.title}圖片}`} />
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
        {currentTheme?.images.detail.map((image, index) => (
          <SwiperSlide key={index}>
            <img src={image} alt={`${currentTheme.title}圖片}`} />
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
}

export default ThemeDesktopSwiper;
