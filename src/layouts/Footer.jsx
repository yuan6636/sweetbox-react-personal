// 外部資源
import { NavLink } from 'react-router-dom';
import { Icon } from '@iconify/react';

// hooks
import { useAuth } from '../contexts/auth';

function Footer() {
  const { user } = useAuth();

  return (
    <footer className="footer bg-neutral-100 position-relative">
      <nav className="container d-flex flex-column flex-lg-row justify-content-between align-items-center mb-3 px-0">
        <NavLink to="/">
          <img
            className="footer-logo mb-3 mb-lg-0"
            src="./images/home-page/logo.svg"
            alt="一盒甜logo"
          />
        </NavLink>
        <ul className="d-flex gap-1 gap-lg-6 mb-3 mb-lg-0">
          <li className="footer-nav-item">
            <NavLink to="/theme">主題一覽</NavLink>
          </li>
          {
            user?.isAdmin ? (
              <li className="footer-nav-item">
                <NavLink to="/admin/subscribe">後台管理</NavLink>
              </li>
            ) : user ? (
              // 一般會員會顯示訂閱管理
              <li className="footer-nav-item">
                <NavLink to="/subscription">訂閱管理</NavLink>
              </li>
            ) : null // 訪客不顯示
          }
        </ul>
        <ul className="d-flex gap-6">
          <li>
            <Icon
              className="social-link"
              icon="fluent:mail-24-filled"
              width="48"
              height="48"
              aria-hidden="true"
            />
          </li>
          <li>
            <Icon
              className="social-link"
              icon="mdi:facebook"
              width="48"
              height="48"
              aria-hidden="true"
            />
          </li>
          <li>
            <Icon
              className="social-link"
              icon="ant-design:instagram-filled"
              width="48"
              height="48"
              aria-hidden="true"
            />
          </li>
        </ul>
      </nav>
      <p className="text-center copyright">Copyright © 2026 Sweet in a box</p>
    </footer>
  );
}

export default Footer;
