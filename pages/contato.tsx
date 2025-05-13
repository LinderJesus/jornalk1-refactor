import React, { useState } from 'react';
import { NextSeo } from 'next-seo';
import { motion } from 'framer-motion';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaSwimmer } from 'react-icons/fa';
import Layout from '../components/Layout';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    // Simulação de envio do formulário
    try {
      // Em um ambiente real, você faria uma chamada de API aqui
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch {

      setSubmitError('Ocorreu um erro ao enviar sua mensagem. Por favor, tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <Layout>
      <div className="bg-gray-50 dark:bg-dark-800 min-h-screen transition-colors duration-200">
      <NextSeo
        title="Contato | JornalK1"
        description="Entre em contato com a equipe do JornalK1 para sugestões, dúvidas ou parcerias."
        openGraph={{
          title: 'Contato | JornalK1',
          description: 'Entre em contato com a equipe do JornalK1 para sugestões, dúvidas ou parcerias.',
          images: [
            {
              url: 'https://jornalk1.com.br/images/og-image.jpg',
              width: 1200,
              height: 630,
              alt: 'JornalK1 - Contato',
            },
          ],
        }}
      />

      {/* Header */}
      <div className="bg-blue-600 dark:bg-blue-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/wave-pattern.svg')] opacity-10"></div>
        <div className="container py-12 md:py-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center mb-4">
              <FaSwimmer className="text-4xl mr-3 text-blue-300" />
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">Contato</h1>
            </div>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl">
              Tem alguma dúvida, sugestão ou quer fazer uma parceria? Entre em contato com a equipe do JornalK1 Surf!
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Informações de Contato */}
          <motion.div
            className="lg:col-span-1"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <div className="bg-white dark:bg-dark-700 rounded-xl shadow-md p-6 md:p-8 transition-colors duration-200">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Informações de Contato</h2>
              
              <motion.div variants={fadeInUp} className="flex items-start mb-6">
                <div className="bg-primary-100 dark:bg-primary-900/30 p-3 rounded-full text-primary-600 dark:text-primary-400 mr-4">
                  <FaEnvelope />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white">Email</h3>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">contato@jornalk1.com.br</p>
                  <p className="text-gray-600 dark:text-gray-300">redacao@jornalk1.com.br</p>
                </div>
              </motion.div>
              
              <motion.div variants={fadeInUp} className="flex items-start mb-6">
                <div className="bg-primary-100 dark:bg-primary-900/30 p-3 rounded-full text-primary-600 dark:text-primary-400 mr-4">
                  <FaPhone />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white">Telefone</h3>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">(11) 3456-7890</p>
                  <p className="text-gray-600 dark:text-gray-300">(11) 98765-4321</p>
                </div>
              </motion.div>
              
              <motion.div variants={fadeInUp} className="flex items-start mb-6">
                <div className="bg-primary-100 dark:bg-primary-900/30 p-3 rounded-full text-primary-600 dark:text-primary-400 mr-4">
                  <FaMapMarkerAlt />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white">Endereço</h3>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">
                    Av. Paulista, 1000 - Bela Vista<br />
                    São Paulo - SP, 01310-100<br />
                    Brasil
                  </p>
                </div>
              </motion.div>
              
              <motion.div variants={fadeInUp}>
                <h3 className="font-semibold text-gray-800 dark:text-white mb-3">Redes Sociais</h3>
                <div className="flex space-x-4">
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="bg-primary-100 dark:bg-primary-900/30 p-3 rounded-full text-primary-600 dark:text-primary-400 hover:bg-primary-200 dark:hover:bg-primary-800/50 transition-colors">
                    <FaFacebook />
                  </a>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="bg-primary-100 dark:bg-primary-900/30 p-3 rounded-full text-primary-600 dark:text-primary-400 hover:bg-primary-200 dark:hover:bg-primary-800/50 transition-colors">
                    <FaTwitter />
                  </a>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="bg-primary-100 dark:bg-primary-900/30 p-3 rounded-full text-primary-600 dark:text-primary-400 hover:bg-primary-200 dark:hover:bg-primary-800/50 transition-colors">
                    <FaInstagram />
                  </a>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="bg-primary-100 dark:bg-primary-900/30 p-3 rounded-full text-primary-600 dark:text-primary-400 hover:bg-primary-200 dark:hover:bg-primary-800/50 transition-colors">
                    <FaLinkedin />
                  </a>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Formulário de Contato */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-white dark:bg-dark-700 rounded-xl shadow-md p-6 md:p-8 transition-colors duration-200">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Envie uma Mensagem</h2>
              
              {submitSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-success-100 dark:bg-success-900/20 border border-success-200 dark:border-success-800/30 text-success-800 dark:text-success-400 p-4 rounded-lg mb-6"
                >
                  <p className="font-medium">Mensagem enviada com sucesso!</p>
                  <p className="mt-1">Agradecemos seu contato. Retornaremos em breve.</p>
                  <button
                    onClick={() => setSubmitSuccess(false)}
                    className="mt-3 text-sm font-medium text-success-600 dark:text-success-400 hover:text-success-800 dark:hover:text-success-300"
                  >
                    Enviar outra mensagem
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
  <div>
    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
      Nome Completo *
    </label>
    <input
      type="text"
      id="name"
      name="name"
      value={formData.name}
      onChange={handleChange}
      required
      aria-label="Nome completo"
      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-600 text-gray-800 dark:text-white transition-colors"
    />
  </div>
  <div>
    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
      Assunto *
    </label>
    <select
      id="subject"
      name="subject"
      value={formData.subject}
      onChange={handleChange}
      required
      aria-label="Assunto"
      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-600 text-gray-800 dark:text-white transition-colors"
    >
      <option value="">Selecione um assunto</option>
      <option value="Dúvida">Dúvida</option>
      <option value="Sugestão">Sugestão de Pauta</option>
      <option value="Parceria">Proposta de Parceria</option>
      <option value="Publicidade">Publicidade</option>
      <option value="Outro">Outro</option>
    </select>
  </div>
</div>
                  
                  <div className="mb-6">
  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
    Email *
  </label>
  <input
    id="email"
    name="email"
    type="email"
    value={formData.email}
    onChange={handleChange}
    required
    aria-label="E-mail"
    pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
    title="Digite um e-mail válido"
    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-dark-600 text-gray-800 dark:text-white transition-colors"
  />
</div>
<div className="mb-6">
  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
    Mensagem *
  </label>
  <textarea
    id="message"
    name="message"
    value={formData.message}
    onChange={handleChange}
    required
    aria-label="Mensagem"
    rows={6}
    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-dark-600 text-gray-800 dark:text-white transition-colors resize-none"
  ></textarea>
</div>
                  
                  {submitError && (
                    <div className="bg-danger-100 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800/30 text-danger-800 dark:text-danger-400 p-4 rounded-lg mb-6">
                      {submitError}
                    </div>
                  )}
                  
                  <div className="flex justify-end">
                    <motion.button
  type="submit"
  disabled={isSubmitting}
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  className={`px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
  aria-label="Enviar mensagem"
>
  {isSubmitting ? (
    <span className="flex items-center gap-2">
      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
      </svg>
      Enviando...
    </span>
  ) : (
    'Enviar Mensagem'
  )}
</motion.button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
        
        {/* Mapa */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 bg-white dark:bg-dark-700 rounded-xl shadow-md p-6 overflow-hidden transition-colors duration-200"
        >
          <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Nossa Localização</h2>
          <div className="relative h-96 w-full rounded-lg overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.0976951333184!2d-46.65390548502406!3d-23.563273284683525!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce59c8da0aa315%3A0xd59f9431f2c9776a!2sAv.%20Paulista%2C%20S%C3%A3o%20Paulo%20-%20SP!5e0!3m2!1spt-BR!2sbr!4v1620000000000!5m2!1spt-BR!2sbr"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              title="Mapa da localização do JornalK1"
              className="absolute inset-0"
            ></iframe>
          </div>
        </motion.div>
      </div>
    </div>
    </Layout>
  );
};

export default ContactPage;
