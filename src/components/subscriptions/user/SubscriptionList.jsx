// 外部工具
import { Icon } from '@iconify/react';
import * as bootstrap from 'bootstrap';
import { useState, useEffect, useRef } from 'react';

// 元件區
import PaymentModal from './PaymentModal';
import CancelReminderModal from './CancelReminderModal';
import CancelConfirmModal from './CancelConfirmModal';

// 信用卡 icon 樣式
const cardIcons = {
  visa: 'logos:visaelectron',
  mastercard: 'logos:mastercard',
  jcb: 'logos:jcb',
};

// 狀態對照表
const subStatusMap = {
  active: '進行中',
  completed: '已完成',
  cancelled: '已取消',
};

const paymentStatusMap = {
  pending: '未付款',
  paid: '已付款',
  failed: '付款失敗',
};

const shippingStatusMap = {
  pending: '待出貨',
  shipped: '已出貨',
  on_hold: '處理中',
  not_required: '無須出貨',
};

// 狀態樣式
const paymentStatusClassMap = {
  pending: 'text-neutral-700',
  failed: 'text-semantic-error',
};

const shippingStatusClassMap = {
  pending: 'text-neutral-700',
};

const statusBadgeMap = {
  active: 'badge-in-progress',
  completed: 'badge-completed',
  cancelled: 'badge-cancelled',
};

const statusDateMap = {
  active: (date) => date ?? '--',
  completed: () => '--',
  cancelled: (date) => (date ? `已於 ${date} 取消訂閱` : '--'),
};

const { Modal } = bootstrap;

function SubscriptionList({ subscriptions, fetchSubscriptions }) {
  const [isAdd, setIsAdd] = useState(false);
  const [expandedIds, setExpandedIds] = useState([]); // 已展開的訂閱 Id
  const [modalState, setModalState] = useState({
    type: null,
    subscription: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const paymentModalRef = useRef(null);
  const cancelReminderModalRef = useRef(null);
  const cancelConfirmModalRef = useRef(null);

  // Modal 初始化
  useEffect(() => {
    const modalRefs = [paymentModalRef, cancelReminderModalRef, cancelConfirmModalRef];

    const handleHide = () => {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur(); // 防止關閉 modal時，focus 停在 modal 內，影響螢幕閱讀器判讀
      }
    };

    modalRefs.forEach((ref) => {
      if (!ref.current) {
        return;
      }
      Modal.getOrCreateInstance(ref.current, { keyboard: false });
      ref.current?.addEventListener('hide.bs.modal', handleHide);
    });

    return () => {
      modalRefs.forEach((ref) => {
        ref.current?.removeEventListener('hide.bs.modal', handleHide);
      });
    };
  }, []);

  // 切換 accordion
  const handleToggleAccordion = (id) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((expandedId) => expandedId !== id) : [...prev, id],
    );
  };

  // Modal 開關
  const handleCloseModal = (ref) => {
    Modal.getInstance(ref.current)?.hide();
  };

  const handleSubscriptionUpdated = (patch) => {
    setModalState((prev) => ({
      ...prev,
      subscription: {
        ...prev.subscription,
        ...patch,
      },
    }));
  };

  // 確定訂閱取到值才開啟 modal
  useEffect(() => {
    if (!modalState.type || !modalState.subscription) return;

    const modalRefs = {
      payment: paymentModalRef,
      cancelReminder: cancelReminderModalRef,
      cancelConfirm: cancelConfirmModalRef,
    };

    const handleOpenModal = (ref) => {
      Modal.getOrCreateInstance(ref.current)?.show();
    };

    handleOpenModal(modalRefs[modalState.type]);
  }, [modalState]);

  return (
    <div
      className="accordion card-accordion p-0 d-flex flex-column gap-4 mb-17"
      id="accordion-subscription"
    >
      {/* 付款管理 Modal */}
      <PaymentModal
        modalRef={paymentModalRef}
        handleCloseModal={() => handleCloseModal(paymentModalRef)}
        isAdd={isAdd}
        onToggleAddCard={(value) => setIsAdd(value)}
        subscription={modalState.subscription}
        onSubscriptionUpdated={handleSubscriptionUpdated}
        fetchSubscriptions={fetchSubscriptions}
      />

      {/* 取消訂閱提醒 Modal */}
      <CancelReminderModal
        cancelReminderModalRef={cancelReminderModalRef}
        handleCloseModal={() => handleCloseModal(cancelReminderModalRef)}
        handleModalState={(type, subscription) => setModalState({ type, subscription })}
        subscription={modalState.subscription}
      />
      {/* 取消訂閱確認 Modal */}
      <CancelConfirmModal
        cancelConfirmModalRef={cancelConfirmModalRef}
        handleCloseModal={() => handleCloseModal(cancelConfirmModalRef)}
        handleModalState={(type, subscription) => setModalState({ type, subscription })}
        subscription={modalState.subscription}
        fetchSubscriptions={fetchSubscriptions}
        isSubmitting={isSubmitting}
        onSubmitStart={() => setIsSubmitting(true)}
        onSubmitEnd={() => setIsSubmitting(false)}
      />
      {subscriptions.map((item) => {
        const { id, subscriptionNumber, theme, plan, orders } = item;

        return (
          <div key={id} className="accordion-item bg-neutral-250 p-sm-8 p-6 rounded-6 border-0">
            <div className="accordion-header mb-0 mb-xl-8">
              <div className="d-flex flex-xl-row flex-column gap-6 gap-xl-8">
                {/* 甜點主題圖片 */}
                <div className="d-flex gap-6 mb-xl-0">
                  <div className="overflow-hidden plan-image">
                    <img
                      className="w-100"
                      src={theme.images.square}
                      alt={`${theme.title}主題圖片`}
                    />
                  </div>
                  {/* 訂閱標題-mobile */}
                  <div className="d-flex flex-column gap-2 d-xl-none">
                    <p className="fs-9 text-neutral-600 fw-bold ls-1">
                      {`訂閱編號：${subscriptionNumber}`}
                    </p>
                    <h2 className="fs-7 fw-bold ls-1">{theme.title}</h2>
                    <span className={`${statusBadgeMap[item.status]} d-block align-self-start`}>
                      {subStatusMap[item.status]}
                    </span>
                  </div>
                </div>

                {/* 訂閱詳細內容 */}
                <div className="flex-equal py-xl-2 py-0 subscription-info">
                  {/* 訂閱編號 */}
                  <div className="mb-8 d-none d-xl-block">
                    <p className="fs-8 text-neutral-600 mb-2">
                      {`訂閱編號：${subscriptionNumber}`}
                    </p>
                    <div className="d-flex align-items-center">
                      <h2 className="h4 d-inline-block fw-bold ls-1 me-3">{theme.title}</h2>
                      <span className={statusBadgeMap[item.status]}>
                        {subStatusMap[item.status]}
                      </span>
                    </div>
                  </div>
                  <div className="subscription-info-divider d-xl-none"></div>
                  <div className="d-flex py-2 py-xl-0">
                    {/* 訂閱期數與價格 */}
                    <div className="flex-equal">
                      <div className="mb-4">
                        <p className="subscription-info-title">期數</p>
                        <p className="subscription-info-content">{`${item.durationMonths}個月`}</p>
                      </div>
                      <div>
                        <p className="subscription-info-title">訂閱價格</p>
                        <p className="subscription-info-content">
                          {`NT$${item.unitPrice * item.quantity}/月 (原價$${plan.originalPrice * item.quantity})`}
                        </p>
                      </div>
                    </div>
                    {/* 數量與下次付款日 */}
                    <div className="flex-equal">
                      <div className="mb-4">
                        <p className="subscription-info-title">數量</p>
                        <p className="subscription-info-content">{`${item.quantity} 盒`}</p>
                      </div>
                      <div>
                        <p className="subscription-info-title">下次付款日</p>
                        <p className="subscription-info-content">
                          {statusDateMap[item.status]?.(item.nextPaymentDate) ?? '--'}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="subscription-info-divider d-xl-none"></div>
                </div>
                {/* 分隔線 */}
                <div className="vertical-divider d-none d-xl-block"></div>
                {/* 付款方式 */}
                <div className="flex-equal py-0 py-xl-2">
                  <button
                    className="accordion-button d-xl-flex justify-content-end align-items-center d-none"
                    type="button"
                    aria-expanded="false"
                    aria-controls={`collapse-${id}`}
                    onClick={() => handleToggleAccordion(id)}
                  >
                    <Icon
                      className={`arrow-down-icon ${expandedIds.includes(id) ? 'rotate' : ''}`}
                      icon="iconamoon:arrow-down-2-bold"
                      width="32"
                      height="32"
                    />
                  </button>
                  {/* 輸入付款號碼 */}
                  <div className="mb-3">
                    <p className="text-label mb-2">目前付款方式</p>
                    <div className="rounded-pill py-3 px-4 bg-neutral-300 d-flex gap-3">
                      <Icon
                        className="py-1 px-2"
                        style={
                          item.status !== 'active' && {
                            filter:
                              'brightness(0) saturate(100%) invert(69%) sepia(22%) saturate(124%) hue-rotate(0deg) brightness(103%) contrast(96%)',
                          }
                        }
                        icon={cardIcons[item.paymentSnapshot.cardBrand] || 'logos:visaelectron'}
                        width="44"
                        height="24"
                      />
                      <div
                        className={`credit-card-number gap-2 ${item.status !== 'active' && 'text-neutral-500'}`}
                      >
                        <span className="masked-number-compact">••••</span>
                        <span className="masked-number-compact">••••</span>
                        <span className="masked-number-compact">••••</span>
                        {item.paymentSnapshot.lastFour}{' '}
                      </div>
                    </div>
                  </div>
                  {/* Modal */}
                  <div className={`${item.status !== 'active' ? 'd-none' : ''}`}>
                    {/* 付款管理 Modal button*/}
                    <button
                      type="button"
                      className="btn btn-cta-200 btn-action w-100 py-3 mb-1"
                      onClick={() => {
                        setModalState({ type: 'payment', subscription: item });
                        setIsAdd(false);
                      }}
                    >
                      付款管理
                    </button>

                    {/* 取消訂閱提醒 Modal button*/}
                    <button
                      type="button"
                      className="btn p-3 border-0 mb-1 w-100"
                      onClick={() => {
                        setModalState({
                          type: 'cancelReminder',
                          subscription: item,
                        });
                      }}
                    >
                      <span className="small">取消目前訂閱方案</span>
                    </button>
                  </div>
                </div>
                {/* 手風琴 mobile 下拉按鈕 */}
                <button
                  className="accordion-button d-flex d-xl-none flex-column gap-2 mb-6"
                  type="button"
                  aria-expanded="false"
                  aria-controls={`collapse-${id}`}
                  onClick={() => handleToggleAccordion(id)}
                >
                  <div className="subscription-info-divider"></div>
                  <div className="d-flex justify-content-center align-items-center text-neutral-600 py-1">
                    <Icon
                      className={`p-1 me-2 arrow-down-icon ${expandedIds.includes(id) ? 'rotate' : ''}`}
                      icon="iconamoon:arrow-down-2-bold"
                      width="32"
                      height="32"
                    />
                    <h3 className="fs-8 fw-bold ls-1">歷史訂單紀錄</h3>
                  </div>
                </button>
              </div>
            </div>
            {/* 手風琴下拉內容 */}
            <div
              id={`collapse-${id}`}
              className={`accordion-collapse collapse ${expandedIds.includes(id) ? 'show' : ''}`}
            >
              {/* 手風琴下拉 table */}
              <div className="accordion-body p-0 d-none d-xl-block">
                <table className="table table-borderless rounded-5 overflow-hidden subscription-table align-middle">
                  <thead>
                    <tr className="table-neutral-200">
                      <th scope="col">訂單編號</th>
                      <th scope="col">期數</th>
                      <th scope="col">帳單日期</th>
                      <th scope="col">金額</th>
                      <th scope="col">付款狀態</th>
                      <th scope="col">出貨狀態</th>
                      <th scope="col">發票</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => {
                      const {
                        id,
                        orderNo,
                        cycle,
                        paymentDate,
                        amount,
                        paymentStatus,
                        shippingStatus,
                      } = order;

                      return (
                        <tr key={id}>
                          <th scope="row">{orderNo}</th>
                          <td>{cycle ?? '-'}</td>
                          <td>{paymentDate}</td>
                          <td>{`NT$${amount}`}</td>
                          <td
                            className={`
                            ${paymentStatusClassMap[paymentStatus]}
                            `}
                          >
                            {paymentStatusMap[paymentStatus] ?? '-'}
                          </td>
                          <td
                            className={`
                            ${shippingStatusClassMap[shippingStatus]}
                            `}
                          >
                            {shippingStatusMap[shippingStatus] ?? '-'}
                          </td>
                          <td>
                            <button type="button" className="btn border-0 me-3">
                              <Icon icon="tabler:eye" width="20" height="20" />
                            </button>
                            <button type="button" className="btn border-0">
                              <Icon
                                icon="material-symbols:download-rounded"
                                width="20"
                                height="20"
                              />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {/* 手風琴 mobile 下拉卡片 */}
              <div className="accordion-body p-0 d-xl-none d-block d-flex flex-column gap-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="rounded-5 border border-neutral-400 p-6 d-flex flex-column gap-4"
                  >
                    <div className="d-flex flex-column gap-6">
                      {/* 訂單編號與狀態 */}
                      <div>
                        <div className="mb-3">
                          <h3 className="mb-1 fs-9 ls-1 text-neutral-600">訂單編號</h3>
                          <p className="h5">{order.orderNo}</p>
                        </div>
                        <div>
                          <span className="badge-resolved me-3">
                            {paymentStatusMap[order.paymentStatus]}
                          </span>
                          <span className="badge-resolved">
                            {shippingStatusMap[order.shippingStatus]}
                          </span>
                        </div>
                      </div>
                      {/* 訂單詳細內容 */}
                      <div className="d-flex flex-column gap-2">
                        <div className="subscription-info-divider"></div>
                        <div className="d-flex">
                          <div className="flex-grow-1 small">
                            <p className="mb-1 text-neutral-600">金額</p>
                            <p>NT${order.amount}</p>
                          </div>
                          <div className="flex-grow-1 small">
                            <p className="mb-1 text-neutral-600">期數</p>
                            <p>{order.cycle}</p>
                          </div>
                          <div className="flex-grow-1 small">
                            <p className="mb-1 text-neutral-600">付款日期</p>
                            <p>{order.paymentDate}</p>
                          </div>
                        </div>
                        <div className="subscription-info-divider"></div>
                      </div>

                      {/* 訂單發票按鈕 */}
                      <div className="d-flex gap-3">
                        <button
                          type="button"
                          className="btn btn-md btn-neutral-300 flex-grow-1 rounded-pill"
                        >
                          查看發票
                        </button>
                        <button
                          type="button"
                          className="btn btn-md btn-neutral-300 flex-grow-1 rounded-pill"
                        >
                          下載發票
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default SubscriptionList;
