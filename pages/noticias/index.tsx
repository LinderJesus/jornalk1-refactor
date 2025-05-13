import React, { useState, useEffect, useCallback } from 'react';
import { NextSeo } from 'next-seo';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaFilter, FaTags, FaArrowUp } from 'react-icons/fa';
import axios from 'axios';
import { Layout, NewsCard, ErrorMessage, LoadingSpinner } from '../../components';
import { NewsArticle, Category } from '../../types';

// Animações

// Animações
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const NewsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<NewsArticle[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  const itemsPerPage = 6;

  // Apply client-side filtering and sorting - using useCallback to memoize the function
  const filterAndSortArticles = useCallback((articlesToFilter: NewsArticle[]) => {
    let result = [...articlesToFilter];
    // Filter by search term
    if (searchTerm) {
      result = result.filter(article => 
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    // Sort articles
    result = result.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortBy === 'oldest') {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sortBy === 'alphabetical') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
    setFilteredArticles(result);
  }, [searchTerm, sortBy]);

  // Fetch news with filters - using useCallback to memoize the function
  const fetchNews = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Prepare query parameters
      const params: Record<string, string | number> = {
        limit: itemsPerPage,
        offset: (currentPage - 1) * itemsPerPage
      };
      // Add category filter if selected
      if (selectedCategoryId) {
        params.categoryId = selectedCategoryId;
      }
      // Call API with params
      const response = await axios.get('/api/news', { params });
      const newsData = response.data;
      setArticles(newsData);
      // Apply client-side filtering and sorting
      filterAndSortArticles(newsData);
    } catch (err) {
      console.error('Error fetching news:', err);
      setError('Ocorreu um erro ao carregar as notícias. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, itemsPerPage, selectedCategoryId, filterAndSortArticles]);

  // Fetch categories and news
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch categories
        const categoriesResponse = await axios.get('/api/categories');
        const categoriesData = categoriesResponse.data;
        setCategories(categoriesData);
        
        // Fetch news articles (initially without category filter)
        await fetchNews();
      } catch (err) {
        console.error('Error fetching initial data:', err);
        setError('Ocorreu um erro ao carregar os dados. Por favor, tente novamente.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [fetchNews]);


  
  // Effect to update when filters change
  useEffect(() => {
    if (articles.length > 0) {
      filterAndSortArticles(articles);
    }
  }, [articles, filterAndSortArticles]);
  
  // Effect to fetch new data when page or category changes
  useEffect(() => {
    if (!isLoading) {
      fetchNews();
    }
  }, [fetchNews, isLoading]);

  // Calculate total pages
  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);

  // Scroll to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [fetchNews]);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  
  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle category change
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    if (category === 'Todas') {
      setSelectedCategoryId(null);
    } else {
      const selectedCat = categories.find(cat => cat.name === category);
      setSelectedCategoryId(selectedCat ? selectedCat.id : null);
    }
    setCurrentPage(1); // Reset to first page when changing category
  };

  // Handle sort change
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  };

  return (
    <Layout>
      <NextSeo 
        title="Notícias | JornalK1 Surf"
        description="Acompanhe as últimas notícias sobre surf, competições, atletas e muito mais no portal JornalK1 Surf."
        canonical="https://jornalk1surf.com.br/noticias"
        openGraph={{
          title: 'Notícias | JornalK1 Surf',
          description: 'Acompanhe as últimas notícias sobre surf, competições, atletas e muito mais.',
          url: 'https://jornalk1surf.com.br/noticias',
        }}
      />
      
      {/* Header */}
      <div className="bg-primary-600 dark:bg-primary-700 text-white">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-4xl">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Notícias</h1>
            <p className="text-lg text-white/90 max-w-3xl">
              Acompanhe as últimas notícias sobre o mundo do surf, campeonatos, atletas e muito mais.
            </p>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <div className="mb-8">
          <nav className="text-sm text-gray-500 dark:text-gray-400 flex flex-wrap items-center">
            <Link href="/" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              Home
            </Link>
            <span className="mx-2 text-gray-400 dark:text-gray-600">/</span>
            <span className="text-gray-700 dark:text-gray-300">Notícias</span>
          </nav>
        </div>
        
        {/* Filters */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 bg-white dark:bg-dark-700 rounded-xl shadow-md p-6 transition-colors duration-200"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-grow max-w-xl">
              <input
                type="text"
                placeholder="Buscar notícias..."
                className="w-full py-2 pl-10 pr-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-600 dark:text-white transition-colors"
                value={searchTerm}
                onChange={handleSearch}
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                  <FaTags />
                  <span>Categoria:</span>
                </div>
                <div className="mt-1 flex flex-wrap gap-2">
                  <motion.button
                    key="Todas"
                    onClick={() => handleCategoryChange('Todas')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-3 py-1 text-sm rounded-full transition-colors ${selectedCategory === 'Todas'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 dark:bg-dark-600 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-500'
                    }`}
                  >
                    Todas
                  </motion.button>
                  {categories.map((category) => (
                    <motion.button
                      key={category.id}
                      onClick={() => handleCategoryChange(category.name)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-3 py-1 text-sm rounded-full transition-colors ${selectedCategory === category.name
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 dark:bg-dark-600 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-500'
                      }`}
                    >
                      {category.name}
                    </motion.button>
                  ))}
                </div>
              </div>
              
              <div className="relative">
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                  <FaFilter />
                  <span>Ordenar por:</span>
                </div>
                <select
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm dark:text-white transition-colors"
                  value={sortBy}
                  onChange={handleSortChange}
                >
                  <option value="newest">Mais recentes</option>
                  <option value="oldest">Mais antigos</option>
                  <option value="alphabetical">Alfabética</option>
                </select>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <div className="min-h-[400px] flex items-center justify-center">
            <LoadingSpinner />
          </div>
        )}
        
        {/* Error State */}
        {error && !isLoading && (
          <div className="min-h-[300px] flex items-center justify-center">
            <ErrorMessage 
              message={error} 
              variant="alert" 
              onRetry={fetchNews} 
            />
          </div>
        )}
        
        {/* Articles */}
        {!isLoading && !error && filteredArticles.length > 0 ? (
          <>
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
            >
              <AnimatePresence>
                {filteredArticles.map((article) => (
                  <motion.div 
                    key={article.id} 
                    variants={fadeInUp}
                    exit={{ opacity: 0, y: 20 }}
                    className="transition-all duration-300"
                  >
                    <NewsCard article={article} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center">
                <nav className="flex items-center space-x-2">
                  <button 
                    onClick={() => paginate(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={`px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-600 transition-colors ${
                      currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    Anterior
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                    <button
                      key={number}
                      onClick={() => paginate(number)}
                      className={`px-3 py-2 rounded-md transition-colors ${
                        currentPage === number
                          ? 'bg-primary-600 text-white'
                          : 'border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-600'
                      }`}
                    >
                      {number}
                    </button>
                  ))}
                  
                  <button 
                    onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-600 transition-colors ${
                      currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    Próxima
                  </button>
                </nav>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white dark:bg-dark-700 rounded-xl shadow-md p-8 text-center transition-colors duration-200">
            <div className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Nenhuma notícia encontrada</h3>
            <p className="text-gray-600 dark:text-gray-400">Não encontramos notícias que correspondam à sua busca. Tente outros termos ou remova os filtros.</p>
            {selectedCategory !== 'Todas' && (
              <button 
                onClick={() => setSelectedCategory('Todas')} 
                className="mt-4 inline-flex items-center text-primary-600 dark:text-primary-400 font-medium"
              >
                Limpar filtros
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
        )}
        
        {/* Newsletter Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16 bg-primary-600 dark:bg-primary-700 rounded-xl overflow-hidden"
        >
          <div className="p-6 md:p-8 text-white">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-6 md:mb-0 md:mr-8 max-w-xl">
                <h3 className="text-2xl font-bold mb-2">Assine nossa newsletter</h3>
                <p className="text-white/80">
                  Receba as últimas notícias e atualizações diretamente na sua caixa de entrada.
                </p>
              </div>
              <div className="w-full md:w-auto">
                <form className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    placeholder="Seu e-mail"
                    className="px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-white/50 bg-white/10 backdrop-blur-sm text-white placeholder:text-white/60 min-w-[250px]"
                    required
                  />
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-6 py-3 bg-white text-primary-600 font-medium rounded-md hover:bg-white/90 transition-colors"
                  >
                    Inscrever-se
                  </motion.button>
                </form>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Scroll to top button */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              onClick={scrollToTop}
              className="fixed bottom-6 right-6 p-3 rounded-full bg-primary-600 text-white shadow-lg hover:bg-primary-700 transition-colors z-50"
              aria-label="Voltar ao topo"
            >
              <FaArrowUp />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
};

export default NewsPage;
