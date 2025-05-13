import React, { useEffect } from 'react';
import { useIdleDetection } from '../hooks';

/**
 * Componente que otimiza o desempenho do site quando o usuário está inativo
 * Reduz a taxa de atualização de animações e pausa processos não essenciais
 */
const PerformanceOptimizer: React.FC = () => {
  // Detectar inatividade após 2 minutos
  const { isIdle } = useIdleDetection({ idleTime: 120000 });

  useEffect(() => {
    // Verificar se estamos no navegador
    if (typeof window === 'undefined') return;

    // Função para otimizar o desempenho quando o usuário está inativo
    const optimizePerformance = () => {
      // Selecionar todos os elementos com animações
      const animatedElements = document.querySelectorAll('.animate-pulse, .animate-spin, .animate-bounce');
      
      // Pausar animações não essenciais
      animatedElements.forEach(element => {
        if (isIdle) {
          element.classList.add('animation-paused');
        } else {
          element.classList.remove('animation-paused');
        }
      });

      // Reduzir a taxa de atualização de vídeos em reprodução automática
      const autoplayVideos = document.querySelectorAll('video[autoplay]');
      autoplayVideos.forEach(video => {
        if (video instanceof HTMLVideoElement) {
          if (isIdle) {
            // Pausar vídeos em reprodução automática
            if (!video.paused) {
              video.pause();
            }
          } else {
            // Retomar vídeos se estiverem pausados
            if (video.paused && !video.ended) {
              video.play().catch(() => {
                // Ignorar erros de reprodução (políticas de autoplay do navegador)
              });
            }
          }
        }
      });

      // Reduzir a frequência de atualizações de elementos dinâmicos
      if (isIdle) {
        // Armazenar os intervalos atuais em um atributo de dados
        document.querySelectorAll('[data-update-interval]').forEach(element => {
          const currentInterval = parseInt(element.getAttribute('data-current-interval') || '0', 10);
          if (currentInterval > 0) {
            // Já está otimizado
            return;
          }
          
          const updateInterval = parseInt(element.getAttribute('data-update-interval') || '0', 10);
          if (updateInterval > 0) {
            // Armazenar o intervalo original
            element.setAttribute('data-original-interval', updateInterval.toString());
            // Definir um novo intervalo mais lento (2x mais lento)
            element.setAttribute('data-current-interval', (updateInterval * 2).toString());
          }
        });
      } else {
        // Restaurar os intervalos originais
        document.querySelectorAll('[data-update-interval]').forEach(element => {
          const originalInterval = parseInt(element.getAttribute('data-original-interval') || '0', 10);
          if (originalInterval > 0) {
            // Restaurar o intervalo original
            element.setAttribute('data-current-interval', '0');
            element.setAttribute('data-update-interval', originalInterval.toString());
          }
        });
      }
    };

    // Adicionar uma classe global ao body para estilos CSS
    if (isIdle) {
      document.body.classList.add('user-idle');
    } else {
      document.body.classList.remove('user-idle');
    }

    // Otimizar o desempenho quando o estado de inatividade mudar
    optimizePerformance();

    // Adicionar estilo global para pausar animações
    const style = document.createElement('style');
    style.innerHTML = `
      .animation-paused {
        animation-play-state: paused !important;
      }
      .user-idle .low-priority-animation {
        display: none !important;
      }
    `;
    document.head.appendChild(style);

    // Limpar estilo ao desmontar
    return () => {
      document.head.removeChild(style);
    };
  }, [isIdle]);

  // Este componente não renderiza nada visível
  return null;
};

export default PerformanceOptimizer;
