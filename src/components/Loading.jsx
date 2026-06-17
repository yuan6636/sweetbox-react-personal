function Loading({ text = '載入中...' }) {
  return (
    <div className="loading-box d-flex justify-content-center align-items-center gap-2 vh-100">
      <img
        className="loading-box-icon"
        src="./images/Home_Page/sweetBox_logo_3.svg"
        alt="一盒甜logo"
      />
      <p className="text-neutral-700 fs-6">{text}</p>
    </div>
  );
}

export default Loading;
