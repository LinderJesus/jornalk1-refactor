import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCookieBite, FaCheck, FaTimes, FaCog } from 'react-icons/fa';

// Variável global para controlar montagem do componente
let isCookieConsentMounted = false;

interface CookieSettings {
  necessary: boolean;
  preferences: boolean;
  analytics: boolean;
  marketing: boolean;
}

/**
 * Componente de gerenciamento de consentimento de cookies
 * Atende às regulamentações de privacidade como LGPD e GDPR
 */
const CookieConsent: React.FC = () => {
  // Referência para controlar se este componente já foi montado
  const instanceRef = useRef(false);
  // States do componente
  const [shouldRender, setShouldRender] = useState(true);
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<CookieSettings>({
    necessary: true, // Sempre necessário
    preferences: false,
    analytics: false,
    marketing: false
  });
  
  // Verificar se existe outra instância do componente
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (isCookieConsentMounted && !instanceRef.current) {
        // Se já existe uma instância, não renderizar esta
        setShouldRender(false);
      } else if (!isCookieConsentMounted) {
        // Registrar esta como a instância ativa
        instanceRef.current = true;
        isCookieConsentMounted = true;
      }
    }
    
    // Limpar ao desmontar
    return () => {
      if (instanceRef.current) {
        instanceRef.current = false;
        isCookieConsentMounted = false;
      }
    };
  }, []);

  // Verificar se o consentimento já foi dado
  useEffect(() => {
    if (!shouldRender || typeof window === 'undefined') return;

    const consent = localStorage.getItem('cookie-consent');
    
    if (!consent) {
      // Mostrar o banner após um pequeno atraso
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else {
      // Carregar configurações salvas
      try {
        const savedSettings = JSON.parse(consent);
        setSettings(savedSettings);
      } catch {
        // Em caso de erro, mostrar o banner novamente
        setShowBanner(true);
      }
    }
  }, [shouldRender]);

  // Salvar as configurações de cookies
  const saveSettings = () => {
    localStorage.setItem('cookie-consent', JSON.stringify(settings));
    setShowBanner(false);
    setShowSettings(false);
    
    // Aplicar as configurações
    applySettings(settings);
  };

  // Aceitar todos os cookies
  const acceptAll = () => {
    const allSettings: CookieSettings = {
      necessary: true,
      preferences: true,
      analytics: true,
      marketing: true
    };
    
    setSettings(allSettings);
    localStorage.setItem('cookie-consent', JSON.stringify(allSettings));
    setShowBanner(false);
    
    // Aplicar as configurações
    applySettings(allSettings);
  };

  // Recusar cookies opcionais
  const rejectOptional = () => {
    const minimalSettings: CookieSettings = {
      necessary: true,
      preferences: false,
      analytics: false,
      marketing: false
    };
    
    setSettings(minimalSettings);
    localStorage.setItem('cookie-consent', JSON.stringify(minimalSettings));
    setShowBanner(false);
    
    // Aplicar as configurações
    applySettings(minimalSettings);
  };

  // Aplicar as configurações de cookies
  const applySettings = (cookieSettings: CookieSettings) => {
    // Verificar se estamos no navegador antes de manipular o DOM
    if (typeof document === 'undefined') return;
    
    // Cookies necessários sempre são ativados
    
    // Cookies de preferências
    if (cookieSettings.preferences) {
      // Ativar cookies de preferências
      document.documentElement.dataset.cookiePreferences = 'true';
    } else {
      // Desativar cookies de preferências
      document.documentElement.dataset.cookiePreferences = 'false';
    }
    
    // Cookies de analytics
    if (cookieSettings.analytics) {
      // Ativar cookies de analytics
      document.documentElement.dataset.cookieAnalytics = 'true';
      
      // Exemplo: inicializar Google Analytics
      if (typeof window !== 'undefined') {
        const windowObj = window as Window & { initAnalytics?: () => void };
        if (windowObj.initAnalytics && typeof windowObj.initAnalytics === 'function') {
          windowObj.initAnalytics();
        }
      }
    } else {
      // Desativar cookies de analytics
      document.documentElement.dataset.cookieAnalytics = 'false';
    }
    
    // Cookies de marketing
    if (cookieSettings.marketing) {
      // Ativar cookies de marketing
      document.documentElement.dataset.cookieMarketing = 'true';
      
      // Exemplo: inicializar ferramentas de marketing
      if (typeof window !== 'undefined') {
        const windowObj = window as Window & { initMarketing?: () => void };
        if (windowObj.initMarketing && typeof windowObj.initMarketing === 'function') {
          windowObj.initMarketing();
        }
      }
    } else {
      // Desativar cookies de marketing
      document.documentElement.dataset.cookieMarketing = 'false';
    }
  };

  // Atualizar uma configuração específica
  const updateSetting = (key: keyof CookieSettings, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };


  // Se não deve renderizar, retorna null
  if (!shouldRender) {
    return null;
  }

  // Renderização do componente
  return (
    <React.Fragment>
      <AnimatePresence>
        {showBanner && (
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white dark:bg-dark-700 shadow-lg border-t border-gray-200 dark:border-dark-600"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="container mx-auto">
              {!showSettings ? (
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-start">
                    <div className="bg-primary-100 dark:bg-primary-900/30 p-3 rounded-full mr-4">
                      <FaCookieBite className="text-primary-600 dark:text-primary-400 text-xl" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">
                        Nós usamos cookies
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm max-w-2xl">
                        Este site utiliza cookies para melhorar sua experiência. Você pode escolher quais cookies aceitar ou recusar. Cookies necessários são essenciais para o funcionamento do site.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setShowSettings(true)}
                      className="px-4 py-2 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white flex items-center gap-2 text-sm transition-colors"
                    >
                      <FaCog />
                      <span>Configurações</span>
                    </button>
                    
                    <button
                      onClick={rejectOptional}
                      className="px-4 py-2 text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-dark-800 hover:bg-gray-200 dark:hover:bg-dark-700 rounded-md transition-colors text-sm"
                    >
                      Recusar opcionais
                    </button>
                    
                    <button
                      onClick={acceptAll}
                      className="px-4 py-2 text-white bg-primary-600 hover:bg-primary-700 rounded-md transition-colors text-sm flex items-center gap-2"
                    >
                      <FaCheck />
                      <span>Aceitar todos</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white dark:bg-dark-700 rounded-lg">
                  <div className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-dark-600">
                    <h2 className="font-semibold text-lg text-gray-800 dark:text-white">Configurações de Cookies</h2>
                    <button 
                      onClick={() => setShowSettings(false)}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      <FaTimes className="text-xl" />
                    </button>
                  </div>
                  <div className="p-4 space-y-4">
                    {/* Cookies cards: necessários, preferências, analytics, marketing */}
                    <>
                    <div className="p-4 border border-gray-200 dark:border-dark-600 rounded-md">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-800 dark:text-white">Cookies necessários</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Essenciais para o funcionamento básico do site. Não podem ser desativados.
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-not-allowed">
                          <span className="sr-only">Cookies necessários</span>
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={settings.necessary}
                            disabled
                            aria-label="Cookies necessários"
                          />
                          <div className="w-11 h-6 rounded-full bg-primary-600 peer-focus:ring-2 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all after:translate-x-full"></div>
                        </label>
                      </div>
                    </div>
                    <div className="p-4 border border-gray-200 dark:border-dark-600 rounded-md">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-800 dark:text-white">Cookies de preferências</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Permitem que o site lembre suas preferências, como tema escuro/claro.
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <span className="sr-only">Cookies de preferências</span>
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={settings.preferences}
                            onChange={e => updateSetting('preferences', e.target.checked)}
                            aria-label="Cookies de preferências"
                          />
                          <div className={`w-11 h-6 rounded-full peer ${
                            settings.preferences
                              ? 'bg-primary-600 after:translate-x-full after:border-white'
                              : 'bg-gray-300 dark:bg-dark-600 after:border-gray-300 dark:after:border-dark-600'
                          } peer-focus:ring-2 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}></div>
                        </label>
                      </div>
                    </div>
                    <div className="p-4 border border-gray-200 dark:border-dark-600 rounded-md">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-800 dark:text-white">Cookies de analytics</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Ajudam a entender como você interage com o site, melhorando a experiência.
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <span className="sr-only">Cookies de analytics</span>
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={settings.analytics}
                            onChange={e => updateSetting('analytics', e.target.checked)}
                            aria-label="Cookies de analytics"
                          />
                          <div className={`w-11 h-6 rounded-full peer ${
                            settings.analytics
                              ? 'bg-primary-600 after:translate-x-full after:border-white'
                              : 'bg-gray-300 dark:bg-dark-600 after:border-gray-300 dark:after:border-dark-600'
                          } peer-focus:ring-2 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}></div>
                        </label>
                      </div>
                    </div>
                    <div className="p-4 border border-gray-200 dark:border-dark-600 rounded-md">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-800 dark:text-white">Cookies de marketing</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Usados para rastrear visitantes em sites. A intenção é exibir anúncios relevantes.
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <span className="sr-only">Cookies de marketing</span>
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={settings.marketing}
                            onChange={e => updateSetting('marketing', e.target.checked)}
                            aria-label="Cookies de marketing"
                          />
                          <div className={`w-11 h-6 rounded-full peer ${
                            settings.marketing
                              ? 'bg-primary-600 after:translate-x-full after:border-white'
                              : 'bg-gray-300 dark:bg-dark-600 after:border-gray-300 dark:after:border-dark-600'
                          } peer-focus:ring-2 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}></div>
                        </label>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-4 border-t border-gray-200 dark:border-dark-600 p-4">
                      <button
                        onClick={rejectOptional}
                        className="px-4 py-2 text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-dark-800 hover:bg-gray-200 dark:hover:bg-dark-700 rounded-md transition-colors"
                      >
                        Apenas necessários
                      </button>
                      <button
                        onClick={saveSettings}
                        className="px-4 py-2 text-white bg-primary-600 hover:bg-primary-700 rounded-md transition-colors flex items-center gap-2"
                      >
                        <FaCheck />
                        <span>Salvar preferências</span>
                      </button>
                    </div>
                    </>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </React.Fragment>
  );
};

export default CookieConsent;