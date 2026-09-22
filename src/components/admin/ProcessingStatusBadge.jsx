import { STATUS } from '../../constants/status';

const ProcessingStatusBadge = ({ status, onClick, variant = 'desktop' }) => {
  const isProcessed = status === STATUS.PROCESSED;

  if (variant === 'mobile') {
    return (
      <div className="flex-fill d-flex justify-content-end align-items-end">
        <button
          className={`status-btn ${isProcessed ? 'processed' : 'unprocessed'}`}
          onClick={onClick}
          style={{ cursor: 'pointer' }}
        >
          {isProcessed ? '已處理' : '未處理'}
        </button>
      </div>
    );
  }

  return (
    <button className={`status-btn ${isProcessed ? 'processed' : 'unprocessed'}`} onClick={onClick}>
      {isProcessed ? '已處理' : '未處理'}
    </button>
  );
};

export default ProcessingStatusBadge;
