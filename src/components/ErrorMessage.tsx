import React from 'react';
import './ErrorMessage.css'; // You might want to create a CSS file for this component

interface ErrorMessageProps {
  message: string | null;
  onClose: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onClose }) => {
  if (!message) {
    return null;
  }

  return (
    <div className="error-box">
      <p>{message}</p>
      <button className="close-button" onClick={onClose}>X</button>
    </div>
  );
};

export default ErrorMessage;
