import { NavLink } from 'react-router-dom';

function NotFound() {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100 text-center">
      <h1 className="display-1 fw-bold text-primary">404</h1>
      <p className="fs-4 text-muted mb-4">頁面還未製作</p>
      <NavLink to="/" className="btn btn-primary btn-lg">
        回首頁
      </NavLink>
    </div>
  );
}

export default NotFound;
