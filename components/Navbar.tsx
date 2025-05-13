import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { FaWater, FaSearch, FaBars, FaTimes, FaUser, FaBookmark, FaMapMarkerAlt, FaWaveSquare, FaSun, FaWind, FaSignOutAlt } from 'react-icons/fa';
import ThemeToggle from './ThemeToggle';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import useNetworkStatus from '../hooks/useNetworkStatus';
import MobileMenu from './MobileMenu';
import SearchBar from './SearchBar';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const router = useRouter();
  const { data: session } = useSession();
  const { isOnline } = useNetworkStatus();
  const auth = useAuth();
  
  // Detectar scroll para mudar a aparência da navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Fechar menu quando mudar de página
  useEffect(() => {
    setIsMenuOpen(false);
    setIsSearchOpen(false);
    setIsUserMenuOpen(false);
  }, [router.pathname]);
  
  // Lidar com a pesquisa
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/pesquisa?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };
  
  // Verificar se o link está ativo
  const isActive = (path: string) => router.pathname === path || router.pathname.startsWith(`${path}/`);
  
  // Links de navegação
  const navLinks = [
    { href: '/', label: 'Home', icon: <FaWater className="mr-2" /> },
    { href: '/noticias', label: 'Notícias', icon: <FaBookmark className="mr-2" /> },
    { href: '/categorias', label: 'Categorias', icon: <FaSearch className="mr-2" /> },
    { href: '/previsao', label: 'Previsão', icon: <FaWaveSquare className="mr-2" /> },
    { href: '/dicas', label: 'Dicas de Surf', icon: <FaSun className="mr-2" /> },
    { href: '/destinos', label: 'Destinos', icon: <FaMapMarkerAlt className="mr-2" /> },
    { href: '/contato', label: 'Contato', icon: <FaUser className="mr-2" /> },
  ];
  
  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 dark:bg-blue-900/95 backdrop-blur-md shadow-md' : 'bg-white dark:bg-dark-bg-primary'}`}
    >
      {/* Barra de status de conexão - exibe quando offline */}
      {!isOnline && (
        <motion.div 
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="bg-gradient-to-r from-red-600 to-red-500 text-white text-center text-sm py-1.5 px-4 flex items-center justify-center"
        >
          <FaWind className="mr-2" /> Você está offline. Algumas funcionalidades podem estar limitadas.
        </motion.div>
      )}
      
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <motion.div
              whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
              transition={{ duration: 0.5 }}
            >
              <FaWater className="text-blue-600 group-hover:text-blue-500 transition-colors text-3xl mr-2" />
            </motion.div>
            <span className="text-gray-800 dark:text-white text-2xl font-bold">
              JornalK1 <span className="text-blue-600 group-hover:text-blue-500 transition-colors">Surf</span>
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-2">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href} 
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center ${isActive(link.href) 
                  ? 'text-white bg-blue-600 shadow-md' 
                  : 'text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20'}`}
                onMouseEnter={() => setHoveredLink(link.href)}
                onMouseLeave={() => setHoveredLink(null)}
              >
                <motion.div
                  animate={{ 
                    scale: hoveredLink === link.href || isActive(link.href) ? 1.1 : 1,
                    rotate: hoveredLink === link.href && !isActive(link.href) ? [0, -5, 5, 0] : 0
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {link.icon}
                </motion.div>
                {link.label}
              </Link>
            ))}
          </nav>
          
          {/* Botões de ação */}
          <div className="flex items-center space-x-2">
            {/* Botão de pesquisa */}
            <motion.button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2.5 rounded-full text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              aria-label="Pesquisar"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaSearch className="h-5 w-5" />
            </motion.button>
            
            {/* Botão de tema */}
            <ThemeToggle />
            
            {/* Menu de usuário */}
            {session ? (
              <div className="relative">
                <motion.button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="p-2.5 rounded-full text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 flex items-center"
                  aria-label="Menu do usuário"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                    {session.user?.image ? (
                      <Image 
                        src={session.user.image} 
                        alt={session.user?.name || 'Usuário'} 
                        width={32} 
                        height={32} 
                        className="rounded-full"
                      />
                    ) : (
                      <FaUser className="h-4 w-4" />
                    )}
                  </div>
                </motion.button>
                
                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-56 bg-white dark:bg-dark-card-bg rounded-xl shadow-xl py-2 z-50 border border-gray-200 dark:border-gray-700 overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-sm font-medium text-gray-800 dark:text-white">{session.user?.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{session.user?.email}</p>
                      </div>
                      <Link 
                        href="/admin" 
                        className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 flex items-center"
                      >
                        <FaUser className="mr-2 text-blue-600" />
                        Dashboard
                      </Link>
                      <button 
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/10 flex items-center"
                      >
                        <FaSignOutAlt className="mr-2 text-red-500" />
                        Sair
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <motion.div 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
                onClick={() => auth.handleLoginClick()}
                className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-full text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-colors duration-300 cursor-pointer"
              >
                <FaUser className="h-4 w-4 mr-2" />
                Entrar
              </motion.div>
            )}
            
            {/* Menu mobile */}
            <motion.button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2.5 rounded-full text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              aria-label="Menu"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isMenuOpen ? 'close' : 'open'}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isMenuOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
                </motion.div>
              </AnimatePresence>
              <span className="sr-only">Abrir menu</span>
            </motion.button>
          </div>
        </div>
      </div>
      
      {/* Barra de pesquisa */}
      <div className="relative md:px-4">
        <SearchBar 
          isOpen={isSearchOpen}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
          closeSearch={() => setIsSearchOpen(false)}
        />
      </div>
      
      {/* Menu Mobile */}
      <MobileMenu 
        isOpen={isMenuOpen}
        navLinks={navLinks}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
        isActive={isActive}
      />
    </header>
  );
};

export default Navbar;