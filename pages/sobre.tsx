import React from 'react';
import { NextSeo } from 'next-seo';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaNewspaper, FaUsers, FaAward, FaGlobe } from 'react-icons/fa';

const AboutPage = () => {
  // Animações
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } }
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

  // Equipe editorial
  const teamMembers = [
    {
      id: 1,
      name: 'Carlos Silva',
      role: 'Editor-Chefe',
      bio: 'Jornalista com mais de 15 anos de experiência em veículos de grande circulação. Especialista em política e economia.',
      imageUrl: '/images/team-1.jpg'
    },
    {
      id: 2,
      name: 'Ana Oliveira',
      role: 'Editora de Tecnologia',
      bio: 'Formada em Jornalismo e Ciência da Computação, cobre o setor de tecnologia há 10 anos com foco em inovação e startups.',
      imageUrl: '/images/team-2.jpg'
    },
    {
      id: 3,
      name: 'Roberto Mendes',
      role: 'Editor de Esportes',
      bio: 'Ex-atleta e jornalista esportivo com passagens por emissoras de TV e rádio. Especialista em futebol e esportes olímpicos.',
      imageUrl: '/images/team-3.jpg'
    },
    {
      id: 4,
      name: 'Juliana Costa',
      role: 'Editora de Cultura',
      bio: 'Jornalista e crítica cultural com experiência em revistas especializadas. Cobre cinema, música, literatura e artes visuais.',
      imageUrl: '/images/team-4.jpg'
    }
  ];

  // Valores
  const values = [
    {
      icon: <FaNewspaper />,
      title: 'Compromisso com a Verdade',
      description: 'Buscamos sempre a precisão e a imparcialidade em nossas reportagens, verificando rigorosamente cada informação.'
    },
    {
      icon: <FaUsers />,
      title: 'Diversidade de Vozes',
      description: 'Valorizamos a pluralidade de opiniões e perspectivas, dando espaço para diferentes pontos de vista em nosso conteúdo.'
    },
    {
      icon: <FaAward />,
      title: 'Excelência Jornalística',
      description: 'Mantemos os mais altos padrões de qualidade em nosso trabalho, buscando sempre a excelência em cada reportagem.'
    },
    {
      icon: <FaGlobe />,
      title: 'Responsabilidade Social',
      description: 'Acreditamos no papel transformador do jornalismo e em nossa responsabilidade de contribuir para uma sociedade mais informada.'
    }
  ];

  return (
    <div className="bg-gray-50 dark:bg-dark-800 min-h-screen transition-colors duration-200">
      <NextSeo
        title="Sobre Nós | JornalK1"
        description="Conheça a história, missão e valores do JornalK1, um portal de notícias comprometido com a verdade e a qualidade da informação."
        openGraph={{
          title: 'Sobre Nós | JornalK1',
          description: 'Conheça a história, missão e valores do JornalK1, um portal de notícias comprometido com a verdade e a qualidade da informação.',
          images: [
            {
              url: 'https://jornalk1.com.br/images/og-image.jpg',
              width: 1200,
              height: 630,
              alt: 'JornalK1 - Sobre Nós',
            },
          ],
        }}
      />

      {/* Header */}
      <div className="bg-primary-600 dark:bg-primary-700 text-white">
        <div className="container py-12 md:py-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Sobre Nós</h1>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl">
              Conheça a história e a equipe por trás do JornalK1, um portal de notícias comprometido com a verdade e a qualidade da informação.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container py-12">
        {/* Nossa História */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16"
        >
          <motion.div variants={fadeInUp} className="order-2 lg:order-1">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800 dark:text-white">Nossa História</h2>
            <div className="prose prose-lg dark:prose-invert">
              <p>
                Fundado em 2020, o JornalK1 nasceu da visão de um grupo de jornalistas experientes que acreditavam na necessidade de um jornalismo independente, ágil e comprometido com a verdade.
              </p>
              <p>
                Em meio a um cenário de transformação digital e desafios para a imprensa tradicional, decidimos criar um portal que unisse o rigor jornalístico com as possibilidades oferecidas pelas novas tecnologias.
              </p>
              <p>
                Começamos como um pequeno blog especializado em notícias locais, mas rapidamente expandimos nossa cobertura para temas nacionais e internacionais, sempre mantendo nosso compromisso com a qualidade da informação.
              </p>
              <p>
                Hoje, o JornalK1 é reconhecido como uma fonte confiável de notícias, análises e reportagens especiais, com uma equipe diversificada de profissionais dedicados a trazer o melhor conteúdo para nossos leitores.
              </p>
            </div>
          </motion.div>
          <motion.div variants={fadeIn} className="order-1 lg:order-2 flex items-center justify-center">
            <div className="relative w-full max-w-md h-80 md:h-96 rounded-xl overflow-hidden shadow-lg">
              <Image
                src="/images/about-history.jpg"
                alt="Redação do JornalK1"
                fill
                className="object-cover"
              />
            </div>
          </motion.div>
        </motion.div>

        {/* Missão e Valores */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="mb-16"
        >
          <motion.div variants={fadeInUp} className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800 dark:text-white">Nossa Missão e Valores</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Acreditamos no poder do jornalismo para informar, educar e transformar a sociedade. Nossa missão é fornecer informações precisas, relevantes e contextualizadas que ajudem nossos leitores a compreender melhor o mundo ao seu redor.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-white dark:bg-dark-700 rounded-xl shadow-md p-6 transition-colors duration-200"
              >
                <div className="bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">{value.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Nossa Equipe */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800 dark:text-white">Nossa Equipe Editorial</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Conheça os profissionais dedicados que trabalham diariamente para trazer as melhores notícias e análises para você.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member) => (
              <motion.div
                key={member.id}
                variants={fadeInUp}
                className="bg-white dark:bg-dark-700 rounded-xl shadow-md overflow-hidden transition-colors duration-200"
              >
                <div className="relative h-64 w-full">
                  <Image
                    src={member.imageUrl}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1 text-gray-800 dark:text-white">{member.name}</h3>
                  <p className="text-primary-600 dark:text-primary-400 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Estatísticas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-16 bg-primary-600 dark:bg-primary-700 rounded-xl overflow-hidden"
        >
          <div className="p-8 md:p-10 text-white">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">JornalK1 em Números</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              <div className="text-center">
                <p className="text-4xl md:text-5xl font-bold mb-2">3+</p>
                <p className="text-lg text-white/80">Anos de história</p>
              </div>
              <div className="text-center">
                <p className="text-4xl md:text-5xl font-bold mb-2">20+</p>
                <p className="text-lg text-white/80">Jornalistas</p>
              </div>
              <div className="text-center">
                <p className="text-4xl md:text-5xl font-bold mb-2">5K+</p>
                <p className="text-lg text-white/80">Artigos publicados</p>
              </div>
              <div className="text-center">
                <p className="text-4xl md:text-5xl font-bold mb-2">500K+</p>
                <p className="text-lg text-white/80">Leitores mensais</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutPage;
