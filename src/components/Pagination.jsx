import { Icon } from '@iconify/react';
import { useState, useRef, useEffect } from 'react';

function Pagination({ currentPage, totalItems, itemsPerPage, onChangePage }) {
  const dropdownRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleClick = (page) => {
    if (page >= 1 && page <= totalPages) {
      onChangePage(page);
    }
  };

  useEffect(() => {
    const handleWindowClick = (e) => {
      if (!dropdownRef.current?.contains(e.target)) {
        setIsOpen(false);
      }
    };
    window.addEventListener('pointerdown', handleWindowClick);

    return () => {
      window.removeEventListener('pointerdown', handleWindowClick);
    };
  }, []);

  return (
    <>
      {/* 桌面板 */}
      <nav aria-label="評論分頁" className="d-none d-lg-block">
        <ul className="pagination sub-pagination">
          {/* 只有不是第一頁才顯示左箭頭 */}
          {currentPage > 1 && (
            <li className="page-item">
              <button
                type="button"
                className="page-link"
                aria-label="Previous"
                onClick={() => handleClick(currentPage - 1)}
              >
                <Icon icon="iconamoon:arrow-left-2-bold" width="14" height="14" />
              </button>
            </li>
          )}

          {Array.from({ length: totalPages }, (_, index) => (
            <li className={`page-item ${currentPage === index + 1 ? 'active' : ''}`} key={index}>
              <button type="button" className="page-link" onClick={() => handleClick(index + 1)}>
                {index + 1}
              </button>
            </li>
          ))}

          {/* 只有不是最後一頁才顯示右箭頭 */}
          {currentPage < totalPages && (
            <li className="page-item">
              <button
                type="button"
                className="page-link"
                aria-label="Next"
                onClick={() => handleClick(currentPage + 1)}
              >
                <Icon icon="iconamoon:arrow-right-2-bold" width="14" height="14" />
              </button>
            </li>
          )}
        </ul>
      </nav>

      {/* 手機板 */}
      <nav aria-label="評論分頁" className="d-lg-none d-block">
        <div className="position-relative" ref={dropdownRef}>
          <ul className="pagination sub-pagination">
            {/* 只有不是第一頁才顯示左箭頭 */}
            {currentPage > 1 && (
              <li className="page-item">
                <button
                  type="button"
                  className="page-link"
                  aria-label="Previous"
                  onClick={() => handleClick(currentPage - 1)}
                >
                  <Icon icon="iconamoon:arrow-left-2-bold" width="14" height="14" />
                </button>
              </li>
            )}

            <li className="page-item">
              <button
                type="button"
                className="page-link border border-1"
                aria-expanded={isOpen}
                onClick={() => setIsOpen((prev) => !prev)}
              >
                {currentPage}
              </button>
            </li>

            <li className="page-item page-item-static">
              <span className="page-link">
                <Icon icon="iconoir:slash" width="16" height="16" />
              </span>
            </li>

            <li className="page-item page-item-static">
              <span className="page-link">{totalPages}</span>
            </li>

            {/* 只有不是最後一頁才顯示右箭頭 */}
            {currentPage < totalPages && (
              <li className="page-item">
                <button
                  type="button"
                  className="page-link"
                  aria-label="Next"
                  onClick={() => handleClick(currentPage + 1)}
                >
                  <Icon icon="iconamoon:arrow-right-2-bold" width="14" height="14" />
                </button>
              </li>
            )}
          </ul>
          {/* 頁碼選單 */}
          <ul className={`dropdown-menu dropdown-menu-page ${isOpen ? 'show' : ''}`}>
            <li className="dropdown-menu-page-header">
              第 {currentPage} / {totalPages} 頁
            </li>
            <li className="dropdown-menu-page-scroll">
              <ul className="dropdown-menu-page-list">
                {Array.from({ length: totalPages }, (_, i) => (
                  <li key={i}>
                    <button
                      className="dropdown-item"
                      onClick={() => {
                        handleClick(i + 1);
                        setIsOpen(false);
                      }}
                    >
                      第{i + 1}頁
                    </button>
                  </li>
                ))}
              </ul>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}

export default Pagination;
