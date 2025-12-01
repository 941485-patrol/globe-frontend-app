import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './register.css';
import { API_BASE_URL } from '../utils/constants';

const Register: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showError, setShowError] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleCloseError = () => {
    setShowError(false);
    setErrorMessage(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Registering with:', { name, email, password });
    setErrorMessage(null); // Clear previous error message
    setShowError(false); // Hide previous error box
    
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Registration successful:', data);
        navigate('/login');
      } else {
        console.error('Registration failed:', data);
        setErrorMessage(data.message || 'An unknown error occurred.');
        setShowError(true);
      }
    } catch (error: any) {
      console.error('Error during registration:', error);
      setErrorMessage(error.message || 'Network error or server unreachable.');
      setShowError(true);
    }
  };

  return (
    <div className="register-container">
      <h2>Register / Sign Up</h2>
      {showError && errorMessage && (
        <div className="error-box">
          <p>{errorMessage}</p>
          <button className="close-button" onClick={handleCloseError}>X</button>
        </div>
      )}
      <form onSubmit={handleSubmit} className="register-form">
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
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
        <button type="submit" className="submit-button">Sign Up</button>
      </form>
      <p>Already have an account? <a href="/login">Login</a></p>
    </div>
  );
};

export default Register;
