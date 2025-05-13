import { useState, useEffect, useCallback } from 'react';

interface IdleDetectionOptions {
  idleTime?: number; // Tempo em milissegundos até considerar o usuário inativo
  events?: string[]; // Eventos que resetam o timer de inatividade
}

/**
 * Hook para detectar inatividade do usuário
 * Útil para pausar animações, reduzir requisições ou mostrar notificações
 * quando o usuário não está interagindo com o site
 */
const useIdleDetection = ({
  idleTime = 60000, // 1 minuto por padrão
  events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'wheel']
}: IdleDetectionOptions = {}) => {
  const [isIdle, setIsIdle] = useState(false);
  const [lastActiveTime, setLastActiveTime] = useState(Date.now());

  // Função para resetar o timer de inatividade
  const resetIdleTimer = useCallback(() => {
    setIsIdle(false);
    setLastActiveTime(Date.now());
  }, []);

  useEffect(() => {
    // Verificar se estamos no navegador
    if (typeof window === 'undefined') return;

    // Função para verificar inatividade
    const checkIdleStatus = () => {
      const now = Date.now();
      const timeSinceLastActivity = now - lastActiveTime;
      
      if (timeSinceLastActivity >= idleTime && !isIdle) {
        setIsIdle(true);
      }
    };
    
    let idleTimer: NodeJS.Timeout;

    // Configurar intervalo para verificar inatividade
    const interval = setInterval(checkIdleStatus, 10000); // Verificar a cada 10 segundos

    // Adicionar event listeners para resetar o timer
    events.forEach(event => {
      window.addEventListener(event, resetIdleTimer);
    });

    // Também resetar quando a página voltar a ficar visível
    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        resetIdleTimer();
      }
    });

    // Limpar event listeners e intervalos
    return () => {
      clearInterval(interval);
      // Não é necessário limpar idleTimer pois não está sendo usado
      
      events.forEach(event => {
        window.removeEventListener(event, resetIdleTimer);
      });
      
      window.removeEventListener('visibilitychange', resetIdleTimer);
    };
  }, [events, idleTime, isIdle, lastActiveTime, resetIdleTimer]);

  return {
    isIdle,
    lastActiveTime,
    resetIdleTimer
  };
};

export default useIdleDetection;
