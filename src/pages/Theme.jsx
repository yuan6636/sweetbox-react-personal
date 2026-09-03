import { NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';

import api from '../api';

import Loading from '../components/common/Loading';

function Theme() {
  const [themes, setThemes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchThemes = async () => {
      setIsLoading(true);
      try {
        const themeRes = await api.get('/themes');
        setThemes(themeRes.data);
      } catch (error) {
        console.error('取得主題失敗', error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchThemes();
  }, []);

  if (isLoading) {
    return <Loading text="甜點主題載入中..." />;
  }

  return (
    <main className="main overflow-hidden">
      <section className="theme-banner bg-neutral-200">
        <picture>
          <source media="(min-width: 767px)" srcSet="./images/theme-page/banner-desktop.svg" />
          <img
            src="./images/theme-page/banner-mobile.svg"
            alt="theme-banner-img"
            className="theme-banner-img"
          />
        </picture>

        <div className="d-lg-none container text-center title-mobile">
          <img src="./images/theme-page/title-banner.svg" alt="總有一盒剛好是你想吃的甜" />
        </div>
      </section>
      {/* 主題一覽 */}
      <section className="position-relative">
        <div className="py-10 py-lg-11">
          <div className="mb-15 text-center">
            <p className="mb-6 text-primary-600 en-font fw-bold ls-1">Theme</p>
            <picture>
              <source
                srcSet="./images/theme-page/title-theme-mobile.svg"
                media="(max-width: 992px)"
              />
              <img src="./images/theme-page/title-theme-desktop.svg" alt="主題一覽" />
            </picture>
          </div>
          <section className="container">
            {isError ? (
              <div className="d-flex justify-content-center align-items-center vh-100">
                <p className="text-center text-danger fs-6 fs-lg-5">
                  主題資料載入失敗，請稍後重新整理頁面
                </p>
              </div>
            ) : (
              <div className="row">
                {/* 主題卡片 */}
                {themes?.map((theme) => (
                  <div className="col-lg-4" key={theme.id}>
                    <div className="card w-100 p-5 p-lg-9 mb-9 mb-lg-17 text-center border-light theme-card">
                      <h3 className="mb-8 text-primary-600 theme-title">{theme.title}</h3>
                      <img
                        src={theme.images.main}
                        className="card-img-top mb-6"
                        alt={`${theme.title}圖片`}
                      />
                      <div className="card-body py-0">
                        <h5 className="card-title fw-bold mb-3">{theme.subtitle}</h5>
                        <p className="card-text mb-6 mb-lg-8">{theme.description}</p>
                        <NavLink
                          to={`/themedetail/${theme.id}`}
                          className="btn-theme-card border stretched-link"
                        >
                          了解更多
                        </NavLink>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
        <picture>
          <source media="(min-width: 992px)" srcSet="./images/theme-page/bg-cake-desktop.png" />
          <img
            className="position-absolute theme-background z-n1"
            src="./images/theme-page/bg-cake-mobile.png"
            alt="蛋糕背景圖"
          />
        </picture>
      </section>
    </main>
  );
}

export default Theme;
