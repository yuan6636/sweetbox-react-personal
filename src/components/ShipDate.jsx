import { Icon } from '@iconify/react';
import { useState } from 'react';
import { DatePicker, ConfigProvider } from 'antd';
import dayjs from 'dayjs';
import 'antd/dist/reset.css';
import zhTW from 'antd/locale/zh_TW';
// function ShipDate({record, isDatePickerOpen, onToggleDatePicker}) {
//   const { orderID, payStatus, shipStatus, shipDate, isArchieved } = record;

//   // 狀態判斷
//   const isError = payStatus === "failed";
//   const isShipped = shipStatus === "shipped";
//   const hasDate = Boolean(shipDate && shipDate !== "-");

//   const [currentDate, setCurrentDate] = useState(
//     shipDate && shipDate !== "-" ? dayjs(shipDate) : null
//   );

//   // 決定顯示內容
//   let text = "-";
//   if (isError) {
//     text = "-";
//   } else if (!isShipped) {
//     text = "選擇日期";
//   } else {
//     text = currentDate
//     ? currentDate.format("YYYY-MM-DD")
//     : "選擇日期";
//   }

//   // 產生 CSS
//   let rootClass = "shipDate-btn";
//   if (isError) rootClass += " is-error";
//   if (!isShipped && !isError) rootClass += " is-empty btn";
//   if (isShipped) rootClass += " is-filled btn";
//   if (isArchieved) rootClass += " is-archieved btn";

//   // ===== 是否可互動 =====
//   const isDisabled = isError || isArchieved;

//   // 付款失敗的話
//   if (shipStatus === 3) {
//     return <span className="disable text-neutral-500">-</span>;
//   }

//   // 已歸檔的話
//   if (isArchieved) {
//     return <span className="text-primary-600">{shipDate}</span>;
//   }
//   return (
//     // <div className="shipDate-wrapper">
//     //   {/* 主顯示區 */}
//     //   <div className={`${rootClass}`}>
//     //     <span className="shipDate-text">{text}</span>

//     //     {/* icon 先全部 render，之後用 CSS 控制 */}
//     //     {!isError && (<span className="shipDate-icon">
//     //       <Icon icon="mdi:calendar-month-outline" />
//     //     </span>)}
//     //   </div>
//     //   {/* 行事曆 */}
//     //   {!isDisabled && (
//     //     <DatePicker className="datePicker"
//     //       popupClassName="shipDate-picker-popup"
//     //       value={currentDate}
//     //       onChange={(date) => setCurrentDate(date)}
//     //       format="YYYY-MM-DD"
//     //       placement="bottomLeft"
//     //       getPopupContainer={(trigger) =>
//     //         trigger.parentElement
//     //       }
//     //     />
//     //   )}
//     // </div>
//     // 新版本
//     // 控制 datepicker 開啟關閉

//   // 先只處理最簡單的：顯示日期或 -
//   <div className="position-relative" style={{display: 'inline'}}>
//   <div className={`shipDateInput d-flex align-items-center ${isDatePickerOpen ? "expanded" : ""}`} onClick={()=>{onToggleDatePicker(orderID)}}>
//     <span className="me-1">{shipDate || '選擇日期'}</span>
//     <Icon icon="mdi:calendar-month-outline" width={'14px'} className=""/>
//   </div>
//   <ConfigProvider
//         theme={{
//           token: {
//             colorPrimary: '#FF6B2C', // 橘色主題
//             colorLink: '#FF6B2C',
//           },
//         }}
//       >
//         <DatePicker
//           open={isDatePickerOpen}
//           value={shipDate ? dayjs(shipDate) : null}
//           onChange={(date) => onDateChange && onDateChange(orderID, date)}
//           onOpenChange={(open) => {
//             if (!open) onToggleDatePicker(orderID, false);
//           }}
//           placeholder="選擇日期"
//           format="YYYY-MM-DD"

//           // 控制彈出位置
//           getPopupContainer={(trigger) => trigger.parentElement}
//           placement="bottomLeft"
//           dropdownAlign={{
//             points: ['tl', 'bl'],
//             offset: [0, 8],  // 按鈕下方 8px
//             overflow: { adjustX: true, adjustY: true }
//           }}

//           // 隱藏輸入框本身
//           style={{
//             position: 'absolute',
//             top: '100%',
//             left: 0,
//             width: 0,
//             height: 0,
//             opacity: 0,
//             pointerEvents: 'none',
//           }}

//           popupStyle={{
//             zIndex: 1050,
//           }}

//           // 自訂渲染
//           popupClassName="ship-date-picker-popup"

//           // 顯示 Today 按鈕
//           showToday
//           renderExtraFooter={() => null}
//         />
//       </ConfigProvider>
//   </div>
// )
// };

const isMobile = window.innerWidth < 992;

function ShippedDate({ record, isOpen, onToggle, onChange }) {
  const { paymentStatus, shippingDate, isArchived } = record;
  console.log('payment_status:', record.id, paymentStatus);
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
  // 已付款未歸檔
  console.log(shippingDate);
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
