import { Icon } from '@iconify/react';
import { DatePicker, ConfigProvider } from 'antd';
import dayjs from 'dayjs';

const isMobile = window.innerWidth < 992;

function ShippedDate({ record, isOpen, onToggle, onChange }) {
  const { paymentStatus, shippingDate, isArchived } = record;
  const currentPayment = paymentStatus;
  const hasData = !(shippingDate === null);
  // 付款失敗或是未付款
  if (currentPayment !== 'paid') {
    return <div className="shipDate-disabled">-</div>;
  }
  // 已付款已歸檔
  if (currentPayment === 'paid' && isArchived) {
    return <div className="shipDate archived text-neutral-800">{shippingDate}</div>;
  }
  return (
    <div className="shipDate-wrapper position-relative">
      {/* 按鈕 */}
      <div
        className={`shipDate-btn d-flex align-items-center px-4 py-2 ${isOpen ? 'open' : ''}`}
        onClick={onToggle}
      >
        <div className="flex-grow-1 text-neutral-800 shipDate-value">
          {hasData ? shippingDate : '選擇日期'}
        </div>
        {!isArchived && (
          <div className="icon-box text-neutral-600">
            <Icon icon="mdi:calendar-month-outline" className="icon" />
          </div>
        )}
      </div>
      {/* 行事曆 */}
      {isOpen && (
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#FF5F1F', //套用主顏色
            },
          }}
        >
          <DatePicker
            className="shipDate-picker"
            value={hasData ? dayjs(shippingDate) : null}
            onChange={(date) => {
              if (!date) {
                onChange(null);
                return;
              }
              onChange(date.format('YYYY-MM-DD'));
              onToggle();
            }}
            open={isOpen}
            classNames={{ popup: 'shipDate-picker-popup' }}
            placement={isMobile ? 'bottomRight' : 'bottomLeft'}
            getPopupContainer={(trigger) => trigger.parentElement}
            dropdownAlign={{
              offset: [0, 8],
            }}
          />
        </ConfigProvider>
      )}
    </div>
  );
}
export default ShippedDate;
