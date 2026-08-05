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
            <button className="page-link border border-1" type="button">
              {currentPage}
            </button>
          </li>

          <li className="page-item disabled">
            <button className="page-link" type="button">
              <Icon icon="iconoir:slash" width="16" height="16" />
            </button>
          </li>

          <li className="page-item disabled">
            <button className="page-link" type="button">
              {totalPages}
            </button>
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
