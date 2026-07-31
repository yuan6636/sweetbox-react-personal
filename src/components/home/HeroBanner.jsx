import { Icon } from '@iconify/react';
import { NavLink } from 'react-router-dom';

function HeroBanner() {
  return (
    <section className="hero-banner bg-neutral-200">
      <div className="container px-4 px-sm-0">
        <h1>
          <span className="visually-hidden">選擇障礙救星</span>
          <img
            className="title-hero mb-6 mb-sm-9"
            src="./images/Home_Page/title_hero_mobile.svg"
            alt=""
          />
        </h1>
        <div className="mb-10 mb-sm-9">
          <h2 className="mb-1 mb-sm-2 slogan-title">告別選擇困難，甜點人生更輕鬆</h2>
          <p className="slogan-subtitle">
            <span className="text-primary-600 me-1">一盒甜</span>
            幫你安排一場好吃又不膩的甜點旅程
          </p>
        </div>
        <NavLink to="/themedetail/1" className="btn-primary-icon">
          立刻訂閱
          <Icon className="ms-2" icon="tdesign:swap-right" width="24" height="24" />
        </NavLink>
      </div>
    </section>
  );
}

export default HeroBanner;
