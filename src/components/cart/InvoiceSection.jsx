import { useState, useRef, useEffect } from 'react';
import { Controller } from 'react-hook-form';
import { Icon } from '@iconify/react';
import { invoiceOpts } from '../../data/formOptions';
import FormInput from '../common/FormInput';
import FormError from '../common/FormError';

const InvoiceSection = ({ register, control, errors, watch, setValue, clearErrors }) => {
  const currentInvoiceType = watch('type', 'default');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <Controller
        name="type"
        control={control}
        defaultValue="default"
        rules={{ validate: (val) => val !== 'default' || '請選擇發票類型' }}
        render={({ field: { onChange, value }, fieldState: { error } }) => {
          const currentLabel =
            invoiceOpts.find((opt) => opt.value === value)?.label || '請選擇發票類型';
          const borderClass = error ? 'border border-semantic-error' : '';
          const textColorClass = value !== 'default' ? 'text-neutral-800' : 'text-neutral-600';

          return (
            <div className="dropdown cart-dropdown flex-grow-1" ref={dropdownRef}>
              <button
                className={`btn d-flex align-items-center justify-content-between py-2 px-4 w-100 ${textColorClass} ${borderClass}`}
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
              >
                <span>{currentLabel}</span>
                <Icon
                  className="ms-2"
                  icon="iconamoon:arrow-down-2-duotone"
                  width="24"
                  height="24"
                />
              </button>

              {isOpen && (
                <ul
                  className="dropdown-menu m-0 custom-dropdown w-100 show"
                  style={{ maxHeight: '316px', overflowY: 'auto' }}
                >
                  {invoiceOpts.map((opt) => (
                    <li key={opt.value}>
                      <button
                        type="button"
                        className={`dropdown-item px-2 ${value === opt.value ? 'active' : ''}`}
                        onClick={() => {
                          onChange(opt.value);
                          setIsOpen(false);

                          // 防呆：切換發票類型時，強制清空其他不相關的欄位
                          setValue('carrier', '', { shouldValidate: false });
                          setValue('donateCode', '', { shouldValidate: false });
                          setValue('companyName', '', { shouldValidate: false });
                          setValue('taxId', '', { shouldValidate: false });
                          setValue('companyEmail', '', { shouldValidate: false });

                          // 清除不相關欄位的錯誤狀態
                          clearErrors([
                            'carrier',
                            'donateCode',
                            'companyName',
                            'taxId',
                            'companyEmail',
                          ]);
                        }}
                      >
                        {opt.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              <FormError message={error?.message} />
            </div>
          );
        }}
      />

      {/* 會員載具 */}
      {currentInvoiceType === 'member' && (
        <p className="px-2 s-text text-neutral-600 fs-8 mt-2">發票將自動儲存至您的會員帳戶</p>
      )}

      {/* 手機條碼 */}
      {currentInvoiceType === 'mobile' && (
        <div className="mt-4">
          <FormInput
            id="carrier"
            register={register}
            errors={errors}
            wrapperClass="mb-0"
            labelText="手機條碼"
            type="text"
            placeholderText="例：/ABC1234"
            iconName="mdi:cellphone"
            maxLength={8}
            rules={{
              required: '請輸入手機條碼',
              pattern: {
                value: /^\/[0-9A-Z+\-.]{7}$/, // 第一碼必須是 /，後面接 7 碼大寫英文、數字或特定符號
                message: '長度應為8碼，開頭為/（例：/ABC1234）',
              },
            }}
            onInput={(e) => {
              let val = e.target.value.toUpperCase(); //字母強制轉大寫
              val = val.replace(/[^/0-9A-Z+\-.]/g, ''); //過濾「/數字A-Z+-.」以外的字元
              e.target.value = val; //過濾後塞回字串
            }}
          />
        </div>
      )}

      {/* 捐贈發票 */}
      {currentInvoiceType === 'donation' && (
        <div className="mt-4">
          <FormInput
            id="donateCode"
            register={register}
            errors={errors}
            wrapperClass="mb-0"
            labelText="捐贈碼"
            type="tel"
            inputMode="numeric"
            placeholderText="例：919"
            iconName="humbleicons:heart"
            maxLength={7}
            rules={{
              required: '請輸入慈善機構愛心碼',
              pattern: {
                value: /^[0-9]{3,7}$/, // 3 到 7 碼純數字
                message: '捐贈碼應為 3-7 碼數字',
              },
            }}
            onInput={(e) => {
              e.target.value = e.target.value.replace(/\D/g, '');
            }}
          />
        </div>
      )}

      {/* 不使用載具 */}
      {currentInvoiceType === 'na' && (
        <p className="px-2 s-text text-neutral-600 fs-8 mt-2">將開立電子發票證明聯</p>
      )}

      {/* 公司戶發票 */}
      {currentInvoiceType === 'business' && (
        <div className="mt-4 d-flex flex-column gap-4">
          <FormInput
            id="companyName"
            register={register}
            errors={errors}
            wrapperClass="mb-0"
            labelText="公司名稱(發票抬頭)"
            type="text"
            placeholderText="例：○○有限公司"
            iconName="fluent:building-multiple-16-regular"
            rules={{ required: '請輸入公司名稱' }}
          />
          <FormInput
            id="taxId"
            register={register}
            errors={errors}
            wrapperClass="mb-0"
            labelText="統一編號"
            type="text"
            inputMode="numeric"
            placeholderText="例：40595252"
            iconName="jam:hashtag"
            maxLength={8}
            rules={{
              required: '請輸入統一編號',
              pattern: {
                value: /^[0-9]{8}$/,
                message: '請輸入正確的 8 碼統一編號',
              },
            }}
            onInput={(e) => {
              e.target.value = e.target.value.replace(/\D/g, '');
            }}
          />
          <FormInput
            id="companyEmail"
            register={register}
            errors={errors}
            wrapperClass="mb-0"
            labelText="收件信箱"
            type="email"
            placeholderText="例：example@company.com"
            iconName="eva:email-outline"
            rules={{
              required: '請輸入收件信箱',
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: '信箱格式不正確',
              },
            }}
          />
        </div>
      )}
    </>
  );
};

export default InvoiceSection;
