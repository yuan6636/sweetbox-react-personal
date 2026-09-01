import { Icon } from '@iconify/react';
import { NavLink } from 'react-router-dom';

// constants
import { DEFAULT_THEME_ID } from '../../constants/theme';

const steps = [
  {
    id: 1,
    image: './images/Home_Page/icon-flow-01.svg',
    imageAlt: 'select 圖示',
    title: '1. 挑選你的主題',
    description: '無論你想和家人分享、或獨自探索甜味風景，我們都有適合你的那一盒甜。',
  },
  {
    id: 2,
    image: './images/Home_Page/icon-flow-02.svg',
    imageAlt: 'subscribe 圖示',
    title: '2. 訂閱並等待驚喜',
    description: '選擇訂閱方式，每月都有盒甜點準時送達，像專屬你的節日驚喜。',
  },
  {
    id: 3,
    image: './images/Home_Page/icon-flow-03.svg',
    imageAlt: 'enjoy 圖示',
    title: '3. 享受一盒甜',
    description: '嚴選甜點搭配保存小秘訣，美味與安心兼具。讓生活多一點甜。',
  },
];

function SubscriptionSteps() {
  return (
    <section className="position-relative">
      <img
        className="position-absolute cakeroll-img z-0"
        src="./images/Home_Page/deco-03.svg"
        alt="蛋糕捲圖示"
        height="612"
        width="880"
      />
      <div className="container py-lg-11 py-10">
        <div className="mb-lg-10 mb-9 text-center position-relative z-1" data-aos="fade-up">
          <p className="en-font text-primary-600 fs-7 fs-lg-5 ls-1 fw-bold mb-lg-6 mb-3">
            How to subscribe
          </p>
          <h2>
            <span className="visually-hidden">訂閱流程</span>
            <img
              className="subscribe-img"
              src="./images/Home_Page/title-flow.svg"
              alt="訂閱流程圖示"
              height="56"
              width="208"
            />
          </h2>
        </div>
        <ul className="row card-custom mb-13 position-relative z-1">
          {steps.map((step, index) => (
            <li
              key={step.id}
              className="col-lg-4 p-lg-6 p-4 text-center"
              data-aos="fade-right"
              data-aos-delay={index * 200}
            >
              <img
                className="mb-lg-6 mb-2"
                src={step.image}
                alt={step.imageAlt}
                width="120"
                height="120"
              />
              <h3 className="fs-lg-4 fs-6 ls-1 fw-bold text-neutral-800 mb-lg-3 mb-2">
                {step.title}
              </h3>
              <p className="fs-lg-6 fs-7 text-neutral-800">{step.description}</p>
            </li>
          ))}
        </ul>
        <div className="d-lg-flex d-none justify-content-center">
          <NavLink
            to={`/themedetail/${DEFAULT_THEME_ID}`}
            className="btn-primary-icon ls-1 lh-sm fs-6 fw-bold d-flex align-items-center"
            data-aos="zoom-in"
          >
            立刻訂閱
            <Icon className="ms-2" icon="tdesign:swap-right" width="24" height="24" />
          </NavLink>
        </div>
      </div>
    </section>
  );
}

export default SubscriptionSteps;
