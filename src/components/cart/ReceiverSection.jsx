import { Controller } from 'react-hook-form';

// components
import Input from '../Input';
import Select from '../Select';
import FormError from '../FormError';

// utils
import { stripNonDigits } from '../../utils/inputHelpers';

function ReceiverSection({
  register,
  errors,
  control,
  cities,
  districts,
  currentCity,
  setValue,
  trigger,
  handleSyncMemberData,
}) {
  return (
    <section className="cart-panel p-4 p-lg-6 mb-2 mb-lg-6">
      <h2 className="cart-section-title mb-6">收件資料</h2>
      <Input
        id="name"
        register={register}
        errors={errors}
        labelText="姓名"
        type="text"
        placeholderText="請輸入真實姓名"
        ariaLabel="收件者姓名"
        iconName="material-symbols:person-outline-rounded"
        rules={{
          required: {
            value: true,
            message: '請輸入真實收件人全名。',
          },
        }}
        labelRight={
          <div className="form-check">
            <input
              className="form-check-input rounded-5"
              type="checkbox"
              id="syncMemberData"
              {...register('syncMemberData', {
                onChange: handleSyncMemberData,
              })}
            />
            <label className="form-check-label s-text" htmlFor="syncMemberData">
              帶入會員資料
            </label>
          </div>
        }
      />
      <Input
        id="phone"
        register={register}
        errors={errors}
        labelText="電話"
        type="tel"
        placeholderText="請輸入電話號碼"
        ariaLabel="收件者電話號碼"
        iconName="bx:phone"
        rules={{
          required: {
            value: true,
            message: '請輸入電話號碼。',
          },
          minLength: {
            value: 6,
            message: '至少 6 碼。',
          },
        }}
        maxLength={10}
        onInput={stripNonDigits}
      />
      <div>
        <label htmlFor="city" className="form-label px-2">
          地址
        </label>
        <div className="row g-3 mb-3">
          <div className="col-6">
            <Controller
              name="city"
              control={control}
              rules={{ required: '請選擇城市' }}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <Select
                  id="city"
                  placeholderText="城市"
                  options={cities}
                  value={value}
                  onChange={(val) => {
                    onChange(val); // 告訴 RHF 城市換了
                    //清空值時，觸發鄉鎮市區「必填」提醒
                    setValue('district', '', { shouldValidate: true }); // 💡 連動防呆：城市切換時，清空鄉鎮市區的值
                  }}
                  errorMsg={error?.message}
                />
              )}
            />
            <FormError message={errors?.city?.message} />
          </div>
          <div className="col-6">
            <Controller
              name="district"
              control={control}
              rules={{ required: '請選擇鄉鎮市區' }}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <Select
                  id="district"
                  placeholderText="鄉鎮市區"
                  options={districts}
                  value={value}
                  onChange={(val) => {
                    onChange(val);
                    trigger(['city', 'district']);
                  }}
                  disabled={!currentCity} // 防呆：沒選城市，不給選
                  errorMsg={error?.message}
                />
              )}
            />
            <FormError message={errors?.district?.message} />
          </div>
        </div>
        <Input
          id="street"
          register={register}
          errors={errors}
          wrapperClass="mb-0"
          type="text"
          placeholderText="請輸入地址"
          ariaLabel="收件者地址"
          iconName="mi:location"
          rules={{
            required: {
              value: true,
              message: '請輸入地址。',
            },
          }}
        />
      </div>
    </section>
  );
}
export default ReceiverSection;
