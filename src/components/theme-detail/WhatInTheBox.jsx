import { featureCards } from './mockData';

function WhatInTheBox() {
  return (
    <section className="bg-neutral-400 theme-feature position-relative mt-5 mt-lg-0 z-1">
      <div className="container-1076 py-17 py-lg-18">
        <div className="mb-15 mb-lg-14 text-center">
          <p className="en-font fw-bold ls-1 text-primary-600 fs-7 fs-lg-6 mb-3 mb-lg-6">
            What’s in the box
          </p>
          <div className="mb-6 mb-lg-9">
            <picture>
              <source
                media="(max-width: 992px)"
                srcSet="
              ./images/Theme_Detail/Feature/Title_section02_mobile.svg
            "
              />
              <img
                src="./images/Theme_Detail/Feature/Title_section02.svg"
                alt="精選甜點盒裡有甚麼"
              />
            </picture>
          </div>
          <p className="text-neutral-800">
            每盒精選甜點含 8-14 款話題甜點，精挑細選最新人氣與聯名熱品，甜點控嚐鮮首選！
          </p>
        </div>
        <div className="d-flex flex-lg-row flex-column gap-lg-8 gap-6">
          {/* features */}
          {featureCards.map((feature) => (
            <div key={feature.icon} className="detail-feature-card">
              <div className="detail-feature-card-content">
                <img src={`./images/Theme_Detail/Feature/${feature.icon}.svg`} alt={feature.alt} />
                <p className="text-primary-600 fw-bold fs-5">{feature.title}</p>
                <p className="text-neutral-800 fs-8">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhatInTheBox;
