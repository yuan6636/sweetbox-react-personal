import { NavLink } from 'react-router-dom';

function AdminNav() {
  const navItems = ['主題管理', '訂閱管理', '訂單管理', '評論管理', '客服管理', '優惠管理'];
  return (
    <nav className="adminNav mb-6">
      <div className="container-fluid">
        <ul className="d-flex">
          {navItems.map((navItem) => {
            return (
              <li className="adminNav-item" key={navItem}>
                {navItem}
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

export default AdminNav;
