// 外部工具
import { Icon } from '@iconify/react';

// 狀態樣式
const paymentStatusClassMap = {
  pending: 'text-neutral-700',
  failed: 'text-semantic-error',
};

const paymentStatusMap = {
  pending: '未付款',
  paid: '已付款',
  failed: '付款失敗',
};

const shippingStatusClassMap = {
  pending: 'text-neutral-700',
};

const shippingStatusMap = {
  pending: '待出貨',
  shipped: '已出貨',
  on_hold: '處理中',
  not_required: '無須出貨',
};

function AccordionItem({ id, orders, isExpanded }) {
  return (
    <div
      id={`collapse-${id}`}
      className={`accordion-collapse collapse ${isExpanded ? 'show' : ''}`}
    >
      {/* 手風琴下拉 table */}
      <div className="accordion-body p-0 d-none d-xl-block">
        <table className="table table-borderless rounded-5 overflow-hidden subscription-table align-middle">
          <thead>
            <tr className="table-neutral-200">
              <th scope="col">訂單編號</th>
              <th scope="col">期數</th>
              <th scope="col">帳單日期</th>
              <th scope="col">金額</th>
              <th scope="col">付款狀態</th>
              <th scope="col">出貨狀態</th>
              <th scope="col">發票</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const { id, orderNo, cycle, paymentDate, amount, paymentStatus, shippingStatus } =
                order;

              return (
                <tr key={id}>
                  <th scope="row">{orderNo}</th>
                  <td>{cycle ?? '-'}</td>
                  <td>{paymentDate}</td>
                  <td>{`NT$${amount}`}</td>
                  <td
                    className={`
                                ${paymentStatusClassMap[paymentStatus]}
                                `}
                  >
                    {paymentStatusMap[paymentStatus] ?? '-'}
                  </td>
                  <td
                    className={`
                                ${shippingStatusClassMap[shippingStatus]}
                                `}
                  >
                    {shippingStatusMap[shippingStatus] ?? '-'}
                  </td>
                  <td>
                    <button type="button" className="btn border-0 me-3" disabled>
                      <Icon icon="tabler:eye" width="20" height="20" />
                    </button>
                    <button type="button" className="btn border-0" disabled>
                      <Icon icon="material-symbols:download-rounded" width="20" height="20" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* 手風琴 mobile 下拉卡片 */}
      <div className="accordion-body p-0 d-xl-none d-block d-flex flex-column gap-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="rounded-5 border border-neutral-400 p-6 d-flex flex-column gap-4"
          >
            <div className="d-flex flex-column gap-6">
              {/* 訂單編號與狀態 */}
              <div>
                <div className="mb-3">
                  <h3 className="mb-1 fs-9 ls-1 text-neutral-600">訂單編號</h3>
                  <p className="h5">{order.orderNo}</p>
                </div>
                <div>
                  <span className="badge-resolved me-3">
                    {paymentStatusMap[order.paymentStatus]}
                  </span>
                  <span className="badge-resolved">{shippingStatusMap[order.shippingStatus]}</span>
                </div>
              </div>
              {/* 訂單詳細內容 */}
              <div className="d-flex flex-column gap-2">
                <div className="subscription-info-divider"></div>
                <div className="d-flex">
                  <div className="flex-grow-1 small">
                    <p className="mb-1 text-neutral-600">金額</p>
                    <p>NT${order.amount}</p>
                  </div>
                  <div className="flex-grow-1 small">
                    <p className="mb-1 text-neutral-600">期數</p>
                    <p>{order.cycle}</p>
                  </div>
                  <div className="flex-grow-1 small">
                    <p className="mb-1 text-neutral-600">付款日期</p>
                    <p>{order.paymentDate}</p>
                  </div>
                </div>
                <div className="subscription-info-divider"></div>
              </div>

              {/* 訂單發票按鈕 */}
              <div className="d-flex gap-3">
                <button
                  type="button"
                  className="btn btn-md btn-neutral-300 flex-grow-1 rounded-pill"
                  disabled
                >
                  查看發票
                </button>
                <button
                  type="button"
                  className="btn btn-md btn-neutral-300 flex-grow-1 rounded-pill"
                  disabled
                >
                  下載發票
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AccordionItem;
