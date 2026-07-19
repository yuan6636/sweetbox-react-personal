function OrderSummary({ cartItems, displayCartMain, isSubmitting, isLoading }) {
  return (
    <section className="cart-panel py-4 px-3 p-lg-8 mb-2 mb-lg-6">
      <h2 className="cart-section-title mb-3 mb-lg-6">訂單明細</h2>
      <div className="px-2 px-lg-0 mb-0 mb-sm-6">
        <ul className="fs-8 order-list mb-6">
          {cartItems.map((item) => (
            <li key={item.id} className="py-2 mb-3 d-flex text-neutral-800">
              <div className="flex-shrink-0 me-1 me-lg-2 align-self-lg-center">
                <img
                  className="order-img rounded-2 bg-secondary d-inline-block"
                  src={item.theme?.images?.square}
                  alt={item.theme?.title}
                />
              </div>
              <div className="px-2 flex-grow-1 d-flex flex-column justify-content-center">
                <div className="fw-bold mb-1 text-neutral-800">{item.theme?.title}甜點盒</div>
                <div>
                  <span>{item.plan?.durationMonths}個月訂閱方案</span>
                  <span className="d-none d-lg-inline"> · </span>
                  <span className="d-block d-lg-inline">NT${item.plan?.discountPrice} / 盒</span>
                </div>
              </div>
              <div className="flex-shrink-0 text-end px-2 ms-2 align-self-end">
                <div className="mb-lg-1">x {item.quantity}</div>
                <div className="fw-bold text-neutral-800">
                  NT$
                  {((item.plan?.discountPrice || 0) * item.quantity).toLocaleString()}
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* 小計、折扣、合計 */}
        <div className="lh-base pb-6 mb-6 border-bottom border-neutral-400">
          <p className="d-flex justify-content-between align-items-center mb-2">
            <span>小計</span>
            <span>NT${displayCartMain?.subTotal?.toLocaleString() || 0}</span>
          </p>
          <p className="d-flex justify-content-between align-items-center">
            <span>折扣</span>
            <span className="text-cta-200">
              - NT${displayCartMain?.discountTotal?.toLocaleString() || 0}
            </span>
          </p>
        </div>
        <p className="d-flex justify-content-between align-items-center lh-sm ls-1 fw-bold">
          <span>合計</span>
          <span className="fs-5 lh-base ls-1">
            NT${displayCartMain?.finalTotal?.toLocaleString() || 0}
          </span>
        </p>
      </div>

      <button
        type="submit"
        disabled={isSubmitting || isLoading} // 提交中禁止重複點擊
        className="btn-primary-text w-100 d-none d-sm-block"
      >
        {isSubmitting ? (
          <>
            <span
              className="spinner-border spinner-border-sm me-2"
              role="status"
              aria-hidden="true"
            ></span>
            處理中...
          </>
        ) : (
          '確認支付並下單'
        )}
      </button>
    </section>
  );
}

export default OrderSummary;
