import App from '../App';
import Cart from '../pages/Cart';
import CartCheckout from '../pages/CartCheckout';
import CartFinish from '../pages/CartFinish';
import Home from '../pages/Home';
import Subscription from '../pages/Subscription';
import Theme from '../pages/Theme';
import ThemeDetail from '../pages/ThemeDetail';
import Subscriptions from '../pages/admin/Subscriptions';
import SubscriptionDetail from '../pages/admin/SubscriptionDetail';
import Login from '../pages/Login';
import NotFound from '../pages/NotFound';
import ProtectedRoute from '../components/ProtectedRoute';
import ErrorPage from '../pages/ErrorPage';

const routes = [
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true, // 這樣就代表 "/" 對應 Home
        element: <Home />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'theme',
        element: <Theme />,
      },
      {
        path: 'themeDetail/:id',
        element: <ThemeDetail />,
      },
      // 需要登入的路由，用 ProtectedRoute 先驗證
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: 'cart',
            element: <Cart />,
          },
          {
            path: 'cartCheckout',
            element: <CartCheckout />,
          },
          {
            path: 'cartFinish',
            element: <CartFinish />,
          },
          {
            path: 'subscription',
            element: <Subscription />,
          },
        ],
      },
      // 後台頁面也使用 ProtectedRoute 驗證
      {
        element: <ProtectedRoute requireAdmin />,
        children: [
          {
            path: 'admin/subscribe',
            element: <Subscriptions />,
          },
          {
            path: 'admin/subscribeDetail/:id',
            element: <SubscriptionDetail />,
          },
        ],
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
];

export default routes;
