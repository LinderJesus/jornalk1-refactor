import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import SurfPlaceholder from './SurfPlaceholder';
import { isImageCached, cacheImage } from '../utils/imageCache';
import useNetworkStatus from '../hooks/useNetworkStatus';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  category?: string;
  title?: string;
  onClick?: () => void;
  onLoad?: () => void;
  onError?: () => void;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  fill = false,
  className = '',
  priority = false,
  objectFit = 'cover',
  category,
  title,
  onClick,
  onLoad,
  onError
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const { isSlow } = useNetworkStatus(); // isOnline não é usado

  // Verificar se a URL é válida
  const isValidUrl = useMemo(() => {
    if (!src) return false;
    
    // Se for uma URL relativa (começando com /), considerar válida
    if (src.startsWith('/')) return true;
    
    try {
      new URL(src);
      return true;
    } catch {
      return false;
    }
  }, [src]);

  // Gerar um placeholder blur data URL com as cores do tema de surf
  const blurDataURL = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9Imc0IiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBzdG9wLWNvbG9yPSIjMGM0YTZlIiBvZmZzZXQ9IjAlIi8+PHN0b3Agc3RvcC1jb2xvcj0iIzAzNjlhMSIgb2Zmc2V0PSIxMDAlIi8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3QgZmlsbD0idXJsKCNnNCkiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiLz48L3N2Zz4=';
  
  // Otimizar a URL da imagem com base no tipo de conexão
  const optimizedSrc = useMemo(() => {
    if (!isValidUrl) return src;
    
    // Se for uma URL relativa, usar diretamente
    if (src.startsWith('/')) return src;
    
    // Se for uma URL do Unsplash, podemos otimizar ainda mais
    if (src.includes('unsplash.com')) {
      // Para conexões lentas, usar uma imagem de menor qualidade
      if (isSlow) {
        return src.includes('?') 
          ? `${src}&q=60&w=${width || 800}&auto=format&fit=crop`
          : `${src}?q=60&w=${width || 800}&auto=format&fit=crop`;
      }
      return src.includes('?') 
        ? `${src}&q=80&auto=format`
        : `${src}?q=80&auto=format`;
    }
    return src;
  }, [src, isValidUrl, isSlow, width]);

  // Verificar se a imagem já está em cache
  useEffect(() => {
    if (isValidUrl && isImageCached(optimizedSrc)) {
      setIsLoading(false);
    }
  }, [optimizedSrc, isValidUrl]);

  // Manipuladores de eventos
  const handleLoad = () => {
    setIsLoading(false);
    if (onLoad) onLoad();
    
    // Armazenar a imagem em cache se for uma URL válida
    if (isValidUrl && typeof window !== 'undefined') {
      cacheImage(optimizedSrc);
    }
  };
  
  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    if (onError) onError();
    
    // Registrar erro no console para depuração
    console.warn(`Erro ao carregar imagem: ${src}`);
  };

  // Renderizar um placeholder se a URL não for válida, se ocorrer um erro,
  // ou se estiver usando uma das imagens conhecidas com problemas
  const isKnownBrokenImage = src.startsWith('/') && (
    src.includes('news-1.jpg') || 
    src.includes('news-2.jpg') || 
    src.includes('news-3.jpg') || 
    src.includes('news-4.jpg') || 
    src.includes('news-5.jpg') || 
    src.includes('news-6.jpg') || 
    src.includes('featured-news.jpg') || 
    src.includes('logo.png') || 
    src.includes('favicon.ico') ||
    src.includes('og-image.jpg')
  );
  
  /**
   * Substitui imagens corrompidas por SVGs correspondentes
   * Esta função mapeia arquivos JPG conhecidos como corrompidos para
   * seus equivalentes SVG que criamos como placeholders temáticos
   */
  const getSvgReplacementForBrokenImage = () => {
    // Mapeamento de imagens JPG para placeholders SVG equivalentes
    if (src.includes('news-1.jpg')) return '/images/news-1.svg';
    if (src.includes('news-2.jpg')) return '/images/news-2.svg';
    if (src.includes('news-3.jpg')) return '/images/news-3.svg';
    if (src.includes('news-4.jpg')) return '/images/news-4.svg';
    if (src.includes('news-5.jpg')) return '/images/news-5.svg';
    if (src.includes('news-6.jpg')) return '/images/news-6.svg';
    if (src.includes('featured-news.jpg')) return '/images/featured-news.svg';
    if (src.includes('og-image.jpg')) return '/images/surf-placeholder.svg';
    if (src.includes('logo.png')) return '/images/surf-placeholder.svg';
    
    // Se não encontrar um mapeamento específico, usa o placeholder padrão
    return '/images/surf-placeholder.svg';
  };
  
  if (!isValidUrl || hasError) {
    // Usar o SurfPlaceholder temático para imagens relacionadas ao site de surf
    return <SurfPlaceholder 
      width={typeof width === 'number' ? width : undefined}
      height={typeof height === 'number' ? height : undefined}
      category={category || ''}
      title={title || alt || 'Imagem temporariamente indisponível'}
    />;
  } else if (isKnownBrokenImage) {
    // Usar os SVGs correspondentes para imagens conhecidas com problemas
    const svgSrc = getSvgReplacementForBrokenImage();
    return (
      <div 
        style={{
          width: typeof width === 'number' ? width : '100%',
          height: typeof height === 'number' ? height : '100%',
          position: 'relative',
          overflow: 'hidden',
        }}
        className="rounded-lg shadow-surf glass"
      >
        <Image 
          src={svgSrc}
          alt={alt || title || 'Imagem relacionada ao surf'}
          fill={true}
          className={`object-${objectFit} transition-transform duration-300 hover:scale-105 hover-float`}
          sizes={fill ? '100vw' : '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
          priority={priority}
          quality={80}
        />
      </div>
    );
  }

  // Estilo para o contêiner da imagem
  const containerStyle: React.CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    width: fill ? '100%' : width ? `${width}px` : '100%',
    height: fill ? '100%' : height ? `${height}px` : 'auto',
  };

  // Classes para o efeito de carregamento
  const loadingClass = isLoading ? 'opacity-0' : 'opacity-100';
  const transitionClass = 'transition-opacity duration-300';

  return (
    <div 
      style={containerStyle} 
      className={`${className}`} 
      onClick={onClick}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {isLoading && (
        <div className="absolute inset-0 bg-ocean-light/30 dark:bg-ocean-deep/50 animate-pulse rounded-lg glass" />
      )}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 0.3 }}
        className="w-full h-full"
      >
        <Image
          src={optimizedSrc}
          alt={alt}
          width={!fill ? (width || 500) : undefined}
          height={!fill ? (height || 300) : undefined}
          fill={fill}
          className={`${loadingClass} ${transitionClass} ${objectFit ? `object-${objectFit}` : ''}`}
          onLoad={handleLoad}
          onError={handleError}
          loading={priority ? 'eager' : 'lazy'}
          placeholder="blur"
          blurDataURL={blurDataURL}
          priority={priority}
          sizes={fill ? '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw' : undefined}
          style={{ objectFit }}
          unoptimized={isSlow} // Desativar otimização automática do Next.js para conexões lentas
        />
      </motion.div>
    </div>
  );
};

export default OptimizedImage;
