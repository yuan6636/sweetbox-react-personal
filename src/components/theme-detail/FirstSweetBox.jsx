import { useState } from 'react';
import { firstSweetBox } from '../../data/mockData';

function FirstSweetBox() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
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
                srcSet="./images/theme-detail/title-first-box-mobile.svg"
              />
              <img
                src="./images/theme-detail/title-first-box-desktop.svg"
                alt="你的第一盒甜"
              />
            </picture>
          </div>
          <p className="text-neutral-800 first-sweet-box-desc">
            首次訂閱一盒甜，即可獲得迎賓禮盒，內含精選、季節、在地三大主題共 9
            款人氣甜點，一次體驗多種甜點驚喜。
            <span className="d-none d-lg-inline">點選甜點卡片，查看更多風味介紹與保存方式。</span>
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
              <img src={item.img.mobile} alt={item.name} className="rounded-6 mb-4 mb-lg-0 w-100" />
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
  );
}

export default FirstSweetBox;
