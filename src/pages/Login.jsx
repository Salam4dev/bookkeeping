import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [globalError, setGlobalError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email) {
      errs.email = 'Email is required';
    } else if (!emailRegex.test(form.email)) {
      errs.email = 'Please enter a valid email address';
    }
    if (!form.password) {
      errs.password = 'Password is required';
    } else if (form.password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }
    return errs;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
    setGlobalError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem('bk_users') || '[]');
      const user = users.find(
        (u) => u.email === form.email && u.password === form.password
      );

      if (!user) {
        setGlobalError('Invalid email or password. Please try again.');
        setLoading(false);
        return;
      }

      localStorage.setItem('bk_session', JSON.stringify({ email: user.email }));
      localStorage.setItem('bk_user', JSON.stringify({ email: user.email }));
      navigate('/dashboard');
    }, 400);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">💰</div>
          <h1>Welcome back</h1>
          <p>Sign in to your My Bookkeeping account</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit} id="login-form">
          {globalError && (
            <div className="alert alert-error" role="alert">
              ⚠️ {globalError}
            </div>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="login-email">Email Address</label>
            <input
              id="login-email"
              name="email"
              type="text"
              className={`form-input ${errors.email ? 'error' : ''}`}
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
            />
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="login-password">Password</label>
            <div className="input-wrapper">
              <input
                id="login-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                className={`form-input ${errors.password ? 'error' : ''}`}
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
              />
              <button
                type="button"
                id="login-toggle-password"
                className="toggle-password-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {errors.password && <span className="form-error">{errors.password}</span>}
          </div>

          <button
            id="login-submit-btn"
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={loading}
          >
            {loading ? '⏳ Signing in...' : '🔐 Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          Don&apos;t have an account?{' '}
          <Link to="/signup">Create one for free</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
