// 外部工具
import { useState, Fragment, useEffect, useMemo, useRef } from 'react';
import { Icon } from '@iconify/react';

// 內部元件
import Pagination from '../../components/common/Pagination';
import Dropdown from '../../components/common/Dropdown';
import ReviewItem from '../../components/theme-detail/ReviewItem';
import Loading from '../../components/common/Loading';

// data
import { ratingDistribution, desktopSortOptions, mobileSortOptions } from '../../data/mockData';

// api
import api from '../../api';

function ThemeReviews() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortOption, setSortOption] = useState('desc');
  const [reviews, setReviews] = useState([]);
  const [themes, setThemes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const reviewSectionRef = useRef(null);

  const categoryOptions = useMemo(() => {
    const categories = themes.map((theme) => ({
      label: theme.title,
      value: theme.id,
    }));
    return [{ label: '全部主題', value: '' }, ...categories];
  }, [themes]);

  // 渲染評價星星
  const renderStars = (rating, size = 24) => {
    return Array.from({ length: 5 }, (_, index) => index + 1).map((number) => (
      <Icon
        key={number}
        icon={Math.round(rating) >= number ? 'mingcute:star-fill' : 'mingcute:star-line'}
        width={size}
        height={size}
        className="text-semantic-rating"
      />
    ));
  };

  const handleCategoryChange = (themeId) => {
    setSelectedCategory(themeId);
    setCurrentPage(1);
  };

  const handleSortChange = (option) => {
    setSortOption(option);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // 滾動到評論區上方
    reviewSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [themesRes, reviewsRes] = await Promise.all([
          api.get('/themes'),
          api.get('/reviews'),
        ]);
        setThemes(themesRes.data);
        setReviews(reviewsRes.data);
      } catch (error) {
        console.error('取得評論失敗', error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredAndSortedReviews = useMemo(() => {
    let result = reviews;

    // 篩選主題
    if (selectedCategory) {
      result = result.filter((review) => review.themeId === selectedCategory);
    }

    // 排序
    result = [...result].sort((a, b) =>
      sortOption === 'asc' ? a.rating - b.rating : b.rating - a.rating,
    );

    return result;
  }, [reviews, selectedCategory, sortOption]);

  const pagedReviews = useMemo(() => {
    const itemsPerPage = 5;
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedReviews.slice(start, start + itemsPerPage);
  }, [currentPage, filteredAndSortedReviews]);

  return (
    <section
      ref={reviewSectionRef}
      className="py-lg-11 py-17 bg-neutral-400 position-relative review-section"
    >
      <div className="container">
        {/* 標題 */}
        <div className="text-center mb-lg-14 mb-15">
          <p className="en-font text-primary-600 fs-7 fs-lg-6 ls-1 fw-bold mb-lg-6 mb-3">
            sweet words
          </p>
          <picture>
            <source
              media="(max-width: 992px)"
              srcSet="./images/theme-detail/title-review-mobile.svg"
            />
            <img src="./images/theme-detail/title-review-desktop.svg" alt="title-review-desktop" />
          </picture>
        </div>
        {/* 主題評分區 */}
        <div className="bg-neutral-250 p-6 py-lg-8 px-lg-16 d-flex justify-content-center flex-column flex-lg-row rounded-8 mb-lg-14 mb-15">
          {/* 評分區左側 */}
          <div className="rate-left p-0 py-lg-5 text-center mb-5 mb-lg-0">
            <div className="d-flex flex-row flex-lg-column align-items-center justify-content-start">
              <p className="noto_sans text-neutral-800 fs-lg-1 fs-4 fw-bold ls-1 lh-sm mb-lg-5 mb-0 me-3 me-lg-0">
                4.8
              </p>
              <div className="rate d-flex justify-content-center gap-1 mb-lg-3 mb-0 me-3 me-lg-0">
                {renderStars(4.8, 24)}
              </div>
              <p className="text-neutral-600 fs-lg-6 fs-9">5,937 則評價</p>
            </div>
          </div>
          {/* 分隔線 */}
          <div className="rating-divider d-lg-block d-none"></div>
          {/* 評分區右側 */}
          <div className="p-0 py-lg-5 px-lg-9 d-flex flex-column gap-3 flex-grow-1">
            {ratingDistribution.map((item) => (
              <div key={item.star} className="d-flex align-items-center gap-lg-6 gap-2">
                {/* 星星數 */}
                <div className="d-flex align-items-center gap-1">
                  <span className="text-neutral-800 fs-lg-6 fs-8 lh-sm ls-1 fw-bold noto_sans">
                    {item.star}
                  </span>
                  <Icon icon="mage:star-fill" className="text-semantic-rating star" />
                </div>
                {/* 進度條 */}
                <div className="progress flex-grow-1">
                  <div
                    className="progress-bar"
                    role="progressbar"
                    style={{ width: item.percent }}
                  ></div>
                </div>
                {/* 評論總數 */}
                <p className="text-neutral-600 fs-8 text-nowrap rating-counts">{`${item.count} 則 (${item.percent})`}</p>
              </div>
            ))}
          </div>
        </div>
        {isLoading ? (
          <Loading text="甜點主題評論載入中..." />
        ) : isError ? (
          <div className="d-flex justify-content-center align-items-center vh-100">
            <p className="text-center text-danger fs-6 fs-lg-5">
              甜點主題評論載入失敗，請稍後重新整理頁面
            </p>
          </div>
        ) : (
          <>
            {/* 評論類別與排序 - desktop */}
            <div className="d-none d-xl-flex justify-content-between align-items-center mb-17">
              <ul className="d-flex gap-2">
                {categoryOptions.map((category) => (
                  <li key={category.label}>
                    <button
                      type="button"
                      className={`btn btn-tag ${selectedCategory === category.value ? 'active' : ''}`}
                      onClick={() => {
                        handleCategoryChange(category.value);
                      }}
                    >
                      {category.label}
                    </button>
                  </li>
                ))}
              </ul>
              <ul className="d-flex align-items-center">
                {desktopSortOptions.map((option, index) => (
                  <Fragment key={option.value}>
                    {index !== 0 && <li className="sortOption-divider"></li>}
                    <li>
                      <button
                        type="button"
                        className={`btn-text ${sortOption === option.value ? 'active' : ''} p-3 fs-8`}
                        onClick={() => handleSortChange(option.value)}
                      >
                        {option.label} {option.direction}
                      </button>
                    </li>
                  </Fragment>
                ))}
              </ul>
            </div>
            {/* 評論類別與排序 - mobile */}
            <div className="d-flex d-xl-none justify-content-end gap-2 mb-6">
              <Dropdown
                options={categoryOptions}
                width="auto"
                value={selectedCategory}
                onChange={handleCategoryChange}
                buttonClass="text-neutral-800"
              />
              <Dropdown
                options={mobileSortOptions}
                value={sortOption}
                onChange={handleSortChange}
                buttonClass="text-neutral-800"
              />
            </div>
            {/* 評論區 */}
            <div className="d-flex flex-column mb-lg-17 mb-15 position-relative z-1">
              {pagedReviews.length > 0 ? (
                <>
                  <div className="d-flex flex-column mb-lg-17 mb-15 position-relative z-1">
                    {pagedReviews.map((review, index) => (
                      <Fragment key={review.id}>
                        <ReviewItem review={review} renderStars={renderStars} />
                        {index !== pagedReviews.length - 1 && (
                          <hr className="border-neutral-500 border-1 my-lg-4 my-3" />
                        )}
                      </Fragment>
                    ))}
                  </div>
                  {/* 分頁 */}
                  <div className="d-flex justify-content-center">
                    <Pagination
                      currentPage={currentPage}
                      totalItems={filteredAndSortedReviews.length} // 評論總數
                      itemsPerPage={5} // 每頁顯示幾筆
                      onChangePage={handlePageChange}
                    />
                  </div>
                </>
              ) : (
                <div className="d-flex justify-content-center align-items-center empty-review">
                  <p className="text-center h3">目前沒有符合條件的評論</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default ThemeReviews;
