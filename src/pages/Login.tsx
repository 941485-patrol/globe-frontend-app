import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';
import '../components/AuthForm.css';
import { API_BASE_URL } from '../utils/constants';
import { useAuth } from '../utils/AuthContext';
import ErrorMessage from '../components/ErrorMessage'; // Import the new component
import AuthForm from '../components/AuthForm';

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleCloseError = () => {
    setErrorMessage(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage(null); // Clear previous error message

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
        login(data.token, data.userId, data.userName);
        navigate('/tasks');
      } else {
        console.error('Login failed:', data);
        setErrorMessage(data.message || 'An unknown error occurred.');
      }
    } catch (error: any) {
      console.error('Error during login:', error);
      setErrorMessage(error.message || 'Network error or server unreachable.');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <ErrorMessage message={errorMessage} onClose={handleCloseError} />
      <AuthForm
        handleSubmit={handleSubmit}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
      />
      <p>Don't have an account? <a href="/register">Sign Up</a></p>
    </div>
  );
};

export default Login;
