import { Icon } from '@iconify/react';
import FormError from './FormError';

const FormInput = ({
  id,
  register,
  errors = {},
  wrapperClass = 'mb-4 mb-lg-6',
  labelText,
  type,
  placeholderText,
  ariaLabel,
  iconName,
  rules,
  labelRight,
  ...rest //可打包剩餘未提及之 html 原生屬性
}) => {
  const hasError = !!errors?.[id];
  const borderClass = hasError ? 'border border-semantic-error' : '';

  return (
    <div className={wrapperClass}>
      {labelText && (
        <div className="d-flex justify-content-between align-items-center px-2">
          <label htmlFor={id} className="form-label">
            {labelText}
          </label>
          {/* 右側欄位 */}
          {labelRight && <div>{labelRight}</div>}
        </div>
      )}
      <div className={`input-group form-group-filled ${borderClass}`}>
        <span className="input-group-text text-neutral-600">
          <Icon icon={iconName} width="20" height="20"></Icon>
        </span>
        <input
          type={type}
          className={`form-control ps-1 `}
          placeholder={placeholderText}
          id={id}
          aria-label={ariaLabel}
          {...rest} //其餘未提及之 html 原生屬性
          {...register(id, rules)}
        />
      </div>
      {/*錯誤訊息 */}
      <FormError message={errors?.[id]?.message} />
    </div>
  );
};

export default FormInput;
