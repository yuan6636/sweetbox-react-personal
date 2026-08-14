import { useState } from 'react';

function ConfirmModal({ confirmModalRef, title, description, onConfirm, handleCloseModal }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    setIsSubmitting(true);
    await onConfirm();
    handleCloseModal();
    setIsSubmitting(false);
  };

  return (
    <div
      className="modal fade"
      tabIndex="-1"
      aria-labelledby="confirmModalLabel"
      ref={confirmModalRef}
    >
      <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '360px' }}>
        <div className="modal-content rounded-4 p-6">
          <div className="d-flex justify-content-between align-items-start mb-4">
            <h2 className="h6 ls-1 mb-0" id="confirmModalLabel">
              {title}
            </h2>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={handleCloseModal}
            ></button>
          </div>
          {description && <p className="small text-neutral-700 mb-6">{description}</p>}
          <div className="d-flex gap-3">
            <button
              type="button"
              className="btn btn-neutral-300 rounded-pill flex-fill py-2"
              disabled={isSubmitting}
              onClick={handleCloseModal}
            >
              取消
            </button>
            <button
              type="button"
              className="btn btn-semantic-error rounded-pill flex-fill py-2"
              disabled={isSubmitting}
              onClick={handleConfirm}
            >
              {isSubmitting ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  處理中...
                </>
              ) : (
                '確認移除'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
