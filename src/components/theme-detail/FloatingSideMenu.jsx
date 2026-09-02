import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

function FloatingSideMenu({ themes, lastMenuItemRef }) {
  const [show, setShow] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    let lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    let hideTimeout;
    // 選單中最後一個主題距離頁面最上方實際的位置
    const scrollTriggerY =
      lastMenuItemRef.current?.offsetTop + lastMenuItemRef.current?.offsetHeight || 800;

    const onScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      // 往下滾動距離超過觸發點位置，可以開始顯示選單
      if (scrollTop > scrollTriggerY) {
        // 往上滾動且滑鼠未懸停，顯示選單
        if (scrollTop < lastScrollTop) {
          if (!isHovering) setShow(true);
          clearTimeout(hideTimeout);
          hideTimeout = setTimeout(() => {
            // 2.5 秒後滑鼠未懸停，隱藏選單
            if (!isHovering) setShow(false);
          }, 2500);
        } else {
          setShow(false);
        }
      } else {
        setShow(false);
      }

      lastScrollTop = scrollTop;
    };

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [isHovering, lastMenuItemRef]);

  if (!themes) return null;

  return (
    <nav
      className={`side-menu-float position-fixed top-50 translate-middle-y ms-2 ${
        show ? 'show' : ''
      }`}
      onMouseEnter={() => {
        setIsHovering(true);
        setShow(true);
      }}
      onMouseLeave={() => {
        setIsHovering(false);
        setTimeout(() => setShow(false), 2500);
      }}
    >
      <h5 className="text-center fw-bold fs-lg-7 text-nowrap ls-1 py-lg-5 ps-1">主題一覽</h5>
      <ul className="nav flex-lg-column side-menu gap-2 py-2 py-lg-0">
        {themes.map((theme) => (
          <li key={theme.id} className="nav-item">
            <NavLink
              to={`/themeDetail/${theme.id}`}
              className={({ isActive }) =>
                'nav-link d-flex align-items-center' + (isActive ? ' active' : '')
              }
            >
              {theme.title}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default FloatingSideMenu;
