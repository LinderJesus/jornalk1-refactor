import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaSun, FaMoon, FaWater, FaUser } from 'react-icons/fa';

import dynamic from 'next/dynamic';
import { useTheme } from 'next-themes';
import { useAuth } from '../context/AuthContext';

// Definindo a interface para o SearchModal
interface SearchModalProps {
  onClose: () => void;
}

// Componente de placeholder para o modal de pesquisa
const SearchModalPlaceholder: React.FC = () => (
  <div className="hidden">Carregando...</div>
);

// Carregamento dinâmico do componente de pesquisa
const SearchModal = dynamic<SearchModalProps>(
  () => import('./SearchModal').then((mod) => mod.default),
  {
    loading: () => <SearchModalPlaceholder />, 
    ssr: false
  }
);

const OptimizedHeader: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState('');
  const { theme } = useTheme();
  const router = useRouter();
  const auth = useAuth();

  // Detectar scroll para mudar o estilo do cabeçalho com debounce para melhor performance
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const handleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsScrolled(window.scrollY > 50);
      }, 10);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, []);

  // Definindo os links de navegação
  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Notícias', href: '/noticias', dropdown: [
      { label: 'Notícias Recentes', href: '/noticias/recentes' },
      { label: 'Notícias Populares', href: '/noticias/populares' },
      { label: 'Campeonatos', href: '/noticias/campeonatos' },
      { label: 'Atletas', href: '/noticias/atletas' },
    ]},
    { label: 'Categorias', href: '/categorias', dropdown: [
      { label: 'Competições', href: '/categorias/competicoes' },
      { label: 'Equipamentos', href: '/categorias/equipamentos' },
      { label: 'Destinos', href: '/categorias/destinos' },
      { label: 'Técnicas', href: '/categorias/tecnicas' },
      { label: 'Sustentabilidade', href: '/categorias/sustentabilidade' },
      { label: 'Cultura', href: '/categorias/cultura' },
    ]},
    { label: 'Dicas', href: '/dicas' },
    { label: 'Previsão', href: '/previsao' },
    { label: 'Contato', href: '/contato' },
  ];

  // Verificar se o link está ativo
  const isActive = (href: string) => {
    return router.pathname === href || 
           (href !== '/' && router.pathname.startsWith(href));
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-dark-bg-primary shadow-sm py-2 border-b border-gray-900/20' 
          : 'bg-transparent py-4'
      }`}
      role="banner"
      aria-label="Cabeçalho do site"
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center" aria-label="Página inicial JornalK1 Surf">
          <FaWater className="text-3xl mr-2 text-blue-accent" />
          <span className="font-bold text-2xl text-white">JornalK1</span>
          <span className="ml-1 text-sm font-medium text-gray-400">Surf</span>
        </Link>

        {/* Navegação Desktop */}
        <nav className="hidden lg:flex items-center space-x-4">
          {navLinks.map((link) => (
            <div key={link.label} className="relative group">
              {link.dropdown ? (
                <>
                  <button
                    onClick={() => setIsDropdownOpen(isDropdownOpen === link.label ? '' : link.label)}
                    className={`group flex items-center text-gray-200 hover:text-white transition-colors ${
                      isDropdownOpen === link.label
                        ? 'text-blue-accent'
                        : ''
                    }`}
                  >
                    {link.label}
                    <svg
                      className={`ml-1 h-4 w-4 transition-transform ${
                        isDropdownOpen === link.label ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <AnimatePresence>
                    {isDropdownOpen === link.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-0 mt-2 w-48 rounded-lg bg-dark-bg-secondary shadow-lg border border-dark-800/60 overflow-hidden z-50"
                      >
                        <div className="py-2">
                          {link.dropdown.map((item) => (
                            <Link
                              key={`${link.label}-${item.href}`}
                              href={item.href}
                              className="block px-4 py-2 text-sm text-gray-300 hover:bg-dark-bg-primary hover:text-blue-accent"
                              onClick={() => setIsDropdownOpen('')}
                            >
                              {item.label}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <Link 
                  href={link.href}
                  className={`text-gray-200 hover:text-white transition-colors ${
                    isActive(link.href)
                      ? 'text-blue-accent font-medium'
                      : ''
                  }`}
                >
                  {link.label}
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* Ações */}
        <div className="flex items-center space-x-3">
          {/* Botão de Pesquisa */}
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="p-2 rounded-full text-gray-300 hover:text-white transition-colors"
            aria-label="Pesquisar"
          >
            <FaSearch className="text-lg" />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => {
              const toggleTheme = document.querySelector('[data-toggle-theme]') as HTMLElement;
              if (toggleTheme) toggleTheme.click();
            }}
            className="p-2 rounded-md text-gray-300 hover:text-white transition-colors"
            aria-label="Alternar tema"
          >
            {theme === 'dark' ? <FaSun className="text-lg" /> : <FaMoon className="text-lg" />}
          </button>

          {/* Botão de Login */}
          <button 
            onClick={() => auth.handleLoginClick()}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-full hover:bg-blue-700 transition-colors shadow-sm cursor-pointer"
          >
            <FaUser className="mr-2" />
            Entrar
          </button>

          {/* Botão do Menu Mobile */}
          <motion.button
            className="lg:hidden p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Menu"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            whileTap={{ scale: 0.9 }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </motion.button>
        </div>
      </div>

      {/* Menu Mobile */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="lg:hidden overflow-hidden glass border-t border-gray-200 dark:border-dark-700 shadow-surf"
            role="navigation"
            aria-label="Menu mobile"
          >
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => (
                <div key={link.label}>
                  {link.dropdown ? (
                    <div className="space-y-1">
                      <button
                        onClick={() => setIsDropdownOpen(isDropdownOpen === link.label ? '' : link.label)}
                        className={`flex items-center justify-between w-full px-3 py-2 rounded-lg text-base font-medium ${
                          isDropdownOpen === link.label
                            ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/10 hover:text-blue-600 dark:hover:text-blue-400'
                        }`}
                      >
                        {link.label}
                        <svg
                          className={`ml-1 h-5 w-5 transition-transform ${
                            isDropdownOpen === link.label ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      
                      <AnimatePresence>
                        {isDropdownOpen === link.label && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="ml-4 pl-2 border-l-2 border-blue-200 dark:border-blue-800 space-y-1"
                          >
                            {link.dropdown.map((item) => (
                              <Link
                                key={`mobile-${link.label}-${item.href}`}
                                href={item.href}
                                className="block px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/10 hover:text-blue-600 dark:hover:text-blue-400"
                                onClick={() => {
                                  setIsDropdownOpen('');
                                  setIsMobileMenuOpen(false);
                                }}
                              >
                                {item.label}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link 
                      href={link.href}
                      className={`block px-3 py-2 rounded-lg text-base font-medium ${
                        isActive(link.href)
                          ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/10 hover:text-blue-600 dark:hover:text-blue-400'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de Pesquisa */}
      {isSearchOpen && (
        <SearchModal onClose={() => setIsSearchOpen(false)} />
      )}
    </header>
  );
};

export default OptimizedHeader;
