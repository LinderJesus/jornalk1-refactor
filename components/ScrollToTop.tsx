import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowUp } from 'react-icons/fa';

interface ScrollToTopProps {
  showAfter?: number; // Altura em pixels após a qual o botão será exibido
  position?: 'right' | 'left';
  offset?: number; // Distância da borda em pixels
}

/**
 * Componente de botão "Voltar ao topo" com animação suave
 * Melhora a experiência de navegação em páginas longas
 */
const ScrollToTop: React.FC<ScrollToTopProps> = ({
  showAfter = 300,
  position = 'right',
  offset = 20
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  // Detectar quando o usuário rolou além da altura especificada
  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > showAfter);
    };

    // Verificar posição inicial
    handleScroll();

    // Adicionar event listener para scroll
    window.addEventListener('scroll', handleScroll);

    // Limpar event listener
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [showAfter]);

  // Função para rolar suavemente para o topo
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Posicionamento do botão
  const positionStyle = position === 'right'
    ? { right: `${offset}px` }
    : { left: `${offset}px` };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          className="fixed bottom-6 p-3 rounded-full bg-primary-600 text-white shadow-lg hover:bg-primary-700 transition-colors z-50 flex items-center"
          style={{ ...positionStyle }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          aria-label="Voltar ao topo"
        >
          <FaArrowUp className="text-white" />
          
          <AnimatePresence>
            {isHovering && (
              <motion.span
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 'auto', opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="ml-2 overflow-hidden whitespace-nowrap"
              >
                Voltar ao topo
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTop;
