import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

// Importar componentes do arquivo de barril
import { 
  CategoriasSurf, 
  PrevisaoOndas, 
  LoadingSpinner, 
  ErrorMessage 
} from './';

import { FaArrowRight, FaCalendarAlt, FaMapMarkerAlt, FaUser, FaSearch, FaChevronRight } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { getNewsList, NewsItem } from '../utils/api-client';

// Aliases para mapeamento de campos no frontend
interface NewsItemFormatted {
  id: number;
  titulo: string; // title na API
  slug: string;
  resumo: string; // excerpt na API
  imagem: string; // image_url na API
  categoria: string; // category_name na API
  local?: string; // campo adicional
  data: string; // created_at na API
  autor: string; // author_name na API
  visualizacoes: number; // view_count na API
  content?: string;
}

// Converte NewsItem da API para o formato usado pelo frontend
const formatNewsItem = (item: NewsItem, local?: string): NewsItemFormatted => ({
  id: item.id,
  titulo: item.title,
  slug: item.slug,
  resumo: item.excerpt,
  imagem: item.image_url || '/images/default-news.jpg',
  categoria: item.category_name,
  local,
  data: item.created_at,
  autor: item.author_name || 'Editor JornalK1',
  visualizacoes: item.view_count || 0,
  content: item.content
});

// Função para formatar data
const formatarData = (data: string) => {
  const dataObj = new Date(data);
  return new Intl.DateTimeFormat('pt-BR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(dataObj);
};

// Componente da página inicial
const HomePage: React.FC = () => {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [searchQuery, setSearchQuery] = useState('');
  
  // Estados para armazenar dados dinâmicos
  const [noticiasDestaque, setNoticiasDestaque] = useState<NewsItemFormatted[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [noticiasRecentes, setNoticiasRecentes] = useState<NewsItemFormatted[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Buscar dados das notícias
  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Buscar notícias em destaque (featured = true)
      const featuredResponse = await getNewsList({ featured: true, limit: 3 });
      
      if (featuredResponse.success) {
        // Mapear para o formato esperado pelo componente
        const destaque = featuredResponse.data.map(item => 
          formatNewsItem(item, item.category_name === 'Destinos' ? item.excerpt.split(',')[0] : 'Brasil')
        );
        
        setNoticiasDestaque(destaque);
      } else {
        setError('Erro ao carregar notícias em destaque');
      }
      
      // Buscar notícias recentes (não destacadas, limite de 4)
      const recentResponse = await getNewsList({ limit: 4, offset: 0 });
      
      if (recentResponse.success) {
        setNoticiasRecentes(recentResponse.data.map(item => formatNewsItem(item)));
      } else {
        setError('Erro ao carregar notícias recentes');
      }
    } catch (err) {
      console.error('Erro ao buscar dados:', err);
      setError('Ocorreu um erro ao carregar as notícias. Tente novamente mais tarde.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Executar a busca de dados ao montar o componente
  useEffect(() => {
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Alternar entre as notícias em destaque automaticamente
  useEffect(() => {
    // Só iniciar o intervalo se houver notícias para mostrar
    if (noticiasDestaque.length > 0) {
      const interval = setInterval(() => {
        setActiveIndex((current) => (current + 1) % noticiasDestaque.length);
      }, 8000);
      
      return () => clearInterval(interval);
    }
  }, [noticiasDestaque.length]);
  
  // Função para alternar a exibição da barra de pesquisa
  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setTimeout(() => {
        document.getElementById('search-input')?.focus();
      }, 100);
    }
  };
  
  // Função para lidar com a pesquisa
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (searchQuery.trim()) {
      // Navegar para a página de pesquisa
      router.push({
        pathname: '/pesquisa',
        query: { q: searchQuery }
      });
    }
  };
  // handleSearch é usado no formulário de pesquisa na seção do banner

  // Se estiver carregando ou com erro, mostra apenas esses estados
  if (isLoading) {
    return (
      <div className="py-16 flex justify-center items-center min-h-[50vh]">
        <LoadingSpinner size="large" color="primary" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="py-16 container mx-auto px-4">
        <ErrorMessage 
          message={error} 
          variant="alert" 
          onRetry={() => window.location.reload()} 
        />
      </div>
    );
  }

  return (
    <>
      {/* Banner Hero Visual */}
      <section className="relative bg-gradient-to-b from-blue-900/90 to-dark-bg-primary overflow-hidden">
        <div className="container mx-auto px-4 pt-16 pb-8 md:pt-24 md:pb-16 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 z-10 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg">
              Bem-vindo ao <span className="text-blue-300">JornalK1 Surf</span>
            </h1>
            <p className="text-gray-200 text-lg mb-8 max-w-xl">
              Notícias, competições e tudo sobre o mundo do surf em um só lugar
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <Link 
                href="/noticias"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transition-colors shadow-lg inline-flex items-center"
              >
                Ver notícias <FaArrowRight className="ml-2" />
              </Link>
              <button 
                onClick={toggleSearch}
                className="px-6 py-3 bg-transparent border-2 border-gray-500 text-white hover:bg-white/10 hover:border-white rounded-full font-medium transition-colors inline-flex items-center"
              >
                <FaSearch className="mr-2" /> Pesquisar
              </button>
            </div>
          </div>
          
          {/* Imagem decorativa */}
          <div className="md:w-2/5 relative z-10 mt-8 md:mt-0">
            <div className="relative aspect-[4/3] w-full max-w-md mx-auto">
              <Image
                src="/images/surf-hero.webp"
                alt="Surfista em onda"
                width={500}
                height={375}
                className="object-cover rounded-lg shadow-2xl"
                priority
              />
              <div className="absolute -bottom-4 -right-4 bg-blue-600 text-white p-4 rounded-lg shadow-lg">
                <p className="font-bold">As melhores ondas</p>
                <p className="text-sm">Atualizações diárias</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Formas decorativas */}
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-30 bg-gradient-to-l from-blue-400/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-dark-bg-primary to-transparent"></div>
      </section>
      
      {/* Seção de notícias em destaque */}
      <section className="py-16 bg-dark-bg-primary">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold text-white">Notícias em <span className="text-blue-400">Destaque</span></h2>
            <Link 
              href="/noticias" 
              className="text-blue-400 hover:text-blue-300 font-medium inline-flex items-center"
            >
              Ver todas <FaChevronRight className="ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Notícia principal em destaque */}
            <motion.div 
              className="lg:col-span-8 relative"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative overflow-hidden rounded-xl aspect-[16/9] shadow-xl">
                <AnimatePresence mode="wait">
                  {noticiasDestaque.length > 0 && (
                    <motion.div
                      key={activeIndex}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="absolute inset-0"
                    >
                      <Image 
                        src={noticiasDestaque[activeIndex]?.imagem || '/images/default-news.jpg'} 
                        alt={noticiasDestaque[activeIndex]?.titulo || 'Notícia em destaque'}
                        width={600}
                        height={400}
                        className="object-cover w-full h-full"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Gradiente de sobreposição */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                
                {/* Conteúdo da notícia */}
                {noticiasDestaque.length > 0 && (
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeIndex}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      >
                        <div className="mb-3">
                          <span className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-full">
                            {noticiasDestaque[activeIndex]?.categoria || 'Notícia'}
                          </span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                          {noticiasDestaque[activeIndex]?.titulo || 'Carregando notícia em destaque...'}
                        </h2>
                        <p className="text-gray-200 mb-4 max-w-2xl">
                          {noticiasDestaque[activeIndex]?.resumo || 'Aguarde enquanto carregamos as notícias mais recentes.'}
                        </p>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300 mb-4">
                          {noticiasDestaque[activeIndex]?.local && (
                            <div className="flex items-center">
                              <FaMapMarkerAlt className="mr-1" />
                              <span>{noticiasDestaque[activeIndex]?.local}</span>
                            </div>
                          )}
                          <div className="flex items-center">
                            <FaCalendarAlt className="mr-1" />
                            <span>{noticiasDestaque[activeIndex]?.data ? formatarData(noticiasDestaque[activeIndex].data) : 'Data não disponível'}</span>
                          </div>
                          <div className="flex items-center">
                            <FaUser className="mr-1" />
                            <span>{noticiasDestaque[activeIndex]?.autor || 'Autor desconhecido'}</span>
                          </div>
                        </div>
                        <Link 
                          href={`/noticia/${noticiasDestaque[activeIndex]?.slug || '#'}`}
                          className="inline-flex items-center px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full transition-colors"
                        >
                          Ler matéria completa <FaArrowRight className="ml-2" />
                        </Link>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                )}
                
                {/* Controles de navegação */}
                {noticiasDestaque.length > 0 && (
                  <div className="absolute bottom-6 right-6 flex space-x-2">
                    {noticiasDestaque.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveIndex(index)}
                        className={`w-3 h-3 rounded-full transition-colors ${index === activeIndex ? 'bg-blue-500' : 'bg-white/50 hover:bg-white/80'}`}
                        aria-label={`Ver notícia ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
            
            {/* Notícias secundárias */}
            <div className="lg:col-span-4 flex flex-col space-y-6">
              {noticiasDestaque.length > 0 && noticiasDestaque.filter((_, index) => index !== activeIndex).map((noticia, index) => (
                <motion.article 
                  key={noticia.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-dark-bg-secondary rounded-lg overflow-hidden shadow-md group hover:shadow-lg transition-shadow"
                >
                  <Link href={`/noticia/${noticia.slug}`} className="block">
                    <div className="relative h-40 overflow-hidden">
                      <Image 
                        src={noticia.imagem} 
                        alt={noticia.titulo}
                        width={300}
                        height={200}
                        className="object-cover w-full h-full transform transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-0 left-0 m-3">
                        <span className="px-2 py-1 bg-blue-800/50 text-blue-200 text-xs font-medium rounded-md">
                          {noticia.categoria}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                        {noticia.titulo}
                      </h3>
                      <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                        {noticia.resumo}
                      </p>
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <div className="flex items-center">
                          <FaCalendarAlt className="mr-1" />
                          <span>{formatarData(noticia.data)}</span>
                        </div>
                        <div className="flex items-center">
                          <FaUser className="mr-1" />
                          <span>{noticia.autor}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Seção de categorias de surf */}
      <CategoriasSurf />
      
      {/* Seção de previsão de ondas */}
      <PrevisaoOndas />
      
      {/* Call to action */}
      <section className="py-16 bg-blue-900/80">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-xl py-12 px-6 shadow-xl border border-blue-700/50">
            <h2 className="text-3xl font-bold text-white mb-4">Não perca nenhuma atualização</h2>
            <p className="text-blue-100/80 max-w-2xl mx-auto">Fique por dentro dos últimos acontecimentos do mundo do surf e receba conteúdo exclusivo diretamente no seu e-mail.</p>
            <form className="mt-8 max-w-md mx-auto flex flex-col sm:flex-row gap-3">
              <input 
                type="email" 
                placeholder="Seu melhor e-mail" 
                className="flex-1 px-4 py-3 bg-white/10 border border-blue-700 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <button 
                type="submit" 
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transition-colors"
              >
                Inscrever-se
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
