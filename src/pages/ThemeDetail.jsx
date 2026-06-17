// 內部元件
import ThemePlans from '../components/theme-detail/ThemePlans';
import WhatInTheBox from '../components/theme-detail/WhatInTheBox';
import FirstSweetBox from '../components/theme-detail/FirstSweetBox';
import ThemeReviews from '../components/theme-detail/ThemeReviews';

function ThemeDetail() {
  return (
    <>
      <main className="main overflow-hidden">
        {/* section1 主題menu + 訂閱方案 */}
        <ThemePlans />
        {/* section2 甜點盒裡有甚麼 */}
        <WhatInTheBox />
        {/* section3 第一盒甜內容 */}
        <FirstSweetBox />
        {/* section4 好評分享 */}
        <ThemeReviews />
      </main>
    </>
  );
}
export default ThemeDetail;
