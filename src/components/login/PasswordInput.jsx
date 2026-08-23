import { useState } from 'react';
import { Icon } from '@iconify/react';

// components
import Input from '../../components/Input';

// constants
import { PASSWORD_INVALID_CHARS } from '../../constants/login';

function PasswordInput({ id, register, errors, labelText, placeholderText, ariaLabel, rules }) {
  const [isVisible, setIsVisible] = useState(false);

  const handlePasswordInput = (e) => {
    e.target.value = e.target.value.replace(/\s+/g, '').replace(PASSWORD_INVALID_CHARS, '');
  };

  return (
    <Input
      id={id}
      register={register}
      errors={errors}
      labelText={labelText}
      type={isVisible ? 'text' : 'password'}
      placeholderText={placeholderText}
      ariaLabel={ariaLabel}
      iconName="mdi:password-outline"
      minLength={6}
      maxLength={14}
      rules={rules}
      onInput={handlePasswordInput}
      labelRight={
        <button
          type="button"
          className="btn-simple-icon mb-2 me-2"
          style={{ zIndex: 5, cursor: 'pointer' }}
          onClick={() => setIsVisible(!isVisible)}
        >
          {isVisible ? (
            <Icon icon="mdi:eye" width="16" height="16" />
          ) : (
            <Icon icon="mdi:hide" width="16" height="16" />
          )}
        </button>
      }
    />
  );
}

export default PasswordInput;
