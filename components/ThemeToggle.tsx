import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSun, FaMoon } from 'react-icons/fa';

const ThemeToggle = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [animationComplete, setAnimationComplete] = useState(true);

  // Determinar qual tema está realmente ativo
  const activeTheme = theme === 'system' ? resolvedTheme : theme;

  // Quando o componente montar, podemos mostrar a UI
  useEffect(() => {
    setMounted(true);
    
    // Adicionar class para transição suave no body
    if (typeof document !== 'undefined') {
      document.body.classList.add('transition-colors');
      document.body.classList.add('duration-300');
    }
    
    return () => {
      // Limpeza ao desmontar
      if (typeof document !== 'undefined') {
        document.body.classList.remove('transition-colors');
        document.body.classList.remove('duration-300');
      }
    };
  }, []);

  // Função para alternar o tema com suavidade
  const toggleTheme = () => {
    if (animationComplete) {
      setAnimationComplete(false);
      setTheme(activeTheme === 'dark' ? 'light' : 'dark');
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <motion.button
      aria-label={activeTheme === 'dark' ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
      title={activeTheme === 'dark' ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
      type="button"
      className="p-2 rounded-full bg-gray-100 dark:bg-dark-card-bg text-blue-accent dark:text-blue-accent hover:bg-gray-200 dark:hover:bg-dark-bg-secondary focus:outline-none focus:ring-2 focus:ring-blue-accent transition-colors duration-200 shadow-sm relative overflow-hidden"
      onClick={toggleTheme}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Efeito de respingo ao clicar */}
      <span className="absolute inset-0 overflow-hidden rounded-full">
        <span className="absolute inset-0 transform scale-0 rounded-full bg-blue-50 dark:bg-blue-900/30 origin-center transition-transform motion-safe:animate-ripple"></span>
      </span>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={activeTheme}
          initial={{ y: -20, opacity: 0, rotate: -90 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: 20, opacity: 0, rotate: 90 }}
          transition={{ duration: 0.3 }}
          onAnimationComplete={() => setAnimationComplete(true)}
          className="relative z-10"
        >
          {activeTheme === 'dark' ? (
            <FaSun className="h-5 w-5" aria-hidden="true" />
          ) : (
            <FaMoon className="h-5 w-5" aria-hidden="true" />
          )}
        </motion.div>
      </AnimatePresence>
    </motion.button>
  );
};

export default ThemeToggle;
