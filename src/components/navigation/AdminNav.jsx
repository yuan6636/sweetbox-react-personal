import { NavLink } from 'react-router-dom';

function AdminNav() {
  const navItems = [
    { label: '主題管理', path: '/topics' },
    { label: '訂閱管理', path: '/admin/subscribe' },
    { label: '訂單管理', path: '/orders' },
    { label: '評論管理', path: '/reviews' },
    { label: '客服管理', path: '/support' },
    { label: '優惠管理', path: '/promotions' },
  ];

  return (
    <nav className="mb-6 d-none d-lg-block">
      <ul className="d-flex adminNav">
        {navItems.map((item) => (
          <li className="nav-item" key={item.label}>
            <NavLink
              to={item.path}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <span className="underline">{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default AdminNav;
