import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';

/**
 * Componente que exibe uma barra de progresso durante a navegação entre páginas
 * Melhora a percepção de velocidade do site e fornece feedback visual ao usuário
 */
const NavigationProgress: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    // Função para simular o progresso de carregamento
    const simulateProgress = () => {
      setProgress(0);
      
      // Incrementar o progresso gradualmente até 90%
      timer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(timer);
            return 90;
          }
          
          // Acelerar no início e desacelerar conforme se aproxima de 90%
          const increment = (90 - prev) / 10;
          return prev + Math.max(0.5, increment);
        });
      }, 100);
    };

    // Manipuladores de eventos de roteamento
    const handleStart = (url: string) => {
      // Ignorar se for apenas uma mudança de hash na mesma página
      if (url.includes('#') && router.asPath.split('#')[0] === url.split('#')[0]) {
        return;
      }
      
      setLoading(true);
      simulateProgress();
    };

    const handleComplete = () => {
      clearInterval(timer);
      setProgress(100);
      
      // Aguardar um pouco para mostrar a barra completa antes de escondê-la
      setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 200);
    };

    // Adicionar event listeners para eventos de roteamento
    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    // Limpar event listeners e timer
    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
      clearInterval(timer);
    };
  }, [router]);

  // Não renderizar nada se não estiver carregando
  if (!loading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <motion.div
        className="h-1 bg-primary-600 origin-left"
        style={{ width: `${progress}%` }}
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ ease: 'easeInOut' }}
      />
    </div>
  );
};

export default NavigationProgress;
