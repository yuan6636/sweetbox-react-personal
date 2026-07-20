import { Icon } from '@iconify/react';
import ShipDate from './ShipDate';
import { useState, useEffect } from 'react';

const SHIP_TEXT = {
  pending: '待出貨',
  shipped: '已出貨',
  onhold: '異常保留',
  not_required: '無須出貨',
};

function DesktopMenu({ onChange }) {
  return (
    <div className="ship-menu">
      <button className="ship-option aa" onClick={() => onChange('pending')}>
        待出貨
      </button>
      <button className="ship-option" onClick={() => onChange('shipped')}>
        已出貨
      </button>
    </div>
  );
}

function MobileMenu({ shippingStatus, onChange, currentShipStatus }) {
  return (
    <div className="ship-menu-mobile">
      <div className="bottom-header d-flex flex-column align-items-center">
        <div className="tab mb-6"></div>
        <div className="bottom-header-title fw-bold">變更出貨狀態</div>
      </div>
      <div className="bottom-content">
        <div className="bottom-options d-flex flex-column px-3 mb-6">
          <button
            className={`ship-option mb-4 ${shippingStatus === 'pending' ? 'active' : ''}`}
            onClick={() => onChange('pending')}
          >
            <p className="fw-bold fs-8 text-neutral-800 mb-1">待出貨</p>
            <p className="fs-8 text-neutral-600">訂單準備中，尚未安排物流</p>
          </button>
          <button
            className={`ship-option ${shippingStatus === 'shipped' ? 'active' : ''}`}
            onClick={() => onChange('shipped')}
          >
            <p className="fw-bold fs-8 text-neutral-800 mb-1">已出貨</p>
            <p className="fs-8 text-neutral-600">訂單已完成出貨作業</p>
          </button>
        </div>
        <div
          className="bottom-text py-3 fs-8 text-center text-neutral-700"
          onClick={() => onChange(currentShipStatus)}
        >
          取消不變更
        </div>
      </div>
    </div>
  );
}

function ShippingStatus({ record, isOpen, onToggle, onChange }) {
  const { shippingStatus, isArchived } = record;
  const currentPayment = record.paymentStatus;
  const currentShipStatus = record.shippingStatus;
  const isPayFailed = currentPayment === 'failed';
  const isPaySuccess = currentPayment === 'paid';
  const hasData = shippingStatus !== null && shippingStatus !== undefined;

  // 將寬度交給React管理，解決了從桌面板改成行動版，需要手動重新整理才能顯示行動版樣式的問題
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 992);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isArchived) {
    return <span className="ship-badge archieved">{SHIP_TEXT[shippingStatus]}</span>;
  }
  if (isPayFailed) {
    return (
      <div className="d-flex d-lg-block justify-content-center align-items-center gap-1 ship-error-button">
        <span className="ship-text error">{SHIP_TEXT[3]}</span>
        <Icon icon="mdi:chevron-down" className="ship-icon d-lg-none" />
      </div>
    );
  }

  const labelText = hasData ? SHIP_TEXT[shippingStatus] : isOpen ? '請選擇' : '出貨狀態';
  return (
    <div className="ship-status-button position-relative">
      <div
        className={`ship-dropdown ${isOpen ? 'open' : ''} ${isPaySuccess ? 'pointer' : ''}`}
        onClick={() => isPaySuccess && onToggle()}
      >
        <span className={`ship-label ${hasData ? 'hasData' : ''}`}>{labelText}</span>

        <Icon icon="mdi:chevron-down" className="ship-icon" />
      </div>
      {isOpen &&
        (isMobile ? (
          <MobileMenu
            shippingStatus={shippingStatus}
            onChange={onChange}
            currentShipStatus={currentShipStatus}
          />
        ) : (
          <DesktopMenu onChange={onChange} />
        ))}
    </div>
  );
}
export default ShippingStatus;
