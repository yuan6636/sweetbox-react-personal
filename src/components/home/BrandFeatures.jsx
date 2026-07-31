const features = [
  {
    id: 'unboxing',
    img: { src: './images/Home_Page/unboxing.svg' },
    title: '每月驚喜主題盒',
    description: '每月依不同主題搭配 6 到 10 款不重複的甜點驚喜，讓你不再煩惱選擇。',
    delay: 0,
  },
  {
    id: 'book',
    img: { src: './images/Home_Page/book.svg' },
    title: '詳細介紹與保存指南',
    description: '每盒甜點附上詳細介紹與保存指南，讓你放心品嚐，輕鬆享受。',
    delay: 100,
  },
  {
    id: 'rating',
    img: { src: './images/Home_Page/rating.svg' },
    title: '主流與小眾品牌混搭',
    description: '結合大品牌經典與小眾人氣店，帶來多樣化的口感體驗。',
    delay: 200,
  },
  {
    id: 'nuts',
    img: { src: './images/Home_Page/nuts.svg' },
    title: '限量新品與在地特色',
    description: '第一時間嚐到市場熱點新品與地方特色，讓你永遠走在甜點潮流前端。',
    delay: 300,
  },
];

function BrandFeatures() {
  return (
    <section className="position-relative">
      <img
        className="position-absolute end-0 top-0 d-none d-lg-block z-n1"
        src="./images/Home_Page/bg_brownies.png"
        alt=""
        height="744"
        width="584"
      />
      <div className="container pt-lg-12 pb-lg-11 py-10">
        <div className="mb-lg-10 mb-9 text-center text-lg-start" data-aos="fade-right">
          <p className="en-font text-primary-600 fs-7 fs-lg-6 ls-1 fw-bold mb-lg-6 mb-3">
            Sweet in box
          </p>
          <h2>
            <span className="visually-hidden">讓你的味蕾每個月都充滿期待</span>
            <picture>
              <source srcSet="./images/Home_Page/title_mobile.svg" media="(max-width: 992px)" />
              <img src="./images/Home_Page/title_desktop.svg" alt="" />
            </picture>
          </h2>
        </div>
        <ul className="row card-custom">
          {features.map((feature) => (
            <li
              key={feature.id}
              className="col-lg-3 p-lg-6 p-4 text-center text-lg-start"
              data-aos="fade-up"
              data-aos-delay={feature.delay}
            >
              <img className="mb-lg-3 mb-2" src={feature.img.src} alt="" width="120" height="120" />
              <h3 className="fs-lg-4 fs-6 ls-1 fw-bold text-neutral-800 mb-lg-3 mb-2">
                {feature.title}
              </h3>
              <p className="fs-lg-6 fs-7 text-neutral-800">{feature.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default BrandFeatures;
