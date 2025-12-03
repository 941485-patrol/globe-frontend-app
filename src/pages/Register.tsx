import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './register.css';
import '../components/AuthForm.css';
import { API_BASE_URL } from '../utils/constants';
import ErrorMessage from '../components/ErrorMessage'; // Import the new component
import AuthForm from '../components/AuthForm';

const Register: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | string[] | null>(
    null
  );
  const navigate = useNavigate();

  const handleCloseError = () => {
    setErrorMessage(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage(null); // Clear previous error message

    try {
      const response = await fetch(`${API_BASE_URL}/user/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate('/login');
      } else {
        console.error('Registration failed:', data);
        if (data.errors && Array.isArray(data.errors)) {
          const errorMessages = data.errors.map((err: any) => err.message);
          setErrorMessage(errorMessages);
        } else {
          setErrorMessage(data.message || 'An unknown error occurred.');
        }
      }
    } catch (error: any) {
      console.error('Error during registration:', error);
      setErrorMessage(error.message || 'Network error or server unreachable.');
    }
  };

  return (
    <div className="register-container">
      <h2>Register / Sign Up</h2>
      <ErrorMessage message={errorMessage} onClose={handleCloseError} />
      <AuthForm
        isRegister
        handleSubmit={handleSubmit}
        name={name}
        setName={setName}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
      />
      <p>Already have an account? <a href="/login">Login</a></p>
    </div>
  );
};

export default Register;
