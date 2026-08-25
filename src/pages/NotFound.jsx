import { NavLink } from 'react-router-dom';

function NotFound() {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100 text-center">
      <img className="notfound-img" src="./images/Not_Found_page/404.png" alt="404 找不到頁面" />
      <p className="fs-5 text-muted mt-0 mb-4">很抱歉，您造訪的頁面不存在</p>
      <NavLink to="/" className="btn-primary-icon">
        回首頁
      </NavLink>
    </div>
  );
}

export default NotFound;
