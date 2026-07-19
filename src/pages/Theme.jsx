import { NavLink } from 'react-router-dom';

function Theme() {
  return (
    <>
      <main className="main overflow-hidden">
        <section className="theme-banner bg-neutral-200">
          <picture>
            <source media="(min-width: 767px)" srcSet="./images/Theme_Page/Banner.svg" />
            <img
              src="./images/Theme_Page/Banner_mobile.svg"
              alt="theme-banner-img"
              className="theme-banner-img"
            />
          </picture>

          <div className="d-lg-none container text-center title-mobile">
            <img
              src="./images/Theme_Page/Title_display_mobile.svg"
              alt="總有一盒剛好是你想吃的甜"
            />
          </div>
        </section>
        {/* <!-- <section className="container"> --> */}
        <section className="position-relative">
          <div className="py-10 py-lg-11">
            <div className="mb-15 text-center">
              <p className="mb-6 text-primary-600 en-font fw-bold ls-1">Theme</p>
              <picture>
                <source
                  srcSet="./images/Theme_Page/Title_section_mobile.svg"
                  media="(max-width: 992px)"
                />
                <img src="./images/Theme_Page/Title_section.svg" alt="主題一覽" />
              </picture>
            </div>
            <section className="container">
              <div className="row">
                <div className="col-12 col-lg-4">
                  {/* <!-- 卡片 --> */}
                  <div
                    className="card w-100 p-5 p-lg-9 mb-9 mb-lg-17 text-center border-light theme-card"
                    style={{ width: 416 }}
                  >
                    <h3 className="mb-8 text-primary-600 theme-title">精選甜點</h3>
                    <img
                      src="./images/Theme_Page/pic_theme_feature.png"
                      className="card-img-top mb-6"
                      alt="精選甜點圖片"
                    />
                    <div className="card-body py-0">
                      <h5 className="card-title fw-bold mb-3">我們幫你挑最值得期待的那一盒</h5>
                      <p className="card-text mb-6 mb-lg-8">
                        從人氣爆款到話題聯名，通通不錯過，喜歡嚐鮮的你一定會愛上。
                      </p>
                      <NavLink
                        to="/themedetail/1"
                        className={'btn-theme-card border stretched-link'}
                      >
                        了解更多
                      </NavLink>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-lg-4">
                  {/* <!-- 卡片 --> */}
                  <div
                    className="card w-100 p-5 p-lg-9 mb-9 mb-lg-17 text-center border-light theme-card"
                    style={{ width: 416 }}
                  >
                    <h3 className="mb-8 text-primary-600 theme-title">季節限定</h3>
                    <img
                      src="./images/Theme_Page/pic_theme_season.png"
                      className="card-img-top mb-6"
                      alt="精選甜點圖片"
                    />
                    <div className="card-body py-0">
                      <h5 className="card-title fw-bold mb-3">春夏秋冬,不同甜點陪你過日子</h5>
                      <p className="card-text mb-6 mb-lg-8">
                        當月份限定的口味與質地，只在這時登場！錯過了，就要再等一年。
                      </p>
                      <NavLink
                        to="/themedetail/2"
                        className={'btn-theme-card border stretched-link'}
                      >
                        了解更多
                      </NavLink>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-lg-4">
                  {/* <!-- 卡片 --> */}
                  <div
                    className="card w-100 p-5 p-lg-9 mb-9 mb-lg-17 text-center border-light theme-card"
                    style={{ width: 416 }}
                  >
                    <h3 className="mb-8 text-primary-600 theme-title">在地甜點</h3>
                    <img
                      src="./images/Theme_Page/pic_theme_local.png"
                      className="card-img-top mb-6"
                      alt="精選甜點圖片"
                    />
                    <div className="card-body py-0">
                      <h5 className="card-title fw-bold mb-3">重溫土地的美味，熟悉中感受驚喜</h5>
                      <p className="card-text mb-6 mb-lg-8">
                        精選以台灣食材與職人手藝製作的特色甜點，簡單卻令人回味無窮。
                      </p>
                      <NavLink
                        to="/themedetail/3"
                        className={'btn-theme-card border stretched-link'}
                      >
                        了解更多
                      </NavLink>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-lg-4">
                  {/* <!-- 卡片 --> */}
                  <div
                    className="card w-100 p-5 p-lg-9 mb-9 mb-lg-17 text-center border-light theme-card"
                    style={{ width: 416 }}
                  >
                    <h3 className="mb-8 text-primary-600 theme-title">異國風味</h3>
                    <img
                      src="./images/Theme_Page/pic_theme_world.png"
                      className="card-img-top mb-6"
                      alt="精選甜點圖片"
                    />
                    <div className="card-body py-0">
                      <h5 className="card-title fw-bold mb-3">我們幫你挑最值得期待的那一盒</h5>
                      <p className="card-text mb-6 mb-lg-8">
                        每月解鎖一國的代表甜點，為你展開一場從舌尖出發的甜點之旅。
                      </p>
                      <NavLink
                        to="/themedetail/4"
                        className={'btn-theme-card border stretched-link'}
                      >
                        了解更多
                      </NavLink>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-lg-4">
                  {/* <!-- 卡片 --> */}
                  <div
                    className="card w-100 p-5 p-lg-9 mb-9 mb-lg-17 text-center border-light theme-card"
                    style={{ width: 416 }}
                  >
                    <h3 className="mb-8 text-primary-600 theme-title">無負擔甜點</h3>
                    <img
                      src="./images/Theme_Page/pic_theme_health.png"
                      className="card-img-top mb-6"
                      alt="精選甜點圖片"
                    />
                    <div className="card-body py-0">
                      <h5 className="card-title fw-bold mb-3">剛剛好的甜，無負擔的美好</h5>
                      <p className="card-text mb-6 mb-lg-8">
                        嚴選天然原料，低糖、無麩質、植物奶製作，每一口都純粹而滿足。
                      </p>
                      <NavLink
                        to="/themedetail/5"
                        className={'btn-theme-card border stretched-link'}
                      >
                        了解更多
                      </NavLink>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-lg-4">
                  {/* <!-- 卡片 --> */}
                  <div
                    className="card w-100 p-5 p-lg-9 mb-lg-17 text-center border-light theme-card"
                    style={{ width: 416 }}
                  >
                    <h3 className="mb-8 text-primary-600 theme-title">素食甜點</h3>
                    <img
                      src="./images/Theme_Page/pic_theme_veg.png"
                      className="card-img-top mb-6"
                      alt="精選甜點圖片"
                    />
                    <div className="card-body py-0">
                      <h5 className="card-title fw-bold mb-3">不加動物成分,不減幸福滋味</h5>
                      <p className="card-text mb-6 mb-lg-8">
                        無蛋無奶植物系甜點，每一口甜，都是對自己與地球的一份溫柔。
                      </p>
                      <NavLink
                        to="/themedetail/6"
                        className={'btn-theme-card border stretched-link'}
                      >
                        了解更多
                      </NavLink>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
          <picture>
            <source media="(min-width: 992px)" srcSet="./images/Theme_Page/bg-cake-desktop.png" />
            <img
              className="position-absolute theme-background z-n1"
              src="./images/Theme_Page/bg-cake-mobile.png"
              alt="蛋糕背景圖"
            />
          </picture>
        </section>
      </main>
      {/* <script type="module" src="../main.js"></script> */}
    </>
  );
}

export default Theme;
