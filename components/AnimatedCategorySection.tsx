import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Category } from '../types';

// Usando o tipo Category importado de '../types'

interface AnimatedCategorySectionProps {
  categories: Category[];
}

const AnimatedCategorySection: React.FC<AnimatedCategorySectionProps> = ({ categories }) => {
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
    },
    hover: {
      y: -10,
      boxShadow: '0 15px 30px rgba(0, 0, 0, 0.1)',
      transition: { duration: 0.3 }
    }
  };

  return (
    <section className="py-12 bg-gray-50 dark:bg-dark-800 transition-colors duration-200">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">Explore por Categorias</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Navegue por nossas categorias para encontrar as notícias que mais interessam a você
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              variants={itemVariants}
              whileHover="hover"
              custom={index}
              className="relative overflow-hidden rounded-xl"
            >
              <Link href={`/categoria/${category.slug}`} className="block h-full">
                <div className="relative h-64 w-full">
                  {category.imageUrl ? (
                    <Image
                      src={category.imageUrl}
                      alt={category.name || 'Categoria'}
                      fill
                      className="object-cover transition-transform duration-500 hover:scale-110"
                      loading="lazy"
                      placeholder="blur"
                      blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTJlOGYwIi8+PC9zdmc+"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      style={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                      <span className="text-4xl text-white font-bold opacity-30">{category.name?.charAt(0) || '?'}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-xl font-bold mb-1">{category.name || 'Categoria'}</h3>
                    <p className="text-white/80 text-sm mb-3 line-clamp-2">{category.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                        {category.count || 0} artigos
                      </span>
                      <motion.span
                        className="text-sm font-medium flex items-center"
                        whileHover={{ x: 5 }}
                      >
                        Explorar
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </motion.span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-10 text-center"
        >
          <Link href="/categorias">
            <motion.span
              className="inline-block px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Ver todas as categorias
            </motion.span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default AnimatedCategorySection;
