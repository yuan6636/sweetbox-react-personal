import React from 'react';
import AdminNav from '../../components/AdminNav';
import CircleProgress from '../../components/CircleProgress';
import PayStatusBadge from '../../components/PayStatusBadge';
import ShippedDate from '../../components/ShipDate';
import ShippingStatus from '../../components/ShipStatus';
import { useState, useEffect, useRef } from 'react';
import { Icon } from '@iconify/react';
import { NavLink, useParams } from 'react-router-dom';
import api from '../../api';

function SubscribeDetail() {
  const { id } = useParams();
  // 原始資料
  const [allOrders, setAllOrders] = useState([]);
  // 可編輯資料
  const [editedOrders, setEditedOrders] = useState([]);
  const [subscriptionData, setSubscriptionData] = useState({});
  // 管理訂閱編號是否置頂
  const [isSticky, setIsSticky] = useState(false);
  const [mode, setMode] = useState('normal'); // normal | sticky-visible | hidden
  const lastScrollY = useRef(0);

  const getSubscriptionWithInfo = async (id) => {
    const subscriptionsRes = await api.get(`/subscriptions?subscriptionNumber=${id}`);
    const subId = subscriptionsRes.data[0].id;
    const [ordersRes, plansRes, themesRes, usersRes] = await Promise.all([
      api.get(`/orders?subscriptionId=${subId}`),
      api.get(`/plans`),
      api.get(`/themes`),
      api.get(`/users`),
    ]);
    const subWithItem = subscriptionsRes.data[0];
    const orders = ordersRes.data;

    // 將陣列轉換成物件，並以id作為key，陣列作為value
    const plansMap = new Map(plansRes.data.map((p) => [p.id, p]));
    const themeMap = new Map(themesRes.data.map((t) => [t.id, t]));
    const userMap = new Map(usersRes.data.map((u) => [u.id, u]));

    // get直接取資料，不用像find從頭開始，優化效能
    const plan = plansMap.get(subWithItem?.planId);
    const theme = themeMap.get(plan?.themeId);
    const user = userMap.get(subWithItem?.userId);

    return {
      ...subWithItem,
      orders,
      user, // user: user 簡寫
      plan,
      theme,
    };
  };

  // 抓取使用者資料 users
  useEffect(() => {
    const fetchData = async () => {
      const result = await getSubscriptionWithInfo(id);
      setSubscriptionData(result);
      setAllOrders(result.orders);
      setEditedOrders(result.orders);
    };
    fetchData();
  }, [id]);
  // 未歸檔
  const orderData = editedOrders.filter((item) => !item.isArchived);
  // 已歸檔
  const archivedData = editedOrders.filter((item) => item.isArchived);
  // 已出貨筆數
  const shippedCount = editedOrders.filter((item) => item.shippingStatus === 'shipped').length;
  const shippedProgress = (shippedCount / subscriptionData?.durationMonths) * 100;
  const defaultCard = subscriptionData?.paymentSnapshot;
  // 計算未歸檔數量
  const unArchivedCount = editedOrders.filter((order) => {
    return order.isArchived !== true;
  }).length;

  const userInfo = subscriptionData.user;

  // 手機版，管理滾動，對置頂列跟按鈕列的效果
  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 20);
      const currentY = window.scrollY;

      // 在最頂端
      if (currentY === 0) {
        setMode('normal');
      }
      // 往上滾動
      else if (currentY < lastScrollY.current) {
        setMode('sticky-visible');
      }
      // 往下滾動
      else {
        setMode('hidden');
      }

      lastScrollY.current = currentY;
    };
    // 事件監聽: 只要滾動，就執行 handleScroll
    window.addEventListener('scroll', handleScroll);
    // 清除事件監聽
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  // 出貨狀態按鈕管理
  const [openId, setOpenId] = useState(null); //管理哪個訂單的出貨狀態按鈕被打開
  // 修改資料的出貨狀態
  const updateShipStatusChange = async (id, newStatus) => {
    try {
      // prev代表還沒更改前的 editedOrders
      setEditedOrders((prev) => {
        return prev.map((order) => {
          return (
            // 找到被按的那筆，展開後覆寫新的狀態，不是該筆就回傳原本的資料
            order.id === id ? { ...order, shippingStatus: newStatus } : order
          );
        });
      });
    } catch (err) {
      console.error('update shipping status error: ', err);
    }
    setOpenId(null); //關閉下拉選單
  };

  // 出貨日期按鈕管理
  const [openDateId, setOpenDateId] = useState(null);
  // 更新出貨日期的資料
  const updateShipDateChange = async (id, newDate) => {
    try {
      setEditedOrders((prev) => {
        return prev.map((order) => {
          return order.id === id ? { ...order, shippingDate: newDate } : order;
        });
      });
    } catch (err) {
      console.error('update shipping_date err: ', err);
    }
    setOpenDateId(null); //選完關閉datepicker
  };
  // 更新歸檔
  const updateArchived = async (item) => {
    try {
      if (
        item.paymentStatus === 'paid' &&
        item.shippingStatus === 'shipped' &&
        item.shippingDate !== null
      ) {
        setEditedOrders((prev) => {
          return prev.map((order) => {
            return order.id === item.id ? { ...order, isArchived: !item.isArchived } : order;
          });
        });
      }
    } catch (err) {
      console.error('archived error:', err);
    }
  };
  // 取消變更
  const cancelChange = () => {
    setEditedOrders(allOrders);
  };
  // 儲存變更
  const saveChange = async () => {
    const updates = editedOrders.filter((editedO) => {
      // 根據該輪的訂單找出對應的原始資料
      const origin = allOrders.find((originO) => String(originO.id) === String(editedO.id));
      return (
        // 比對可編輯的資料跟原始資料是否有差異，有差異就回傳true，filter就會放到updates
        editedO.shippingStatus !== origin.shippingStatus ||
        editedO.shippingDate !== origin.shippingDate ||
        editedO.isArchived !== origin.isArchived
      );
    });
    // 遍歷需要更新的資料，一筆一筆做patch
    for (const order of updates) {
      await api.patch(`/orders/${order.id}`, {
        shippingStatus: order.shippingStatus,
        shippingDate: order.shippingDate,
        isArchived: order.isArchived,
      });
    }
    // 把原始資料變更成更新後的資料
    setAllOrders(editedOrders);
    if (unArchivedCount === 0) {
      await api.patch(`subscriptions/${subscriptionData.id}`, {
        isProcessed: true,
      });
    }
  };

  return (
    <>
      <main
        className={`main d-block d-lg-none overflow-hidden sticky-section ${mode === 'hidden' ? 'hide-top' : ''} ${isSticky ? 'is-sticky bg-neutral-200 z-999' : 'bg-neutral-300'}`}
      >
        {/* 如果沒有父層的 overflow-hidden，mt-20會因為外部塌陷凸出 main，造成navbar背景會有白色區塊，也就是 body的背景 */}
        {/* 加上 overflow-hidden後，mt-20會留在main內，預留空間給navbar顯示 */}
        {/* 沒置頂時區塊背景色300，置頂時覆蓋navbar，並且CSS設定translate(-80px)，視覺上就不會有預留的mt-20 */}
        <div className={`container mt-20`}>
          {/* 訂單編號 - mobile */}
          <div className={`order-mobile d-flex align-items-center subscribeDetail-underline  `}>
            <div className="icon me-2">
              <NavLink to={'/admin/subscribe'}>
                <Icon icon={'material-symbols:chevron-left'} width={'22px'} />
              </NavLink>
            </div>
            <div className="order-info d-flex justify-content-between align-items-center pe-3 w-100">
              <div className="subscription-title">
                <p className="fs-9 fw-bold mb-1 text-neutral-600 subscription-text">訂單編號</p>
                <p className="fs-5 fw-bold me-3 text-neutral-800 subscription-id">{id}</p>
              </div>
              <div className="order-status">
                <button
                  type="button"
                  className={`btn orderStatusBtn ${unArchivedCount === 0 ? 'allDone' : ''}`}
                >
                  {unArchivedCount === 0 ? '已處理' : '未處理'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <main className="main overflow-hidden bg-neutral-300">
        <div className="container mt-lg-11 mb-lg-11 mb-10">
          <AdminNav />
          {/* 訂單編號 */}
          <section className="mb-8 d-none d-lg-block">
            <div className="d-flex align-items-center p-3">
              <Icon icon={'material-symbols:chevron-left'} className="me-1" />
              <NavLink to={'/admin/subscribe'}>
                <p className="backList neutral-800 fs-8">返回列表</p>
              </NavLink>
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex gap-3 align-items-center">
                <p className="fs-2 fw-bold me-3 orderID">{id}</p>
                <button
                  type="button"
                  className={`btn orderStatusBtn ${unArchivedCount === 0 ? 'allDone' : ''}`}
                >
                  {unArchivedCount === 0 ? '已處理' : '未處理'}
                </button>
              </div>
              <div className="d-flex gap-3">
                <button
                  type="button"
                  className="cancelButton px-6 py-3 text-neutral-800"
                  onClick={() => cancelChange()}
                >
                  取消
                </button>
                <button
                  type="button"
                  className="saveButton fw-bold text-neutral-100"
                  onClick={() => {
                    const isConfirm = window.confirm('確定儲存嗎?');
                    if (isConfirm) {
                      saveChange();
                      alert('已儲存變更');
                    }
                  }}
                >
                  儲存變更
                </button>
              </div>
            </div>
          </section>
          {/* 訂單編號 - mobile */}
          {/* 訂閱內容 */}
          <section className="">
            <div className="d-flex flex-column flex-lg-row align-items-stretch gap-lg-2 mb-lg-6">
              {/* 訂閱方案 */}
              <div className="orderCard orderCase order-2 order-lg-1 subscribeDetail-underline">
                <div className="caseTitle pt-1 pb-1 pb-lg-4 mb-6 fw-bold fs-8 fs-lg-7 ">
                  訂閱方案
                </div>
                <div className="caseContent px-3">
                  <div className="d-flex gap-8 mb-2 fs-8">
                    <p className="text-neutral-600">方案名稱</p>
                    <p className="text-neutral-800">{subscriptionData?.theme?.title}</p>
                  </div>
                  <div className="d-flex gap-8 mb-2 fs-8">
                    <p className="text-neutral-600">方案時長</p>
                    <p className="text-neutral-800">{subscriptionData?.plan?.durationMonths}個月</p>
                  </div>
                  <div className="d-flex gap-8 mb-2 fs-8">
                    <p className="text-neutral-600">訂閱數量</p>
                    <p className="text-neutral-800">{subscriptionData?.quantity}盒</p>
                  </div>
                  <div className="d-flex gap-8 mb-2 fs-8">
                    <p className="text-neutral-600">訂閱價格</p>
                    <p className="text-neutral-800">NT${subscriptionData?.unitPrice} / 月</p>
                  </div>
                  <div className="d-flex gap-8 mb-2 fs-8">
                    <p className="text-neutral-600">支付方式</p>
                    <p className="text-neutral-800">
                      信用卡 ****-
                      {defaultCard?.lastFour || defaultCard?.map((card) => card.last_four)}
                    </p>
                  </div>
                </div>
              </div>
              {/* 訂單進度 */}
              <div className="orderCard orderSchedule order-1 subscribeDetail-underline">
                <div className="caseTitle pt-1 pb-1 pb-lg-4 mb-6 fw-bold fs-8 fs-lg-7 ">
                  訂閱進度
                </div>
                <div className="d-flex justify-content-center">
                  <CircleProgress progress={shippedProgress}>
                    <p className="metric mb-2 fs-5 fw-bold text-neutral-800">
                      {shippedCount}/{subscriptionData?.durationMonths}
                    </p>
                    <p className="fs-9 text-neutral-600">
                      已配送{shippedCount}期
                      <br />共{subscriptionData?.durationMonths}期
                    </p>
                  </CircleProgress>
                </div>
              </div>
              {/* 會員資訊 */}
              <div className="orderCard memberInfo order-3 subscribeDetail-underline">
                <div className="caseTitle pt-1 pb-1 pb-lg-4 mb-6 fw-bold fs-8 fs-lg-7">
                  收件人資訊
                </div>
                <div className="d-flex gap-8 text-neutral-600 px-4  fs-8">
                  <div className="title">
                    <p className="mb-2">收件人姓名 </p>
                    <p className="mb-2">Email</p>
                    <p className="mb-2">電子載具 </p>
                    <p className="mb-2">統一編號 </p>
                    <p className="mb-2">配送地址 </p>
                  </div>
                  <div className="content text-neutral-800">
                    <p className="mb-2">{userInfo?.name}</p>
                    <p className="mb-2">{userInfo?.email}</p>
                    <p className="mb-2">{userInfo?.carrier}</p>
                    <p className="mb-2">無</p>
                    <p className="mb-2">{Object.values(userInfo?.address || {}).join(' ')}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 未處理訂單 桌機版 */}
          <section className="unprocessed d-none d-lg-block bg-neutral-200 rounded-6 mb-6">
            <div className="p-6">
              <p className="mb-2 fw-bold text-neutral-800">未處理訂單</p>
              <div
                className="border-bottom"
                style={{ marginTop: '6px', marginBottom: '14px' }}
              ></div>
              <table className="subscribeDetailTable column-table bg-neutral-200 fs-8">
                <thead>
                  <tr className="text-neutral-600">
                    <th scope="col" className="ps-4 fw-bold text-neutral-600">
                      訂單編號
                    </th>
                    <th scope="col" className="text-center fw-bold text-neutral-600">
                      期數
                    </th>
                    <th scope="col" className="text-center fw-bold text-neutral-600">
                      金額
                    </th>
                    <th scope="col" className="text-center fw-bold text-neutral-600">
                      付款日期
                    </th>
                    <th scope="col" className="text-center fw-bold text-neutral-600">
                      付款狀態
                    </th>
                    <th scope="col" className="text-center fw-bold text-neutral-600">
                      出貨狀態
                    </th>
                    <th scope="col" className="text-center fw-bold text-neutral-600">
                      預計出貨日
                    </th>
                    <th scope="col" className="text-center fw-bold text-neutral-600">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orderData
                    .slice()
                    .reverse()
                    .map((item) => {
                      return (
                        <tr key={item.orderNo}>
                          <th scope="row" className="ps-4 fw-normal text-semantic-link">
                            {item.orderNo}
                          </th>
                          <td className="text-center fw-normal">
                            {item.cycle}
                            {/* 取訂單編號的後兩碼轉換成數字，這樣如果是01就會變1 */}
                          </td>
                          <td className="text-center fw-normal">{item.amount}</td>
                          <td className="text-center fw-normal">{item.paymentDate}</td>
                          <td className="text-center fw-normal">
                            <PayStatusBadge
                              currentStatus={item.paymentStatus}
                              isArchived={item.isArchived}
                              isFailed={item.paymentStatus === 'failed'}
                            />
                          </td>
                          <td className="text-center fw-normal">
                            <ShippingStatus
                              record={item}
                              isOpen={openId === item.orderNo}
                              onToggle={() =>
                                setOpenId(openId === item.orderNo ? null : item.orderNo)
                              }
                              onChange={(status) => updateShipStatusChange(item.id, status)}
                            />
                          </td>
                          <td className="text-center fw-normal">
                            <ShippedDate
                              record={item}
                              isOpen={openDateId === item.orderNo}
                              onToggle={() => {
                                setOpenDateId(openDateId === item.orderNo ? null : item.orderNo);
                              }}
                              onChange={(date) => updateShipDateChange(item.id, date)}
                            />
                          </td>
                          <td className="text-center fw-normal">
                            <span
                              className={`badge rounded-pill fileBadge text-center fw-bold fs-9 ${item.shippingStatus === 'failed' ? 'shipped-failed' : item.shippingStatus === 'shipped' ? 'pointer' : ''}`}
                              onClick={() => {
                                if (item.paymentStatus !== 'failed') {
                                  updateArchived(item);
                                }
                              }}
                            >
                              {item.isArchived ? '' : '歸檔'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </section>
          {/* 未處理訂單 mobile版*/}
          <div className="unprocessed-mobile d-block d-lg-none  pt-6 px-3 pb-8 subscribeDetail-underline">
            <div className="order-category-text pt-1 pb-1 mb-4 fs-8 fw-bold">未處理訂單</div>
            <div className="order-list d-flex flex-column gap-3">
              {orderData
                .slice()
                .reverse()
                .map((item) => {
                  return (
                    <div
                      className="order-card px-4 py-6 bg-neutral-200 rounded-6"
                      key={item.orderNo}
                    >
                      <div className="order-content mb-17">
                        <div className="order-header d-flex justify-content-between align-items-end mb-6">
                          <div className="order-title">
                            <div className="text mb-1 fs-9 fw-bold text-neutral-600">訂單編號</div>
                            <div className="order-id fs-5 fw-bold text-neutral-800">
                              {item.orderNo}
                            </div>
                          </div>
                          <PayStatusBadge
                            currentStatus={item.paymentStatus}
                            isArchived={item.isArchived}
                            isFailed={item.paymentStatus === 'failed'}
                          />
                        </div>
                        <div className="order-mobile-divider"></div>

                        {/* 金額&期數&付款日期 */}
                        <div className="order-info fs-8 mt-2 mb-2">
                          <div className="row g-0">
                            <div className="col-4">
                              <div className="price-text text-neutral-600">金額</div>
                              <div className="price text-neutral-800">{item.amount}</div>
                            </div>
                            <div className="col-4">
                              <div className="price-text text-neutral-600">期數</div>
                              <div className="price text-neutral-800">
                                {parseInt(item.orderNo.slice(-2))}
                              </div>
                            </div>
                            <div className="col-4">
                              <div className="price-text text-neutral-600">付款日期</div>
                              <div className="price text-neutral-800">{item.paymentDate}</div>
                            </div>
                          </div>
                        </div>
                        {/* 分隔線 */}
                        <div className="order-mobile-divider"></div>
                        {/* 出貨狀態&預計出貨日 */}
                        <div className="order-shipStatus mt-6">
                          <div className="ship-status d-flex justify-content-between align-items-center mb-3">
                            <div className="ship-text fs-8 text-neutral-600">出貨狀態</div>
                            <div className="ship-button">
                              <ShippingStatus
                                record={item}
                                isOpen={openId === item.orderNo}
                                onToggle={() =>
                                  setOpenId(openId === item.orderNo ? null : item.orderNo)
                                }
                                onChange={(status) => updateShipStatusChange(item.id, status)}
                              />
                            </div>
                          </div>
                          <div className="ship-status d-flex justify-content-between align-items-center">
                            <div className="ship-text fs-8 text-neutral-600">預計出貨日</div>
                            <div className="ship-button">
                              <ShippedDate
                                record={item}
                                isOpen={openDateId === item.orderNo}
                                onToggle={() =>
                                  setOpenDateId(openDateId === item.orderNo ? null : item.orderNo)
                                }
                                onChange={(date) => updateShipDateChange(item.id, date)}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* 結案歸檔按鈕 */}
                      <div className="order-button" onClick={() => updateArchived(item)}>
                        結案歸檔
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
          {/* 已歸檔訂單 桌機版 */}
          <section className="archived d-none d-lg-block bg-neutral-200 rounded-6 mb-6">
            <div className="p-6">
              <p className="mb-2 fw-bold text-neutral-800">已歸檔訂單</p>
              <div
                className="border-bottom"
                style={{ marginTop: '6px', marginBottom: '14px' }}
              ></div>
              <table className="subscribeDetailTable column-table bg-neutral-200 fs-8">
                <thead>
                  <tr className="text-neutral-600">
                    <th scope="col" className="ps-4 fw-bold text-neutral-600">
                      訂單編號
                    </th>
                    <th scope="col" className="text-center fw-bold text-neutral-600">
                      期數
                    </th>
                    <th scope="col" className="text-center fw-bold text-neutral-600">
                      金額
                    </th>
                    <th scope="col" className="text-center fw-bold text-neutral-600">
                      付款日期
                    </th>
                    <th scope="col" className="text-center fw-bold text-neutral-600">
                      付款狀態
                    </th>
                    <th scope="col" className="text-center fw-bold text-neutral-600">
                      出貨狀態
                    </th>
                    <th scope="col" className="text-center fw-bold text-neutral-600">
                      出貨日期
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {archivedData.map((item) => {
                    return (
                      <tr key={item.orderNo}>
                        <th scope="row" className="ps-4 fw-normal order-id text-semantic-link">
                          {item.orderNo}
                        </th>
                        <td className="text-center fw-normal">
                          {parseInt(item.orderNo.slice(-2))}
                        </td>
                        <td className="text-center fw-normal">{item.amount}</td>
                        <td className="text-center fw-normal">{item.paymentDate}</td>
                        <td className="text-center fw-normal">
                          <span
                            className={`badge rounded-pill payBadge ${item.payment_status} fs-9`}
                          >
                            已付款
                          </span>
                        </td>
                        <td className="text-center fw-normal">
                          <ShippingStatus record={item} />
                        </td>
                        <td className="text-center fw-normal">
                          <ShippedDate
                            record={item}
                            isOpen={openDateId === item.orderNo}
                            onToggle={() =>
                              setOpenDateId(openDateId === item.orderNo ? null : item.orderNo)
                            }
                            onChange={(date) => updateShipDateChange(item.id, date)}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
          {/* 已歸檔訂單 mobile版 */}
          <div className="archived-mobile d-block d-lg-none  pt-6 px-3 pb-8">
            <div className="order-category-text pt-1 pb-1 mb-4 fs-8 fw-bold">已歸檔訂單</div>
            <div className="order-list d-flex flex-column gap-3">
              {archivedData.map((item) => {
                return (
                  <div
                    className="archived-order-card p-6 bg-neutral-200 rounded-5"
                    key={item.orderNo}
                  >
                    <div className="order-header mb-6">
                      <div className="order-title mb-3">
                        <div className="text mb-1 fs-9 fw-bold text-neutral-600">訂單編號</div>
                        <div className="order-id fs-5 fw-bold text-neutral-800">{item.orderNo}</div>
                      </div>
                      <div className="order-status d-flex justify-content-start gap-3 mb-3">
                        <PayStatusBadge
                          currentStatus={item.paymentStatus}
                          isArchived={item.isArchived}
                          isFailed={item.paymentStatus === 'failed'}
                        />
                        <ShippingStatus
                          record={item}
                          isOpen={openId === item.orderNo}
                          onToggle={() => setOpenId(openId === item.orderNo ? null : item.orderNo)}
                          onChange={(status) => updateShipStatusChange(item.id, status)}
                        />
                      </div>
                      <div className="order-mobile-divider"></div>
                    </div>
                    <div className="order-info">
                      <div className="price-period d-flex mb-4">
                        <div className="flex-fill">
                          <div className="fs-8 text-neutral-600 mb-1">金額</div>
                          <div className="fs-8 text-neutral-800">{item.amount}</div>
                        </div>
                        <div className="flex-fill">
                          <div className="fs-8 text-neutral-600 mb-1">期數</div>
                          <div className="fs-8 text-neutral-800">
                            {parseInt(item.orderNo.slice(-2))}
                          </div>
                        </div>
                      </div>
                      <div className="payDate-shipDate d-flex ">
                        <div className="flex-fill">
                          <div className="text fs-8 text-neutral-600 mb-1">付款日期</div>
                          <div className="pay-date fs-8 text-neutral-800">{item.paymentDate}</div>
                        </div>
                        <div className="flex-fill">
                          <div className="text fs-8 text-neutral-600 mb-1">出貨日期</div>
                          <div className="pay-date fs-8 text-neutral-800">{item.shippingDate}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
      {/* 底部按鈕列-mobile版才有 */}
      <div
        className={`d-flex d-lg-none justify-content-between align-items-center mobile-button-bar p-6 ${mode === 'sticky-visible' ? '' : 'hide-button-bar'}`}
      >
        <p className="fs-7 text-neutral-700 button-text" onClick={cancelChange}>
          取消
        </p>
        <button
          type="button"
          className="btn fw-bold text-neutral-100 bg-CTA-200 save-button"
          onClick={saveChange}
        >
          儲存變更
        </button>
      </div>
      {openId !== null && (
        <div className="ship-overlay-mobile d-lg-none" onClick={() => setOpenId(null)} />
      )}
    </>
  );
}

export default SubscribeDetail;
