import Input from '../Input';
import Select from '../Select';
import { Controller } from 'react-hook-form';
import FormError from '../FormError';
import { Icon } from '@iconify/react';

function PaymentSection({
  register,
  errors,
  control,
  creditCardMonths,
  creditCardYears,
  handleCardNumberChange,
  getValues,
  trigger,
  matchedSavedCard,
}) {
  return (
    <section className="cart-panel p-4 p-lg-6 mb-2 mb-lg-6">
      <h2 className="cart-section-title mb-6">付款資料</h2>
      <Input
        id="cardNumber"
        register={register}
        errors={errors}
        labelText="信用卡卡號"
        type="tel"
        placeholderText="0000-0000-0000-0000"
        ariaLabel="信用卡卡號"
        iconName="tabler:credit-card"
        rules={{
          required: {
            value: true,
            message: '請輸入信用卡卡號。',
          },
          minLength: {
            value: 19,
            message: '信用卡卡號需為 16 碼。',
          },
          onChange: handleCardNumberChange,
        }}
        labelRight={
          <div className="d-flex">
            <Icon className="me-3" icon="logos:visaelectron" width="35.93" height="16"></Icon>
            <Icon className="me-3" icon="logos:mastercard" width="20.59" height="16"></Icon>
            <Icon icon="logos:jcb" width="20.69" height="16"></Icon>
          </div>
        }
        // ...rest 部分
        maxLength={19}
        onInput={(e) => {
          e.target.value = e.target.value.replace(/\D/g, ''); // 強制過濾非數字字元
        }}
      />
      <Input
        id="cardOwner"
        register={register}
        errors={errors}
        labelText="持卡人姓名"
        type="text"
        placeholderText="請輸入卡片上的英文姓名。"
        ariaLabel="持卡人姓名"
        iconName="material-symbols:person-outline-rounded"
        rules={{
          required: {
            value: true,
            message: '請輸入持卡人英文姓名。',
          },
        }}
      />

      <div className="mb-4 mb-lg-6">
        <div className="row g-3">
          <div className="col-lg-6">
            <label htmlFor="" className="form-label px-2">
              有效期限
            </label>
            <div className="row g-3">
              <div className="col-6">
                <Controller
                  name="expiryMonth"
                  control={control}
                  rules={{
                    validate: (val) => {
                      if (!val) return '請選擇效期';

                      const currentYear = getValues('expiryYear');
                      if (!currentYear) return true;

                      const now = new Date();
                      const expiration = new Date(Number(currentYear), Number(val), 1);

                      if (now >= expiration) {
                        return '信用卡已過期';
                      }

                      return true;
                    },
                  }}
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <Select
                      id="expiryMonth"
                      placeholderText="月份"
                      options={creditCardMonths}
                      value={value}
                      onChange={(val) => {
                        onChange(val);
                        trigger(['expiryMonth', 'expiryYear']); // 💡 觸發年份與月份的連動驗證
                      }}
                      errorMsg={error?.message}
                      suffix=" 月"
                    />
                  )}
                />
                <FormError message={errors?.expiryMonth?.message} />
              </div>
              <div className="col-6">
                <Controller
                  name="expiryYear"
                  control={control}
                  rules={{
                    validate: (val) => {
                      if (!val) return '請選擇年份';
                      return true;
                    },
                  }}
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <Select
                      id="expiryYear"
                      placeholderText="年份"
                      options={creditCardYears}
                      value={value}
                      onChange={(val) => {
                        onChange(val);
                        trigger(['expiryMonth', 'expiryYear']);
                      }}
                      errorMsg={error?.message}
                      suffix=" 年"
                    />
                  )}
                />
                <FormError message={errors?.expiryYear?.message} />
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <Input
              id="card-cvv"
              register={register}
              errors={errors}
              labelText="安全碼"
              type="tel"
              placeholderText="CVV"
              ariaLabel="信用卡安全碼"
              iconName="lets-icons:lock"
              rules={{
                required: {
                  value: true,
                  message: '請輸入信用卡安全碼。',
                },
                minLength: {
                  value: 3,
                  message: '安全碼應為 3 碼。',
                },
              }}
              // ...rest 部分
              maxLength={3}
              onInput={(e) => {
                e.target.value = e.target.value.replace(/\D/g, ''); // 強制過濾非數字字元
              }}
            />
          </div>
        </div>
      </div>
      <div className="form-check">
        <input
          className="form-check-input rounded-5"
          type="checkbox"
          id="saveCard"
          {...register('saveCard')}
          disabled={!!matchedSavedCard} // 輸入已儲存的信用卡，則禁用勾選框
        />
        <label className="form-check-label s-text" htmlFor="saveCard">
          記住此卡片資訊以提供下次使用
        </label>
        {matchedSavedCard && <span className="small text-neutral-600 ms-2">(此卡片已儲存)</span>}
      </div>
    </section>
  );
}

export default PaymentSection;
