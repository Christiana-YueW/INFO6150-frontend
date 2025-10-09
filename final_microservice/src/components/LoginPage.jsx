import { useState } from 'react';
import '../styles/login.css';

function LoginPage({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setMessage('');

    // Validation
    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!isLogin && !name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      await onLogin(email, password, name, isLogin);
    } catch (error) {
      setErrors({ general: error.message || 'Authentication failed' });
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setMessage('');
  };

  const fillDemoCredentials = () => {
    setEmail('demo@example.com');
    setPassword('demo123');
    setMessage('Demo credentials filled. Click Login to continue.');
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>Find My Stuff</h1>
          <p className="tagline">Never lose track of your belongings again</p>
        </div>

        <div className="login-card">
          <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>

          {errors.general && (
            <div className="error-banner" role="alert">
              {errors.general}
            </div>
          )}

          {message && (
            <div className="info-banner" role="status">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {!isLogin && (
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? 'error-name' : undefined}
                  disabled={loading}
                />
                {errors.name && (
                  <div id="error-name" className="error" role="alert">
                    {errors.name}
                  </div>
                )}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'error-email' : undefined}
                disabled={loading}
              />
              {errors.email && (
                <div id="error-email" className="error" role="alert">
                  {errors.email}
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? 'error-password' : undefined}
                disabled={loading}
              />
              {errors.password && (
                <div id="error-password" className="error" role="alert">
                  {errors.password}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Please wait...' : isLogin ? 'Login' : 'Sign Up'}
            </button>
          </form>

          {isLogin && (
            <button
              type="button"
              className="btn-demo"
              onClick={fillDemoCredentials}
              disabled={loading}
            >
              🎯 Use Demo Account
            </button>
          )}

          <div className="login-footer">
            <p>
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <button
                type="button"
                className="link-button"
                onClick={toggleMode}
                disabled={loading}
              >
                {isLogin ? 'Sign Up' : 'Login'}
              </button>
            </p>
          </div>
        </div>

        <div className="login-features">
          <div className="feature">
            <span className="feature-icon">📸</span>
            <h3>Photo Tracking</h3>
            <p>Snap photos of your items</p>
          </div>
          <div className="feature">
            <span className="feature-icon">🔍</span>
            <h3>Smart Search</h3>
            <p>Find items instantly</p>
          </div>
          <div className="feature">
            <span className="feature-icon">🤖</span>
            <h3>AI Assistant</h3>
            <p>Ask in natural language</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

