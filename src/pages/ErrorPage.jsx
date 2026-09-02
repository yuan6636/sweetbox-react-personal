import { useEffect } from 'react';
import { Link, useNavigate, useRouteError, isRouteErrorResponse } from 'react-router-dom';

function ErrorPage() {
  const navigate = useNavigate();
  const error = useRouteError();

  /**
   * 取得可顯示於畫面上的 Error Code 文字。
   * - React Router 的 route error response 會帶有 status，優先顯示。
   * - 一般 JS Error 則顯示其名稱。
   * - 完全沒有錯誤資訊時，回傳 "Unknown Error"。
   */
  function getErrorCode(error) {
    // isRouteErrorResponse 判斷是否為 React Router 路由層級錯誤
    if (isRouteErrorResponse(error)) {
      return `Error ${error.status}`;
    }
    if (error instanceof Error && error.name) {
      return error.name;
    }
    return 'Unknown Error';
  }

  useEffect(() => {
    if (error) {
      console.error('[ErrorPage] Route error caught:', error);
    }
  }, [error]);

  const errorCode = getErrorCode(error);

  return (
    <main className="error-page d-flex align-items-center justify-content-center">
      <section className="error-card bg-white text-center">
        {/* 圖片 */}
        <img src="./images/error-page/pic-error.png" alt="" />

        <h1 className="title">發生了一點小意外...</h1>

        {/* 說明文字 */}
        <p className="description">
          很抱歉，頁面暫時無法顯示。
          <br />
          請稍後再試，或返回首頁繼續探索。
        </p>

        {/* 操作按鈕：Desktop 水平排列，Mobile 改上下排列 */}
        <div className="actions d-flex">
          <Link to="/" className="btn btn-cta-100 rounded-pill flex-equal">
            回首頁
          </Link>
          <button
            type="button"
            className="btn btn-outline-neutral-800 rounded-pill flex-equal"
            onClick={() => navigate(-1)}
          >
            返回上一頁
          </button>
        </div>

        {/* 底部：Error Code */}
        <p className="code">{errorCode}</p>
      </section>
    </main>
  );
}

export default ErrorPage;
