import { createRoot } from 'react-dom/client';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import './assets/scss/all.scss';
import 'bootstrap';

import routes from './routes/index.jsx';

const router = createHashRouter(routes);

createRoot(document.getElementById('root')).render(
  <RouterProvider
    router={router}
    future={{
      v7_startTransition: true,
    }} // 把「切頁更新」降級成背景任務，避免影響使用者即時操作
  />,
);
