import { Icon } from '@iconify/react';

function Pagination({ currentPage, totalItems, itemsPerPage, onChangePage }) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleClick = (e, page) => {
    e.preventDefault();
    if (page >= 1 && page <= totalPages) {
      onChangePage(page);
    }
  };

  return (
    <>
      {/* 桌面板 */}
      <nav aria-label="Page navigation example" className="d-none d-lg-block">
        <ul className="pagination sub-pagination">
          {/* 只有不是第一頁才顯示左箭頭 */}
          {currentPage > 1 && (
            <li className="page-item">
              <a
                className="page-link"
                href="#"
                aria-label="Previous"
                onClick={(e) => handleClick(e, currentPage - 1)}
              >
                <Icon icon="iconamoon:arrow-left-2-bold" width="14" height="14" />
              </a>
            </li>
          )}

          {Array.from({ length: totalPages }, (_, index) => (
            <li className={`page-item ${currentPage === index + 1 ? 'active' : ''}`} key={index}>
              <a className="page-link" href="#" onClick={(e) => handleClick(e, index + 1)}>
                {index + 1}
              </a>
            </li>
          ))}

          {/* 只有不是最後一頁才顯示右箭頭 */}
          {currentPage < totalPages && (
            <li className="page-item">
              <a
                className="page-link"
                href="#"
                aria-label="Next"
                onClick={(e) => handleClick(e, currentPage + 1)}
              >
                <Icon icon="iconamoon:arrow-right-2-bold" width="14" height="14" />
              </a>
            </li>
          )}
        </ul>
      </nav>

      {/* 手機板 */}
      <nav aria-label="Page navigation example" className="d-lg-none d-block">
        <ul className="pagination sub-pagination">
          {/* 只有不是第一頁才顯示左箭頭 */}
          {currentPage > 1 && (
            <li className="page-item">
              <a
                className="page-link"
                href="#"
                aria-label="Previous"
                onClick={(e) => handleClick(e, currentPage - 1)}
              >
                <Icon icon="iconamoon:arrow-left-2-bold" width="14" height="14" />
              </a>
            </li>
          )}

          <li className="page-item">
            <a className="page-link border border-1" href="#">
              {currentPage}
            </a>
          </li>

          <li className="page-item disabled">
            <a className="page-link" href="#">
              <Icon icon="iconoir:slash" width="16" height="16" />
            </a>
          </li>

          <li className="page-item disabled">
            <a className="page-link" href="#">
              {totalPages}
            </a>
          </li>

          {/* 只有不是最後一頁才顯示右箭頭 */}
          {currentPage < totalPages && (
            <li className="page-item">
              <a
                className="page-link"
                href="#"
                aria-label="Next"
                onClick={(e) => handleClick(e, currentPage + 1)}
              >
                <Icon icon="iconamoon:arrow-right-2-bold" width="14" height="14" />
              </a>
            </li>
          )}
        </ul>
      </nav>
    </>
  );
}

export default Pagination;
