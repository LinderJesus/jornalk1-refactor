import React from 'react';
import { NextSeo } from 'next-seo';
import { motion } from 'framer-motion';
import Layout from '../../components/Layout';
import { OptimizedImage, SmartLink } from '../../components';

// Dados de exemplo para categorias
const categorias = [
  {
    id: 1,
    nome: 'Política',
    slug: 'politica',
    descricao: 'Notícias sobre política nacional e internacional',
    imagem: '/images/news-1.jpg',
    quantidadeNoticias: 42
  },
  {
    id: 2,
    nome: 'Economia',
    slug: 'economia',
    descricao: 'Atualizações sobre economia, mercado financeiro e negócios',
    imagem: '/images/news-2.jpg',
    quantidadeNoticias: 38
  },
  {
    id: 3,
    nome: 'Tecnologia',
    slug: 'tecnologia',
    descricao: 'Novidades em tecnologia, inovação e ciência',
    imagem: '/images/news-3.jpg',
    quantidadeNoticias: 56
  },
  {
    id: 4,
    nome: 'Esportes',
    slug: 'esportes',
    descricao: 'Cobertura esportiva nacional e internacional',
    imagem: '/images/news-4.jpg',
    quantidadeNoticias: 64
  },
  {
    id: 5,
    nome: 'Cultura',
    slug: 'cultura',
    descricao: 'Notícias sobre arte, música, cinema e literatura',
    imagem: '/images/news-5.jpg',
    quantidadeNoticias: 29
  },
  {
    id: 6,
    nome: 'Saúde',
    slug: 'saude',
    descricao: 'Informações sobre saúde, bem-estar e medicina',
    imagem: '/images/news-6.jpg',
    quantidadeNoticias: 33
  }
];

const CategoriasPage: React.FC = () => {
  return (
    <Layout>
      <NextSeo
        title="Categorias | JornalK1"
        description="Explore todas as categorias de notícias do JornalK1"
        openGraph={{
          title: 'Categorias | JornalK1',
          description: 'Explore todas as categorias de notícias do JornalK1',
          images: [
            {
              url: 'https://jornalk1.com.br/og-image.jpg',
              width: 1200,
              height: 630,
              alt: 'JornalK1 - Categorias',
            },
          ],
        }}
      />

      <div className="container mx-auto px-4 py-8">
        <motion.h1 
          className="text-3xl md:text-4xl font-bold mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Categorias
        </motion.h1>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {categorias.map((categoria, index) => (
            <motion.div
              key={categoria.id}
              className="bg-white dark:bg-dark-800 rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="relative h-48">
                <OptimizedImage
                  src={categoria.imagem}
                  alt={categoria.nome}
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <h2 className="text-white text-xl font-bold">{categoria.nome}</h2>
                  <span className="text-white/80 text-sm">{categoria.quantidadeNoticias} notícias</span>
                </div>
              </div>
              <div className="p-4">
                <p className="text-gray-700 dark:text-gray-300 mb-4">{categoria.descricao}</p>
                <SmartLink
                  href={`/categorias/${categoria.slug}`}
                  className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded transition-colors"
                >
                  Ver notícias
                </SmartLink>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </Layout>
  );
};

export default CategoriasPage;
