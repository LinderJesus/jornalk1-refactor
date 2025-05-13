import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaWifi, FaExclamationTriangle } from 'react-icons/fa';

/**
 * Componente que exibe uma notificação quando o usuário está offline
 * Melhora a experiência do usuário informando sobre o status da conexão
 */
const OfflineNotification: React.FC = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    // Verificar se estamos no navegador
    if (typeof window === 'undefined') return;

    // Função para atualizar o status da conexão
    const handleOnlineStatusChange = () => {
      setIsOnline(navigator.onLine);
      
      // Mostrar a notificação apenas se estiver offline
      if (!navigator.onLine) {
        setShowNotification(true);
      } else {
        // Quando voltar online, aguardar um pouco antes de esconder a notificação
        setTimeout(() => {
          setShowNotification(false);
        }, 3000);
      }
    };

    // Verificar o status inicial
    handleOnlineStatusChange();

    // Adicionar event listeners para mudanças na conexão
    window.addEventListener('online', handleOnlineStatusChange);
    window.addEventListener('offline', handleOnlineStatusChange);

    // Limpar event listeners
    return () => {
      window.removeEventListener('online', handleOnlineStatusChange);
      window.removeEventListener('offline', handleOnlineStatusChange);
    };
  }, []);

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
          <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg shadow-lg ${
            isOnline 
              ? 'bg-green-500 text-white' 
              : 'bg-red-500 text-white'
          }`}>
            {isOnline ? (
              <>
                <FaWifi className="text-white" />
                <span>Você está online novamente!</span>
              </>
            ) : (
              <>
                <FaExclamationTriangle className="text-white" />
                <span>Você está offline. Alguns recursos podem não funcionar corretamente.</span>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OfflineNotification;
