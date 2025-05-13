import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {  FaBookmark, FaShare,  FaEye, FaClock, FaUser } from 'react-icons/fa';
import OptimizedImage from './OptimizedImage';


import { Article } from '../types';

interface AnimatedNewsCardProps {
  article: Article;
  index?: number;
  variant?: 'default' | 'featured' | 'compact';
}

const AnimatedNewsCard: React.FC<AnimatedNewsCardProps> = ({ 
  article, 
  index = 0,
  variant = 'default' 
}) => {
  const { title, excerpt, imageUrl, date, category, slug, author, viewCount }: Article = article;
  
  // Usar um valor fixo para evitar erro de hidratação
  const defaultViews = 256;
  
  // Estado para armazenar a contagem de visualizações
  const [views, setViews] = useState(defaultViews);
  
  // Gerar contagem de visualizações aleatória apenas no cliente
  useEffect(() => {
    if (viewCount) {
      setViews(viewCount);
    } else {
      // Gerar número aleatório apenas no cliente
      setViews(Math.floor(Math.random() * 500) + 50);
    }
  }, [viewCount]);
  
  // Animações
  const cardVariants = {
    hidden: { 
      opacity: 0,
      y: 20,
    },
    visible: { 
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.5,
        delay: index * 0.1, // Efeito escalonado baseado no índice
      }
    },
    hover: {
      y: -8,
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
      transition: { duration: 0.3 }
    }
  };

  // Animação para o gradiente de fundo da imagem
  const gradientVariants = {
    rest: {
      opacity: 0.6,
      background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 60%)',
      transition: { duration: 0.3 }
    },
    hover: {
      opacity: 0.8,
      background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.2) 70%)',
      transition: { duration: 0.3 }
    }
  };

  // Animação para o título
  const titleVariants = {
    rest: { y: 0, transition: { duration: 0.3 } },
    hover: { y: -5, transition: { duration: 0.3 } }
  };

  // Animação para os botões
  const buttonVariants = {
    rest: { opacity: 0, y: 10, transition: { duration: 0.3 } },
    hover: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  // Renderizar card compacto
  if (variant === 'compact') {
    return (
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        className="bg-white dark:bg-dark-700 rounded-lg shadow-md overflow-hidden h-full"
      >
        <div className="flex h-full">
          <div className="relative w-1/3 min-w-[100px]">
            <OptimizedImage 
              src={imageUrl} 
              alt={title} 
              fill 
              category={category} 
              title={title} 
              className="object-cover" 
            />
          </div>
          <div className="p-4 w-2/3 flex flex-col justify-between">
            <div>
              <Link 
                href={`/categoria/${category.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-xs font-semibold text-primary-600 dark:text-primary-400 mb-1 inline-block"
              >
                {category}
              </Link>
              <h3 className="text-base font-semibold mb-1 line-clamp-2 text-gray-800 dark:text-white">
                <Link href={`/noticia/${slug}`}>
                  {title}
                </Link>
              </h3>
            </div>
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
              <FaClock className="mr-1" />
              <span>{date}</span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Renderizar card em destaque
  if (variant === 'featured') {
    return (
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        className="bg-white dark:bg-dark-700 rounded-xl shadow-lg overflow-hidden h-full"
      >
        <div className="relative h-72 w-full">
          <OptimizedImage 
            src={imageUrl} 
            alt={title} 
            fill 
            category={category} 
            title={title} 
            priority={true} 
          />
          <motion.div 
            className="absolute inset-0"
            variants={gradientVariants}
            initial="rest"
            whileHover="hover"
          />
          <div className="absolute top-4 left-4 z-10">
            <Link 
              href={`/categoria/${category.toLowerCase().replace(/\s+/g, '-')}`}
              className="bg-primary-600 text-white text-sm font-semibold px-3 py-1 rounded-md hover:bg-primary-700 transition-colors"
            >
              {category}
            </Link>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10">
            <motion.h2 
              className="text-2xl font-bold mb-2"
              variants={titleVariants}
            >
              <Link href={`/noticia/${slug}`}>
                {title}
              </Link>
            </motion.h2>
            <p className="text-white/80 mb-4 line-clamp-2">{excerpt}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <FaClock className="mr-1" />
                  <span>{date}</span>
                </div>
                {author && (
                  <div className="flex items-center">
                    <FaUser className="mr-1" />
                    <span>{author}</span>
                  </div>
                )}
              </div>
              <motion.div 
                className="flex space-x-2"
                variants={buttonVariants}
              >
                <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors">
                  <FaBookmark size={14} />
                </button>
                <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors">
                  <FaShare size={14} />
                </button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Renderizar card padrão
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className="bg-white dark:bg-dark-700 rounded-xl shadow-md overflow-hidden h-full"
    >
      <div className="relative h-48 w-full overflow-hidden">
        <OptimizedImage 
          src={imageUrl} 
          alt={title} 
          fill 
          category={category} 
          title={title} 
          className="h-full w-full object-cover" 
        />
        <motion.div 
          className="absolute inset-0"
          variants={gradientVariants}
          initial="rest"
          whileHover="hover"
        />
        <div className="absolute top-3 left-3 z-10">
          <Link 
            href={`/categoria/${category.toLowerCase().replace(/\s+/g, '-')}`}
            className="bg-primary-600 dark:bg-primary-500 text-white text-xs font-semibold px-2 py-1 rounded-md hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors"
          >
            {category}
          </Link>
        </div>
        <motion.div 
          className="absolute top-3 right-3 flex space-x-2 z-10"
          variants={buttonVariants}
          initial="rest"
          whileHover="hover"
        >
          <button 
            className="bg-white/20 backdrop-blur-sm p-2 rounded-full text-white hover:bg-white/30 transition-colors"
            aria-label="Salvar artigo"
          >
            <FaBookmark size={14} />
          </button>
        </motion.div>
      </div>
      <div className="p-5">
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-3 space-x-4">
          <div className="flex items-center">
            <FaClock className="mr-1" />
            <span>{date}</span>
          </div>
          {author && (
            <div className="flex items-center">
              <FaUser className="mr-1" />
              <span>{author}</span>
            </div>
          )}
          <div className="flex items-center">
            <FaEye className="mr-1" />
            <span>{views}</span>
          </div>
        </div>
        <motion.h3 
          className="text-xl font-semibold mb-2 line-clamp-2 text-gray-800 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors"
          variants={titleVariants}
          initial="rest"
          whileHover="hover"
        >
          <Link href={`/noticia/${slug}`}>
            {title}
          </Link>
        </motion.h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">{excerpt}</p>
        <Link 
          href={`/noticia/${slug}`} 
          className="inline-flex items-center text-primary-600 dark:text-primary-400 font-medium hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
        >
          Ler mais
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </Link>
      </div>
    </motion.div>
  );
};

export default AnimatedNewsCard;
