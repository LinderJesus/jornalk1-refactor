import React from 'react';
import { FaFacebookF, FaTwitter, FaYoutube, FaInstagram, FaTiktok, FaEnvelope, FaArrowRight } from 'react-icons/fa';
import { motion } from 'framer-motion';

// Interface para tipagem das redes sociais
interface RedeSocialProps {
  id: number;
  nome: string;
  url: string;
  icon: React.ReactNode;
  bgClass: string;
}

// Dados das redes sociais corrigidos
const redesSociais: RedeSocialProps[] = [
  {
    id: 1,
    nome: 'Instagram',
    url: 'https://instagram.com/jornalk1surf',
    icon: <FaInstagram className="text-2xl" />,
    bgClass: 'bg-gradient-to-tr from-purple-600 to-pink-500'
  },
  {
    id: 2,
    nome: 'Facebook',
    url: 'https://facebook.com/jornalk1surf',
    icon: <FaFacebookF className="text-2xl" />,
    bgClass: 'bg-blue-600'
  },
  {
    id: 3,
    nome: 'Twitter',
    url: 'https://twitter.com/jornalk1surf',
    icon: <FaTwitter className="text-2xl" />,
    bgClass: 'bg-blue-400'
  },
  {
    id: 4,
    nome: 'YouTube',
    url: 'https://youtube.com/jornalk1surf',
    icon: <FaYoutube className="text-2xl" />,
    bgClass: 'bg-red-600'
  },
  {
    id: 5,
    nome: 'TikTok',
    url: 'https://tiktok.com/@jornalk1surf',
    icon: <FaTiktok className="text-2xl" />,
    bgClass: 'bg-gray-900'
  }
];

const RedesSociais: React.FC = () => {
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
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  return (
    <section className="py-16 bg-gradient-to-b from-dark-bg-primary to-blue-900/90 relative overflow-hidden">
      {/* Padrão de ondas no fundo */}
      <div className="absolute inset-0 bg-[url('/images/wave-pattern.svg')] opacity-5"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Conecte-se com a <span className="text-blue-300">comunidade</span>
          </h2>
          <p className="text-blue-100/80 max-w-2xl mx-auto">Acompanhe-nos nas redes sociais e faça parte da nossa comunidade de surfistas e apaixonados pelo mar.</p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-5 gap-6 max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {redesSociais.map((rede) => (
            <motion.a 
              key={rede.id}
              href={rede.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className={`${rede.bgClass} rounded-lg flex flex-col items-center justify-center p-6 text-white hover:scale-105 hover:shadow-lg transition-all duration-300 backdrop-blur-sm border border-white/10`}
              variants={itemVariants}
              whileHover={{ y: -5 }}
            >
              {rede.icon}
              <span className="mt-3 font-medium">{rede.nome}</span>
              <span className="text-xs mt-1 text-white/70">@jornalk1surf</span>
            </motion.a>
          ))}
        </motion.div>
        
        <motion.div 
          className="mt-16 max-w-3xl mx-auto bg-gradient-to-r from-blue-900/80 to-dark-card-bg rounded-xl p-6 md:p-8 border border-blue-800/30 shadow-xl backdrop-blur-sm"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="flex items-center justify-center mb-6">
            <div className="bg-blue-600/30 p-3 rounded-full mr-3">
              <FaEnvelope className="text-blue-300 text-xl" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-white mb-1">Fique por dentro do mundo do surf</h3>
              <p className="text-blue-100/70">Receba as melhores notícias e previsões diretamente no seu email</p>
            </div>
          </div>
          
          <form className="flex flex-col sm:flex-row gap-3">
            <input 
              type="email" 
              placeholder="Seu melhor email" 
              className="flex-1 px-4 py-3 rounded-full bg-white/10 border border-blue-700/30 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <motion.button 
              type="submit" 
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full transition-colors flex items-center justify-center"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              Inscrever-se <FaArrowRight className="ml-2" />
            </motion.button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default RedesSociais;
