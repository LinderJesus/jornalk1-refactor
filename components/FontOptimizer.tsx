import React, { useEffect } from 'react';
import Head from 'next/head';

interface FontOptimizerProps {
  fonts?: {
    family: string;
    weights?: number[];
    display?: 'auto' | 'block' | 'swap' | 'fallback' | 'optional';
    preload?: boolean;
  }[];
}

/**
 * Componente para otimização de carregamento de fontes
 * Melhora o desempenho do site otimizando o carregamento de fontes
 */
const FontOptimizer: React.FC<FontOptimizerProps> = ({
  fonts = [
    {
      family: 'Inter',
      weights: [300, 400, 500, 600, 700],
      display: 'swap',
      preload: true
    },
    {
      family: 'Montserrat',
      weights: [400, 500, 600, 700],
      display: 'swap',
      preload: false
    }
  ]
}) => {
  // Adicionar classe para evitar flash de texto não estilizado
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Adicionar classe para controlar a visibilidade do texto
      document.documentElement.classList.add('fonts-loading');
      
      // Verificar quando as fontes estão carregadas
      if ('fonts' in document) {
        document.fonts.ready.then(() => {
          // Remover a classe quando as fontes estiverem carregadas
          document.documentElement.classList.remove('fonts-loading');
          document.documentElement.classList.add('fonts-loaded');
        });
      } else {
        // Fallback para navegadores que não suportam a API de fontes
        setTimeout(() => {
          document.documentElement.classList.remove('fonts-loading');
          document.documentElement.classList.add('fonts-loaded');
        }, 2000);
      }
    }
  }, []);

  // Gerar URLs para pré-carregar fontes
  const preloadFontUrls = fonts
    .filter(font => font.preload)
    .flatMap(font => {
      const weights = font.weights || [400];
      return weights.map(weight => {
        const family = font.family.replace(/\s+/g, '+');
        return `https://fonts.googleapis.com/css2?family=${family}:wght@${weight}&display=${font.display || 'swap'}`;
      });
    });

  // Gerar URL para carregar todas as fontes
  const allFontsUrl = fonts.map(font => {
    const family = font.family.replace(/\s+/g, '+');
    const weights = font.weights?.join(';') || '400';
    return `family=${family}:wght@${weights}`;
  }).join('&');

  return (
    <Head>
      {/* Pré-carregar fontes críticas */}
      {preloadFontUrls.map((url, index) => (
        <link
          key={`preload-font-${index}`}
          rel="preload"
          href={url}
          as="style"
          crossOrigin="anonymous"
        />
      ))}
      
      {/* Carregar todas as fontes com display=swap para evitar FOIT */}
      <link
        rel="stylesheet"
        href={`https://fonts.googleapis.com/css2?${allFontsUrl}&display=swap`}
        crossOrigin="anonymous"
      />
      
      {/* Estilo para evitar flash de texto não estilizado */}
      <style>{`
        .fonts-loading {
          /* Evitar flash de texto não estilizado */
          visibility: visible;
        }
        
        /* Aplicar fontes quando estiverem carregadas */
        .fonts-loaded {
          visibility: visible;
        }
        
        /* Fontes de fallback otimizadas para métricas semelhantes */
        @font-face {
          font-family: 'Inter Fallback';
          size-adjust: 100%;
          ascent-override: 90%;
          src: local('Arial');
        }
        
        @font-face {
          font-family: 'Montserrat Fallback';
          size-adjust: 105%;
          ascent-override: 95%;
          src: local('Helvetica');
        }
      `}</style>
    </Head>
  );
};

export default FontOptimizer;
