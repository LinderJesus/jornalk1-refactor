import React, { useState, useEffect } from 'react';
import { useNetworkStatus } from '../hooks';
import { motion } from 'framer-motion';

interface OptimizedBackgroundProps {
  src: string;
  fallbackSrc?: string;
  lowQualitySrc?: string;
  className?: string;
  children?: React.ReactNode;
  overlayColor?: string;
  overlayOpacity?: number;
  fixed?: boolean;
  lazyLoad?: boolean;
}

/**
 * Componente para otimização de imagens de fundo
 * Melhora o desempenho carregando imagens de fundo de forma otimizada
 */
const OptimizedBackground: React.FC<OptimizedBackgroundProps> = ({
  src,
  fallbackSrc,
  lowQualitySrc,
  className = '',
  children,
  overlayColor = 'rgba(0, 0, 0, 0.5)',
  overlayOpacity = 0.5,
  fixed = false,
  lazyLoad = true
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(!lazyLoad);
  const [currentSrc, setCurrentSrc] = useState<string>(lowQualitySrc || '');
  const { isSlow } = useNetworkStatus();
  
  // Função para carregar a imagem de forma otimizada
  useEffect(() => {
    // Se não for para carregar de forma lazy, carregar imediatamente
    if (!lazyLoad) {
      loadImage();
      return;
    }
    
    // Configurar o observador de interseção para carregar a imagem quando estiver visível
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, {
      rootMargin: '200px', // Carregar a imagem quando estiver a 200px de distância da viewport
      threshold: 0.01 // Carregar quando pelo menos 1% da imagem estiver visível
    });
    
    // Observar o elemento
    const element = document.getElementById(`optimized-bg-${src.replace(/[^a-zA-Z0-9]/g, '')}`);
    if (element) {
      observer.observe(element);
    }
    
    // Limpar o observador
    return () => {
      observer.disconnect();
    };
  }, [lazyLoad, src]);
  
  // Carregar a imagem quando estiver visível
  useEffect(() => {
    if (isVisible) {
      // Função para carregar a imagem definida dentro do useEffect
      // para resolver o problema de dependência do ESLint
      const loadImage = () => {
        // Se estiver em uma conexão lenta e houver uma versão de baixa qualidade, usar essa
        if (isSlow && lowQualitySrc) {
          setCurrentSrc(lowQualitySrc);
          setIsLoaded(true);
          return;
        }
        
        // Carregar a imagem principal
        const img = new Image();
        img.src = src;
        
        img.onload = () => {
          setCurrentSrc(src);
          setIsLoaded(true);
        };
        
        img.onerror = () => {
          // Se houver uma imagem de fallback, usar essa
          if (fallbackSrc) {
            setCurrentSrc(fallbackSrc);
          }
          setIsLoaded(true);
        };
      };
      
      // Executar a função de carregamento
      loadImage();
    }
  }, [isVisible, src, fallbackSrc, lowQualitySrc, isSlow]);
  
  // Estilo base para o contêiner
  const containerStyle: React.CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: fixed ? 'fixed' : 'scroll'
  };
  
  // Estilo para o overlay
  const overlayStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: overlayColor,
    opacity: overlayOpacity,
    zIndex: 1
  };
  
  // Estilo para o conteúdo
  const contentStyle: React.CSSProperties = {
    position: 'relative',
    zIndex: 2
  };
  
  // Estilo para a imagem de fundo
  const backgroundStyle: React.CSSProperties = {
    ...containerStyle,
    backgroundImage: currentSrc ? `url(${currentSrc})` : 'none'
  };
  
  return (
    <div
      id={`optimized-bg-${src.replace(/[^a-zA-Z0-9]/g, '')}`}
      className={`optimized-background ${className}`}
      style={backgroundStyle}
    >
      {/* Overlay para escurecer ou clarear a imagem */}
      <div style={overlayStyle} />
      
      {/* Animação de fade-in para o conteúdo */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        style={contentStyle}
      >
        {children}
      </motion.div>
      
      {/* Placeholder de carregamento */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 animate-pulse" />
      )}
    </div>
  );
};

export default OptimizedBackground;
