import { Icon } from '@iconify/react';

// helpers
import { calculatePenalty } from '../../../../utils/subscriptionHelpers';

function CancelReminderModal({
  cancelReminderModalRef,
  handleModalState,
  handleCloseModal,
  subscription,
}) {
  if (!subscription) return null;

  const { unitDifference, deliveredCount, penalty } = calculatePenalty(subscription);

  return (
    <div
      className="modal fade"
      tabIndex="-1"
      aria-labelledby="cancelReminderModalLabel"
      role="dialog"
      ref={cancelReminderModalRef}
    >
      <div className="modal-dialog modal-fullscreen-lg-down modal-wide mx-auto">
        <div className="modal-content bg-transparent">
          <div className="d-flex flex-column flex-sm-row cancel-modal">
            {/* 取消訂閱提醒 Modal 左側 */}
            <div className="cancel-modal-left d-flex justify-content-center align-items-center bg-neutral-800">
              <div className="cancel-modal-left-content">
                <div className="notice-icon-wrapper d-flex justify-content-center align-items-center mb-8">
                  <Icon icon="gridicons:notice-outline" width="32" height="32"></Icon>
                </div>
                <div className="px-2 px-sm-0">
                  <h2
                    className="cancel-modal-title desktop-title text-neutral-100 ls-1 mb-4"
                    id="cancelReminderModalLabel"
                  >
                    確定要取消訂閱嗎？
                  </h2>
                  <h2 className="cancel-modal-title mobile-title text-neutral-100 ls-1 mb-4">
                    真的要離開嗎？
                  </h2>
                  <p className="text-neutral-250 fs-8">
                    我們很遺憾看到您要結束訂閱旅程。取消後，您的會員專屬方案與目前的優惠折扣將失效。
                  </p>
                </div>
              </div>
            </div>
            {/* 取消訂閱提醒 Modal 右側 */}
            <div className="cancel-modal-right bg-neutral-200">
              <div className="cancel-modal-reminder-content">
                <div className="d-none d-sm-block text-end">
                  <button
                    type="button"
                    className="btn-close btn-close-lg"
                    aria-label="Close"
                    onClick={() => {
                      handleCloseModal();
                      handleModalState(null, null);
                    }}
                  ></button>
                </div>
                <div className="d-flex flex-column gap-6 gap-sm-8">
                  {/* 右側標題 */}
                  <div>
                    <p className="fs-9 text-neutral-700 mb-2">NOTICE</p>
                    <h1 className="h6 ls-1">提前取消說明</h1>
                  </div>
                  {/* 右側說明 */}
                  <div className="modal-info-card">
                    <p className="mb-8">
                      {`您的「${subscription.durationMonths}個月${subscription.theme.title}」已享有連續 ${deliveredCount} 期的優惠折扣。若現在終止訂閱，將失去 $${unitDifference}/盒
                      的優惠折扣，並需補足先前 ${deliveredCount} 期的差額共：`}
                    </p>
                    <p className="d-flex gap-4 align-items-end">
                      <span className="text-label">補貼總額</span>
                      <span className="h2 ls-1">${penalty}</span>
                      <span className="text-label">NTD</span>
                    </p>
                  </div>
                  {/* 桌面版下方按鈕 */}
                  <div className="d-none d-sm-flex flex-column gap-3">
                    <button
                      type="button"
                      className="btn btn-cta-200 btn-action py-3 px-6"
                      onClick={() => {
                        handleCloseModal();
                        handleModalState(null, null);
                      }}
                    >
                      保留訂閱，繼續甜點旅程
                    </button>
                    <button
                      type="button"
                      className="btn py-3 fs-8 text-neutral-700 border-0"
                      onClick={() => {
                        handleCloseModal();
                        handleModalState('cancelConfirm', subscription);
                      }}
                    >
                      確認前往取消並支付價差
                    </button>
                  </div>
                </div>
              </div>
              {/* 取消訂閱提醒 Modal 行動版下方按鈕 */}
              <div className="payment-button-container d-flex gap-3 d-sm-none">
                <button
                  className="btn flex-grow-1 border-0"
                  onClick={() => {
                    handleCloseModal();
                    handleModalState('cancelConfirm', subscription);
                  }}
                >
                  取消訂閱
                </button>
                <button
                  className="btn btn-cta-200 btn-action flex-grow-1"
                  onClick={() => {
                    handleCloseModal();
                    handleModalState(null, null);
                  }}
                >
                  保留訂閱
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CancelReminderModal;
