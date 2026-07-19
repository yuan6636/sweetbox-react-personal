import App from '../App';
import Cart from '../pages/Cart';
import CartCheckout from '../pages/CartCheckout';
import CartFinish from '../pages/CartFinish';
import Home from '../pages/Home';
import Subscription from '../pages/Subscription';
import Theme from '../pages/Theme';
import ThemeDetail from '../pages/ThemeDetail';
import Subscribe from '../pages/admin/Subscribe';
import SubscribeDetail from '../pages/admin/SubscribeDetail';
import Login from '../pages/Login';
import NotFound from '../pages/NotFound';
import ProtectedRoute from '../components/ProtectedRoute';

const routes = [
  {
    path: '/',
    element: <App />,
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
        path: 'cart',
        element: (
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        ),
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
        path: 'theme',
        element: <Theme />,
      },
      {
        path: 'themeDetail/:id',
        element: <ThemeDetail />,
      },
      {
        path: 'subscription',
        element: <Subscription />,
      },
      {
        path: 'admin/subscribe',
        element: (
          <ProtectedRoute requireAdmin>
            <Subscribe />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin/subscribeDetail/:id',
        element: (
          <ProtectedRoute requireAdmin>
            <SubscribeDetail />
          </ProtectedRoute>
        ),
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
];

export default routes;
