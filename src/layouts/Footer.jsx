// 外部資源
import { NavLink } from 'react-router-dom';

// hooks
import { useAuth } from '../contexts/auth';

function Footer() {
  const { user } = useAuth();

  return (
    <footer className="footer bg-neutral-400 position-relative">
      <div className="footer-wave"></div>
      <nav className="container d-flex flex-column flex-lg-row justify-content-between align-items-center mb-3 px-0">
        <NavLink to="/">
          <img
            className="footer-logo mb-3 mb-lg-0"
            src="./images/Home_Page/sweetBox_logo.svg"
            alt="一盒甜logo"
          />
        </NavLink>
        <ul className="d-flex gap-1 gap-lg-6 mb-3 mb-lg-0">
          <li className="footer-nav-item">
            <NavLink to="/theme">主題一覽</NavLink>
          </li>
          {user?.isAdmin ? (
            <li className="footer-nav-item">
              <NavLink to="/admin/subscribe">後台管理</NavLink>
            </li>
          ) : (
            <li className="footer-nav-item">
              <NavLink to="/subscription">會員中心</NavLink>
            </li>
          )}
        </ul>
        <ul className="d-flex gap-6">
          <li>
            <a className="social-link" href="#">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M1.503 6.977A3.375 3.375 0 0 1 4.875 3.75h14.25a3.375 3.375 0 0 1 3.372 3.227l-1.107.615L12 12.648 2.61 7.592l-1.107-.615ZM1.5 8.691v8.184a3.375 3.375 0 0 0 3.375 3.375h14.25a3.375 3.375 0 0 0 3.375-3.375V8.691l-.395.22-9.75 5.25a.75.75 0 0 1-.71 0l-9.76-5.255L1.5 8.69Z"
                />
              </svg>
            </a>
          </li>
          <li>
            <a className="social-link" href="#">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M12 2.04c-5.5 0-10 4.49-10 10.02c0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.89 3.78-3.89c1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.53-4.5-10.02-10-10.02"
                />
              </svg>
            </a>
          </li>
          <li>
            <a className="social-link" href="#">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M12 8.75a3.25 3.25 0 1 0 0 6.5a3.25 3.25 0 0 0 0-6.5"
                />
                <path
                  fill="currentColor"
                  fillRule="evenodd"
                  d="M6.77 3.082a47.5 47.5 0 0 1 10.46 0c1.899.212 3.43 1.707 3.653 3.613a45.7 45.7 0 0 1 0 10.61c-.223 1.906-1.754 3.401-3.652 3.614a47.5 47.5 0 0 1-10.461 0c-1.899-.213-3.43-1.708-3.653-3.613a45.7 45.7 0 0 1 0-10.611C3.34 4.789 4.871 3.294 6.77 3.082M17 6a1 1 0 1 0 0 2a1 1 0 0 0 0-2m-9.75 6a4.75 4.75 0 1 1 9.5 0a4.75 4.75 0 0 1-9.5 0"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </li>
        </ul>
      </nav>
      <p className="text-center copyright">Copyright © 2026 Sweet in a box</p>
    </footer>
  );
}

export default Footer;
