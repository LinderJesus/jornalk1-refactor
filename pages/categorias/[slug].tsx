import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import { NextSeo } from 'next-seo';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { OptimizedImage, LoadingSpinner, ErrorMessage } from '../../components';
import { FaCalendarAlt, FaUser, FaEye, FaComment, FaSearch, FaTimes, FaArrowRight } from 'react-icons/fa';
import axios from 'axios';

// Definindo os tipos de dados para a API
interface Categoria {
  id: number;
  nome: string;
  slug: string;
  descricao: string;
  imagem: string;
  cor: string;
}

interface Noticia {
  id: number;
  titulo: string;
  slug: string;
  resumo: string;
  conteudo: string;
  imagem: string;
  categoriaId: number;
  data: string;
  visualizacoes: number;
  comentarios: number;
  autor: string;
  destaque: boolean;
}

// Mapeia cores para categorias com base no slug para manter consistência visual
const getCategoryColor = (slug: string): string => {
  const colorMap: Record<string, string> = {
    'competicoes': 'bg-blue-600',
    'equipamentos': 'bg-teal-600',
    'destinos': 'bg-purple-600',
    'tecnicas': 'bg-green-600',
    'sustentabilidade': 'bg-yellow-600',
    'cultura': 'bg-orange-600',
    'noticias': 'bg-red-600'
  };
  
  return colorMap[slug] || 'bg-gray-600';
};

const formatarData = (dataString: string) => {
  const data = new Date(dataString);
  return data.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

interface CategoriaProps {
  categoria: Categoria;
  noticias: Noticia[];
  error?: string;
}

// Usamos getServerSideProps para buscar dados atualizados na API
export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  try {
    const { slug } = params as { slug: string };
    
    // Buscar informações da categoria
    const categoriaResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/categories`);
    const categorias = categoriaResponse.data;
    
    const categoria = categorias.find((cat: Categoria) => cat.slug === slug);
    
    if (!categoria) {
      return {
        notFound: true
      };
    }
    
    // Buscar notícias da categoria
    const noticiasResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/news`, {
      params: {
        categoryId: categoria.id,
        limit: 10
      }
    });
    
    const noticias = noticiasResponse.data.data || [];
    
    // Adicionar cor à categoria
    const categoriaWithColor = {
      ...categoria,
      cor: getCategoryColor(slug)
    };
    
    return {
      props: {
        categoria: categoriaWithColor,
        noticias
      }
    };
  } catch (error) {
    console.error('Erro ao buscar dados da categoria:', error);
    return {
      props: {
        error: 'Não foi possível carregar as informações da categoria. Tente novamente mais tarde.',
        categoria: null,
        noticias: []
      }
    };
  }
};

const CategoriaDetalhePage = ({ categoria, noticias, error }: CategoriaProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Renderizar estado de erro
  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <ErrorMessage
            message={error}
            variant="alert"
            onRetry={() => window.location.reload()}
          />
        </div>
      </Layout>
    );
  }
  
  // Renderizar estado de carregamento se não tiver categoria
  if (!categoria) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 flex justify-center items-center min-h-[50vh]">
          <LoadingSpinner size="large" color="primary" />
        </div>
      </Layout>
    );
  }
  
  // Filtrar notícias com base na pesquisa
  const noticiasFiltradas = noticias.filter(noticia => 
    noticia.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    noticia.resumo.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Separar notícia em destaque (a primeira) das demais
  const noticiaDestaque = noticiasFiltradas[0];
  const noticiasRegulares = noticiasFiltradas.slice(1);
  
  // Se não houver notícias após filtragem
  const semResultados = noticiasFiltradas.length === 0;

  // Variantes de animação
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4 }
    }
  };

  return (
    <Layout>
      <NextSeo 
        title={`${categoria.nome} | JornalK1 Surf`}
        description={categoria.descricao}
        openGraph={{
          title: `${categoria.nome} | JornalK1 Surf`,
          description: categoria.descricao,
          images: [
            {
              url: `https://jornalk1surf.com.br${categoria.imagem}`,
              width: 1200,
              height: 630
            }
          ]
        }}
      />
      <motion.div 
        className="container mx-auto p-4 pt-6 md:p-6 lg:p-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        variants={containerVariants}
      >
        <div className="flex flex-wrap justify-between mb-12">
          <div className="w-full md:w-1/2 xl:w-1/3 mb-6 md:mb-0">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 text-gray-800 dark:text-white">
              {categoria.nome}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl">
              {categoria.descricao}
            </p>
          </div>
          {/* Campo de busca */}
          <div className="w-full md:w-auto mt-6 md:mt-0">
            <div className="relative max-w-md mx-auto md:mx-0">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar nesta categoria..."
                className="pl-10 pr-4 py-3 w-full md:w-80 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white transition-colors"
              />
              <button 
                className="absolute inset-y-0 right-0 px-4 text-blue-600 hover:text-blue-800 transition-colors"
                onClick={() => setSearchQuery('')}
                aria-label="Limpar busca"
              >
                {searchQuery && <FaTimes />}
              </button>
            </div>
          </div>
        </div>
        {semResultados ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-2">Nenhuma notícia encontrada</h2>
            <p className="text-gray-600 dark:text-gray-400">Tente outro termo de busca ou volte mais tarde para novas notícias.</p>
          </div>
        ) : (
          <>
            {/* Notícia em destaque */}
            {noticiaDestaque && (
              <motion.div 
                className="mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-gray-200 dark:border-gray-700">Em Destaque</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="relative h-96 rounded-lg overflow-hidden">
                    <OptimizedImage
                      src={noticiaDestaque.imagem}
                      alt={noticiaDestaque.titulo}
                      width={600}
                      height={400}
                      className="object-cover"
                      priority
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                      <FaCalendarAlt className="mr-1" />
                      <span>{formatarData(noticiaDestaque.data)}</span>
                      <span className="mx-2">•</span>
                      <FaUser className="mr-1" />
                      <span>{noticiaDestaque.autor}</span>
                    </div>
                    <h2 className="text-2xl font-bold mb-3">{noticiaDestaque.titulo}</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{noticiaDestaque.resumo}</p>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <FaEye className="mr-1" />
                      <span>{noticiaDestaque.visualizacoes.toLocaleString()}</span>
                      <span className="mx-2">•</span>
                      <FaComment className="mr-1" />
                      <span>{noticiaDestaque.comentarios}</span>
                    </div>
                    <Link 
                      href={`/noticias/${noticiaDestaque.slug}`}
                      className="inline-block mt-4 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                    >
                      Ler mais <FaArrowRight className="inline ml-1" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
            {/* Lista de notícias regulares */}
            {noticiasRegulares.length > 0 && (
              <div className="mt-12">
                <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-gray-200 dark:border-gray-700">Últimas Notícias</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {noticiasRegulares.map((noticia) => (
                    <motion.article 
                      key={noticia.id}
                      className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
                      variants={itemVariants}
                    >
                      <div className="relative h-48">
                        <OptimizedImage
                          src={noticia.imagem}
                          alt={noticia.titulo}
                          width={400}
                          height={250}
                          className="object-cover"
                        />
                      </div>
                      <div className="p-6">
                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-2">
                          <FaCalendarAlt className="mr-1" />
                          <span>{formatarData(noticia.data)}</span>
                        </div>
                        <h3 className="text-xl font-semibold mb-2 line-clamp-2">{noticia.titulo}</h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">{noticia.resumo}</p>
                        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center">
                            <FaEye className="mr-1" />
                            <span>{noticia.visualizacoes.toLocaleString()}</span>
                          </div>
                          <Link 
                            href={`/noticias/${noticia.slug}`}
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium flex items-center"
                          >
                            Ler mais <FaArrowRight className="ml-1 text-xs" />
                          </Link>
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </motion.div>
    </Layout>
  );
};
export default CategoriaDetalhePage;
