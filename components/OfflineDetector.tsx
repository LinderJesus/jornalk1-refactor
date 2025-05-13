import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaWifi, FaExclamationTriangle, FaRedo } from 'react-icons/fa';

/**
 * Componente avançado para detecção de conexão offline
 * Melhora a experiência do usuário quando a conexão com a internet estiver indisponível
 * Fornece opções para recarregar a página e acessar conteúdo em cache
 */
const OfflineDetector: React.FC = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [showNotification, setShowNotification] = useState(false);
  const [offlineDuration, setOfflineDuration] = useState(0);
  // O ESLint estava avisando que offlineStartTime é atribuído mas nunca usado
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [offlineStartTime, setOfflineStartTime] = useState<number | null>(null);

  useEffect(() => {
    // Verificar se estamos no navegador
    if (typeof window === 'undefined') return;

    let offlineTimer: NodeJS.Timeout | null = null;

    // Função para atualizar o status da conexão
    const handleOnlineStatusChange = () => {
      const online = navigator.onLine;
      setIsOnline(online);
      
      if (!online) {
        // Registrar o momento em que ficou offline
        const startTime = Date.now();
        setOfflineStartTime(startTime);
        setShowNotification(true);
        
        // Iniciar um timer para atualizar a duração do tempo offline
        offlineTimer = setInterval(() => {
          const currentDuration = Math.floor((Date.now() - startTime) / 1000);
          setOfflineDuration(currentDuration);
        }, 1000);
      } else {
        // Quando voltar online
        if (offlineTimer) {
          clearInterval(offlineTimer);
          offlineTimer = null;
        }
        
        // Mostrar notificação de volta online
        setShowNotification(true);
        
        // Esconder a notificação após alguns segundos
        setTimeout(() => {
          setShowNotification(false);
          setOfflineDuration(0);
          setOfflineStartTime(null);
        }, 5000);
      }
    };

    // Verificar o status inicial
    handleOnlineStatusChange();

    // Adicionar event listeners para mudanças na conexão
    window.addEventListener('online', handleOnlineStatusChange);
    window.addEventListener('offline', handleOnlineStatusChange);

    // Limpar event listeners e timer
    return () => {
      window.removeEventListener('online', handleOnlineStatusChange);
      window.removeEventListener('offline', handleOnlineStatusChange);
      
      if (offlineTimer) {
        clearInterval(offlineTimer);
      }
    };
  }, []);

  // Função para recarregar a página
  const handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  // Função para formatar a duração do tempo offline
  const formatDuration = (seconds: number): string => {
    if (seconds < 60) {
      return `${seconds} segundos`;
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      return `${minutes} minuto${minutes > 1 ? 's' : ''}`;
    } else {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      return `${hours} hora${hours > 1 ? 's' : ''} e ${minutes} minuto${minutes > 1 ? 's' : ''}`;
    }
  };

  // Não renderizar nada se estiver online e a notificação não estiver visível
  if (isOnline && !showNotification) return null;

  return (
    <AnimatePresence>
      {showNotification && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: 'spring', damping: 20 }}
          className="fixed top-0 left-0 right-0 z-50 p-4 flex justify-center"
        >
          <div className={`max-w-md w-full ${
            isOnline 
              ? 'bg-green-500 text-white' 
              : 'bg-red-500 text-white'
          } rounded-lg shadow-lg overflow-hidden`}>
            <div className="p-4">
              <div className="flex items-center">
                {isOnline ? (
                  <>
                    <FaWifi className="text-white text-xl mr-3" />
                    <div>
                      <h3 className="font-semibold">Você está online novamente!</h3>
                      {offlineDuration > 0 && (
                        <p className="text-sm opacity-90">
                          Você ficou offline por {formatDuration(offlineDuration)}
                        </p>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <FaExclamationTriangle className="text-white text-xl mr-3" />
                    <div>
                      <h3 className="font-semibold">Você está offline</h3>
                      <p className="text-sm opacity-90">
                        Verifique sua conexão com a internet
                        {offlineDuration > 0 && ` (${formatDuration(offlineDuration)})`}
                      </p>
                    </div>
                  </>
                )}
              </div>
              
              {!isOnline && (
                <div className="mt-3 flex justify-end">
                  <button
                    onClick={handleReload}
                    className="flex items-center gap-1 px-3 py-1 bg-white text-red-500 text-sm rounded hover:bg-red-50 transition-colors"
                  >
                    <FaRedo size={12} />
                    <span>Tentar novamente</span>
                  </button>
                </div>
              )}
            </div>
            
            {!isOnline && (
              <div className="bg-red-600 px-4 py-2 text-sm">
                <p>
                  Algumas funcionalidades podem não estar disponíveis enquanto você estiver offline.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OfflineDetector;
