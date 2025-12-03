import React from 'react';
import './AuthForm.css';

interface AuthFormProps {
  isRegister?: boolean;
  handleSubmit: (event: React.FormEvent) => void;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  name?: string;
  setName?: (name: string) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({
  isRegister,
  handleSubmit,
  email,
  setEmail,
  password,
  setPassword,
  name,
  setName,
}) => {
  return (
    <form onSubmit={handleSubmit} className="auth-form">
      {isRegister && setName && (
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
      )}
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
      <button type="submit" className="submit-button">
        {isRegister ? 'Sign Up' : 'Login'}
      </button>
    </form>
  );
};

export default AuthForm;
