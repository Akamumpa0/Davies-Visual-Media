import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateEmail(email) || password.length < 6) {
      setError('Please enter a valid email and password (min 6 characters).');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('daviesUser', JSON.stringify(data.user));
        localStorage.setItem('daviesToken', data.token);
        if (data.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/customer');
        }
      } else {
        setError(data.error || 'Invalid credentials.');
      }
    } catch (err) {
      setError('Cannot connect to server. Ensure the backend is running.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <header className="header">
        <div className="container nav-container">
          <Link to="/" className="logo-wrapper">
            <img src="/images/logo.png" alt="Davies Visual Media Logo" className="nav-logo" style={{ maxHeight: '45px' }} />
            <span className="logo-text">Davies Visual Media</span>
          </Link>
        </div>
      </header>

      <div className="auth-container">
        <div className="auth-box">
          <h2>Welcome Back</h2>
          <p>Log in to access your Davies Visual Media dashboard.</p>
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="loginEmail">Email Address</label>
              <input 
                type="email" 
                id="loginEmail" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="loginPassword">Password</label>
              <input 
                type="password" 
                id="loginPassword" 
                required 
                minLength="6"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <div className="validation-msg error" style={{ marginBottom: '15px', textAlign: 'center' }}>{error}</div>}
            <button type="submit" className="btn-primary auth-btn" disabled={loading}>
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>
          <div className="auth-link">
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
