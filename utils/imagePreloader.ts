/**
 * Sistema de pré-carregamento de imagens para melhorar a experiência do usuário
 * 
 * Este módulo implementa funções para pré-carregar imagens críticas antes que
 * elas sejam necessárias, melhorando a experiência do usuário ao navegar pelo site.
 */

import { preloadImages } from './imageCache';

// Lista de imagens críticas que devem ser pré-carregadas
const criticalImages = [
  // Imagens de categorias populares
  'https://images.unsplash.com/photo-1581088247940-c0e306a0bde9',
  'https://images.unsplash.com/photo-1526666923127-b2970f64b422',
  'https://images.unsplash.com/photo-1504805572947-34fad45aed93',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
  
  // Logos e ícones do site
  '/logo.png',
  '/favicon.ico'
];

/**
 * Pré-carrega imagens críticas quando o site é carregado
 */
export const preloadCriticalImages = (): void => {
  if (typeof window === 'undefined') return;
  
  // Usar o sistema de cache para pré-carregar as imagens
  preloadImages(criticalImages);
};

/**
 * Pré-carrega imagens para uma categoria específica
 */
export const preloadCategoryImages = (category: string): void => {
  if (typeof window === 'undefined') return;
  
  // Mapear categorias para URLs de imagens relacionadas
  const categoryImages: Record<string, string[]> = {
    'tecnologia': [
      'https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b',
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085'
    ],
    'esportes': [
      'https://images.unsplash.com/photo-1461896836934-ffe607ba8211',
      'https://images.unsplash.com/photo-1579952363873-27f3bade9f55'
    ],
    'politica': [
      'https://images.unsplash.com/photo-1541872703-74c5e44368f9',
      'https://images.unsplash.com/photo-1569225034143-e19e9c4c3943'
    ],
    'saude': [
      'https://images.unsplash.com/photo-1505751172876-fa1923c5c528',
      'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7'
    ]
  };
  
  // Obter imagens para a categoria especificada
  const images = categoryImages[category.toLowerCase()] || [];
  
  // Pré-carregar as imagens
  if (images.length > 0) {
    preloadImages(images);
  }
};

/**
 * Pré-carrega imagens para um artigo específico e artigos relacionados
 */
export const preloadArticleImages = (_articleId: number, _relatedArticleIds: number[]): void => {
  // Implementação futura para pré-carregar imagens de artigos específicos
  // baseado em IDs de artigos
};

const imagePreloader = {
  preloadCriticalImages,
  preloadCategoryImages,
  preloadArticleImages
};

export default imagePreloader;
