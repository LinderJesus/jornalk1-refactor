import React, { ReactNode, useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView as useFramerInView } from 'framer-motion';

interface LazySectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  threshold?: number;
  animation?: 'fadeIn' | 'slideUp' | 'slideLeft' | 'slideRight' | 'scale' | 'none';
}

/**
 * Componente que carrega seu conteúdo apenas quando está visível na viewport
 * Melhora o desempenho inicial da página carregando conteúdo sob demanda
 */
const LazySection: React.FC<LazySectionProps> = ({
  children,
  className = '',
  delay = 0,
  threshold = 0.1,
  animation = 'fadeIn'
}) => {
  const ref = useRef(null);
  const inView = useFramerInView(ref, {
    once: true,
    amount: threshold
  });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (inView) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, delay);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [inView, delay]);

  // Definir as variantes de animação baseadas no tipo selecionado
  const getVariants = () => {
    switch (animation) {
      case 'fadeIn':
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { duration: 0.5 } }
        };
      case 'slideUp':
        return {
          hidden: { opacity: 0, y: 50 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
        };
      case 'slideLeft':
        return {
          hidden: { opacity: 0, x: 50 },
          visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
        };
      case 'slideRight':
        return {
          hidden: { opacity: 0, x: -50 },
          visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
        };
      case 'scale':
        return {
          hidden: { opacity: 0, scale: 0.8 },
          visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
        };
      case 'none':
      default:
        return {
          hidden: { opacity: 1 },
          visible: { opacity: 1 }
        };
    }
  };

  return (
    <div ref={ref} className={className}>
      {animation !== 'none' ? (
        <motion.div
          initial="hidden"
          animate={isVisible ? 'visible' : 'hidden'}
          variants={getVariants()}
        >
          {children}
        </motion.div>
      ) : (
        isVisible && children
      )}
    </div>
  );
};

export default LazySection;
