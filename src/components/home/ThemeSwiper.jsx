import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import { Icon } from '@iconify/react';
import api from '../../api';
import { NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';

// 載入 swiper 樣式
import 'swiper/css';
import 'swiper/css/navigation';

// Themes
const themesTitleMap = [
  { src: './images/Home_Page/feature.svg' },
  { src: './images/Home_Page/season.svg' },
  { src: './images/Home_Page/local.svg' },
];

// theme title highlight
const highlightMap = ['最值得期待', '陪你過日子', '熟悉中遇見驚喜'];

function ThemeSwiper() {
  const [themes, setThemes] = useState([]);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchThemes = async () => {
      try {
        const themesRes = await api.get('/themes');
        setThemes(themesRes.data.slice(0, 3));
      } catch (error) {
        console.error('取得主題失敗', error?.message || '請重新再試！');
        setIsError(true);
      }
    };
    fetchThemes();
  }, []);

  const highlightText = (subtitle, highlight) => {
    const [before, after] = subtitle.split(highlight);

    return (
      <>
        {before}
        <span className="text-primary">{highlight}</span>
        {after}
      </>
    );
  };

  return (
    <section className="position-relative">
      <div className="container py-md-11 py-10">
        {isError ? (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: '500px' }}
          >
            <p className="text-center text-danger fs-6 fs-lg-5">
              主題資料載入失敗，請稍後重新整理頁面
            </p>
          </div>
        ) : (
          <>
            {/* desktop: Slider main container */}
            <div className="swiper-themeOpts-area d-lg-block d-none position-relative">
              <Swiper
                className="swiper-themeOpts"
                speed={800}
                modules={[Navigation]}
                autoplay={{
                  delay: 2500,
                }}
                navigation={{
                  nextEl: '.swiper-button-next',
                  prevEl: '.swiper-button-prev',
                }}
                grabCursor={true}
                resistanceRatio={0}
              >
                {/* Additional required wrapper */}
                {/* Slides */}
                {themes.map((theme, index) => (
                  <SwiperSlide key={theme.id} className="swiper-slide position-relative">
                    <div className="d-flex">
                      <div className="row">
                        <div className="col-7">
                          <img
                            src={theme.images.home}
                            alt={theme.title}
                            className="me-6 w-100"
                            height="auto"
                          />
                        </div>
                        <div className="col-5 py-10 px-9 d-flex flex-column justify-content-between align-items-start">
                          <div className="text">
                            <p className="en-font text-capitalize text-primary-600 ls-1 fw-bold fs-7 mb-6">
                              {theme.titleEn}
                            </p>
                            <h3 className="mb-9">
                              <span className="visually-hidden">{theme.title}</span>
                              <img src={themesTitleMap[index].src} alt="" />
                            </h3>
                            <h4 className="fs-6 fw-bold ls-1 mb-2">
                              {highlightText(theme.subtitle, highlightMap[index])}
                            </h4>
                            <p className="fs-6 fs-5">{theme.description}</p>
                          </div>
                          <NavLink
                            to={`/themedetail/${theme.id}`}
                            className="btn-primary-icon ls-1 lh-sm fs-6 fw-bold d-flex align-items-center"
                          >
                            了解更多
                            <Icon
                              className="ms-2"
                              icon="tdesign:swap-right"
                              width="24"
                              height="24"
                            />
                          </NavLink>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              <div className="swiper-button-prev text-neutral-700">
                <div className="p-3">
                  <Icon icon="tdesign:swap-left" width="24" height="24" />
                </div>
              </div>
              <div className="swiper-button-next text-neutral-700">
                <div className="p-3">
                  <Icon icon="tdesign:swap-right" width="24" height="24" />
                </div>
              </div>
            </div>
            {/* mobile:card */}
            <ul className="card-themeOpts d-lg-none">
              {themes.map((theme, index) => (
                <li key={theme.id} className="card text-center bg-transparent border-0 py-4 mb-9">
                  <div className="card-body px-0">
                    <p className="en-font card-subtitle text-primary text-capitalize mb-3 ls-1 fs-7 fw-bold">
                      {theme.titleEn}
                    </p>
                    <h3 className="card-title">
                      <span className="visually-hidden">{theme.title}</span>
                      <img src={themesTitleMap[index].src} alt="" />
                    </h3>
                    <img
                      className="w-100 h-auto my-6"
                      src={theme.images.home}
                      alt={`${theme.title}圖片`}
                    />
                    <h4 className="fs-6 fw-bold ls-1 mb-2 mb-lg-0">
                      {highlightText(theme.subtitle, highlightMap[index])}
                    </h4>
                    <p className="card-text mb-6">{theme.description}</p>
                    <NavLink
                      to={`/themedetail/${theme.id}`}
                      className="btn-primary-icon ls-1 lh-sm fs-6 fw-bold d-inline-flex align-items-center mx-auto"
                    >
                      了解更多
                      <Icon className="ms-2" icon="tdesign:swap-right" width="24" height="24" />
                    </NavLink>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
      <img
        className="position-absolute cake-img z-n1"
        height="244"
        width="272"
        src="./images/Home_Page/bg_cake.svg"
        alt=""
      />
      <img
        className="position-absolute dessert-img z-n1  d-none d-lg-block"
        height="335"
        width="325"
        src="./images/Home_Page/bg_dessert.svg"
        alt=""
      />
    </section>
  );
}

export default ThemeSwiper;
