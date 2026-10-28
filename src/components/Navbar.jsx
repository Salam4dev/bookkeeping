import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('bk_user') || 'null');

  const handleLogout = () => {
    localStorage.removeItem('bk_session');
    navigate('/login');
  };

  const getInitials = (email) => {
    if (!email) return '?';
    return email.charAt(0).toUpperCase();
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-inner">
          <Link to="/dashboard" className="navbar-brand">
            <div className="navbar-logo">💰</div>
            <span className="navbar-title">My Bookkeeping</span>
          </Link>

          <div className="navbar-actions">
            {user && (
              <>
                <div className="navbar-user">
                  <div className="user-avatar">{getInitials(user.email)}</div>
                  <span>{user.email}</span>
                </div>
                <button
                  id="logout-btn"
                  className="btn btn-danger btn-sm"
                  onClick={handleLogout}
                >
                  🚪 Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
