import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';
import { API_BASE_URL } from '../utils/constants';
import { useAuth } from '../utils/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showError, setShowError] = useState<boolean>(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleCloseError = () => {
    setShowError(false);
    setErrorMessage(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Logging in with:', { email, password });
    setErrorMessage(null); // Clear previous error message
    setShowError(false); // Hide previous error box

    try {
      const response = await fetch(`${API_BASE_URL}/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Login successful:', data);
        login(data.token, data.userId);
        navigate('/tasks');
      } else {
        console.error('Login failed:', data);
        setErrorMessage(data.message || 'An unknown error occurred.');
        setShowError(true);
      }
    } catch (error: any) {
      console.error('Error during login:', error);
      setErrorMessage(error.message || 'Network error or server unreachable.');
      setShowError(true);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {showError && errorMessage && (
        <div className="error-box">
          <p>{errorMessage}</p>
          <button className="close-button" onClick={handleCloseError}>X</button>
        </div>
      )}
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="submit-button">Login</button>
      </form>
      <p>Don't have an account? <a href="/register">Sign Up</a></p>
    </div>
  );
};

export default Login;
