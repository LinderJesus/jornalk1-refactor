import { useState, useEffect } from 'react';

interface NetworkStatus {
  isOnline: boolean;
  isSlow: boolean;
  effectiveType: string | null;
  downlink: number | null;
  rtt: number | null;
}

/**
 * Hook personalizado para detectar o status da conexão do usuário
 * Permite adaptar a experiência do usuário com base na qualidade da conexão
 */
const useNetworkStatus = (): NetworkStatus => {
  // Estado inicial
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    isOnline: true,
    isSlow: false,
    effectiveType: null,
    downlink: null,
    rtt: null
  });

  useEffect(() => {
    // Verificar se estamos no navegador
    if (typeof window === 'undefined') return;

    // Função para atualizar o status da rede
    const updateNetworkStatus = () => {
      // Verificar se o navegador suporta a API de conexão
      const connection = 
        'connection' in navigator
          ? (navigator as any).connection || 
            (navigator as any).mozConnection || 
            (navigator as any).webkitConnection
          : null;

      if (connection) {
        // Determinar se a conexão é lenta
        const isSlow = 
          connection.effectiveType === '2g' || 
          connection.effectiveType === 'slow-2g' ||
          (connection.downlink && connection.downlink < 1) ||
          (connection.rtt && connection.rtt > 500);

        setNetworkStatus({
          isOnline: navigator.onLine,
          isSlow,
          effectiveType: connection.effectiveType || null,
          downlink: connection.downlink || null,
          rtt: connection.rtt || null
        });
      } else {
        // Fallback para navegadores que não suportam a API de conexão
        setNetworkStatus({
          isOnline: navigator.onLine,
          isSlow: false,
          effectiveType: null,
          downlink: null,
          rtt: null
        });
      }
    };

    // Atualizar o status inicial
    updateNetworkStatus();

    // Adicionar event listeners para mudanças na conexão
    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);

    // Adicionar event listener para mudanças na qualidade da conexão (se suportado)
    const connection = 
      'connection' in navigator
        ? (navigator as any).connection || 
          (navigator as any).mozConnection || 
          (navigator as any).webkitConnection
        : null;

    if (connection && connection.addEventListener) {
      connection.addEventListener('change', updateNetworkStatus);
    }

    // Limpar event listeners
    return () => {
      window.removeEventListener('online', updateNetworkStatus);
      window.removeEventListener('offline', updateNetworkStatus);

      if (connection && connection.removeEventListener) {
        connection.removeEventListener('change', updateNetworkStatus);
      }
    };
  }, []);

  return networkStatus;
};

export default useNetworkStatus;
