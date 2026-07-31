import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import AOS from 'aos';

// components
import Footer from './layouts/Footer';
import Header from './layouts/Header';
import ScrollToTop from './components/ScrollToTop';

// contexts
import { CartProvider } from './contexts/cart';
import { AuthProvider } from './contexts/auth';

function App() {
  useEffect(() => {
    AOS.init({ once: true, duration: 600 });
  }, []);

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
