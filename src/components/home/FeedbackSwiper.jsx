import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';

// 載入 swiper 樣式
import 'swiper/css';
import 'swiper/css/navigation';

const feedbackData = [
  {
    img: './images/home-page/pic-review-02.png',
    rating: 4.5,
    text: '每次打開甜點盒都有拆禮物的感覺！我是那種選擇困難又愛吃甜點的人，有時候光選哪家蛋糕就滑一小時，現在每月都有驚喜幫我決定，超省心又療癒！',
    author: '無聊小日子',
    avatar: './images/home-page/avatar-01.png',
  },
  {
    img: './images/home-page/pic-review-01.png',
    rating: 4.0,
    text: '超愛這種不寂寞的嚐鮮方式！上次吃到一家我從沒聽過的小店，竟然好吃到立刻加關注，下次想訂整顆主題回購。比起自己亂買，一盒甜起值又省時～',
    author: '焦糖人生好焦躁',
    avatar: './images/home-page/avatar-02.png',
  },
  {
    img: './images/home-page/pic-review-06.png',
    rating: 4.2,
    text: '整個包裝跟口味都超級可愛，完全是我的風格。還特別拍照傳給我閨蜜，結果她現在也訂了🤣',
    author: '一點點可愛就好',
    avatar: './images/home-page/avatar-03.png',
  },
  {
    img: './images/home-page/pic-review-05.png',
    rating: 4.5,
    text: '我太喜歡一盒甜的季節主題了，讓我很期待每次季節的交替。',
    author: 'Linda K.',
    avatar: './images/home-page/avatar-04.png',
  },
  {
    img: './images/home-page/pic-review-04.png',
    rating: 5.0,
    text: '本來只是想試試，結果連我媽都搶著問🤤甜點不只好吃，還有詳細的介紹跟保存小卡，看得出來很用心。整體包裝跟體驗感都超棒，續訂沒懸念！',
    author: '啾啾在躺平',
    avatar: './images/home-page/avatar-05.png',
  },
  {
    img: './images/home-page/pic-review-03.png',
    rating: 4.0,
    text: '一盒甜讓我太開心了！開箱的過程很刺激，裡面的甜點也總是能療癒我身心，驚喜又好吃。太喜歡了！',
    author: '南港裴勇俊',
    avatar: './images/home-page/avatar-06.png',
  },
];

function FeedbackSwiper() {
  return (
    <section className="bg-neutral-200 position-relative" data-aos="fade-up">
      <div className="container py-lg-11 py-10">
        <div className="mb-9 mb-lg-10 text-center position-relative z-1">
          <p className="en-font fs-7 fs-lg-5 ls-1 fw-bold mb-lg-6 mb-3 text-primary-600">
            Sweet words
          </p>
          <h2>
            <span className="visually-hidden">好評分享</span>
            <picture>
              <source media="(min-width: 576px)" srcSet="./images/home-page/title-feedback.svg" />
              <img
                className="feedback-img"
                src="./images/home-page/title-feedback-mobile.png"
                alt=""
              />
            </picture>
          </h2>
        </div>
        <Swiper
          className="feedback-swiper"
          modules={[Autoplay]}
          slidesPerView={'auto'}
          spaceBetween={24}
          autoplay={true}
          loop
          speed={800}
          grabCursor={true}
        >
          {feedbackData.map((feedback, index) => (
            <SwiperSlide key={index} className="swiper-slide" style={{ width: '300px' }}>
              <div className="card bg border-light bg-neutral-200 feedback-card w-100">
                <img
                  src={feedback.img}
                  className="card-img-top w-100"
                  alt={`${feedback.author || '客戶'}分享的甜點盒開箱照`}
                />
                <div className="card-body d-flex flex-column justify-content-between">
                  <div className="content">
                    <p className="star-number ls-1 text-neutral-800">
                      <span className="me-2">{feedback.rating}</span>
                      <img src="./images/icon/icon-star.svg" alt="星星圖示" />
                    </p>
                    <p className="card-text">{feedback.text}</p>
                  </div>
                  <div className="author d-flex align-items-center justify-content-end">
                    <p className="me-2">{feedback.author}</p>
                    <img src={feedback.avatar} alt="客戶頭像" className="" />
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

export default FeedbackSwiper;
