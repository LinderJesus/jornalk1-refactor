import React, { FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaTimes } from 'react-icons/fa';

interface SearchBarProps {
  isOpen: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: (e: React.FormEvent) => void;
  closeSearch: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  isOpen,
  searchQuery,
  setSearchQuery,
  handleSearch,
  closeSearch,
}) => {
  // Função para pesquisa rápida por meio de sugestões
  const quickSearch = (term: string): void => {
    setSearchQuery(term);
    // Passamos um objeto vazio como FormEvent, que é suficiente para nosso caso de uso
    handleSearch({} as FormEvent);
  };
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-x-0 top-full mt-2 bg-white dark:bg-dark-card-bg shadow-surf rounded-lg z-50 overflow-hidden border border-gray-200 dark:border-gray-700 glass"
        >
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium text-gray-800 dark:text-white">Pesquisar</h3>
              <button
                onClick={closeSearch}
                className="p-1 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
              >
                <FaTimes />
              </button>
            </div>
            
            <form onSubmit={handleSearch} className="flex">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar notícias, categorias, destinos..."
                  className="w-full bg-gray-50 dark:bg-dark-bg-secondary border border-gray-300 dark:border-gray-600 rounded-l-full py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white"
                  // Removido autoFocus para melhorar acessibilidade
                />
              </div>
              <motion.button 
                type="submit" 
                className="btn-ocean px-6 py-3 rounded-r-full"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Pesquisar
              </motion.button>
            </form>
            
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">Sugestões:</span>
              <button 
                onClick={() => quickSearch('surf')}
                className="text-sm px-3 py-1 bg-gray-100 dark:bg-dark-bg-primary rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover-float"
              >
                Surf
              </button>
              <button 
                onClick={() => quickSearch('campeonato')}
                className="text-sm px-3 py-1 bg-gray-100 dark:bg-dark-bg-primary rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover-float"
              >
                Campeonato
              </button>
              <button 
                onClick={() => quickSearch('previsão ondas')}
                className="text-sm px-3 py-1 bg-gray-100 dark:bg-dark-bg-primary rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover-float"
              >
                Previsão de ondas
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchBar;
