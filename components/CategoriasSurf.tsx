import React from 'react';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaTrophy, FaTools, FaGlobeAmericas, FaWater, FaLeaf, FaGlasses } from 'react-icons/fa'; // Remover ícones não utilizados conforme necessário

// Interface para tipagem das categorias
interface CategoriaProps {
  id: number;
  icon: React.ReactNode;
  categoria: string;
  descricao: string;
  slug: string;
}

// Dados das categorias com textos corretos
const categorias: CategoriaProps[] = [
  { 
    id: 1, 
    icon: <FaTrophy className="text-2xl" />, 
    categoria: 'Competições', 
    descricao: 'Acompanhe as disputas mundiais', 
    slug: 'competicoes' 
  },
  { 
    id: 2, 
    icon: <FaTools className="text-2xl" />, 
    categoria: 'Equipamentos', 
    descricao: 'Pranchas, wetsuits e acessórios', 
    slug: 'equipamentos' 
  },
  { 
    id: 3, 
    icon: <FaGlobeAmericas className="text-2xl" />, 
    categoria: 'Destinos', 
    descricao: 'Melhores praias pelo mundo', 
    slug: 'destinos' 
  },
  { 
    id: 4, 
    icon: <FaWater className="text-2xl" />, 
    categoria: 'Técnicas', 
    descricao: 'Aprenda novas manobras', 
    slug: 'tecnicas' 
  },
  { 
    id: 5, 
    icon: <FaLeaf className="text-2xl" />, 
    categoria: 'Sustentabilidade', 
    descricao: 'Proteção para oceanos', 
    slug: 'sustentabilidade' 
  },
  { 
    id: 6, 
    icon: <FaGlasses className="text-2xl" />, 
    categoria: 'Cultura', 
    descricao: 'A história e o estilo de vida', 
    slug: 'cultura' 
  },
];

const CategoriasSurf = () => {
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
      transition: { duration: 0.5 }
    }
  };
  
  return (
    <section className="py-20 bg-gray-50 dark:bg-dark-bg-primary relative overflow-hidden">
      {/* Background elements decorativos */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-blue-accent opacity-10 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-blue-accent opacity-10 blur-3xl"></div>
      
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 relative z-10">
          <div className="inline-block mb-4">
            <FaWater className="text-blue-accent mx-auto text-4xl mb-2" />
            <div className="h-1 w-20 bg-gradient-to-r from-transparent via-blue-accent to-transparent mx-auto"></div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800 dark:text-white">
            Explore o Universo do <span className="text-blue-accent">Surf</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Descubra todas as facetas do mundo do surf através de nossas categorias especializadas
          </p>
        </div>
        
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {categorias.map((categoria) => (
            <motion.div key={categoria.id} variants={itemVariants}>
              <Link 
                href={`/categorias/${categoria.slug}`}
                className="bg-white dark:bg-dark-card-bg rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full group border border-gray-200 dark:border-gray-700/30"
              >
                <div className="p-6 flex flex-col items-center text-center flex-grow">
                  <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <div className="text-blue-accent text-3xl group-hover:text-blue-accent-hover transition-colors">
                      {categoria.icon}
                    </div>
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-gray-800 dark:text-white group-hover:text-blue-accent transition-colors">
                    {categoria.categoria}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {categoria.descricao}
                  </p>
                </div>
                <div className="mt-auto border-t border-gray-100 dark:border-gray-800 py-3 px-6 text-sm text-center">
                  <span className="text-blue-accent flex items-center justify-center">
                    Explorar <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default CategoriasSurf;
