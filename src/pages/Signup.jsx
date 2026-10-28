import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [globalError, setGlobalError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
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

    if (!form.confirmPassword) {
      errs.confirmPassword = 'Please confirm your password';
    } else if (form.password !== form.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }

    return errs;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
    setGlobalError('');
    setSuccessMsg('');
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
      const exists = users.find((u) => u.email === form.email);

      if (exists) {
        setGlobalError('An account with this email already exists.');
        setLoading(false);
        return;
      }

      const newUser = { email: form.email, password: form.password };
      users.push(newUser);
      localStorage.setItem('bk_users', JSON.stringify(users));

      // Auto-login after signup
      localStorage.setItem('bk_session', JSON.stringify({ email: newUser.email }));
      localStorage.setItem('bk_user', JSON.stringify({ email: newUser.email }));

      setSuccessMsg('Account created! Redirecting...');
      setTimeout(() => navigate('/dashboard'), 800);
    }, 400);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">🚀</div>
          <h1>Create Account</h1>
          <p>Start managing your finances today</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit} id="signup-form">
          {globalError && (
            <div className="alert alert-error" role="alert">
              ⚠️ {globalError}
            </div>
          )}
          {successMsg && (
            <div className="alert alert-success" role="status">
              ✅ {successMsg}
            </div>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="signup-email">Email Address</label>
            <input
              id="signup-email"
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
            <label className="form-label" htmlFor="signup-password">Password</label>
            <div className="input-wrapper">
              <input
                id="signup-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                className={`form-input ${errors.password ? 'error' : ''}`}
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
              />
              <button
                type="button"
                id="signup-toggle-password"
                className="toggle-password-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {errors.password && <span className="form-error">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="signup-confirm-password">Confirm Password</label>
            <div className="input-wrapper">
              <input
                id="signup-confirm-password"
                name="confirmPassword"
                type={showConfirm ? 'text' : 'password'}
                className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                placeholder="Repeat your password"
                value={form.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
              />
              <button
                type="button"
                id="signup-toggle-confirm"
                className="toggle-password-btn"
                onClick={() => setShowConfirm(!showConfirm)}
                aria-label={showConfirm ? 'Hide password' : 'Show password'}
              >
                {showConfirm ? '🙈' : '👁️'}
              </button>
            </div>
            {errors.confirmPassword && (
              <span className="form-error">{errors.confirmPassword}</span>
            )}
          </div>

          <button
            id="signup-submit-btn"
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={loading}
          >
            {loading ? '⏳ Creating account...' : '✨ Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account?{' '}
          <Link to="/login">Sign in here</Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;
