import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error on input change
  };

  const validateForm = () => {
    const { email, password, name } = formData;

    if (!email || !password) {
      setError('Email and password are required');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Invalid email format');
      return false;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }

    if (!isLogin && (!name || name.trim().length < 2)) {
      setError('Name must be at least 2 characters');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const response = isLogin
        ? await authAPI.login(formData.email, formData.password)
        : await authAPI.register(formData.name, formData.email, formData.password);

      // Save auth data
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      navigate('/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.message ||
        'An error occurred. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>
        {isLogin ? 'Login to Dashboard' : 'Create Account'}
      </h2>

      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required={!isLogin}
              disabled={loading}
            />
          </div>
        )}

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            disabled={loading}
            minLength={6}
          />
        </div>

        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Loading...' : isLogin ? 'Login' : 'Register'}
        </button>
      </form>

      <button
        className="btn btn-secondary"
        style={{ marginTop: '1rem' }}
        onClick={() => setIsLogin(!isLogin)}
        disabled={loading}
      >
        {isLogin ? 'Need an account? Register' : 'Have an account? Login'}
      </button>
    </div>
  );
};

export default Login;

