import { NavLink } from 'react-router-dom';

const tabs = [
  { label: '會員資料', to: '/', disabled: true },
  { label: '訂閱管理', to: '/subscription' },
  { label: '我的優惠', to: '/', disabled: true },
  { label: '我的評論', to: '/', disabled: true },
  { label: '推薦獎勵', to: '/', disabled: true },
];

function Tab() {
  return (
    <ul className="nav py-2 mb-sm-6 mb-0 nav-subscription gap-2 gap-sm-0">
      {tabs.map((tab) => (
        <li className="nav-item" key={tab.label}>
          <NavLink
            to={tab.to}
            className={({ isActive }) =>
              `nav-link ${isActive ? 'active' : ''} px-3 py-4 px-sm-4 py-sm-5`
            }
            style={tab.disabled ? { pointerEvents: 'none' } : {}}
          >
            <span className="underline">{tab.label}</span>
          </NavLink>
        </li>
      ))}
    </ul>
  );
}

export default Tab;
