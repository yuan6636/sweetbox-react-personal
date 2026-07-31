import { Icon } from '@iconify/react';

const faqTabs = [
  {
    id: 'hot',
    label: '熱門問題',
    isDefault: true,
    items: [
      {
        id: 'hot-1',
        question: '我要訂購甜點盒，需要加入會員嗎？',
        answer: '是的，目前我們僅開放會員訂購服務，以方便你管理訂閱狀態、配送地址與付款資訊。',
      },
      {
        id: 'hot-2',
        question: '有哪些付款方式呢？',
        answer: '目前支援信用卡付款。',
      },
      {
        id: 'hot-3',
        question: '我的甜點盒什麼時候能到？',
        answer:
          '下單後約需5–7個工作天安排配送，我們會盡快把甜點送到你手上。※若遇旺季或天候影響，配送時間可能略有延遲。',
      },
      {
        id: 'hot-4',
        question: '一盒甜提供哪些類型的盒子？',
        answer:
          '我們提供精選、在地、異國、季節、無負擔、素食六種主題的甜點盒，來滿足每一位甜點愛好者的味蕾。',
      },
    ],
  },
  {
    id: 'account',
    label: '會員與帳號',
    items: [
      {
        id: 'account-1',
        question: '我要訂購甜點盒，需要加入會員嗎？',
        answer: '是的，目前我們僅開放會員訂購服務，以方便你管理訂閱狀態、配送地址與付款資訊。',
      },
      {
        id: 'account-2',
        question: '如何加入會員？',
        answer: '點選右上角「註冊/登入」按鈕，填寫基本資料即可成為會員。',
      },
      {
        id: 'account-3',
        question: '成為會員有哪些好處？',
        answer: '將不定期收到會員專屬優惠、當朋友以你的邀請碼訂閱成功後，你將獲得100元折價券。',
      },
      {
        id: 'account-4',
        question: '我要怎麼查看我的訂單或訂閱狀態？',
        answer: '登入會員後前往「會員中心」的「訂閱紀錄」，即可查看目前與過去的訂單資訊。',
      },
    ],
  },
  {
    id: 'money',
    label: '費用與訂閱',
    items: [
      {
        id: 'money-1',
        question: '一盒甜提供哪些類型的盒子？',
        answer:
          '我們提供精選、在地、異國、季節、無負擔、素食六種主題的甜點盒，來滿足每一位甜點愛好者的味蕾。',
      },
      {
        id: 'money-2',
        question: '我是否需要支付運費呢？',
        answer: '我們提供全台免運服務，讓你輕鬆享受甜點，不必擔心運費問題！',
      },
      {
        id: 'money-3',
        question: '我可以取消或暫停我的訂閱嗎？',
        answer: '可以，但若在訂閱期間取消或暫停，需補齊過去訂閱期數的折扣差額。',
      },
      {
        id: 'money-4',
        question: '有哪些付款方式呢？',
        answer: '目前支援信用卡付款。',
      },
    ],
  },
  {
    id: 'other',
    label: '其他',
    items: [
      {
        id: 'other-1',
        question: '我的甜點盒什麼時候能到？',
        answer:
          '下單後約需5–7個工作天安排配送，我們會盡快把甜點送到你手上。※若遇旺季或天候影響，配送時間可能略有延遲。',
      },
      {
        id: 'other-2',
        question: '我拿到破損的產品，怎麼辦？',
        answer: '不用擔心！我們會提供協助。請拍照告訴我們破損產品的狀況，我們將盡快為你處理。',
      },
      {
        id: 'other-3',
        question: '我可以客製化甜點盒中的內容嗎？',
        answer:
          '目前無法客製化甜點盒的內容。如果您有任何飲食限制或對於產品有任何問題或疑慮，請於購買前與我們聯繫。',
      },
    ],
  },
];

function FaqSection() {
  return (
    <section className="bg-neutral-300 position-relative faq-wave" data-aos="fade-up">
      <div className="container py-9 py-lg-11">
        <div className="faq-bg rounded-panel ">
          <div className="px-lg-9 py-lg-10 py-9">
            <div className="text-center mb-9">
              <p className="en-font fs-7 fs-lg-5 fw-bold ls-1 mb-3 mb-lg-6 text-primary-600">FAQ</p>
              <h2>
                <span className="visually-hidden">FAQ</span>
                <picture>
                  <source
                    media="(min-width: 576px)"
                    srcSet="./images/Home_Page/title_section08.svg"
                  />
                  <img src="./images/Home_Page/title_section08_mobile.png" alt="FAQ-img" />
                </picture>
              </h2>
            </div>
            {/* Tab */}
            <ul className="nav nav-pills faq-nav" id="pills-tab" role="tablist">
              {faqTabs.map((tab) => {
                return (
                  <li key={tab.id} className="nav-item me-2 me-lg-3" role="presentation">
                    <button
                      className={`nav-link ${tab.isDefault && 'active'}`}
                      id={`pills-${tab.id}-tab`}
                      data-bs-toggle="pill"
                      data-bs-target={`#${tab.id}`}
                      type="button"
                      role="tab"
                      aria-controls={tab.id}
                      aria-selected={tab.isDefault && 'true'}
                    >
                      {tab.label}
                    </button>
                  </li>
                );
              })}
            </ul>
            {/* FAQ 內容 */}
            <div className="tab-content px-0 py-4 p-sm-6" id="pills-tabContent">
              {faqTabs.map((tab) => (
                <div
                  key={tab.id}
                  className={`tab-pane fade ${tab.isDefault && 'show active'}`}
                  id={tab.id}
                  role="tabpanel"
                  aria-labelledby={`pills-${tab.id}-tab`}
                >
                  {/* 問題 */}
                  <div className="accordion accordion-flush" id={`accordion-${tab.id}`}>
                    {tab.items.map((item) => (
                      <div key={item.id} className="accordion-item">
                        <h3 className="accordion-header">
                          <button
                            className="accordion-button collapsed justify-content-between fw-bold fs-7 fs-lg-6 text-neutral-800"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target={`#${item.id}`}
                            aria-expanded="false"
                            aria-controls={item.id}
                          >
                            {item.question}
                            <div className="p-3">
                              {/* 加號 */}
                              <Icon
                                className="add"
                                icon="material-symbols:add-rounded"
                                width="24"
                                height="24"
                              />
                              {/* 減號 */}
                              <Icon className="sub" icon="ic:round-minus" width="24" height="24" />
                            </div>
                          </button>
                        </h3>
                        <div
                          id={item.id}
                          className="accordion-collapse collapse"
                          data-bs-parent={`#accordion-${tab.id}`}
                        >
                          <div className="accordion-body fs-7 fs-lg-6">
                            <p>{item.answer}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FaqSection;
