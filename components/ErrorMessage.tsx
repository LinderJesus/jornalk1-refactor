import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';

interface ErrorMessageProps {
  message: string;
  variant?: 'default' | 'alert' | 'toast';
  onRetry?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  message, 
  variant = 'default',
  onRetry
}) => {
  // Variantes de estilo
  const variantStyles = {
    default: 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800/50',
    alert: 'bg-red-600 text-white border border-red-700',
    toast: 'bg-white text-red-700 border border-red-100 shadow-lg dark:bg-gray-800 dark:text-red-300 dark:border-gray-700'
  };
  
  const containerClass = `rounded-lg p-4 ${variantStyles[variant]} flex items-start space-x-3`;
  
  return (
    <div className={containerClass} role="alert">
      <div className="flex-shrink-0 pt-0.5">
        <FaExclamationTriangle className={variant === 'alert' ? 'text-white' : 'text-red-500'} />
      </div>
      
      <div className="flex-1">
        <p className="text-sm font-medium">{message}</p>
        
        {onRetry && (
          <button 
            onClick={onRetry}
            className={`mt-2 px-3 py-1 text-xs font-medium rounded-md ${
              variant === 'alert' 
                ? 'bg-white text-red-700 hover:bg-red-50' 
                : 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/50 dark:text-red-300 dark:hover:bg-red-900'
            }`}
          >
            Tentar novamente
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;
