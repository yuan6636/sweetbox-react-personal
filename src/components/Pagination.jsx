import { Icon } from '@iconify/react';

function Pagination({ currentPage, totalItems, itemsPerPage, onChangePage }) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleClick = (page) => {
    if (page >= 1 && page <= totalPages) {
      onChangePage(page);
    }
  };

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
            <div className="dropdown dropdown-center">
              <button
                type="button"
                className="page-link border border-1"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {currentPage}
              </button>
              <ul className="dropdown-menu dropdown-menu-page">
                <li className="dropdown-menu-page-header">
                  第 {currentPage} / {totalPages} 頁
                </li>
                <li className="dropdown-menu-page-scroll">
                  <ul className="dropdown-menu-page-list">
                    {Array.from({ length: totalPages }, (_, i) => (
                      <li key={i}>
                        <button className="dropdown-item" onClick={() => handleClick(i + 1)}>
                          第{i + 1}頁
                        </button>
                      </li>
                    ))}
                  </ul>
                </li>
              </ul>
            </div>
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
      </nav>
    </>
  );
}

export default Pagination;
