import React from 'react';
import { 
  FaWater, 
  FaUmbrellaBeach, 
  FaShip, 
  FaFish, 
  FaMountain,
  FaSun,
  FaSwimmer
} from 'react-icons/fa';

interface SurfPlaceholderProps {
  width?: number;
  height?: number;
  category?: string;
  title?: string;
  className?: string;
}

/**
 * Componente que gera um placeholder visual para imagens de surf com temas específicos
 * Substitui imagens corrompidas ou ausentes com uma visualização estilizada e temática
 */
const SurfPlaceholder: React.FC<SurfPlaceholderProps> = ({
  width = 400,
  height = 300,
  category = 'geral',
  title = 'Imagem não disponível',
  className = '',
}) => {
  // Cores e estilos são definidos diretamente com base na categoria
  // sem necessidade de geração dinâmica de cores
  
  // Escolher um ícone baseado na categoria
  const getIcon = () => {
    const lowerCategory = category.toLowerCase();
    
    if (lowerCategory.includes('compet') || lowerCategory.includes('camp')) {
      return <FaSwimmer className="text-5xl" />;
    } else if (lowerCategory.includes('praia') || lowerCategory.includes('dest')) {
      return <FaUmbrellaBeach className="text-5xl" />;
    } else if (lowerCategory.includes('equip') || lowerCategory.includes('pranc')) {
      return <FaSwimmer className="text-5xl" />; // Nadador como substituto para surfista
    } else if (lowerCategory.includes('onda') || lowerCategory.includes('mar')) {
      return <FaWater className="text-5xl" />;
    } else if (lowerCategory.includes('barco') || lowerCategory.includes('nav')) {
      return <FaShip className="text-5xl" />;
    } else if (lowerCategory.includes('ecologia') || lowerCategory.includes('sust')) {
      return <FaFish className="text-5xl" />;
    } else if (lowerCategory.includes('tec') || lowerCategory.includes('mano')) {
      return <FaMountain className="text-5xl" />;
    } else {
      return <FaSun className="text-5xl" />;
    }
  };

  // Cores de gradiente com base nas categorias
  const getGradient = () => {
    const lowerCategory = category.toLowerCase();
    
    if (lowerCategory.includes('compet') || lowerCategory.includes('camp')) {
      return 'from-blue-500 to-purple-600';
    } else if (lowerCategory.includes('praia') || lowerCategory.includes('dest')) {
      return 'from-yellow-400 to-orange-500';
    } else if (lowerCategory.includes('equip') || lowerCategory.includes('pranc')) {
      return 'from-teal-400 to-blue-500';
    } else if (lowerCategory.includes('onda') || lowerCategory.includes('mar')) {
      return 'from-blue-400 to-blue-600';
    } else if (lowerCategory.includes('sust')) {
      return 'from-green-400 to-teal-500';
    } else {
      return 'from-indigo-500 to-blue-600';
    }
  };

  return (
    <div 
      className={`overflow-hidden bg-gradient-to-br ${getGradient()} flex items-center justify-center relative ${className}`} 
      style={{ 
        width: width || '100%', 
        height: height || '100%', 
        borderRadius: '0.375rem',
      }}
      aria-label={title}
      role="img"
    >
      {/* Elemento decorativo - ondas estilizadas */}
      <div className="absolute inset-0 opacity-20">
        <div className="wave-pattern absolute bottom-0 left-0 w-full h-40 opacity-20"></div>
      </div>

      <div className="z-10 text-white text-center p-4 flex flex-col items-center justify-center">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm mb-4">
          {getIcon()}
        </div>
        
        {title && (
          <div className="max-w-[80%]">
            <p className="text-sm font-medium truncate">
              {title}
            </p>
            <p className="text-xs mt-1 opacity-80">Imagem relacionada ao tema surf</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .wave-pattern {
          background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.2));
          transform: perspective(100px) rotateX(60deg);
          transform-origin: bottom;
          mask-image: repeating-linear-gradient(
            to bottom,
            transparent,
            transparent 8px,
            white 8px,
            white 14px
          );
        }
      `}</style>
    </div>
  );
};

export default SurfPlaceholder;
