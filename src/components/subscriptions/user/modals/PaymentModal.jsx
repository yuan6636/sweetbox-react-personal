// 外部工具
import { useCallback, useEffect, useState, useRef } from 'react';
import { message } from 'antd';
import { Modal } from 'bootstrap';

// api
import api from '../../../../api';

// 元件區
import ConfirmModal from '../ConfirmModal';
import PaymentModalContent from './PaymentModalContent';

function PaymentModal({
  modalRef,
  handleCloseModal,
  isAdd,
  onToggleAddCard,
  subscription,
  onSubscriptionUpdated,
  fetchSubscriptions,
}) {
  const [cards, setCards] = useState([]);
  const [cardToRemove, setCardToRemove] = useState(null);
  const confirmModalRef = useRef(null);

  const fetchPaymentData = useCallback(async () => {
    const userId = subscription?.userId;

    if (!userId) return;

    try {
      const paymentsRes = await api.get(`/payment_methods?userId=${userId}`);

      setCards(paymentsRes.data);
    } catch (error) {
      console.error('載入付款資料失敗：', error);
    }
  }, [subscription?.userId]);

  useEffect(() => {
    (async () => {
      fetchPaymentData();
    })();
  }, [fetchPaymentData]);

  // 確定有拿到訂閱資料才開 Modal
  if (!subscription) return null;

  const handleRemoveCard = async (cardId) => {
    try {
      await api.patch(`/payment_methods/${cardId}`, {
        isDeleted: true,
      });
      fetchPaymentData();
      message.success('已成功移除信用卡');
    } catch (error) {
      console.error('移除信用卡失敗', error);
      message.error('移除信用卡失敗，請稍後再試！');
    }
  };

  const closeRemoveConfirm = () => {
    const paymentModal = modalRef.current;
    const confirmModal = confirmModalRef.current;
    if (!paymentModal || !confirmModal) return;

    document.activeElement?.blur();

    // 監聽 ConfirmModal，確定關閉才打開 PaymentModal
    confirmModal.addEventListener(
      'hidden.bs.modal',
      () => {
        Modal.getOrCreateInstance(paymentModal).show();
      },
      { once: true },
    );
    Modal.getOrCreateInstance(confirmModal).hide();
  };

  return (
    <>
      <div
        className="modal fade"
        tabIndex="-1"
        aria-labelledby="paymentManageModalLabel"
        ref={modalRef}
      >
        <div className="modal-dialog modal-fullscreen-lg-down modal-wide">
          <div className="modal-content bg-neutral-200 border-0 p-lg-8 pb-13">
            {/* Modal header */}
            <div className="modal-header p-0 justify-content-center justify-content-lg-between mb-0 mb-lg-6">
              <div className="text-start">
                <h1 className="ls-1 mb-0 mb-lg-2 modal-title" id="paymentManageModalLabel">
                  設定付款方式
                </h1>
                <p className="small text-neutral-700 d-none d-lg-block">
                  管理您的信用卡資訊與訂閱扣款卡片
                </p>
              </div>
              <button
                type="button"
                className="btn-close btn-close-lg align-self-start me-0 mt-0 d-none d-lg-block"
                aria-label="Close"
                onClick={() => {
                  handleCloseModal();
                }}
              ></button>
            </div>
            {/* Modal 內容 */}
            <div className="modal-body p-6 p-lg-0 d-flex gap-6">
              <PaymentModalContent
                isAdd={isAdd}
                onToggleAddCard={onToggleAddCard}
                subscription={subscription}
                cards={cards}
                onSubscriptionUpdated={onSubscriptionUpdated}
                modalRef={modalRef}
                confirmModalRef={confirmModalRef}
                onRemoveCard={(card) => setCardToRemove(card)}
                handleCloseModal={handleCloseModal}
                fetchSubscriptions={fetchSubscriptions}
                fetchPaymentData={fetchPaymentData}
              />
            </div>
            {/* 付款管理 Modal 行動版固定下方的按鈕*/}
            {isAdd ? (
              <div className="payment-button-container d-flex d-lg-none">
                <button
                  type="button"
                  className="btn py-3 px-4 border-0 me-6 flex-grow-1"
                  onClick={() => onToggleAddCard(false)}
                >
                  取消新增
                </button>
                <button
                  type="submit"
                  form="add-card-form"
                  className="btn btn-cta-200 btn-action py-3 px-6 flex-grow-1"
                >
                  確認並儲存
                </button>
              </div>
            ) : (
              <div className="payment-button-container d-block d-lg-none">
                <button
                  type="button"
                  className="btn btn-cta-200 btn-action w-100 py-3"
                  onClick={() => {
                    handleCloseModal();
                    fetchSubscriptions();
                  }}
                >
                  完成管理
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <ConfirmModal
        confirmModalRef={confirmModalRef}
        title="移除信用卡"
        description={
          cardToRemove
            ? `確定要移除 ${cardToRemove.cardBrand.toUpperCase()} **** ${cardToRemove.lastFour} 嗎?`
            : ''
        }
        onConfirm={() => handleRemoveCard(cardToRemove.id)}
        handleCloseModal={closeRemoveConfirm}
      />
    </>
  );
}

export default PaymentModal;
