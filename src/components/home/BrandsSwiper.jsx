import { useRef, useEffect } from 'react';

// Desktop
const desktopBrands = [
  './images/home-page/brand/brand-01.png',
  './images/home-page/brand/brand-02.png',
  './images/home-page/brand/brand-03.png',
  './images/home-page/brand/brand-04.png',
  './images/home-page/brand/brand-05.png',
  './images/home-page/brand/brand-06.png',
  './images/home-page/brand/brand-07.png',
  './images/home-page/brand/brand-08.png',
  './images/home-page/brand/brand-09.png',
  './images/home-page/brand/brand-10.png',
  './images/home-page/brand/brand-11.png',
  './images/home-page/brand/brand-12.png',
  './images/home-page/brand/brand-13.png',
  './images/home-page/brand/brand-14.png',
  './images/home-page/brand/brand-15.png',
  './images/home-page/brand/brand-16.png',
];

const desktopBrandsRow1 = desktopBrands.slice(0, 8);
const desktopBrandsRow2 = desktopBrands.slice(8, 16);

// Mobile
const mobileBrandsRow1 = [
  './images/home-page/brand-mobile/brand-mobile-01.png',
  './images/home-page/brand-mobile/brand-mobile-02.png',
  './images/home-page/brand-mobile/brand-mobile-16.png',
  './images/home-page/brand-mobile/brand-mobile-15.png',
  './images/home-page/brand-mobile/brand-mobile-03.png',
  './images/home-page/brand-mobile/brand-mobile-04.png',
];

const mobileBrandsRow2 = [
  './images/home-page/brand-mobile/brand-mobile-05.png',
  './images/home-page/brand-mobile/brand-mobile-11.png',
  './images/home-page/brand-mobile/brand-mobile-12.png',
  './images/home-page/brand-mobile/brand-mobile-06.png',
  './images/home-page/brand-mobile/brand-mobile-13.png',
];

const mobileBrandsRow3 = [
  './images/home-page/brand-mobile/brand-mobile-09.png',
  './images/home-page/brand-mobile/brand-mobile-10.png',
  './images/home-page/brand-mobile/brand-mobile-14.png',
  './images/home-page/brand-mobile/brand-mobile-07.png',
  './images/home-page/brand-mobile/brand-mobile-08.png',
];

// 跑馬燈速度
const MARQUEE_SPEED = 60;

function MarqueeRow({ images, reverse = false }) {
  const trackRef = useRef(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const updateDuration = () => {
      const singleSetWidth = track.scrollWidth / 2;
      const duration = singleSetWidth / MARQUEE_SPEED;

      track.style.setProperty('--marquee-duration', `${duration}s`);
    };

    updateDuration();

    const observer = new ResizeObserver(() => {
      updateDuration();
    });

    observer.observe(track);

    return () => observer.disconnect();
  }, [images]);

  return (
    <div className="marquee-row">
      <div className="marquee-track" ref={trackRef} data-reverse={reverse}>
        {[...images, ...images].map((img, index) => (
          <div className="flex-shrink-0" key={index}>
            <img src={img} alt={`合作品牌 Logo`} className="align-bottom" />
          </div>
        ))}
      </div>
    </div>
  );
}

function BrandsSwiper() {
  return (
    <section className="bg-neutral-200 position-relative" data-aos="fade-up">
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
                srcSet="./images/home-page/title-brand-mobile.png"
              />
              <img className="brands-img" src="./images/home-page/title-brand.svg" alt="" />
            </picture>
          </h2>
        </div>
        {/* 下半部-品牌 swiper */}
        {/* desktop */}
        <div className="d-none d-lg-flex flex-column row-gap-5">
          <MarqueeRow images={desktopBrandsRow1} />
          <MarqueeRow images={desktopBrandsRow2} reverse />
        </div>
        {/* mobile */}
        <div className="d-flex d-lg-none flex-column row-gap-1">
          <MarqueeRow images={mobileBrandsRow1} />
          <MarqueeRow images={mobileBrandsRow2} reverse />
          <MarqueeRow images={mobileBrandsRow3} />
        </div>
      </div>
    </section>
  );
}

export default BrandsSwiper;
