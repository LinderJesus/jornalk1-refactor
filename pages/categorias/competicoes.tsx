import React, { useState } from 'react';
import { NextSeo } from 'next-seo';
import { motion } from 'framer-motion';
import Layout from '../../components/Layout';
import { OptimizedImage, SmartLink } from '../../components';
import { FaCalendarAlt, FaMapMarkerAlt, FaTrophy, FaUser, FaSearch } from 'react-icons/fa';

// Dados de exemplo para competições de surf
const competicoes = [
  {
    id: 1,
    titulo: 'WSL Championship Tour - Etapa Taiti',
    slug: 'wsl-championship-tour-taiti',
    resumo: 'A etapa mais aguardada do circuito mundial, com as ondas perfeitas de Teahupoo desafiando os melhores surfistas do mundo.',
    imagem: '/images/news-1.jpg',
    local: 'Teahupoo, Taiti',
    data: '2025-05-20',
    dataFim: '2025-05-30',
    status: 'Próxima',
    categoria: 'WSL Championship Tour',
    premioTotal: '$1,000,000',
    favoritos: ['Gabriel Medina', 'John John Florence', 'Italo Ferreira']
  },
  {
    id: 2,
    titulo: 'Circuito Brasileiro de Surf Profissional - Etapa Ubatuba',
    slug: 'circuito-brasileiro-ubatuba',
    resumo: 'Os melhores surfistas brasileiros se reúnem em Ubatuba para disputar pontos importantes no ranking nacional.',
    imagem: '/images/news-2.jpg',
    local: 'Praia de Itamambuca, Ubatuba, SP',
    data: '2025-06-05',
    dataFim: '2025-06-08',
    status: 'Próxima',
    categoria: 'Circuito Brasileiro',
    premioTotal: 'R$150,000',
    favoritos: ['Filipe Toledo', 'Tatiana Weston-Webb', 'Yago Dora']
  },
  {
    id: 3,
    titulo: 'Oi Rio Pro - WSL Championship Tour',
    slug: 'oi-rio-pro-wsl',
    resumo: 'A etapa brasileira do circuito mundial promete fortes emoções nas ondas da Barra da Tijuca, com grande torcida para os atletas locais.',
    imagem: '/images/news-3.jpg',
    local: 'Barra da Tijuca, Rio de Janeiro, RJ',
    data: '2025-06-15',
    dataFim: '2025-06-23',
    status: 'Próxima',
    categoria: 'WSL Championship Tour',
    premioTotal: '$1,000,000',
    favoritos: ['Gabriel Medina', 'Filipe Toledo', 'Tatiana Weston-Webb']
  },
  {
    id: 4,
    titulo: 'Challenger Series - Fernando de Noronha',
    slug: 'challenger-series-noronha',
    resumo: 'A nova etapa do Challenger Series em Fernando de Noronha coloca os surfistas em um dos cenários mais paradisíacos do mundo.',
    imagem: '/images/news-4.jpg',
    local: 'Praia do Cachorro, Fernando de Noronha, PE',
    data: '2025-07-10',
    dataFim: '2025-07-17',
    status: 'Próxima',
    categoria: 'WSL Challenger Series',
    premioTotal: '$250,000',
    favoritos: ['Jadson André', 'Alejo Muniz', 'Silvana Lima']
  },
  {
    id: 5,
    titulo: 'Campeonato Brasileiro de Surf Amador',
    slug: 'campeonato-brasileiro-amador',
    resumo: 'A competição reúne os melhores talentos amadores do país, revelando as futuras promessas do surf brasileiro.',
    imagem: '/images/news-5.jpg',
    local: 'Praia de Maresias, São Sebastião, SP',
    data: '2025-07-25',
    dataFim: '2025-07-27',
    status: 'Próxima',
    categoria: 'Amador',
    premioTotal: 'R$50,000',
    favoritos: ['Novos talentos do surf brasileiro']
  },
  {
    id: 6,
    titulo: 'Billabong Pipe Masters',
    slug: 'billabong-pipe-masters',
    resumo: 'A tradicional competição nas ondas de Pipeline, no Havaí, encerra a temporada do Championship Tour com tubos perfeitos.',
    imagem: '/images/news-6.jpg',
    local: 'Pipeline, North Shore, Oahu, Havaí',
    data: '2025-12-08',
    dataFim: '2025-12-20',
    status: 'Futura',
    categoria: 'WSL Championship Tour',
    premioTotal: '$1,000,000',
    favoritos: ['John John Florence', 'Gabriel Medina', 'Kelly Slater']
  }
];

// Competições passadas
const competicoesPast = [
  {
    id: 7,
    titulo: 'Rip Curl Pro Bells Beach',
    slug: 'rip-curl-pro-bells-beach',
    resumo: 'A tradicional etapa australiana foi vencida pelo brasileiro Italo Ferreira, que tocou o sino pela segunda vez na carreira.',
    imagem: '/images/news-1.jpg',
    local: 'Bells Beach, Victoria, Austrália',
    data: '2025-04-01',
    dataFim: '2025-04-11',
    status: 'Concluída',
    categoria: 'WSL Championship Tour',
    premioTotal: '$1,000,000',
    resultado: {
      campeao: 'Italo Ferreira',
      segundo: 'Filipe Toledo',
      terceiro: 'John John Florence'
    }
  },
  {
    id: 8,
    titulo: 'Margaret River Pro',
    slug: 'margaret-river-pro',
    resumo: 'Nas poderosas ondas da Austrália Ocidental, Tatiana Weston-Webb conquistou sua primeira vitória na temporada.',
    imagem: '/images/news-2.jpg',
    local: 'Margaret River, Austrália Ocidental',
    data: '2025-04-20',
    dataFim: '2025-04-30',
    status: 'Concluída',
    categoria: 'WSL Championship Tour',
    premioTotal: '$1,000,000',
    resultado: {
      campeao: 'Tatiana Weston-Webb',
      segundo: 'Carissa Moore',
      terceiro: 'Caroline Marks'
    }
  }
];

// Categorias de competições
const categoriasFiltro = [
  { id: 'todas', nome: 'Todas as competições' },
  { id: 'wsl', nome: 'WSL Championship Tour' },
  { id: 'challenger', nome: 'WSL Challenger Series' },
  { id: 'brasileiro', nome: 'Circuito Brasileiro' },
  { id: 'amador', nome: 'Competições Amadoras' }
];

// Função para formatar data
const formatarData = (dataString: string) => {
  const data = new Date(dataString);
  return data.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

// Função para formatar período
const formatarPeriodo = (dataInicio: string, dataFim: string) => {
  const inicio = new Date(dataInicio);
  const fim = new Date(dataFim);
  
  const diaInicio = inicio.getDate();
  const diaFim = fim.getDate();
  const mesInicio = inicio.toLocaleDateString('pt-BR', { month: 'short' });
  const mesFim = fim.toLocaleDateString('pt-BR', { month: 'short' });
  const anoInicio = inicio.getFullYear();
  const anoFim = fim.getFullYear();
  
  if (anoInicio !== anoFim) {
    return `${diaInicio} ${mesInicio} ${anoInicio} - ${diaFim} ${mesFim} ${anoFim}`;
  } else if (mesInicio !== mesFim) {
    return `${diaInicio} ${mesInicio} - ${diaFim} ${mesFim} ${anoFim}`;
  } else {
    return `${diaInicio} - ${diaFim} ${mesInicio} ${anoFim}`;
  }
};

const CompeticoesPage: React.FC = () => {
  const [categoriaFiltro, setCategoriaFiltro] = useState('todas');
  const [termoBusca, setTermoBusca] = useState('');
  const [mostrarPassadas, setMostrarPassadas] = useState(false);
  
  // Filtrar competições com base na categoria e termo de busca
  const competicoesFiltradas = (mostrarPassadas ? competicoesPast : competicoes).filter(comp => {
    const matchCategoria = categoriaFiltro === 'todas' || 
      comp.categoria.toLowerCase().includes(categoriaFiltro.toLowerCase());
    
    const matchBusca = termoBusca === '' || 
      comp.titulo.toLowerCase().includes(termoBusca.toLowerCase()) ||
      comp.local.toLowerCase().includes(termoBusca.toLowerCase());
    
    return matchCategoria && matchBusca;
  });
  
  return (
    <Layout>
      <NextSeo
        title="Competições de Surf | JornalK1 Surf"
        description="Acompanhe as principais competições de surf no Brasil e no mundo. Calendário, resultados e informações sobre o circuito mundial e campeonatos nacionais."
        canonical="https://jornalk1.com.br/categorias/competicoes"
        openGraph={{
          url: 'https://jornalk1.com.br/categorias/competicoes',
          title: 'Competições de Surf | JornalK1 Surf',
          description: 'Acompanhe as principais competições de surf no Brasil e no mundo. Calendário, resultados e informações sobre o circuito mundial e campeonatos nacionais.',
          images: [
            {
              url: 'https://jornalk1.com.br/og-image.jpg',
              width: 1200,
              height: 630,
              alt: 'JornalK1 Surf - Competições',
            },
          ],
          site_name: 'JornalK1 Surf',
        }}
      />
      
      {/* Hero Section */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-teal-800 opacity-90"></div>
        <div className="relative container mx-auto px-4 py-12 md:py-16 text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Competições de Surf</h1>
            <p className="text-lg md:text-xl mb-8 text-blue-100">Acompanhe os principais eventos, resultados e calendário do surf competitivo</p>
          </motion.div>
        </div>
      </section>
      
      {/* Filtros */}
      <section className="py-8 bg-white dark:bg-dark-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-100 dark:bg-dark-800 rounded-lg p-4 md:p-6"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex-grow">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar competição ou local..."
                    value={termoBusca}
                    onChange={(e) => setTermoBusca(e.target.value)}
                    className="w-full py-3 px-4 pl-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row gap-4">
                <div>
                  <select
                    value={categoriaFiltro}
                    onChange={(e) => setCategoriaFiltro(e.target.value)}
                    className="w-full md:w-auto py-3 px-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {categoriasFiltro.map(categoria => (
                      <option key={categoria.id} value={categoria.id}>{categoria.nome}</option>
                    ))}
                  </select>
                </div>
                
                <div className="flex rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700">
                  <button
                    onClick={() => setMostrarPassadas(false)}
                    className={`py-3 px-4 ${!mostrarPassadas 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white dark:bg-dark-700 text-gray-700 dark:text-gray-300'}`}
                  >
                    Próximas
                  </button>
                  <button
                    onClick={() => setMostrarPassadas(true)}
                    className={`py-3 px-4 ${mostrarPassadas 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white dark:bg-dark-700 text-gray-700 dark:text-gray-300'}`}
                  >
                    Concluídas
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Lista de Competições */}
      <section className="py-8 bg-gray-100 dark:bg-dark-800">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold mb-6">
              {mostrarPassadas ? 'Competições Concluídas' : 'Próximas Competições'}
            </h2>
            
            {competicoesFiltradas.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-dark-900 rounded-lg shadow-md">
                <p className="text-gray-600 dark:text-gray-400 mb-4">Nenhuma competição encontrada com os filtros selecionados.</p>
                <button
                  onClick={() => {setCategoriaFiltro('todas'); setTermoBusca('');}}
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                >
                  Limpar filtros
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {competicoesFiltradas.map((comp, index) => (
                  <motion.div
                    key={comp.id}
                    className="bg-white dark:bg-dark-900 rounded-lg shadow-md overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-1/3 lg:w-1/4 relative">
                        <div className="h-48 md:h-full">
                          <OptimizedImage
                            src={comp.imagem}
                            alt={comp.titulo}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="absolute top-0 left-0 bg-blue-600 text-white px-3 py-1 text-sm font-semibold">
                          {comp.categoria}
                        </div>
                      </div>
                      
                      <div className="p-6 md:w-2/3 lg:w-3/4">
                        <div className="flex flex-wrap items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                          <div className="flex items-center mr-4 mb-2">
                            <FaMapMarkerAlt className="mr-1" />
                            <span>{comp.local}</span>
                          </div>
                          <div className="flex items-center mr-4 mb-2">
                            <FaCalendarAlt className="mr-1" />
                            <span>{formatarPeriodo(comp.data, comp.dataFim)}</span>
                          </div>
                          <div className="flex items-center mb-2">
                            <FaTrophy className="mr-1 text-yellow-500" />
                            <span>{comp.premioTotal}</span>
                          </div>
                        </div>
                        
                        <h3 className="text-xl font-bold mb-3">{comp.titulo}</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">{comp.resumo}</p>
                        
                        {mostrarPassadas && 'resultado' in comp ? (
                          <div className="bg-gray-100 dark:bg-dark-800 rounded-lg p-4 mb-4">
                            <h4 className="font-bold mb-2">Resultado Final</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                              <div className="flex items-center">
                                <div className="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center text-white font-bold mr-2">1</div>
                                <span>{(comp as any).resultado.campeao}</span>
                              </div>
                              <div className="flex items-center">
                                <div className="w-6 h-6 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold mr-2">2</div>
                                <span>{(comp as any).resultado.segundo}</span>
                              </div>
                              <div className="flex items-center">
                                <div className="w-6 h-6 rounded-full bg-amber-700 flex items-center justify-center text-white font-bold mr-2">3</div>
                                <span>{(comp as any).resultado.terceiro}</span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="mb-4">
                            <h4 className="font-bold mb-2">Favoritos</h4>
                            <div className="flex flex-wrap gap-2">
                              {comp.favoritos.map((favorito, i) => (
                                <span key={i} className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm">
                                  {favorito}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <SmartLink 
                          href={`/competicao/${comp.slug}`}
                          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Ver detalhes
                        </SmartLink>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </section>
      
      {/* Calendário Anual */}
      <section className="py-12 bg-white dark:bg-dark-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-8 text-center">Calendário 2025</h2>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
              Confira as datas das principais competições de surf do ano
            </p>
            
            <div className="bg-gray-100 dark:bg-dark-800 rounded-lg p-6 shadow-md">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold mb-4 border-l-4 border-blue-600 pl-3">WSL Championship Tour 2025</h3>
                  <div className="space-y-3">
                    <div className="flex flex-col md:flex-row md:items-center justify-between p-3 bg-white dark:bg-dark-900 rounded-lg">
                      <div className="flex-grow">
                        <h4 className="font-bold">Pipeline, Havaí</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">29 Jan - 10 Fev</p>
                      </div>
                      <div className="mt-2 md:mt-0">
                        <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-sm">Concluído</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between p-3 bg-white dark:bg-dark-900 rounded-lg">
                      <div className="flex-grow">
                        <h4 className="font-bold">Sunset Beach, Havaí</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">14 Fev - 23 Fev</p>
                      </div>
                      <div className="mt-2 md:mt-0">
                        <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-sm">Concluído</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between p-3 bg-white dark:bg-dark-900 rounded-lg">
                      <div className="flex-grow">
                        <h4 className="font-bold">Peniche, Portugal</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">08 Mar - 16 Mar</p>
                      </div>
                      <div className="mt-2 md:mt-0">
                        <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-sm">Concluído</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between p-3 bg-white dark:bg-dark-900 rounded-lg">
                      <div className="flex-grow">
                        <h4 className="font-bold">Bells Beach, Austrália</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">01 Abr - 11 Abr</p>
                      </div>
                      <div className="mt-2 md:mt-0">
                        <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-sm">Concluído</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between p-3 bg-white dark:bg-dark-900 rounded-lg">
                      <div className="flex-grow">
                        <h4 className="font-bold">Margaret River, Austrália</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">20 Abr - 30 Abr</p>
                      </div>
                      <div className="mt-2 md:mt-0">
                        <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-sm">Concluído</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between p-3 bg-white dark:bg-dark-900 rounded-lg">
                      <div className="flex-grow">
                        <h4 className="font-bold">Teahupoo, Taiti</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">20 Mai - 30 Mai</p>
                      </div>
                      <div className="mt-2 md:mt-0">
                        <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">Próxima</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between p-3 bg-white dark:bg-dark-900 rounded-lg">
                      <div className="flex-grow">
                        <h4 className="font-bold">Rio de Janeiro, Brasil</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">15 Jun - 23 Jun</p>
                      </div>
                      <div className="mt-2 md:mt-0">
                        <span className="inline-block bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">Futura</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold mb-4 border-l-4 border-blue-600 pl-3">Circuito Brasileiro 2025</h3>
                  <div className="space-y-3">
                    <div className="flex flex-col md:flex-row md:items-center justify-between p-3 bg-white dark:bg-dark-900 rounded-lg">
                      <div className="flex-grow">
                        <h4 className="font-bold">Etapa Ubatuba</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">05 Jun - 08 Jun</p>
                      </div>
                      <div className="mt-2 md:mt-0">
                        <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">Próxima</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between p-3 bg-white dark:bg-dark-900 rounded-lg">
                      <div className="flex-grow">
                        <h4 className="font-bold">Etapa Florianópolis</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">15 Jul - 18 Jul</p>
                      </div>
                      <div className="mt-2 md:mt-0">
                        <span className="inline-block bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">Futura</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between p-3 bg-white dark:bg-dark-900 rounded-lg">
                      <div className="flex-grow">
                        <h4 className="font-bold">Etapa Saquarema</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">10 Ago - 13 Ago</p>
                      </div>
                      <div className="mt-2 md:mt-0">
                        <span className="inline-block bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">Futura</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default CompeticoesPage;
