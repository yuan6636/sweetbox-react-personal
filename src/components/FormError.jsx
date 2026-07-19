import { Icon } from '@iconify/react';

const FormError = ({ message }) => {
  if (!message) return null;

  return (
    <div className="px-2 error-message text-semantic-error mt-1">
      <Icon className="me-2" icon="gridicons:notice-outline" width="16" height="16" />
      {message}
    </div>
  );
};

export default FormError;
