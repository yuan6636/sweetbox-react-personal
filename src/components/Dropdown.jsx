import { Icon } from '@iconify/react';
import { useEffect, useRef, useState } from 'react';

function Dropdown({
  options,
  width = '108px',
  variant = 'default',
  value,
  onChange,
  prefix,
  buttonClass,
}) {
  const [option, setOption] = useState(options?.[0]?.label ?? '');
  const [isSelected, setIsSelected] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  function selectOption(e, opt) {
    e.preventDefault();
    setOption(opt.label);
    setIsSelected(true);
    setIsOpen(false);

    if (onChange) {
      onChange(opt.value); // 把選中的 value 傳出去
    }
  }

  // 當外部 value 改變時，更新內部顯示
  useEffect(() => {
    const matched = options.find((opt) => opt.value === value);
    const updateOption = (isMatched, options) => {
      if (isMatched) {
        setOption(isMatched.label);
        setIsSelected(value !== options?.[0]?.value); // 第一個通常是 "全部"
      }
    };
    updateOption(matched, options);
  }, [value, options]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  if (!options || options.length === 0) return null;

  // 顯示文字邏輯：有 prefix 且不是全部時才加上前綴
  const displayText = prefix && value !== options?.[0]?.value ? `${prefix}：${option}` : option;

  return (
    <div className="dropdown dropdown-neutral-250">
      {variant === 'default' ? (
        <button
          ref={dropdownRef}
          className={`btn btn-secondary dropdown-toggle d-flex justify-content-center align-items-center
          ${isSelected ? 'text-neutral-800' : ''}
          ${isOpen ? 'is-open' : ''} ${buttonClass || ''}`}
          style={{ width }}
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <span className="me-1">{displayText}</span>
          <Icon icon="iconamoon:arrow-down-2-bold" width="20" height="20" />
        </button>
      ) : (
        <button
          ref={dropdownRef}
          className={`btn btn-secondary dropdown-toggle d-flex justify-content-center align-items-center p-3 ${isOpen ? 'is-open' : ''}`}
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <div className="three-dots text-neutral-700">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
      )}
      <ul
        className={`dropdown-menu mt-2 dropdown-menu-neutral-250 ${isOpen ? 'show' : ''}`}
        style={{ right: 0, width }}
      >
        {options.map((opt, index) => (
          <li key={index}>
            <a className="dropdown-item" onClick={(e) => selectOption(e, opt)}>
              {opt.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dropdown;
