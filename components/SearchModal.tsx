import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaTimes } from 'react-icons/fa';
import Link from 'next/link';

export interface SearchModalProps {
  onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<{id: number; title: string; category: string; slug: string}[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Focar no input quando o modal abrir
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
    
    // Adicionar event listener para fechar o modal com ESC
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);
  
  // Simulação de pesquisa
  useEffect(() => {
    if (searchTerm.length < 2) {
      setSearchResults([]);
      return;
    }
    
    setIsLoading(true);
    
    // Simulação de delay de rede
    const timer = setTimeout(() => {
      // Dados de exemplo para a pesquisa
      const mockResults = [
        {
          id: 1,
          title: 'Nova tecnologia de dessalinização pode resolver crise hídrica',
          category: 'Tecnologia',
          slug: 'nova-tecnologia-dessalinizacao-crise-hidrica'
        },
        {
          id: 2,
          title: 'Avanços na medicina regenerativa prometem revolucionar tratamentos',
          category: 'Saúde',
          slug: 'avancos-medicina-regenerativa-lesoes-medula'
        },
        {
          id: 3,
          title: 'Cúpula do G20 define novas metas para redução de emissões',
          category: 'Política',
          slug: 'cupula-g20-metas-reducao-emissoes-carbono'
        }
      ].filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      setSearchResults(mockResults);
      setIsLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchTerm]);
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-20"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 500 }}
          className="bg-white dark:bg-dark-800 w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4 border-b border-gray-200 dark:border-dark-600 flex items-center">
            <FaSearch className="text-gray-400 mr-3" />
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar notícias, categorias, tópicos..."
              className="flex-grow bg-transparent border-none outline-none text-gray-800 dark:text-white placeholder:text-gray-400"
            />
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
            >
              <FaTimes className="text-gray-500 dark:text-gray-400" />
            </button>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="p-6 text-center">
                <div className="inline-block w-6 h-6 border-2 border-t-primary-600 border-r-primary-600 border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                <p className="mt-2 text-gray-500 dark:text-gray-400">Buscando resultados...</p>
              </div>
            ) : searchTerm.length < 2 ? (
              <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                Digite pelo menos 2 caracteres para buscar
              </div>
            ) : searchResults.length === 0 ? (
              <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                Nenhum resultado encontrado para "{searchTerm}"
              </div>
            ) : (
              <div className="p-2">
                {searchResults.map((result) => (
                  <Link 
                    key={result.id} 
                    href={`/noticia/${result.slug}`}
                    onClick={onClose}
                    passHref
                  >
                    <div className="p-3 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors cursor-pointer">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-800 dark:text-white">{result.title}</h4>
                        <span className="text-xs px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 rounded-full">
                          {result.category}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
          
          <div className="p-4 border-t border-gray-200 dark:border-dark-600 text-xs text-gray-500 dark:text-gray-400">
            Pressione ESC para fechar ou clique fora do modal
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SearchModal;
