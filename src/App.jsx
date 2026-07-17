import { Outlet } from 'react-router-dom';
import Footer from './layouts/Footer';
import Header from './layouts/Header';
import ScrollToTop from './components/ScrollToTop';

import { CartProvider } from './contexts/cart';
import { AuthProvider } from './contexts/auth';

function App() {
  return (
    <div>
      <ScrollToTop />
      <AuthProvider>
        <CartProvider>
          <Header />
          <Outlet />
        </CartProvider>
        <Footer />
      </AuthProvider>
    </div>
  );
}

export default App;
