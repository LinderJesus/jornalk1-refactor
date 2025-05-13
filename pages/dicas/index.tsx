import React, { useState } from 'react';
import { NextSeo } from 'next-seo';
import { motion } from 'framer-motion';
import Layout from '../../components/Layout';
import { OptimizedImage, SmartLink } from '../../components';
import { FaCalendarAlt, FaEye, FaComment, FaStar, FaUserCircle, FaWater, FaShoppingBag, FaMapMarked, FaLeaf, FaTrophy, FaSun } from 'react-icons/fa';

// Categorias de dicas de surf
const categoriasDicas = [
  { id: 'tecnicas', nome: 'Técnicas', icone: <FaWater /> },
  { id: 'equipamentos', nome: 'Equipamentos', icone: <FaShoppingBag /> },
  { id: 'destinos', nome: 'Destinos', icone: <FaMapMarked /> },
  { id: 'sustentabilidade', nome: 'Sustentabilidade', icone: <FaLeaf /> },
  { id: 'competicoes', nome: 'Competições', icone: <FaTrophy /> },
  { id: 'saude', nome: 'Saúde & Bem-estar', icone: <FaSun /> }
];

// Dados de exemplo para dicas de surf
const dicasSurf = [
  {
    id: 1,
    titulo: 'Como escolher a prancha ideal para iniciantes no surf',
    slug: 'como-escolher-prancha-iniciantes',
    resumo: 'Guia completo para ajudar novos surfistas a encontrar o equipamento perfeito para começar a pegar ondas com segurança.',
    imagem: '/images/news-1.jpg',
    categoria: 'equipamentos',
    data: '2025-05-09',
    visualizacoes: 3245,
    comentarios: 28,
    autor: 'Ricardo Almeida',
    avaliacao: 4.8,
    dificuldade: 'Iniciante'
  },
  {
    id: 2,
    titulo: 'Técnica do turtle roll: como passar pela arrebentação de forma eficiente',
    slug: 'tecnica-turtle-roll-arrebentacao',
    resumo: 'Aprenda o passo a passo desta técnica essencial para superar a arrebentação sem perder energia durante sua sessão de surf.',
    imagem: '/images/news-2.jpg',
    categoria: 'tecnicas',
    data: '2025-05-07',
    visualizacoes: 2187,
    comentarios: 19,
    autor: 'Ana Oliveira',
    avaliacao: 4.9,
    dificuldade: 'Intermediário'
  },
  {
    id: 3,
    titulo: 'Os 5 melhores destinos para surfar no litoral nordestino',
    slug: 'melhores-destinos-surf-nordeste',
    resumo: 'Conheça as praias paradisíacas do Nordeste brasileiro que oferecem condições perfeitas para surfistas de todos os níveis.',
    imagem: '/images/news-3.jpg',
    categoria: 'destinos',
    data: '2025-05-04',
    visualizacoes: 4216,
    comentarios: 35,
    autor: 'Mariana Santos',
    avaliacao: 4.7,
    dificuldade: 'Todos os níveis'
  },
  {
    id: 4,
    titulo: 'Exercícios específicos para melhorar seu equilíbrio no surf',
    slug: 'exercicios-melhorar-equilibrio-surf',
    resumo: 'Série de treinamentos que você pode fazer em casa para aprimorar seu equilíbrio e estabilidade na prancha.',
    imagem: '/images/news-4.jpg',
    categoria: 'saude',
    data: '2025-05-01',
    visualizacoes: 1876,
    comentarios: 21,
    autor: 'Carlos Silva',
    avaliacao: 4.5,
    dificuldade: 'Todos os níveis'
  },
  {
    id: 5,
    titulo: 'Como ler ondas e correntes: guia para escolher o melhor pico',
    slug: 'ler-ondas-correntes-melhor-pico',
    resumo: 'Dicas de um surfista profissional sobre como interpretar o mar, identificar correntes e encontrar os melhores picos para surfar.',
    imagem: '/images/news-5.jpg',
    categoria: 'tecnicas',
    data: '2025-04-28',
    visualizacoes: 3521,
    comentarios: 42,
    autor: 'Gabriel Medina',
    avaliacao: 4.9,
    dificuldade: 'Intermediário'
  },
  {
    id: 6,
    titulo: 'O que você precisa saber para surfar em Fernando de Noronha',
    slug: 'surf-fernando-noronha-guia',
    resumo: 'Guia completo com informações sobre as praias, melhores épocas, regulamentações ambientais e dicas para surfar neste paraíso brasileiro.',
    imagem: '/images/news-6.jpg',
    categoria: 'destinos',
    data: '2025-04-25',
    visualizacoes: 2965,
    comentarios: 31,
    autor: 'Juliana Costa',
    avaliacao: 4.8,
    dificuldade: 'Avançado'
  },
  {
    id: 7,
    titulo: 'Como reparar pequenos danos na sua prancha de surf',
    slug: 'reparar-danos-prancha-surf',
    resumo: 'Tutorial passo a passo para consertar amassados, furos e outros problemas comuns que podem acontecer com sua prancha.',
    imagem: '/images/news-2.jpg',
    categoria: 'equipamentos',
    data: '2025-04-21',
    visualizacoes: 1654,
    comentarios: 15,
    autor: 'Fernando Mendes',
    avaliacao: 4.6,
    dificuldade: 'Intermediário'
  },
  {
    id: 8,
    titulo: 'Pranchas eco-friendly: opções sustentáveis para surfistas conscientes',
    slug: 'pranchas-eco-friendly-sustentaveis',
    resumo: 'Conheça as inovações em materiais e processos que estão tornando o surf um esporte mais amigável ao meio ambiente.',
    imagem: '/images/news-4.jpg',
    categoria: 'sustentabilidade',
    data: '2025-04-18',
    visualizacoes: 1987,
    comentarios: 23,
    autor: 'Sophia Medeiros',
    avaliacao: 4.7,
    dificuldade: 'Todos os níveis'
  },
  {
    id: 9,
    titulo: 'Como se preparar para competições de surf: guia mental e físico',
    slug: 'preparacao-competicoes-surf',
    resumo: 'Estratégias de preparação física e mental para surfistas que desejam participar de campeonatos locais ou profissionais.',
    imagem: '/images/news-3.jpg',
    categoria: 'competicoes',
    data: '2025-04-15',
    visualizacoes: 2143,
    comentarios: 26,
    autor: 'Tatiana Weston-Webb',
    avaliacao: 4.9,
    dificuldade: 'Avançado'
  }
];

const formatarData = (dataString: string) => {
  const data = new Date(dataString);
  return data.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

const DicasPage: React.FC = () => {
  const [categoriaAtiva, setCategoriaAtiva] = useState<string>('todas');
  
  // Filtrar dicas pela categoria selecionada
  const dicasFiltradas = categoriaAtiva === 'todas' 
    ? dicasSurf 
    : dicasSurf.filter(dica => dica.categoria === categoriaAtiva);
    
  // Obter o nível de dificuldade com a cor correspondente
  const getNivelDificuldade = (nivel: string) => {
    switch(nivel) {
      case 'Iniciante':
        return { texto: 'Iniciante', cor: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' };
      case 'Intermediário':
        return { texto: 'Intermediário', cor: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' };
      case 'Avançado':
        return { texto: 'Avançado', cor: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' };
      default:
        return { texto: 'Todos os níveis', cor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' };
    }
  };
  
  return (
    <Layout>
      <NextSeo
        title="Dicas de Surf | JornalK1 Surf"
        description="Confira as melhores dicas e orientações para melhorar seu surf, escolher equipamentos, encontrar destinos e muito mais."
        canonical="https://jornalk1.com.br/dicas"
        openGraph={{
          url: 'https://jornalk1.com.br/dicas',
          title: 'Dicas de Surf | JornalK1 Surf',
          description: 'Aprimore suas habilidades no surf com nossas dicas especializadas.',
          images: [
            {
              url: 'https://jornalk1.com.br/images/og-dicas.jpg',
              width: 1200,
              height: 630,
              alt: 'JornalK1 Surf - Dicas',
            },
          ],
          site_name: 'JornalK1 Surf',
        }}
      />
      
      {/* Header */}
      <section className="relative pt-32 pb-16 overflow-hidden bg-gradient-to-r from-blue-900 to-teal-800 text-white">
        {/* Ondas decorativas */}
        <div className="absolute bottom-0 left-0 right-0 h-16 overflow-hidden">
          <svg className="absolute bottom-0 w-full h-24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" fill="#ffffff" opacity=".25"></path>
            <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" fill="#ffffff" opacity=".5"></path>
          </svg>
        </div>
        
        <div className="container mx-auto px-4 relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Dicas de Surf</h1>
            <p className="text-xl text-blue-100">Aprimore suas habilidades e conhecimento sobre o mundo do surf</p>
          </motion.div>
        </div>
      </section>

      {/* Categorias */}
      <section className="py-8 bg-white dark:bg-dark-900 border-b border-gray-200 dark:border-dark-700 sticky top-20 z-30">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-2">
            <button 
              onClick={() => setCategoriaAtiva('todas')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                categoriaAtiva === 'todas' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-600'
              }`}
            >
              Todas as Dicas
            </button>
            
            {categoriasDicas.map(categoria => (
              <button
                key={categoria.id}
                onClick={() => setCategoriaAtiva(categoria.id)}
                className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  categoriaAtiva === categoria.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-600'
                }`}
              >
                <span className="mr-2">{categoria.icone}</span>
                {categoria.nome}
              </button>
            ))}
          </div>
        </div>
      </section>
      
      {/* Listagem de Dicas */}
      <section className="py-12 bg-gray-50 dark:bg-dark-800">
        <div className="container mx-auto px-4">
          {dicasFiltradas.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dicasFiltradas.map((dica, index) => {
                const dificuldade = getNivelDificuldade(dica.dificuldade);
                
                return (
                  <motion.article
                    key={dica.id}
                    className="card card-hover overflow-hidden flex flex-col h-full"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                    whileHover={{ y: -5 }}
                  >
                    <div className="relative h-48">
                      <OptimizedImage
                        src={dica.imagem}
                        alt={dica.titulo}
                        fill
                        className="object-cover transition-transform duration-500 hover:scale-105"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="badge badge-primary px-3 py-1 text-sm font-medium">
                          {categoriasDicas.find(cat => cat.id === dica.categoria)?.nome}
                        </span>
                      </div>
                      <div className="absolute top-4 right-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${dificuldade.cor}`}>
                          {dificuldade.texto}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-6 flex-grow flex flex-col">
                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-3">
                        <div className="flex items-center">
                          <FaCalendarAlt className="mr-1" />
                          <span>{formatarData(dica.data)}</span>
                        </div>
                        <div className="flex items-center">
                          <FaStar className="text-yellow-500 mr-1" />
                          <span>{dica.avaliacao.toFixed(1)}</span>
                        </div>
                      </div>
                      
                      <h2 className="text-xl font-bold mb-3 line-clamp-2">{dica.titulo}</h2>
                      <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 flex-grow">{dica.resumo}</p>
                      
                      <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center">
                            <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mr-2">
                              <FaUserCircle />
                            </div>
                            <span className="text-sm font-medium">{dica.autor}</span>
                          </div>
                          <div className="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400">
                            <div className="flex items-center">
                              <FaEye className="mr-1" />
                              <span>{dica.visualizacoes.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center">
                              <FaComment className="mr-1" />
                              <span>{dica.comentarios}</span>
                            </div>
                          </div>
                        </div>
                        
                        <SmartLink
                          href={`/dicas/${dica.slug}`}
                          className="btn btn-primary w-full"
                        >
                          Ler artigo completo
                        </SmartLink>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 max-w-md mx-auto">
              <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 text-3xl mx-auto mb-6">
                <FaWater />
              </div>
              <h3 className="text-xl font-bold mb-2">Nenhuma dica encontrada</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Não encontramos dicas na categoria selecionada. Tente outra categoria ou volte mais tarde.</p>
              <button 
                onClick={() => setCategoriaAtiva('todas')}
                className="btn btn-primary"
              >
                Ver todas as dicas
              </button>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default DicasPage;
