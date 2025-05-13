import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import ImageCarousel from './ImageCarousel';
import AnimatedNewsCard from './AnimatedNewsCard';

import { Article } from '../types';

interface FeaturedNewsSectionProps {
  mainArticle: Article;
  secondaryArticles: Article[];
  trendingArticles: Article[];
}

const FeaturedNewsSection: React.FC<FeaturedNewsSectionProps> = ({
  mainArticle,
  secondaryArticles,
  trendingArticles,
}) => {
  // Preparar itens para o carrossel
  const carouselItems = [mainArticle, ...secondaryArticles.slice(0, 3)].map(article => ({
    id: article.id,
    title: article.title,
    description: article.excerpt,
    imageUrl: article.imageUrl,
    link: `/noticia/${article.slug}`,
    category: article.category
  }));

  // Animações
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section className="py-8 md:py-12">
      <div className="container">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Carrossel de notícias em destaque - Ocupa 2/3 da largura em desktop */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <ImageCarousel items={carouselItems} />
          </motion.div>

          {/* Notícias em tendência - Ocupa 1/3 da largura em desktop */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <div className="bg-white dark:bg-dark-700 rounded-xl shadow-md p-6 h-full transition-colors duration-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">Em Alta</h2>
                <Link href="/noticias" className="text-primary-600 dark:text-primary-400 text-sm font-medium hover:underline">
                  Ver todas
                </Link>
              </div>
              
              <div className="space-y-4">
                {trendingArticles.map((article, index) => (
                  <AnimatedNewsCard 
                    key={article.id} 
                    article={article} 
                    index={index}
                    variant="compact" 
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedNewsSection;
