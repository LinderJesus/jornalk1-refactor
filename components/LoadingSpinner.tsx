import React from 'react';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium', 
  color = 'primary',
  fullScreen = false
}) => {
  // Definir tamanho com base na prop
  const sizeMap = {
    small: 'w-5 h-5',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  // Definir cor com base na prop
  const colorMap = {
    primary: 'border-primary-600',
    secondary: 'border-secondary-600',
    white: 'border-white',
    gray: 'border-gray-600'
  };

  // Variantes de animação
  const spinnerVariants = {
    animate: {
      rotate: 360,
      transition: {
        repeat: Infinity,
        duration: 1,
        ease: 'linear'
      }
    }
  };

  const spinnerClass = `${sizeMap[size]} border-4 border-t-transparent rounded-full ${
    typeof color === 'string' && color in colorMap 
      ? colorMap[color as keyof typeof colorMap] 
      : 'border-primary-600'
  }`;

  // Renderizar spinner em tela cheia ou normal
  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 dark:bg-dark-900/80 backdrop-blur-sm z-50">
        <motion.div
          className={spinnerClass}
          variants={spinnerVariants}
          animate="animate"
        />
      </div>
    );
  }

  return (
    <motion.div
      className={spinnerClass}
      variants={spinnerVariants}
      animate="animate"
    />
  );
};

export default LoadingSpinner;
