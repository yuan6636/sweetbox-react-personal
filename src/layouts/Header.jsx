import { useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { Tooltip } from 'bootstrap';

import NavIcon from '../components/NavIcon';
import useTooltip from '../hooks/useTooltip';
import { useCart } from '../contexts/cart';
import { useAuth } from '../contexts/auth';

function Header() {
  // Context hook
  const { user, logout } = useAuth();
  const { cartMain, clearCart } = useCart();
  // 自訂義 hook
  const customerServiceRef = useTooltip();
  const userNameRef = useTooltip(user);

  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const cartCount = cartMain?.cart_items?.length || 0;

  useEffect(() => {
    // 使用者未登入，清空購物車
    const resetCartCount = () => {
      clearCart();
    };

    if (!user) {
      resetCartCount();
    }
  }, [user, clearCart]);

  return (
    <nav className="navbar pt-3 px-3 pt-lg-5 px-lg-0">
      <div className="container header py-1 px-4 py-lg-2 px-lg-9">
        <div className="flex-equal">
          <NavLink to="/">
            <picture>
              <source srcSet="./images/Home_Page/sweetBox_logo.svg" media="(min-width: 992px)" />
              <img
                className="logo-icon"
                src="./images/Home_Page/sweetBox_logo_3.svg"
                alt="一盒甜logo"
              />
            </picture>
          </NavLink>
        </div>
        <div className="d-none d-lg-block flex-equal">
          <NavLink to="/theme" className="nav-link">
            <span className="underline">主題一覽</span>
          </NavLink>
        </div>
        <ul className="nav d-none d-lg-flex align-items-center">
          {!user?.isAdmin && (
            <>
              <li className="nav-item p-3">
                <span
                  ref={customerServiceRef}
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                  data-bs-title="Coming Soon"
                >
                  <Icon icon="ri:customer-service-line" width="24" height="24" />
                </span>
              </li>
              <li className="nav-item position-relative">
                <NavIcon
                  to="/cart"
                  icon="mynaui:cart"
                  activeIcon="mynaui:cart-solid"
                  label="購物車圖示"
                />
                {cartCount > 0 && (
                  <span className="cart-count position-absolute d-flex justify-content-center align-items-center top-0 end-0 rounded-circle">
                    {cartCount}
                  </span>
                )}
              </li>
            </>
          )}
          <li className="nav-item ">
            {user ? (
              <div className="dropdown">
                {/* 使用者頭像 */}
                <button
                  type="button"
                  className="btn dropdown-toggle d-flex align-items-center py-3 px-6 border-0 user-avatar-btn"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <div className="avatar me-2">
                    {user?.avatar ? (
                      <img className="d-block" src={user.avatar} alt="使用者頭像" />
                    ) : (
                      <Icon icon="carbon:user-avatar-filled" width="24" height="24" />
                    )}
                  </div>
                  <span
                    ref={userNameRef}
                    className="user-name"
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    data-bs-title={user?.name || '訪客'}
                  >
                    {user?.name || '訪客'}
                  </span>
                </button>
                {/* 使用者頭像下拉選單 */}
                <ul className="dropdown-menu dropdown-menu-avatar" data-bs-popper="static">
                  {user?.isAdmin ? (
                    <li>
                      <NavLink className="dropdown-item d-block" to="/admin/subscribe">
                        後台管理
                      </NavLink>
                    </li>
                  ) : (
                    <li>
                      <NavLink className="dropdown-item d-block" to="/subscription">
                        訂閱管理
                      </NavLink>
                    </li>
                  )}
                  <li>
                    <button className="dropdown-item d-block" onClick={handleLogout}>
                      登出
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <NavLink to="/login" className="nav-link dropdown-item px-4">
                <span className="underline">登入 / 註冊</span>
              </NavLink>
            )}
          </li>
        </ul>

        {/* 漢堡排 button */}
        <div className="dropdown position-static d-lg-none d-block">
          <button
            type="button"
            className="btn dropdown-toggle p-3 border-0 d-inline-block d-lg-none"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <Icon icon="ci:hamburger-md" width="24" height="24" />
          </button>
          {/* 漢堡排下拉選單 */}
          <ul className="dropdown-menu fs-6 dropdown-menu-burger d-lg-none">
            <li className="dropdown-item-wrapper">
              <NavLink className="dropdown-item" to="/">
                首頁
              </NavLink>
            </li>
            <li className="dropdown-item-wrapper">
              <NavLink className="dropdown-item" to="/theme">
                主題一覽
              </NavLink>
            </li>
            {user?.isAdmin ? (
              // 管理者顯示
              <li className="dropdown-item-wrapper">
                <NavLink className="dropdown-item" to="/admin/subscribe">
                  後台管理
                </NavLink>
              </li>
            ) : (
              // 訪客、一般使用者顯示
              <>
                <li className="dropdown-item-wrapper">
                  <NavLink className="dropdown-item" to="/service">
                    客服諮詢
                  </NavLink>
                </li>
                <li className="dropdown-item-wrapper">
                  <NavLink className="dropdown-item" to="/cart">
                    購物車
                  </NavLink>
                </li>
                {user && (
                  <li className="dropdown-item-wrapper">
                    <NavLink className="dropdown-item" to="/subscription">
                      訂閱管理
                    </NavLink>
                  </li>
                )}
              </>
            )}
            {user ? (
              <li className="dropdown-item-wrapper">
                <button className="dropdown-item" onClick={handleLogout}>
                  登出
                </button>
              </li>
            ) : (
              <li className="dropdown-item-wrapper">
                <NavLink to="/login" className="dropdown-item">
                  登入 / 註冊
                </NavLink>
              </li>
            )}

            <li className="dropdown-item-wrapper">
              <button type="button" className="btn border-0 dropdown-item" aria-expanded="true">
                <Icon icon="material-symbols:close" width="32" height="32" />
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Header;
