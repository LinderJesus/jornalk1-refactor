import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { OptimizedImage, SmartLink, LoadingSpinner, ErrorMessage } from '../components';
import { FaCalendarAlt, FaUser, FaEye, FaSearch, FaTimes, FaFilter } from 'react-icons/fa';
import axios from 'axios';

// Definindo interfaces para os dados
interface Noticia {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content?: string;
  image_url: string;
  category_id: number;
  category_name: string;
  created_at: string;
  view_count: number;
  comment_count?: number;
  author_name: string;
  type: string;
}

interface NoticiaFormatada {
  id: number;
  titulo: string;
  slug: string;
  resumo: string;
  imagem: string;
  categoriaId: number;
  categoria: string;
  data: string;
  visualizacoes: number;
  comentarios: number;
  autor: string;
  tipo: string;
}

interface Categoria {
  id: number;
  name: string;
  slug: string;
}

// Tipos de conteúdo
const tipos = [
  { id: 'noticia', nome: 'Notícias' },
  { id: 'dica', nome: 'Dicas' }
];

const formatarData = (dataString: string) => {
  const data = new Date(dataString);
  return data.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

const PesquisaPage = () => {
  const router = useRouter();
  
  // Parâmetros da URL
  const { q: queryParam } = router.query;
  
  // Estados para busca e filtros
  const [termoBusca, setTermoBusca] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState<number | null>(null);
  const [tipoFiltro, setTipoFiltro] = useState<string | null>(null);
  const [ordenacao, setOrdenacao] = useState('recentes'); // Usado para ordenar os resultados
  const [resultados, setResultados] = useState<NoticiaFormatada[]>([]);
  const [filtrosVisiveis, setFiltrosVisiveis] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  
  // Carregar categorias ao iniciar
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await axios.get('/api/categories');
        setCategorias(response.data);
      } catch (err) {
        console.error('Erro ao carregar categorias:', err);
      }
    };
    
    fetchCategorias();
  }, []);
  
  // Formatar notícia da API para o formato de exibição
  const formatarNoticia = (noticia: Noticia): NoticiaFormatada => ({
    id: noticia.id,
    titulo: noticia.title,
    slug: noticia.slug,
    resumo: noticia.excerpt,
    imagem: noticia.image_url || '/images/default-news.jpg',
    categoriaId: noticia.category_id,
    categoria: noticia.category_name,
    data: noticia.created_at,
    visualizacoes: noticia.view_count || 0,
    comentarios: noticia.comment_count || 0,
    autor: noticia.author_name || 'Editor JornalK1',
    tipo: noticia.type || 'noticia'
  });
  
  // Buscar dados da API com base nos filtros
  const buscarDados = useCallback(async (termo: string, categoria?: number, tipo?: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Preparar parâmetros de consulta
      const params: Record<string, string | number> = {
        search: termo,
        limit: 20
      };
      
      if (categoria) {
        params.categoryId = categoria;
      }
      
      // Chamar API
      const response = await axios.get('/api/news', { params });
      
      // Verificar resposta e formatar dados
      if (response.data.success) {
        const noticias: Noticia[] = response.data.data || [];
        const noticiasFormatadas = noticias.map(formatarNoticia);
        
        // Filtrar por tipo se necessário - isso é feito no cliente pois a API não suporta filtragem por tipo
        const resultadosFiltrados = tipo
          ? noticiasFormatadas.filter(item => item.tipo === tipo)
          : noticiasFormatadas;
          
        setResultados(resultadosFiltrados);
      } else {
        setResultados([]);
        setError('Erro ao buscar dados. Por favor, tente novamente.');
      }
    } catch (err) {
      console.error('Erro na busca:', err);
      setError('Ocorreu um erro ao processar sua busca. Por favor, tente novamente.');
      setResultados([]);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Buscar com o termo da URL e definir estado inicial
  useEffect(() => {
    if (queryParam && typeof queryParam === 'string') {
      setTermoBusca(queryParam);
      buscarDados(queryParam, categoriaFiltro || undefined, tipoFiltro || undefined);
    }
  }, [queryParam, buscarDados, categoriaFiltro, tipoFiltro]);
  
  // Aplicar ordenação quando os resultados ou critério de ordenação mudam
  useEffect(() => {
    if (resultados.length > 0) {
      const ordenados = [...resultados];
      
      // Aplicar ordenação sem modificar o array original
      const resultadosOrdenados = ordenados.sort((a, b) => {
        if (ordenacao === 'recentes') {
          return new Date(b.data).getTime() - new Date(a.data).getTime();
        } else if (ordenacao === 'antigos') {
          return new Date(a.data).getTime() - new Date(b.data).getTime();
        } else if (ordenacao === 'populares') {
          return b.visualizacoes - a.visualizacoes;
        } else {
          // Alfabética
          return a.titulo.localeCompare(b.titulo);
        }
      });
      
      // Evita loops infinitos usando um stringify para comparação
      const stringAtual = JSON.stringify(resultados);
      const stringNovo = JSON.stringify(resultadosOrdenados);
      
      if (stringAtual !== stringNovo) {
        setResultados(resultadosOrdenados);
      }
    }
  }, [ordenacao, resultados]);
  
  // Manipulador para o formulário de busca
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Atualizar URL com o termo de busca para permitir compartilhamento
    router.push(`/pesquisa?q=${encodeURIComponent(termoBusca)}`, undefined, { shallow: true });
    // Realizar busca com filtros
    buscarDados(termoBusca, categoriaFiltro || undefined, tipoFiltro || undefined);
  };
  
  // Limpar todos os filtros
  const limparFiltros = () => {
    setTermoBusca('');
    setCategoriaFiltro(null);
    setTipoFiltro(null);
  };

  return (
    <Layout>
      <NextSeo
        title={`Pesquisa${termoBusca ? ` - ${termoBusca}` : ''} | JornalK1`}
        description="Pesquise notícias, dicas e conteúdos no JornalK1"
        noindex={true}
      />

      <div className="container mx-auto px-4 py-8">
        <motion.h1 
          className="text-3xl md:text-4xl font-bold mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Pesquisa
        </motion.h1>

        {/* Formulário de busca */}
        <motion.div 
          className="max-w-3xl mx-auto mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <form onSubmit={handleSubmit} className="relative">
            <input
              type="text"
              placeholder="O que você está procurando?"
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
              className="w-full py-4 px-6 pl-12 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-800 focus:outline-none focus:ring-2 focus:ring-primary-500 text-lg"
            />
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
            
            {termoBusca && (
              <button
                type="button"
                onClick={() => setTermoBusca('')}
                className="absolute right-20 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                aria-label="Limpar busca"
              >
                <FaTimes />
              </button>
            )}
            
            <button
              type="button"
              onClick={() => setFiltrosVisiveis(!filtrosVisiveis)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl"
              aria-label="Filtros"
            >
              <FaFilter />
            </button>
          </form>
          
          {/* Filtros */}
          {filtrosVisiveis && (
            <motion.div 
              className="mt-4 p-4 bg-white dark:bg-dark-800 rounded-lg shadow-md"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-wrap justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Filtros</h3>
                <button
                  type="button"
                  onClick={limparFiltros}
                  className="text-sm text-primary-600 hover:text-primary-800 dark:hover:text-primary-400"
                >
                  Limpar filtros
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="col">
                  <label htmlFor="categoria-select" className="block text-sm font-medium mb-1">Categoria</label>
                  <select
                    id="categoria-select"
                    value={categoriaFiltro || ''}
                    onChange={(e) => setCategoriaFiltro(e.target.value ? Number(e.target.value) : null)}
                    className="w-full p-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-900"
                  >
                    <option value="">Todas as categorias</option>
                    {categorias.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col">
                  <label htmlFor="tipo-select" className="block text-sm font-medium mb-1">Tipo</label>
                  <select
                    id="tipo-select"
                    value={tipoFiltro || ''}
                    onChange={(e) => setTipoFiltro(e.target.value || null)}
                    className="w-full p-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-900"
                  >
                    <option value="">Todos os tipos</option>
                    {tipos.map(tipo => (
                      <option key={tipo.id} value={tipo.id}>
                        {tipo.nome}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col">
                  <label htmlFor="ordenacao-select" className="block text-sm font-medium mb-1">Ordenar por</label>
                  <select
                    id="ordenacao-select"
                    value={ordenacao}
                    onChange={(e) => setOrdenacao(e.target.value)}
                    className="w-full p-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-900"
                  >
                    <option value="recentes">Mais recentes</option>
                    <option value="antigos">Mais antigos</option>
                    <option value="populares">Mais populares</option>
                    <option value="alfabetica">Ordem alfabética</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Filtros ativos */}
          {(categoriaFiltro || tipoFiltro) && (
            <div className="flex flex-wrap gap-2 mt-4">
              {categoriaFiltro && (
                <div className="inline-flex items-center bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 rounded-full px-3 py-1 text-sm">
                  <span>Categoria: {categorias.find(c => c.id === categoriaFiltro)?.name}</span>
                  <button
                    onClick={() => setCategoriaFiltro(null)}
                    className="ml-2 text-primary-600 hover:text-primary-800 dark:hover:text-primary-400"
                  >
                    <FaTimes size={12} />
                  </button>
                </div>
              )}
              
              {tipoFiltro && (
                <div className="inline-flex items-center bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 rounded-full px-3 py-1 text-sm">
                  <span>Tipo: {tipos.find(t => t.id === tipoFiltro)?.nome}</span>
                  <button
                    onClick={() => setTipoFiltro(null)}
                    className="ml-2 text-primary-600 hover:text-primary-800 dark:hover:text-primary-400"
                  >
                    <FaTimes size={12} />
                  </button>
                </div>
              )}
            </div>
          )}
        </motion.div>

        {/* Resultados da busca */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {/* Estado de erro */}
          {error && (
            <div className="mb-8">
              <ErrorMessage 
                message={error} 
                variant="alert" 
                onRetry={() => buscarDados(termoBusca, categoriaFiltro || undefined, tipoFiltro || undefined)} 
              />
            </div>
          )}
          
          {/* Estado de carregamento */}
          {isLoading && (
            <div className="py-12 flex justify-center items-center">
              <LoadingSpinner size="large" color="primary" />
            </div>
          )}
          
          {/* Seção de filtros */}
          {resultados.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resultados.map((item, index) => (
                <motion.article
                  key={item.id}
                  className="bg-white dark:bg-dark-800 rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg flex flex-col"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="relative h-48">
                    <OptimizedImage
                      src={item.imagem}
                      alt={item.titulo}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                        item.tipo === 'noticia' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-green-600 text-white'
                      }`}>
                        {item.tipo === 'noticia' ? 'Notícia' : 'Dica'}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 flex-grow">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                      <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 mr-2">
                        {item.categoria}
                      </span>
                      <FaCalendarAlt className="mr-1" />
                      <span>{formatarData(item.data)}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2 line-clamp-2">{item.titulo}</h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">{item.resumo}</p>
                  </div>
                  <div className="px-4 pb-4 mt-auto">
                    <div className="flex justify-between items-center mb-3 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <FaUser className="mr-1" />
                        <span>{item.autor}</span>
                      </div>
                      <div className="flex items-center">
                        <FaEye className="mr-1" />
                        <span>{item.visualizacoes.toLocaleString()}</span>
                      </div>
                    </div>
                    <SmartLink
                      href={`/${item.tipo === 'noticia' ? 'noticia' : 'dicas'}/${item.slug}`}
                      className="inline-block w-full text-center bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded transition-colors"
                    >
                      Ler mais
                    </SmartLink>
                  </div>
                </motion.article>
              ))}
            </div>
          ) : termoBusca ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Não encontramos resultados para sua busca. Tente outros termos ou navegue pelas categorias.
              </p>
              <SmartLink
                href="/categorias"
                className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-6 rounded transition-colors"
              >
                Ver categorias
              </SmartLink>
            </div>
          ) : termoBusca === '' ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Digite um termo de busca para encontrar notícias, dicas e outros conteúdos.
              </p>
              <div className="flex flex-wrap justify-center gap-4 mt-6">
                <h2 className="text-2xl font-bold mb-8">Resultados da busca{termoBusca ? `: "${termoBusca}"` : ''}</h2>
                {['tecnologia', 'saúde', 'economia', 'educação', 'concursos', 'investimentos'].map(termo => (
                  <button
                    key={termo}
                    onClick={() => setTermoBusca(termo)}
                    className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-4 py-2 rounded-full transition-colors"
                  >
                    {termo}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Nenhum resultado encontrado.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </Layout>
  );
};

export default PesquisaPage;
