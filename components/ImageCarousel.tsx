import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import OptimizedImage from './OptimizedImage';

interface CarouselItem {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  category: string;
}

interface ImageCarouselProps {
  items: CarouselItem[];
  autoplaySpeed?: number;
  showControls?: boolean;
  showIndicators?: boolean;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({
  items,
  autoplaySpeed = 5000,
  showControls = true,
  showIndicators = true,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const [direction, setDirection] = useState(0); // -1 para esquerda, 1 para direita, 0 para inicial

  // Configurar autoplay
  useEffect(() => {
    if (!isAutoplay) return;
    
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
    }, autoplaySpeed);
    
    return () => clearInterval(interval);
  }, [isAutoplay, items.length, autoplaySpeed]);

  // Pausar autoplay quando o mouse estiver sobre o carrossel
  const handleMouseEnter = () => setIsAutoplay(false);
  const handleMouseLeave = () => setIsAutoplay(true);

  // Navegar para o slide anterior
  const goToPrevious = () => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + items.length) % items.length);
  };

  // Navegar para o próximo slide
  const goToNext = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
  };

  // Navegar para um slide específico
  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  // Variantes de animação
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? '-100%' : '100%',
      opacity: 0,
    }),
  };

  // Item atual
  const currentItem = items[currentIndex];

  return (
    <div 
      className="relative w-full h-[400px] md:h-[500px] overflow-hidden rounded-xl shadow-xl"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Carrossel de imagens */}
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          <div className="relative w-full h-full">
            <OptimizedImage 
              src={currentItem.imageUrl} 
              alt={currentItem.title} 
              fill 
              category={currentItem.category} 
              title={currentItem.title} 
              priority={true} 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
              <h2 className="text-2xl md:text-3xl font-bold mb-2 line-clamp-2">{currentItem.title}</h2>
              <p className="text-white/80 mb-4 line-clamp-2 md:line-clamp-3">{currentItem.description}</p>
              <Link href={currentItem.link}>
                <motion.span 
                  className="inline-block px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-md transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Ler mais
                </motion.span>
              </Link>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Controles de navegação */}
      {showControls && (
        <>
          <motion.button
            className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full backdrop-blur-sm transition-colors z-10"
            onClick={goToPrevious}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Slide anterior"
          >
            <FaChevronLeft />
          </motion.button>
          <motion.button
            className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full backdrop-blur-sm transition-colors z-10"
            onClick={goToNext}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Próximo slide"
          >
            <FaChevronRight />
          </motion.button>
        </>
      )}

      {/* Indicadores */}
      {showIndicators && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-10">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-white scale-110' 
                  : 'bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`Ir para slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageCarousel;
