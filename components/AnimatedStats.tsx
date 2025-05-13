import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, useInView } from 'framer-motion';
import { FaNewspaper, FaUsers, FaTags, FaPen } from 'react-icons/fa';

interface Stat {
  icon: JSX.Element;
  label: string;
  value: number;
  suffix?: string;
  color: string;
}

const AnimatedStats: React.FC = () => {
  // Referência para o elemento que será observado
  const ref = useRef(null);
  // Hook useInView para detectar quando o elemento está visível na tela
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  
  // Estado para armazenar os valores atuais durante a animação
  // Inicializar com os valores finais para evitar erro de hidratação
  const [isMounted, setIsMounted] = useState(false);
  
  // Estatísticas a serem exibidas
  const stats = useMemo<Stat[]>(() => [
    {
      icon: <FaNewspaper className="h-6 w-6" />,
      label: 'Artigos Publicados',
      value: 5280,
      color: 'bg-primary-600 dark:bg-primary-500'
    },
    {
      icon: <FaUsers className="h-6 w-6" />,
      label: 'Leitores Mensais',
      value: 520000,
      suffix: '+',
      color: 'bg-secondary-600 dark:bg-secondary-500'
    },
    {
      icon: <FaTags className="h-6 w-6" />,
      label: 'Categorias',
      value: 24,
      color: 'bg-success-600 dark:bg-success-500'
    },
    {
      icon: <FaPen className="h-6 w-6" />,
      label: 'Autores',
      value: 42,
      color: 'bg-info-600 dark:bg-info-500'
    }
  ], []);
  
  // Efeito para marcar quando o componente está montado no cliente
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Efeito para animar os números apenas no lado do cliente e quando o componente estiver visível
  const [counts, setCounts] = useState<number[]>([]);
  
  useEffect(() => {
    // Inicializa os contadores com zeros apenas quando montado no cliente
    if (isMounted) {
      setCounts([0, 0, 0, 0]);
    }
  }, [isMounted]);
  
  useEffect(() => {
    // Só executa a animação quando o componente estiver montado no cliente e visível
    if (isMounted && isInView && counts.length > 0) {
      // Duração da animação em ms
      const animationDuration = 2000;
      // Intervalo entre cada atualização
      const interval = 20;
      // Total de passos
      const steps = animationDuration / interval;
      
      let currentStep = 0;
      
      const timer = setInterval(() => {
        currentStep += 1;
        const progress = currentStep / steps;
        
        // Atualizar os valores com base no progresso
        setCounts(stats.map((stat) => {
          // Usar uma função de easing para tornar a animação mais natural
          const easeOutQuart = 1 - Math.pow(1 - progress, 4);
          return Math.floor(stat.value * easeOutQuart);
        }));
        
        // Parar a animação quando chegar ao final
        if (currentStep >= steps) {
          clearInterval(timer);
          setCounts(stats.map(stat => stat.value));
        }
      }, interval);
      
      return () => clearInterval(timer);
    }
  }, [isInView, isMounted, counts.length, stats]);
  
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
    <section ref={ref} className="py-16 bg-white dark:bg-dark-700 transition-colors duration-200">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">JornalK1 em Números</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Acompanhe o crescimento do nosso portal de notícias
          </p>
        </motion.div>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-gray-50 dark:bg-dark-800 rounded-xl shadow-md overflow-hidden transition-colors duration-200"
            >
              <div className="p-6">
                <div className={`${stat.color} text-white p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4`}>
                  {stat.icon}
                </div>
                <h3 className="text-3xl font-bold mb-2 text-gray-800 dark:text-white">
                  {isMounted ? 
                    (counts[index] !== undefined ? counts[index].toLocaleString() : '0') + (stat.suffix || '') : 
                    '0' + (stat.suffix || '')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{stat.label}</p>
              </div>
              <div className={`h-1 ${stat.color}`}></div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default AnimatedStats;
