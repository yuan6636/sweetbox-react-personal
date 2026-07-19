import { Icon } from '@iconify/react';

function DropdownComponent({
  label,
  options,
  onSelect,
  activeValue,
  variant = 'default',
  id,
  menuWidth,
}) {
  const activeOption = options.find((opt) => opt.value === activeValue);
  const dropdownId = id || `dropdownMenu-${variant}`;

  return (
    <div className="sub-dropdown">
      <button
        className={`btn bg-neutral-200 border-0 rounded-pill d-flex align-items-center ${
          variant === 'default' ? 'ps-4 pe-2 py-3' : 'p-3'
        }`}
        type="button"
        id={dropdownId}
        data-bs-toggle="dropdown"
        aria-expanded="false"
        data-bs-display="static"
      >
        {variant === 'default' ? (
          <>
            {activeOption ? activeOption.label : label}
            <div
              className="ms-3 d-flex align-items-center"
              style={{ width: '24px', height: '24px' }}
            >
              <Icon icon="iconamoon:arrow-down-2-bold" width="20" height="20" />
            </div>
          </>
        ) : (
          <div className="three-dots text-neutral-700">
            <span></span>
            <span></span>
            <span></span>
          </div>
        )}
      </button>

      <ul
        className={`dropdown-menu sub-dropdown-menu m-0 shadow-sm ${menuWidth === 124 ? 'w-124' : menuWidth === 84 ? 'w-84' : ''}`}
        aria-labelledby={dropdownId}
      >
        {options.map((opt, idx) => (
          <li key={idx}>
            <button
              type="button"
              className={`dropdown-btn ${activeValue === opt.value ? 'active' : ''}`}
              onClick={() => onSelect(opt.value)}
            >
              {opt.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DropdownComponent;
