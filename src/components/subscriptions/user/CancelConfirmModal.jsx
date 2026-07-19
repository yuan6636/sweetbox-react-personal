import { Icon } from '@iconify/react';
import api from '../../../api';

// 信用卡 icon 樣式
const cardIcons = {
  visa: 'logos:visaelectron',
  mastercard: 'logos:mastercard',
  jcb: 'logos:jcb',
};

// 生成發票號碼
const generateInvoiceNumber = () => {
  // 兩個隨機英文字母
  const letters = Array.from({ length: 2 }, () => {
    return String.fromCharCode(Math.floor(Math.random() * 26) + 65);
  }).join('');

  // 後面 6 位數字
  const numbers = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, '0');

  return `${letters}-${numbers}`;
};

function CancelConfirmModal({
  cancelConfirmModalRef,
  handleCloseModal,
  handleModalState,
  subscription,
  fetchSubscriptions,
}) {
  if (!subscription) return null;

  // 現在時間
  const currentTime = new Date().toISOString();

  // 取得訂單編號
  const getOrderNo = (subscription) => {
    const subscriptionNumber = subscription.subscriptionNumber;
    return `${subscriptionNumber}CF`;
  };

  // 格式化日期 YYYY-MM-DD
  const formatDate = (date) => {
    return new Date(date).toISOString().slice(0, 10);
  };

  // 計算罰金與已訂閱期數
  const deliveredCount = Math.max(...subscription.orders.map((order) => order.cycle));
  const { discountPrice, originalPrice } = subscription.plan;
  const difference = Math.abs(discountPrice - originalPrice);

  const penalty = deliveredCount * difference;

  const { id } = subscription;

  const handelCancelSubscription = async (subscriptionId) => {
    try {
      const orderNo = getOrderNo(subscription);
      const invoiceNumber = generateInvoiceNumber();

      // 新增訂單的資料
      const newOrder = {
        subscriptionId: id,
        orderNo,
        cycle: '-',
        amount: penalty,
        paymentDueDate: formatDate(currentTime),
        createdAt: currentTime,
        paymentStatus: 'paid',
        paymentDate: formatDate(currentTime),
        shippingStatus: 'not_required',
        shippingDate: null,
        invoice: {
          number: invoiceNumber,
          date: currentTime,
          fileUrl: `/invoices/${orderNo}.pdf`,
        },
        isArchived: false,
      };

      // 新增一筆訂單、修改訂閱狀態
      await api.post('/orders', newOrder);
      await api.patch(`/subscriptions/${subscriptionId}`, {
        status: 'cancelled',
        nextPaymentDate: formatDate(currentTime),
      });
    } catch (error) {
      console.error('取消訂閱失敗:', error?.message || '請稍後再試！');
    }
  };

  return (
    <div
      className="modal fade"
      tabIndex="-1"
      aria-labelledby="cancelConfirmModalLabel"
      role="dialog"
      ref={cancelConfirmModalRef}
    >
      <div className="modal-dialog modal-fullscreen-sm-down modal-wide mx-auto px-sm-2">
        <div className="modal-content bg-transparent">
          <div className="d-flex flex-column flex-sm-row cancel-modal">
            {/* 取消訂閱確認 Modal 左側 */}
            <div className="cancel-modal-left bg-neutral-100 d-none d-sm-block">
              <div className="cancel-modal-left-content h-100 d-flex flex-column justify-content-between">
                {/* 結算明細 */}
                <div>
                  <p className="text-label mb-6 fw-bold ls-1 lh-sm">結算明細</p>
                  <div className="d-flex gap-4">
                    <div className="theme-wrapper">
                      <img
                        className="align-self-start rounded-3"
                        src={subscription.theme.images.square}
                        alt="甜點盒圖片"
                      />
                    </div>
                    <div>
                      <p className="h6 ls-1 mb-6">{subscription.theme.title}</p>
                      <ul className="d-flex flex-column gap-3">
                        <li>
                          <p className="mb-1 text-label">訂閱編號</p>
                          <p className="small">{subscription.subscriptionNumber}</p>
                        </li>
                        <li>
                          <p className="mb-1 text-label">已配送期數</p>
                          <p className="small">
                            {deliveredCount}/{subscription.durationMonths}期
                          </p>
                        </li>
                        <li>
                          <p className="mb-1 text-label">訂閱數量</p>
                          <p className="small">{subscription.quantity} 盒</p>
                        </li>
                        <li>
                          <p className="mb-1 text-label">訂閱價格</p>
                          <p className="small">
                            NT${subscription.unitPrice * subscription.quantity}
                            /月
                          </p>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                {/* 扣款方式 */}
                <div className="rounded-4 p-4 bg-neutral-200">
                  <p className="text-label mb-3">扣款方式</p>
                  <div className="d-flex gap-2 align-items-center">
                    <div className="credit-card-logo">
                      <Icon
                        icon={cardIcons[subscription.paymentSnapshot.cardBrand]}
                        width="28"
                        height="16"
                      />
                    </div>
                    <p>**** **** **** {subscription.paymentSnapshot.lastFour}</p>
                  </div>
                </div>
              </div>
            </div>
            {/* 取消訂閱確認 Modal 右側 */}
            <div className="cancel-modal-right bg-neutral-200">
              <div className="cancel-modal-confirm-content">
                {/* 關閉按鈕 */}
                <div className="d-none d-sm-block text-end">
                  <button
                    type="button"
                    className="btn-close btn-close-md"
                    aria-label="Close"
                    onClick={() => {
                      handleCloseModal();
                      handleModalState(null, null);
                    }}
                  ></button>
                </div>
                <div className="d-flex flex-column gap-8">
                  {/* 最後確認標題 */}
                  <div>
                    <h1 className="h4 ls-1 mb-2" id="cancelConfirmModalLabel">
                      最後確認
                    </h1>
                    <p className="small text-neutral-700">
                      提前解約將收取原價差額補貼，請確認以下結算明細
                    </p>
                  </div>
                  {/* 確認結算明細和補貼總額 */}
                  <div>
                    <div className="subscription-summary d-flex flex-column gap-1 mb-4">
                      <p className="subscription-summary-item">
                        <span>單期原價</span>
                        <span>${subscription.plan.originalPrice}</span>
                      </p>
                      <p className="subscription-summary-item">
                        <span>訂閱優惠價</span>
                        <span>${subscription.plan.discountPrice}</span>
                      </p>
                      <div className="subscription-info-divider"></div>
                      <p className="subscription-summary-item">
                        <span>每期優惠金額(價差)</span>
                        <span>${difference}</span>
                      </p>
                      <p className="subscription-summary-item">
                        <span>累計已配送期數</span>
                        <span>{deliveredCount}期</span>
                      </p>
                    </div>
                    <div className="rounded-3 p-4 bg-primary-200 d-flex justify-content-between">
                      <span className="fs-8 fw-bold ls-1 lh-sm">補貼總額計算</span>
                      <span className="fs-8 fw-bold ls-1 lh-sm text-primary-600">
                        ${difference} X {deliveredCount}期 = ${penalty}
                      </span>
                    </div>
                  </div>
                  {/* 取消訂閱確認 Modal 桌面版按鈕 */}
                  <div className="d-none d-sm-flex flex-column gap-3">
                    <button
                      type="button"
                      className="btn btn-semantic-error rounded-pill px-6 py-3 ls-1 lh-sm"
                      onClick={async () => {
                        await handelCancelSubscription(subscription.id);
                        handleCloseModal();
                        handleModalState(null, null);
                        fetchSubscriptions();
                      }}
                    >
                      確認扣款 NT${penalty} ，並取消訂閱
                    </button>
                    <button
                      type="button"
                      className="btn py-3 fs-8 text-neutral-700 border-0"
                      onClick={() => {
                        handleCloseModal();
                        handleModalState('cancelReminder', subscription);
                      }}
                    >
                      返回上一步
                    </button>
                  </div>
                  {/* 行動版扣款方式 */}
                  <div className="rounded-4 p-4 bg-neutral-100 d-sm-none">
                    <p className="text-label mb-3">扣款方式</p>
                    <div className="d-flex align-items-center gap-2">
                      <div className="py-1 px-2">
                        <Icon
                          icon={cardIcons[subscription.paymentSnapshot.cardBrand]}
                          width="28"
                          height="16"
                        />
                      </div>
                      <span>**** **** **** {subscription.paymentSnapshot.lastFour}</span>
                    </div>
                  </div>
                  {/* 行動版訂閱編號卡片 */}
                  <div className="rounded-3 p-4 border border-neutral-400 d-sm-none">
                    {/* 訂閱編號 */}
                    <div className="d-flex gap-4 mb-4">
                      <img
                        className="rounded-3"
                        src={subscription.theme.images.square}
                        alt="甜點盒圖片"
                      />
                      <div>
                        <p className="fs-9 lh-sm ls-1 fw-bold text-neutral-600 mb-1">
                          訂閱編號：{subscription.subscriptionNumber}
                        </p>
                        <p className="fs-8 fw-bold lh-sm ls-1">{subscription.theme.title}</p>
                      </div>
                    </div>
                    {/* 訂閱內容 */}
                    <div className="d-flex gap-4">
                      <div className="flex-grow-1">
                        <p className="text-label mb-1">數量</p>
                        <p>{subscription.quantity} 盒</p>
                      </div>
                      <div className="flex-grow-1">
                        <p className="text-label mb-1">價格</p>
                        <p>NT${subscription.unitPrice * subscription.quantity}/月</p>
                      </div>
                      <div className="flex-grow-1">
                        <p className="text-label mb-1">已配送</p>
                        <p>
                          {deliveredCount}/{subscription.durationMonths}期
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* 取消訂閱確認 Modal 行動板下方按鈕 */}
              <div className="payment-button-container d-flex gap-3 d-sm-none">
                <button
                  className="btn w-100 border-0 py-3 fs-8 text-neutral-700"
                  onClick={() => {
                    handleCloseModal();
                    handleModalState('cancelReminder', subscription);
                  }}
                >
                  返回上一步
                </button>
                <button
                  className="btn btn-semantic-error btn-action py-3 w-100"
                  onClick={async () => {
                    await handelCancelSubscription(subscription.id);
                    handleCloseModal();
                    handleModalState(null, null);
                    fetchSubscriptions();
                  }}
                >
                  扣款並取消訂閱
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CancelConfirmModal;
