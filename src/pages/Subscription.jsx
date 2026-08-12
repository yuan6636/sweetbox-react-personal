// 外部工具
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api';
import { BeatLoader } from 'react-spinners';

// 元件區
import Dropdown from '../components/Dropdown';
import Pagination from '../components/Pagination';
import Tab from '../components/subscriptions/user/Tab';
import SubscriptionList from '../components/subscriptions/user/SubscriptionList';
import EmptySubscription from '../components/subscriptions/user/EmptySubscription';

// contexts
import { useAuth } from '../contexts/auth';

const themeOptions = [
  { label: '全部主題', value: null },
  { label: '精選甜點', value: 1 },
  { label: '季節限定', value: 2 },
  { label: '在地甜點', value: 3 },
  { label: '異國風味', value: 4 },
  { label: '無負擔甜點', value: 5 },
  { label: '素食甜點', value: 6 },
];

const statusOptions = [
  { label: '全部訂閱狀態', value: '' },
  { label: '進行中', value: 'active' },
  { label: '已完成', value: 'completed' },
  { label: '已取消', value: 'cancelled' },
];

function Subscription() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [totalItems, setTotalItems] = useState(0);

  const navigate = useNavigate();

  const { user } = useAuth();

  const currentPage = Number(searchParams.get('page')) || 1;

  const fetchSubscriptions = useCallback(async () => {
    try {
      setIsLoading(true);

      const userId = user?.id;
      if (!userId) return;
      // 取得篩選條件
      const themeId = searchParams.get('themeId');
      const status = searchParams.get('status');
      const page = Number(searchParams.get('page')) || 1;

      // 組合 subscriptions
      let url = `/subscriptions?userId=${userId}&_expand=plan&_expand=theme&_sort=createdAt&_order=desc&_page=${page}&_limit=5`;

      if (themeId) {
        url += `&themeId=${themeId}`;
      }

      if (status) {
        url += `&status=${status}`;
      }

      // 取得訂閱
      const itemsRes = await api.get(url);
      const totalCount = Number(itemsRes.headers.get('x-Total-Count'));

      // 取得當前頁數所有訂閱的訂單
      const subscriptionIds = itemsRes.data.map((item) => item.id);

      let ordersRes = { data: [] };
      if (subscriptionIds.length) {
        const ordersQuery = subscriptionIds.map((id) => `subscriptionId=${id}`).join('&');
        ordersRes = await api.get(`/orders?${ordersQuery}&_sort=createdAt&_order=desc`);
      }

      // 訂單的資料預處理
      const groupByOrders = (map, order) => {
        const key = order.subscriptionId;
        if (!map.has(key)) {
          map.set(key, []);
        }
        map.get(key).push(order);
        return map;
      };
      // 取得所有訂閱

      const ordersMap = ordersRes.data.reduce(groupByOrders, new Map());

      const items = itemsRes.data.map((item) => ({
        ...item,
        orders: ordersMap.get(item.id) ?? [],
      }));

      setTotalItems(totalCount);
      setSubscriptions(items);
    } catch (error) {
      console.error('取得訂閱資料失敗：', error?.message);
      setError('載入訂閱資料失敗，請稍後再試');
      setTimeout(() => {
        navigate(-1);
      }, 2000);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    }
  }, [navigate, searchParams, user?.id]);

  // 組合訂閱列表和主題資料
  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  // api error, 顯示錯誤訊息
  if (error) {
    return <h1 className="d-flex justify-content-center align-items-center vh-100">{error}</h1>;
  }

  const handleParamChange = (key, value) => {
    const params = new URLSearchParams(searchParams);

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set('page', 1);
    setSearchParams(params);
  };

  const hasFilters = searchParams.get('themeId') || searchParams.get('status');

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set('page', page);
    setSearchParams(params);
  };

  return (
    <div className="py-sm-11 pt-20 pb-5 bg-neutral-300">
      <main className="container">
        {/* 導覽列表 */}
        <Tab />
        {/* 標題和篩選選單 */}
        <div className="py-4 p-sm-0 mb-4 mb-sm-8">
          <div className="d-flex justify-content-between">
            <h1 className="h2 d-none d-sm-block">訂閱管理</h1>
            <div className="d-flex gap-4">
              <Dropdown
                options={themeOptions}
                width="108px"
                onChange={(value) => handleParamChange('themeId', value)}
                value={searchParams.get('themeId') || ''}
              />
              <Dropdown
                options={statusOptions}
                width="136px"
                onChange={(value) => handleParamChange('status', value)}
                value={searchParams.get('status') || ''}
              />
            </div>
          </div>
        </div>
        {/* 訂閱列表 */}
        {isLoading ? (
          <div className="d-flex justify-content-center gap-2 vh-100">
            <BeatLoader size={20} />
            <p className="text-center">載入訂閱中...</p>
          </div>
        ) : subscriptions.length ? (
          <SubscriptionList subscriptions={subscriptions} fetchSubscriptions={fetchSubscriptions} />
        ) : hasFilters ? (
          <p className="h3 text-center">目前篩選條件下沒有訂閱紀錄</p>
        ) : (
          <EmptySubscription />
        )}

        {/* 分頁 */}
        {totalItems > 0 && (
          <div className="d-flex justify-content-center">
            <Pagination
              currentPage={currentPage}
              totalItems={totalItems}
              itemsPerPage={5}
              onChangePage={handlePageChange}
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default Subscription;
