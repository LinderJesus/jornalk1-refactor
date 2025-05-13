import React from 'react';
import { motion } from 'framer-motion';

interface ImagePlaceholderProps {
  category?: string;
  width?: number;
  height?: number;
  className?: string;
  title?: string;
}

const ImagePlaceholder: React.FC<ImagePlaceholderProps> = ({
  category = 'Notícia',
  width = 800,
  height = 600,
  className = '',
  title
}) => {
  // Gerar uma cor baseada na categoria
  const getColorFromCategory = (cat: string) => {
    const categories: Record<string, string> = {
      'Política': '#3b82f6',
      'Economia': '#10b981',
      'Tecnologia': '#6366f1',
      'Esportes': '#ef4444',
      'Saúde': '#ec4899',
      'Cultura': '#f59e0b',
      'Educação': '#8b5cf6',
      'Meio Ambiente': '#84cc16',
      'Internacional': '#06b6d4',
      'Notícia': '#6b7280'
    };
    
    return categories[cat] || categories['Notícia'];
  };
  
  const bgColor = getColorFromCategory(category);
  const bgGradient = `linear-gradient(135deg, ${bgColor}, ${adjustColor(bgColor, -30)})`;
  
  // Função para ajustar a cor (escurecer ou clarear)
  function adjustColor(color: string, amount: number): string {
    // Converter hex para RGB
    let r = parseInt(color.substring(1, 3), 16);
    let g = parseInt(color.substring(3, 5), 16);
    let b = parseInt(color.substring(5, 7), 16);

    // Ajustar valores
    r = Math.max(0, Math.min(255, r + amount));
    g = Math.max(0, Math.min(255, g + amount));
    b = Math.max(0, Math.min(255, b + amount));

    // Converter de volta para hex
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }
  
  return (
    <motion.div 
      initial={{ opacity: 0.6 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`flex items-center justify-center ${className}`}
      style={{ 
        background: bgGradient,
        width: width || '100%',
        height: height || '100%',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Elementos decorativos */}
      <div 
        className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-20" 
        style={{ background: adjustColor(bgColor, 30), transform: 'translate(30%, -30%)' }}
      />
      <div 
        className="absolute bottom-0 left-0 w-40 h-40 rounded-full opacity-20" 
        style={{ background: adjustColor(bgColor, 20), transform: 'translate(-30%, 30%)' }}
      />
      
      <div className="text-white text-center p-4 relative z-10">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-12 w-12 mx-auto mb-3 opacity-80" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={1.5} 
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
          />
        </svg>
        <p className="text-sm font-medium mb-1">{category}</p>
        {title && <p className="text-xs opacity-80 max-w-[200px] mx-auto">Imagem para: {title}</p>}
        <div className="mt-3 text-xs bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full inline-block">
          Imagem não disponível
        </div>
      </div>
    </motion.div>
  );
};

export default ImagePlaceholder;
