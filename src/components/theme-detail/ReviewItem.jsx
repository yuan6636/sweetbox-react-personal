import { useEffect, useState, useRef } from 'react';
import { Icon } from '@iconify/react';

function ReviewItem({ review, renderStars }) {
  // 是否要按讚的狀態
  const [isLiked, setIsLiked] = useState(false);
  // 評論按讚數
  const [likeCounts, setLikeCounts] = useState(review.initialLikeCount);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const reviewRef = useRef(null);

  useEffect(() => {
    const el = reviewRef.current;
    if (el) {
      // 評論內容超過 5 行，isOverflowing 為 true，表示需要截斷內容
      setIsOverflowing(el.scrollHeight > el.clientHeight);
    }
  }, []);

  const handleLikes = () => {
    const nextIsLiked = !isLiked;
    setIsLiked(nextIsLiked);
    setLikeCounts((prev) => {
      return nextIsLiked ? prev + 1 : Math.max(prev - 1, 0);
    });
  };

  // 切換展開/收合評論內容
  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  // 展示評論圖片
  const renderImage = () => {
    const displayImages = review.images.slice(0, 5);
    const remainingCount = review.images.length - displayImages.length;

    return displayImages.map((imgUrl, index) => {
      const isLast = index === displayImages.length - 1;

      // 若為第五張圖片，且還有剩餘圖片，顯示遮罩和剩餘數量
      if (isLast && remainingCount > 0) {
        return (
          <div key={index} className="position-relative d-inline-block rounded-5">
            <img src={imgUrl} className="img-fluid rounded-5 w-100 h-100" alt="甜點方案評論圖片" />

            {/* 半透明黑色遮罩 + 文字置中 */}
            <div
              className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center rounded-5"
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            >
              <span className="text-neutral-100 fw-bold fs-6 noto_sans">+{remainingCount}</span>
            </div>
          </div>
        );
      }

      return (
        <img
          key={index}
          className="rounded-5"
          src={imgUrl}
          alt="甜點方案評論圖片"
          width="100"
          height="100"
        />
      );
    });
  };

  return (
    <div className="d-flex flex-lg-row flex-column px-lg-0 px-3">
      {/* 評論者 */}
      <div
        className="ms-lg-5 ms-0 d-flex align-items-start py-3 me-6"
        style={{ minWidth: '200px' }}
      >
        <div className="me-lg-4 me-3" style={{ width: '48px', height: '48px' }}>
          <img
            className="rounded-pill"
            src={review.avatar}
            alt={`${review.name} 的頭像`}
            width="48"
            height="48"
          />
        </div>
        <div className="d-flex flex-column">
          <div className="d-flex flex-wrap flex-lg-column align-items-lg-start align-items-center mb-2 mb-lg-0">
            <p className="mb-lg-1 mb-0 me-2">{review.name}</p>
            <div className="d-flex align-items-center">
              <Icon
                icon="icon-park-outline:check-one"
                width="14"
                height="14"
                className="text-semantic-verified me-1"
              />
              <p className="text-neutral-700 fs-9">已驗證買家</p>
            </div>
          </div>
          {/* 評論星星與日期 - mobile */}
          <div className="d-lg-none d-flex flex-wrap gap-2 align-items-center">
            <div className="d-flex align-items-center gap-1">{renderStars(review.rating, 16)}</div>
            <div className="d-flex align-items-center">
              <p className="fs-8 noto_sans text-neutral-700">{review.date}</p>
            </div>
          </div>
        </div>
      </div>
      {/* 評論內容 */}
      <div className="py-3 me-lg-6 me-0" style={{ maxWidth: '808px' }}>
        {/* 星星與日期 */}
        <div className="d-lg-flex d-none align-items-center mb-4">
          <div className="me-4">{renderStars(review.rating, 24)}</div>
          <p className="fs-8 noto_sans text-neutral-600">{review.date}</p>
        </div>
        {/* 購買的產品 */}
        <div className="py-1 px-3 bg-neutral-250 rounded-pill mb-5">
          <p className="fs-8 text-neutral-700">購買產品：{review.products}</p>
        </div>
        <div className="mb-lg-4 mb-6">
          <p className="fw-bold ls-1 mb-2 lh-sm">{review.title}</p>
          <p ref={reviewRef} className={`text-prewrap ${isExpanded ? '' : 'text-truncate-box'}`}>
            {review.body}
          </p>
          {isOverflowing && (
            <div className="d-flex justify-content-end mb-lg-4">
              <button
                type="button"
                className="btn-icon-tailing d-flex align-items-center"
                onClick={toggleExpand}
              >
                {isExpanded ? '收起內容' : '查看全文'}
                <Icon
                  className={`arrow-down-icon ${isExpanded ? 'rotate' : ''}`}
                  icon="iconamoon:arrow-down-2-bold"
                  width="20"
                  height="20"
                />
              </button>
            </div>
          )}
        </div>
        {/* 評論圖片 */}
        {review.images?.length > 0 && (
          <div className="d-flex align-items-center gap-2 flex-wrap">{renderImage()}</div>
        )}
      </div>
      {/* 按讚數 */}
      <div className="align-self-lg-start align-self-end flex-grow-1" style={{ width: '200px' }}>
        <div
          className="d-flex justify-content-end align-items-center p-3 me-lg-5 me-0 vote-box"
          onClick={handleLikes}
        >
          <Icon
            className="icon-swap me-1"
            icon={isLiked ? 'mdi:thumbs-up' : 'mdi:thumbs-up-outline'}
            width="20"
            height="20"
          ></Icon>
          <p className="fs-8 text-nowrap noto_sans">
            {likeCounts < 1 ? '此評論有幫助' : `${likeCounts} 人認為此評論有幫助`}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ReviewItem;
