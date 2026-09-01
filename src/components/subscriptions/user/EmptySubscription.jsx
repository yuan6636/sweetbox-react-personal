import { NavLink } from 'react-router-dom';
import { Icon } from '@iconify/react';

function EmptySubscription() {
  return (
    <div className="d-flex flex-column align-items-center gap-3">
      <img src="./images/cart-page/pic-empty.svg" alt="空的購物車圖示" />
      <h2>目前尚未訂閱</h2>
      <p>每個月收到一盒精心挑選的甜點驚喜</p>
      <p>讓我們幫你選，你只管享用</p>
      <NavLink to="/theme" className="btn-primary-icon d-flex align-items-center gap-1">
        <span>探索訂閱方案</span>
        <Icon icon="ant-design:swap-right-outlined" width="24" height="24" />
      </NavLink>
    </div>
  );
}

export default EmptySubscription;
