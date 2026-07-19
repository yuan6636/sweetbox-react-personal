// 載入 components
import HeroBanner from '../components/home/HeroBanner';
import BrandFeatures from '../components/home/BrandFeatures';
import ThemeSwiper from '../components/home/ThemeSwiper';
import SubscriptionSteps from '../components/home/SubscriptionSteps';
import SubBanner from '../components/home/SubBanner';
import FeedbackSwiper from '../components/home/FeedbackSwiper';
import BrandsSwiper from '../components/home/BrandsSwiper';
import FaqSection from '../components/home/FaqSection';

function Home() {
  return (
    <>
      {/* 隱藏超出的背景圖 */}
      <main className="main overflow-hidden">
        {/* Hero banner */}
        <HeroBanner />
        {/* Brand Features */}
        <BrandFeatures />
        {/* Theme option */}
        <ThemeSwiper />
        {/* Subscription steps */}
        <SubscriptionSteps />
        {/* Sub banner */}
        <SubBanner />
        {/* Feedback */}
        <FeedbackSwiper />
        {/* Brands partner */}
        <BrandsSwiper />
        {/* FAQ */}
        <FaqSection />
      </main>
    </>
  );
}

export default Home;
