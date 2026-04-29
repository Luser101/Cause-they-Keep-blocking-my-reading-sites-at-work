import React from 'react';
import { FiAlertCircle, FiX } from 'react-icons/fi';
import '../styles/Toast.css';

const Toast = ({ message, type = 'info', onClose, duration = 5000 }) => {
  React.useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className={`toast toast-${type}`}>
      <FiAlertCircle className="toast-icon" />
      <span>{message}</span>
      <button onClick={onClose} className="toast-close">
        <FiX />
      </button>
    </div>
  );
};

export default Toast;
