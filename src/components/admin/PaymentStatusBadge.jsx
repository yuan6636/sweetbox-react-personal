const PAYSTATUS = {
  paid: '已付款',
  failed: '付款失敗',
  pending: '即將付款',
};

function PaymentStatusBadge({ currentStatus }) {
  const isFailed = currentStatus === 'failed';
  return (
    <button type="button" className={`payStatusBadge ${isFailed ? 'failed' : ''}`}>
      {PAYSTATUS[currentStatus]}
    </button>
  );
}

export default PaymentStatusBadge;
