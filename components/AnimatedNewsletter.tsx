import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEnvelope, FaCheck, FaTimes } from 'react-icons/fa';
import Link from 'next/link';

interface AnimatedNewsletterProps {
  variant?: 'default' | 'compact' | 'featured';
  backgroundColor?: string;
}

const AnimatedNewsletter: React.FC<AnimatedNewsletterProps> = ({ 
  variant = 'default',
  backgroundColor = 'bg-primary-600 dark:bg-primary-700'
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validação básica de email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Por favor, insira um email válido.');
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulação de envio
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsSubmitted(true);
      setEmail('');
    } catch (err) {
      console.error('Erro ao processar inscrição:', err);
      setError(`Ocorreu um erro ao processar sua inscrição: ${err instanceof Error ? err.message : 'Erro desconhecido'}. Tente novamente.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setError('');
  };

  // Animações
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const formVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0, 
      scale: 0.9,
      transition: { duration: 0.2 }
    }
  };

  const successVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.3 }
    }
  };

  // Renderizar versão compacta
  if (variant === 'compact') {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={`${backgroundColor} rounded-lg p-4 text-white`}
      >
        <div className="flex flex-col">
          <h3 className="text-lg font-bold mb-2">Assine nossa newsletter</h3>
          
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.form 
                key="form"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onSubmit={handleSubmit}
                className="flex"
              >
                <div className="relative flex-grow mr-2">
                  <label htmlFor="newsletter-email" className="block text-sm font-medium mb-2">E-mail</label>
                  <input
                    id="newsletter-email"
                    type="email"
                    placeholder="Seu email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white/50 bg-white/10 backdrop-blur-sm text-white placeholder:text-white/60"
                    disabled={isSubmitting}
                    required
                  />
                  {error && (
                    <p className="absolute -bottom-5 left-0 text-xs text-red-300">{error}</p>
                  )}
                </div>
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 bg-white text-primary-600 font-medium rounded-md hover:bg-white/90 transition-colors ${
                    isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? 'Enviando...' : 'Inscrever'}
                </motion.button>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                variants={successVariants}
                initial="hidden"
                animate="visible"
                className="flex items-center bg-white/10 backdrop-blur-sm p-3 rounded-md"
              >
                <div className="bg-green-500 rounded-full p-1 mr-2">
                  <FaCheck className="text-white" size={12} />
                </div>
                <p className="text-sm flex-grow">Inscrição realizada com sucesso!</p>
                <button 
                  onClick={resetForm}
                  className="text-white/80 hover:text-white"
                >
                  <FaTimes size={16} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    );
  }
  
  // Renderizar versão featured
  if (variant === 'featured') {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={`${backgroundColor} rounded-xl overflow-hidden shadow-lg`}
      >
        <div className="p-8 md:p-10 relative overflow-hidden">
          {/* Elementos decorativos */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-white/5 rounded-full blur-xl"></div>
          
          <div className="relative z-10">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full w-16 h-16 flex items-center justify-center mb-6">
              <FaEnvelope className="text-white" size={24} />
            </div>
            
            <h2 className="text-3xl font-bold mb-3 text-white">Fique por dentro das últimas notícias</h2>
            <p className="text-white/80 text-lg mb-6 max-w-2xl">
              Assine nossa newsletter e receba as notícias mais importantes diretamente na sua caixa de entrada.
              Sem spam, apenas conteúdo relevante.
            </p>
            
            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.form 
                  key="form"
                  variants={formVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  onSubmit={handleSubmit}
                  className="flex flex-col sm:flex-row gap-3 max-w-xl"
                >
                  <div className="relative flex-grow">
                    <input
                      type="email"
                      placeholder="Seu melhor email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-white/50 bg-white/10 backdrop-blur-sm text-white placeholder:text-white/60"
                      disabled={isSubmitting}
                      required
                    />
                    {error && (
                      <p className="absolute -bottom-6 left-0 text-sm text-red-300">{error}</p>
                    )}
                  </div>
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className={`px-6 py-3 bg-white text-primary-600 font-medium rounded-md hover:bg-white/90 transition-colors ${
                      isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSubmitting ? 'Enviando...' : 'Inscrever-se'}
                  </motion.button>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  variants={successVariants}
                  initial="hidden"
                  animate="visible"
                  className="bg-white/10 backdrop-blur-sm p-6 rounded-lg max-w-xl"
                >
                  <div className="flex items-center mb-3">
                    <div className="bg-green-500 rounded-full p-2 mr-3">
                      <FaCheck className="text-white" size={16} />
                    </div>
                    <h3 className="text-xl font-bold text-white">Inscrição realizada com sucesso!</h3>
                  </div>
                  <p className="text-white/80 mb-4">
                    Obrigado por se inscrever em nossa newsletter. Em breve você começará a receber nossas atualizações.
                  </p>
                  <motion.button
                    onClick={resetForm}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="text-white/80 hover:text-white font-medium"
                  >
                    Voltar
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
            
            <p className="text-white/60 text-sm mt-6">
              Ao se inscrever, você concorda com nossa <Link href="/privacidade" className="underline hover:text-white">Política de Privacidade</Link>.
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  // Renderizar versão padrão
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`${backgroundColor} rounded-xl overflow-hidden shadow-md`}
    >
      <div className="p-6 md:p-8 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-6 md:mb-0 md:mr-8 max-w-xl">
            <h3 className="text-2xl font-bold mb-2">Assine nossa newsletter</h3>
            <p className="text-white/80">
              Receba as últimas notícias e atualizações diretamente na sua caixa de entrada.
            </p>
          </div>
          <div className="w-full md:w-auto">
            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.form 
                  key="form"
                  variants={formVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  onSubmit={handleSubmit}
                  className="flex flex-col sm:flex-row gap-2"
                >
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="Seu e-mail"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-white/50 bg-white/10 backdrop-blur-sm text-white placeholder:text-white/60 min-w-[250px]"
                      disabled={isSubmitting}
                      required
                    />
                    {error && (
                      <p className="absolute -bottom-6 left-0 text-sm text-red-300">{error}</p>
                    )}
                  </div>
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className={`px-6 py-3 bg-white text-primary-600 font-medium rounded-md hover:bg-white/90 transition-colors ${
                      isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSubmitting ? 'Enviando...' : 'Inscrever-se'}
                  </motion.button>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  variants={successVariants}
                  initial="hidden"
                  animate="visible"
                  className="bg-white/10 backdrop-blur-sm p-4 rounded-md"
                >
                  <div className="flex items-center">
                    <div className="bg-green-500 rounded-full p-1 mr-2">
                      <FaCheck className="text-white" size={12} />
                    </div>
                    <p className="text-sm">Inscrição realizada com sucesso!</p>
                    <button 
                      onClick={resetForm}
                      className="ml-auto text-white/80 hover:text-white"
                    >
                      <FaTimes size={16} />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AnimatedNewsletter;
