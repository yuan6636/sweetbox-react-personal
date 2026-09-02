import { Link, Navigate, useSearchParams, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { message } from 'antd';
import { Icon } from '@iconify/react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

import api from '../api';

// 台灣時間
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Asia/Taipei');

// 信用卡 icon 樣式
const cardIcons = {
  visa: 'logos:visaelectron',
  mastercard: 'logos:mastercard',
  jcb: 'logos:jcb',
};

function CartFinish() {
  // 取 網址上的 sub_ids 參數
  const [searchParams] = useSearchParams();
  const subIdsParam = searchParams.get('sub_ids');

  const [subscriptions, setSubscriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const location = useLocation();
  const showSuccess = location.state?.showSuccess;

  // 訂閱成功訊息
  useEffect(() => {
    if (showSuccess) {
      message.success({
        content: '訂閱成功！感謝您的支持。',
        key: 'checkout',
        duration: 2,
      });
    }
  }, [showSuccess]);

  useEffect(() => {
    // 防呆
    if (!subIdsParam) {
      setIsLoading(false);
      return;
    }

    const fetchCompleteData = async () => {
      try {
        const subIdsArray = subIdsParam.split(',');
        // 重組 subscriptions 和 orders 的 query
        const subIdsQuery = subIdsArray.map((id) => `id=${id}`).join('&');
        const ordersQuery = subIdsArray.map((id) => `subscriptionId=${id}`).join('&');

        const [subsRes, plansRes, themesRes, ordersRes] = await Promise.all([
          api.get(`/subscriptions?${subIdsQuery}`),
          api.get('/plans'),
          api.get('/themes'),
          api.get(`/orders?${ordersQuery}`),
        ]);

        const subsData = subsRes.data;

        // 組合資料
        const enrichedSubs = subsData.map((sub) => {
          const matchedPlan = plansRes.data.find((p) => p.id === sub.planId);
          const matchedTheme = themesRes.data.find((t) => t.id === sub.themeId);
          const matchedOrder = ordersRes.data.find((o) => o.subscriptionId === sub.id);

          return {
            ...sub,
            themeTitle: matchedTheme?.title ? `${matchedTheme.title}甜點盒` : '特選甜點盒',
            quantity: sub.quantity || 1,
            discountedPrice: sub.unitPrice || 0,
            durationMonths: sub.durationMonths || matchedPlan?.durationMonths,
            firstOrderAmount: matchedOrder ? matchedOrder.amount : 0,
          };
        });

        setSubscriptions(enrichedSubs);
      } catch (err) {
        console.error('訂閱完成頁面資料讀取失敗', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCompleteData();
  }, [subIdsParam]);

  if (isLoading) {
    return (
      <main
        className="bg-neutral-300 d-flex justify-content-center align-items-center"
        style={{ minHeight: '100vh' }}
      >
        {/*  Bootstrap 內建的 Spinner 載入動畫 */}
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">載入中...</span>
        </div>
      </main>
    );
  }

  //防呆：未結帳 or 取不到資料者，導回購物車
  if (!subscriptions || subscriptions.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  //抓第一筆訂閱信用卡、時間
  const representSub = subscriptions[0];
  // 將 YYYY-MM-DD 轉換為 YYYY/MM/DD 的格式顯示
  const startDate = representSub?.startDate?.replace(/-/g, '/') || '';
  const deductionDay = representSub?.startDate ? dayjs(representSub.startDate).tz().date() : '';
  const paymentInfo = representSub?.paymentSnapshot;
  const totalOriginalAmount = subscriptions.reduce(
    (sum, sub) => sum + sub.discountedPrice * sub.quantity,
    0,
  );
  const totalPaidAmount = subscriptions.reduce((sum, sub) => sum + sub.firstOrderAmount, 0);
  const totalDiscount = totalOriginalAmount - totalPaidAmount;

  return (
    <>
      <main className="bg-neutral-300">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 cart-main">
              {/* 購物車步驟 */}
              <ol className="stepper mx-auto d-flex justify-content-center align-items-center">
                <li className="step-item d-flex flex-column align-items-center active">
                  <div className="step mb-2">1</div>
                  <span className="step-intro">購物車</span>
                </li>
                <li className="step-item d-flex flex-column align-items-center active">
                  <div className="step mb-2">2</div>
                  <span className="step-intro">填寫資料</span>
                </li>
                <li className="step-item d-flex flex-column align-items-center active">
                  <div className="step mb-2">3</div>
                  <span className="step-intro">完成訂閱</span>
                </li>
              </ol>
              <div className="d-flex justify-content-between align-items-center mb-2 mb-lg-6">
                <h1 className="cart-title p-3 py-lg-2 px-lg-4">完成訂閱</h1>
              </div>
              {/* 感謝訂閱 */}
              <section className="cart-wrapper text-center mb-9 mb-lg-6">
                <div className="mx-auto mb-6 mb-sm-8">
                  <img src="./images/cart-page/pic-finish.svg" alt="空的購物車圖片" />
                </div>
                <h2 className="empty-cart-title mb-2">感謝您的訂閱</h2>
                <p className="lh-base mb-3 mb-sm-2">
                  您的一盒甜將於 <span className="text-primary-600">{startDate}</span>{' '}
                  開始陸續配送。
                </p>
              </section>
              {/* 訂閱明細 */}
              <section className="cart-wrapper mb-9 mb-lg-6 fs-8">
                <h3 className="fs-8 fs-sm-7 pb-3 fw-bold border-bottom border-neutral-400">
                  訂閱明細
                </h3>
                <table className="w-100">
                  <tbody>
                    {subscriptions.map((sub) => (
                      <tr key={sub.id} className="align-top">
                        <td className="text-nowrap py-2">
                          # <span>{sub.subscriptionNumber}</span>
                        </td>
                        <td className="w-50 py-2">
                          <div className="fw-bold mb-1">{sub.themeTitle}</div>
                          <div className="d-flex">
                            <div className="badge text-bg-primary-200 text-primary-700 fw-medium rounded-pill me-1">
                              {sub.durationMonths}個月訂閱方案
                            </div>
                            <div className="badge text-bg-neutral-400 text-neutral-700 fw-medium rounded-pill">
                              {sub.quantity} 盒
                            </div>
                          </div>
                        </td>
                        <td className="text-end py-2">
                          <p className="fw-bold ">
                            NT${(sub.discountedPrice * sub.quantity).toLocaleString()}
                          </p>
                          <p className="fs-8">/月</p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
              {/* 首期訂單明細 */}
              <section className="cart-wrapper mb-9 mb-lg-6 fs-8">
                <h3 className="fs-8 fs-sm-7 pb-3 fw-bold border-bottom border-neutral-400">
                  首期付款明細
                </h3>
                <div className="pt-3">
                  <div className="d-flex justify-content-between my-2">
                    <p className="text-neutral-600">小計</p>
                    <p>NT$ {totalOriginalAmount.toLocaleString()}</p>
                  </div>

                  {totalDiscount > 0 && (
                    <div className="d-flex justify-content-between my-2">
                      <p className="text-neutral-600">折扣</p>
                      <p className="text-cta-200">- NT$ {totalDiscount.toLocaleString()}</p>
                    </div>
                  )}

                  <hr className="border-neutral-600 my-1 my-md-2" />
                  <div className="d-flex justify-content-between align-items-center">
                    <p>首期實付合計</p>
                    <p className="fw-bold">NT$ {totalPaidAmount.toLocaleString()}</p>
                  </div>
                </div>
              </section>
              {/* 配送資訊 */}
              <section className="cart-wrapper mb-9 mb-lg-6 fs-8">
                <h3 className="fs-8 fs-sm-7 pb-3 fw-bold border-bottom border-neutral-400">
                  配送資訊
                </h3>
                <div className="d-flex justify-content-between my-2">
                  <p className="text-neutral-600">首次出貨日</p>
                  <p className="text-primary">{startDate}</p>
                </div>
                <div className="d-flex justify-content-between my-2">
                  <p className="text-neutral-600">每月扣款日</p>
                  <p>每月 {deductionDay} 日</p>
                </div>
                <div className="d-flex justify-content-between my-2">
                  <p className="text-neutral-600">付款方式</p>
                  <p className="d-flex align-items-center gap-2">
                    <Icon
                      icon={cardIcons[paymentInfo?.cardBrand] ?? 'tabler:credit-card'}
                      width="24"
                      height="16"
                    />
                    <span> ···· </span>
                    <span>{paymentInfo?.lastFour}</span>
                  </p>
                </div>
                {representSub?.note && (
                  <div className="d-flex justify-content-between fs-8 fs-sm-7 my-2">
                    <p className="fs-8 text-neutral-600 flex-shrink-0 me-4">訂閱備註</p>
                    <p className="text-end text-break">{representSub.note}</p>
                  </div>
                )}
              </section>
              {/* 查看訂閱按鈕 */}
              <section className="row gx-2 mb-18">
                <div className="col-6">
                  <Link className="btn-secondary fw-bold text-center w-100" to="/theme">
                    繼續購物
                  </Link>
                </div>
                <div className="col-6">
                  <Link className="btn-primary-text fw-bold text-center w-100" to="/subscription">
                    查看訂閱內容
                  </Link>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default CartFinish;
