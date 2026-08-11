// 外部工具
import { Icon } from '@iconify/react';
import { useCallback, useEffect, useState, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { message } from 'antd';
import { Modal } from 'bootstrap';

// api
import api from '../../../api';

// 元件區
import Select from '../../Select';
import FormError from '../../FormError';
import ConfirmModal from './ConfirmModal';

// js 工具
import { formatCardNumber, getCardType } from '../../../assets/utils/paymentUtils';
import { creditCardYears, creditCardMonths } from '../../../assets/utils/formOptions';

// 最多的卡片數量
const maxCards = 5;

// 信用卡 icon 樣式
const cardIcons = {
  visa: 'logos:visaelectron',
  mastercard: 'logos:mastercard',
  jcb: 'logos:jcb',
};

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

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
    trigger,
    getValues,
    setValue,
  } = useForm({
    defaultValues: {
      cardNumber: '',
      userName: '',
      expiryMonth: '',
      expiryYear: '',
      cvc: '',
    },
    mode: 'onBlur',
  });

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

  // 現在時間
  const currentTime = new Date().toISOString();

  const currentCard = subscription.paymentSnapshot;
  const activeCards = cards?.filter((card) => !card?.isDeleted);

  const handleAddCard = () => {
    onToggleAddCard(true);
    reset();
  };

  const formatToUpperCase = (name) => {
    return name.toUpperCase();
  };

  const formatExpiryDate = (month = '', year = '') => {
    return `${String(month).padStart(2, '0')}/${String(year).slice(-2)}`;
  };

  const handleCardNumberChange = (e) => {
    const formattedValue = formatCardNumber(e.target.value);
    setValue('cardNumber', formattedValue, { shouldValidate: true });
  };

  const handleCvcChange = (e) => {
    const formattedValue = e.target.value.replace(/\D/g, '');
    setValue('cvc', formattedValue, { shouldValidate: true });
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

  // 新增信用卡
  const handlePaymentSubmit = async (data) => {
    const { cardNumber, userName, expiryMonth, expiryYear } = data;
    const creditCard = {
      userId: subscription.userId,
      cardOwner: userName,
      cardBrand: getCardType(cardNumber),
      lastFour: cardNumber.slice(-4),
      expiryMonth,
      expiryYear,
      isDeleted: false,
      createdAt: currentTime,
    };

    try {
      await api.post('/payment_methods', creditCard);
      fetchPaymentData();
      onToggleAddCard(false);
      reset();
      message.success('新增信用卡成功');
    } catch (error) {
      console.error('新增信用卡失敗：', error);
      message.error('新增信用卡失敗，請稍後再試！');
    }
  };

  // 打開 / 關閉移除信用卡二次確認 Modal
  const openRemoveConfirm = (card) => {
    const paymentModal = modalRef.current;
    const confirmModal = confirmModalRef.current;
    if (!paymentModal || !confirmModal) return;

    document.activeElement?.blur();

    setCardToRemove(card);
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
              {/* 付款管理 Modal 左側區塊 */}
              <div className="subscription-modal-left-section d-flex flex-column">
                {isAdd ? (
                  <>
                    {/* 新增信用卡表單 */}
                    <h2 className="py-3 fs-8 ls-1 text-neutral-600 mb-6">新增付款方式</h2>
                    <form
                      className="flex-grow-1 d-flex flex-column"
                      onSubmit={handleSubmit(handlePaymentSubmit)}
                    >
                      {/* label 包 input 是為了解決 Bootstrap Modal focus trap 問題 */}
                      <div className="d-flex flex-column gap-4 flex-grow-1">
                        {/* 信用卡卡號 */}
                        <div>
                          <label className="d-block">
                            <div className="mx-2 mb-2 small d-flex justify-content-between align-items-center">
                              <span>信用卡卡號</span>
                              <div className="d-flex gap-3">
                                <Icon icon="logos:visaelectron" width="28" height="16" />
                                <Icon icon="logos:mastercard" width="24" height="16" />
                                <Icon icon="logos:jcb" width="24" height="16" />
                              </div>
                            </div>
                            <div className="input-wrapper">
                              <Icon
                                icon="tabler:credit-card"
                                width="24"
                                height="24"
                                className="input-icon"
                              />
                              <input
                                type="text"
                                className={`form-control ms-0 ${errors.cardNumber ? 'border border-semantic-error' : ''}`}
                                aria-describedby="error-message"
                                placeholder="0000-0000-0000-0000"
                                {...register('cardNumber', {
                                  required: '請輸入信用卡卡號',
                                  validate: (value) => {
                                    const numbers = value.replace(/\D/g, '');
                                    if (numbers.length !== 16) {
                                      return '信用卡卡號需為 16 碼';
                                    }
                                    return true;
                                  },
                                  onChange: handleCardNumberChange,
                                })}
                              />
                            </div>
                            <FormError message={errors?.cardNumber?.message} />
                          </label>
                        </div>
                        {/* 持卡人姓名 */}
                        <div>
                          <label className="d-block">
                            <div className="mx-2 mb-2 small">持卡人姓名</div>
                            <div className="input-wrapper">
                              <Icon
                                icon="material-symbols:person-outline-rounded"
                                width="24"
                                height="24"
                                className="input-icon"
                              />
                              <input
                                type="text"
                                className={`form-control ms-0 ${errors.userName && 'border border-semantic-error'}`}
                                aria-describedby="error-message"
                                placeholder="請輸入卡片上的英文姓名"
                                {...register('userName', {
                                  required: '請輸入持卡人姓名',
                                })}
                              />
                            </div>
                            <FormError message={errors?.userName?.message} />
                          </label>
                        </div>
                        {/* 有效期限 */}
                        <div>
                          <label className="form-label mx-2 small">有效期限</label>
                          <div className="d-flex gap-3">
                            <div className="flex-grow-1">
                              <Controller
                                name="expiryMonth"
                                control={control}
                                rules={{
                                  validate: (val) => {
                                    if (!val) return '請選擇有效期限';

                                    const currentYear = getValues('expiryYear');
                                    if (!currentYear) return true;

                                    const now = new Date();
                                    const expiration = new Date(
                                      Number(currentYear),
                                      Number(val),
                                      1,
                                    );

                                    if (now >= expiration) {
                                      return '信用卡已過期';
                                    }

                                    return true;
                                  },
                                }}
                                render={({ field: { value, onChange } }) => (
                                  <Select
                                    options={creditCardMonths}
                                    value={value}
                                    onChange={(val) => {
                                      onChange(val);
                                      trigger(['expiryMonth', 'expiryYear']);
                                    }}
                                    placeholderText="月"
                                    suffix="月"
                                    errorMsg={errors?.expiryMonth?.message}
                                  />
                                )}
                              />
                            </div>
                            <div className="flex-grow-1">
                              <Controller
                                name="expiryYear"
                                control={control}
                                rules={{
                                  validate: (val) => {
                                    if (!val) return '請選擇有效期限';

                                    return true;
                                  },
                                }}
                                render={({ field: { value, onChange } }) => (
                                  <Select
                                    options={creditCardYears}
                                    value={value}
                                    onChange={(val) => {
                                      onChange(val);
                                      trigger(['expiryMonth', 'expiryYear']);
                                    }}
                                    placeholderText="年"
                                    suffix="年"
                                    errorMsg={errors?.expiryYear?.message}
                                  />
                                )}
                              />
                            </div>
                          </div>
                          <FormError
                            message={errors?.expiryMonth?.message || errors?.expiryYear?.message}
                          />
                        </div>
                        {/* 安全碼 */}
                        <div>
                          <label className="d-block">
                            <div className="mx-2 mb-2 small">安全碼</div>
                            <div className="input-wrapper">
                              <Icon
                                icon="lets-icons:lock"
                                width="24"
                                height="24"
                                className="input-icon"
                              />
                              <input
                                type="text"
                                className={`form-control ms-0 ${errors.cvc && 'border border-semantic-error'}`}
                                aria-describedby="error-message"
                                placeholder="CVC"
                                inputMode="numeric"
                                maxLength="3"
                                {...register('cvc', {
                                  required: '請輸入安全碼',
                                  pattern: {
                                    value: /^[0-9]{3}$/,
                                    message: '安全碼需為 3 碼',
                                  },
                                  onChange: handleCvcChange,
                                })}
                              />
                            </div>
                            <FormError message={errors?.cvc?.message} />
                          </label>
                        </div>
                      </div>
                      <div className="text-end d-none d-lg-block">
                        <button
                          type="button"
                          className="btn py-3 px-4 border-0 me-6"
                          onClick={() => onToggleAddCard(false)}
                        >
                          取消新增
                        </button>
                        <button type="submit" className="btn btn-cta-200 btn-action py-3 px-6">
                          確認並儲存
                        </button>
                      </div>
                    </form>
                  </>
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
                                    {formatExpiryDate(
                                      currentCard.expiryMonth,
                                      currentCard.expiryYear,
                                    )}
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
                        <span className="h3 ls-1">
                          ${subscription.unitPrice * subscription.quantity}
                        </span>
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
                  className="btn btn-cta-200 btn-action py-3 px-6 flex-grow-1"
                  onClick={handleSubmit(handlePaymentSubmit)}
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
