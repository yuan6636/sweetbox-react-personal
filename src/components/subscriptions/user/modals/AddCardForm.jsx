// 外部工具
import { useForm, Controller } from 'react-hook-form';
import { Icon } from '@iconify/react';
import { message } from 'antd';

// js 工具
import { formatCardNumber, isCardExpired, getCardType } from '../../../../utils/payment';
import { creditCardMonths, creditCardYears } from '../../../../data/formOptions';

// 元件區
import Select from '../../../Select';
import FormError from '../../../FormError';

// api
import api from '../../../../api';

function AddCardForm({ subscription, onToggleAddCard, fetchPaymentData }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
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
      createdAt: new Date().toISOString(),
    };

    try {
      await api.post('/payment_methods', creditCard);
      await fetchPaymentData();
      onToggleAddCard(false);
      message.success('新增信用卡成功');
    } catch (error) {
      console.error('新增信用卡失敗：', error);
      message.error('新增信用卡失敗，請稍後再試！');
    }
  };

  const handleCardNumberChange = (e) => {
    const formattedValue = formatCardNumber(e.target.value);
    setValue('cardNumber', formattedValue, { shouldValidate: true });
  };

  const handleCvcChange = (e) => {
    const formattedValue = e.target.value.replace(/\D/g, '');
    setValue('cvc', formattedValue, { shouldValidate: true });
  };

  return (
    <>
      {/* 新增信用卡表單 */}
      <h2 className="py-3 fs-8 ls-1 text-neutral-600 mb-6">新增付款方式</h2>
      <form
        id="add-card-form"
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
                <Icon icon="tabler:credit-card" width="24" height="24" className="input-icon" />
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

                      const expiryYear = getValues('expiryYear');
                      if (!expiryYear) return true;

                      if (isCardExpired(expiryYear, val)) {
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
            <FormError message={errors?.expiryMonth?.message || errors?.expiryYear?.message} />
          </div>
          {/* 安全碼 */}
          <div>
            <label className="d-block">
              <div className="mx-2 mb-2 small">安全碼</div>
              <div className="input-wrapper">
                <Icon icon="lets-icons:lock" width="24" height="24" className="input-icon" />
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
  );
}

export default AddCardForm;
