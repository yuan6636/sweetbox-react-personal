import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Icon } from '@iconify/react';

function NavIcon({ to, icon, activeIcon, label }) {
  const [isHover, setIsHover] = useState(false);

  const handleMouseEnter = () => {
    setIsHover(true);
  };

  const handleMouseLeave = () => {
    setIsHover(false);
  };

  return (
    <NavLink
      to={to}
      className="p-3 nav-icon"
      aria-label={label}
      onMouseEnter={() => handleMouseEnter()}
      onMouseLeave={() => handleMouseLeave()}
    >
      {({ isActive }) => (
        <Icon icon={isActive || isHover ? activeIcon : icon} width="24" height="24" />
      )}
    </NavLink>
  );
}

export default NavIcon;
