// 外部工具
import { message } from 'antd';
import { Modal } from 'bootstrap';
import { Icon } from '@iconify/react';

// js 工具
import { formatToUpperCase, formatExpiryDate } from '../../../../utils/payment';

// api
import api from '../../../../api';

// 元件區
import AddCardForm from './AddCardForm';

// 信用卡 icon 樣式
const cardIcons = {
  visa: 'logos:visaelectron',
  mastercard: 'logos:mastercard',
  jcb: 'logos:jcb',
};

// 最多的卡片數量
const maxCards = 5;

function PaymentModalContent({
  isAdd,
  onToggleAddCard,
  subscription,
  cards,
  onSubscriptionUpdated,
  modalRef,
  confirmModalRef,
  onRemoveCard,
  handleCloseModal,
  fetchSubscriptions,
  fetchPaymentData,
}) {
  const currentCard = subscription.paymentSnapshot;
  const activeCards = cards?.filter((card) => !card?.isDeleted);

  const handleAddCard = () => {
    onToggleAddCard(true);
  };

  const handleSelectPaymentMethod = async (card, subscriptionId) => {
    const { id: cardId, cardBrand, cardOwner, expiryMonth, expiryYear, lastFour } = card;

    // 選擇信用卡作為下期付款的卡片
    try {
      await api.patch(`/subscriptions/${subscriptionId}`, {
        paymentMethodId: cardId,
        paymentSnapshot: {
          cardOwner,
          cardBrand,
          lastFour,
          expiryMonth,
          expiryYear,
        },
      });

      // 更新父層的 subscription 資料
      onSubscriptionUpdated({
        paymentMethodId: cardId,
        paymentSnapshot: {
          cardOwner,
          cardBrand,
          lastFour,
          expiryMonth,
          expiryYear,
        },
      });
    } catch (error) {
      console.error('設定預設信用卡失敗', error);
      message.error('設定預設信用卡失敗，請稍後再試！');
    }
  };

  // 打開 / 關閉移除信用卡二次確認 Modal
  const openRemoveConfirm = (card) => {
    const paymentModal = modalRef.current;
    const confirmModal = confirmModalRef.current;
    if (!paymentModal || !confirmModal) return;

    document.activeElement?.blur();

    onRemoveCard(card);
    // 監聽 PaymentModal，確定關閉才打開 ConfirmModal
    paymentModal.addEventListener(
      'hidden.bs.modal',
      () => {
        Modal.getOrCreateInstance(confirmModal).show();
      },
      { once: true },
    );
    Modal.getOrCreateInstance(paymentModal).hide();
  };

  return (
    <>
      {/* 付款管理 Modal 左側區塊 */}
      <div className="subscription-modal-left-section d-flex flex-column">
        {isAdd ? (
          <AddCardForm
            subscription={subscription}
            onToggleAddCard={onToggleAddCard}
            fetchPaymentData={fetchPaymentData}
          />
        ) : (
          <>
            {/* 信用卡圖片 */}
            <div className="mb-4">
              {currentCard ? (
                <>
                  <h2 className="p-2 py-lg-3 small ls-1 text-neutral-600 mb-2 mb-lg-1">
                    目前付款方式
                  </h2>
                  <div className="credit-card-image d-flex flex-column justify-content-between">
                    <div className="d-flex justify-content-between">
                      <div
                        className="bg-neutral-600 opacity-70 rounded-2"
                        style={{
                          width: '48px',
                          height: '36px',
                        }}
                      ></div>
                      <div className="px-2 rounded-1 bg-neutral-100 align-self-start">
                        <Icon
                          icon={cardIcons[currentCard.cardBrand] || 'logos:visaelectron'}
                          width="28"
                          height="16"
                        />
                      </div>
                    </div>
                    <div>
                      <p className="mb-6 text-neutral-100 h6 ls-1 credit-card-number gap-6">
                        <span className="masked-number">••••</span>
                        <span className="masked-number">••••</span>
                        <span className="masked-number">••••</span>
                        {currentCard.lastFour}
                      </p>
                      <div className="d-flex justify-content-between text-neutral-100">
                        <div>
                          <p className="text-neutral-600 fs-9">CARD HOLDER</p>
                          <p className="fs-8">{formatToUpperCase(currentCard.cardOwner)}</p>
                        </div>
                        <div className="text-end">
                          <p className="text-neutral-600 fs-9">EXPIRES</p>
                          <p className="fs-8">
                            {formatExpiryDate(currentCard.expiryMonth, currentCard.expiryYear)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div>...Loading</div>
              )}
            </div>
            {/* 信用卡列表 */}
            <div className="d-flex justify-content-between align-items-center mb-0 mb-lg-1 px-2 pb-2">
              <h2
                className={`small ls-1 text-neutral-600 py-3 ${activeCards.length === maxCards ? 'text-semantic-error' : ''}`}
              >
                其他卡片
                {activeCards.length === maxCards
                  ? `(已達上限 ${maxCards} 張)`
                  : `(目前 ${activeCards.length} / ${maxCards} 張)`}
              </h2>
              {activeCards.length < maxCards ? (
                <button
                  type="button"
                  className="btn d-none d-lg-flex align-items-center p-3 border-0"
                  onClick={() => handleAddCard()}
                >
                  <Icon icon="ic:round-plus" width="16" height="16" className="me-1" />
                  <span className="small">新增卡片</span>
                </button>
              ) : (
                <div className="d-flex flex-column text-neutral-600 gap-1">
                  <small>已達信用卡上限 (5 張)</small>
                  <small>如需新增請先移除卡片</small>
                </div>
              )}
            </div>
            <ul className="mb-4 credit-card-list d-flex flex-column gap-2">
              {activeCards.map((card) => (
                <li
                  key={card.id}
                  className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center rounded-4 bg-neutral-100 p-4"
                >
                  <div className="d-flex justify-content-start justify-content-sm-between gap-3 mb-4 mb-sm-0">
                    <div className="credit-card-logo align-self-center">
                      <Icon icon={cardIcons[card.cardBrand]} width="24" height="16" />
                    </div>
                    <div className="small">
                      <p className="mb-1 d-flex flex-column flex-sm-row">
                        <span className="mb-1 mb-sm-0">{card.cardBrand.toUpperCase()}</span>
                        <span>{`• • • • ${card.lastFour}`}</span>
                      </p>
                      <p className="text-neutral-600">
                        到期日 {formatExpiryDate(card.expiryMonth, card.expiryYear)}
                      </p>
                    </div>
                  </div>
                  {/* 編輯和使用這張卡按鈕 */}
                  <div className="d-none d-sm-block">
                    {card.id === subscription.paymentMethodId ? (
                      <span className="badge-completed">使用中</span>
                    ) : (
                      <>
                        <button
                          type="button"
                          className="btn p-3 fs-8 border-0"
                          onClick={() => handleSelectPaymentMethod(card, subscription.id)}
                        >
                          使用
                        </button>
                        <button
                          type="button"
                          className="btn p-3 fs-8 border-0 text-semantic-error"
                          onClick={() => openRemoveConfirm(card)}
                        >
                          移除
                        </button>
                      </>
                    )}
                  </div>
                  {/* 編輯和使用這張卡按鈕-mobile */}
                  {card.id === subscription.paymentMethodId ? (
                    <span className="badge-completed d-block d-sm-none text-center align-self-center">
                      使用中
                    </span>
                  ) : (
                    <div className="d-sm-none d-flex w-100 gap-2">
                      <button
                        type="button"
                        className="btn btn-neutral-300 rounded-pill flex-fill py-2 py-sm-3 px-3 px-sm-6 fs-9"
                        onClick={() => handleSelectPaymentMethod(card, subscription.id)}
                      >
                        使用
                      </button>
                      <button
                        type="button"
                        className="btn btn-semantic-error rounded-pill flex-fill py-2 py-sm-3 px-3 px-sm-6 fs-9"
                        onClick={() => openRemoveConfirm(card)}
                      >
                        移除
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
            {activeCards.length < maxCards && (
              <button
                type="button"
                className="btn btn-neutral-100 w-100 opacity-70 border-neutral-300 rounded-4 py-3 d-block d-lg-none"
                onClick={() => handleAddCard()}
              >
                <Icon icon="ic:round-plus" width="16" height="16" className="me-1" />
                <span className="small">新增卡片</span>
              </button>
            )}
            <button
              type="button"
              className="btn btn-cta-200 btn-action w-100 py-3 d-none d-lg-block"
              onClick={() => {
                handleCloseModal();
                fetchSubscriptions();
              }}
            >
              完成管理
            </button>
          </>
        )}
      </div>
      {/* 付款管理 Modal 右側區塊 */}
      <div className="subscription-modal-right-section d-none d-lg-flex flex-column">
        <div className="modal-info-card mb-4 flex-grow-1">
          <h2 className="small ls-1 text-neutral-600 mb-4">訂閱方案</h2>
          {/* 訂閱方案標題 */}
          <div className="d-flex gap-3 mb-17">
            <div className="theme-wrapper">
              <img
                className="rounded-2"
                src={subscription.theme.images.square}
                alt="甜點主題圖片"
              />
            </div>
            <div>
              <h3 className="fs-7 ls-1 mb-1">{subscription.theme.title}</h3>
              <p className="small text-neutral-600">
                {subscription.plan.durationMonths}個月 ·{subscription.quantity}盒
              </p>
            </div>
          </div>
          {/* 訂閱方案詳情 */}
          <div>
            <div className="small mb-3">
              <p className="d-flex justify-content-between">
                <span className="text-neutral-600">方案價格</span>
                <span>${subscription.unitPrice * subscription.quantity} / 月</span>
              </p>
              <div className="subscription-info-divider"></div>
              <p className="d-flex justify-content-between">
                <span className="text-neutral-600">扣款卡片</span>
                <span className="d-flex gap-1">
                  <span>{formatToUpperCase(subscription.paymentSnapshot.cardBrand)}</span>
                  <span>****</span>
                  <span>{subscription.paymentSnapshot.lastFour}</span>
                </span>
              </p>
              <div className="subscription-info-divider"></div>
              <p className="d-flex justify-content-between">
                <span className="text-neutral-600">下次扣款日期</span>
                <span>{subscription.nextPaymentDate}</span>
              </p>
            </div>
            <div className="rounded-4 p-4 bg-neutral-100">
              <p className="text-neutral-600 small mb-3">自動扣款</p>
              <p className="d-flex justify-content-between align-items-end">
                <span className="h3 ls-1">${subscription.unitPrice * subscription.quantity}</span>
                <span className="small text-neutral-600">NTD / Monthly</span>
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-4 border border-neutral-400 p-3 fs-9 text-neutral-600">
          🔒 您的交易資訊均透過最高業界標準的 SSL 256-bit
          加密技術處理，確保信用卡號碼與個資均受中最高安全。
        </div>
      </div>
    </>
  );
}

export default PaymentModalContent;
