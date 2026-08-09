import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (name.trim().length < 2 || !validateEmail(email) || password.length < 6) {
      setError('Please fix the errors above before submitting.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), password, role })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Account created successfully! Logging you in...');
        localStorage.setItem('daviesUser', JSON.stringify(data.user));
        localStorage.setItem('daviesToken', data.token);
        if (data.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/customer');
        }
      } else {
        setError(data.error || 'Signup failed. Please try again.');
      }
    } catch (err) {
      setError('Cannot connect to server. Ensure the backend is running.');
      console.error('Signup error:', err);
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
          <h2>Create Account</h2>
          <p>Join Davies Visual Media to manage your design projects.</p>
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="signupName">Full Name</label>
              <input 
                type="text" 
                id="signupName" 
                required 
                minLength="2"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="signupEmail">Email Address</label>
              <input 
                type="email" 
                id="signupEmail" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="signupPassword">Password</label>
              <input 
                type="password" 
                id="signupPassword" 
                required 
                minLength="6"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="signupRole">Account Type</label>
              <select id="signupRole" value={role} onChange={(e) => setRole(e.target.value)} required>
                <option value="customer">Customer / Client</option>
                <option value="admin">Admin / Staff</option>
              </select>
            </div>
            {error && <div className="validation-msg error" style={{ marginBottom: '15px', textAlign: 'center' }}>{error}</div>}
            <button type="submit" className="btn-primary auth-btn" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
          <div className="auth-link">
            Already have an account? <Link to="/login">Log In</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
