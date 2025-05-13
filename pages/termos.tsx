import React from 'react';
import { NextSeo } from 'next-seo';
import Link from 'next/link';
import { motion } from 'framer-motion';

const TermsPage = () => {
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="bg-gray-50 dark:bg-dark-800 min-h-screen transition-colors duration-200">
      <NextSeo
        title="Termos de Uso | JornalK1 Surf"
        description="Termos e condições de uso do portal de notícias JornalK1 Surf. Leia atentamente antes de utilizar nossos serviços."
        canonical="https://jornalk1surf.com.br/termos"
        openGraph={{
          title: 'Termos de Uso | JornalK1 Surf',
          description: 'Termos e condições de uso do portal de notícias JornalK1 Surf.',
          url: 'https://jornalk1surf.com.br/termos',
        }}
      />

      {/* Header */}
      <div className="surf-gradient-bg text-white relative overflow-hidden">
        {/* Padrão de ondas no fundo */}
        <div className="absolute inset-0 wave-pattern-bg opacity-10"></div>
        <div className="container mx-auto px-4 py-12 md:py-16 relative z-10">
          <div className="max-w-4xl">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Termos de Uso</h1>
            <p className="text-lg text-sand-light max-w-3xl">
              Leia atentamente os termos e condições de uso do portal JornalK1 Surf antes de utilizar nossos serviços.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <div className="mb-8">
          <nav className="text-sm text-gray-500 dark:text-gray-400 flex flex-wrap items-center">
            <Link href="/" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              Home
            </Link>
            <span className="mx-2 text-gray-400 dark:text-gray-600">/</span>
            <span className="text-gray-700 dark:text-gray-300">Termos de Uso</span>
          </nav>
        </div>

        {/* Content */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="bg-white dark:bg-dark-700 rounded-xl shadow-surf p-6 md:p-8 lg:p-10 mb-8 transition-colors duration-200"
        >
          <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-gray-800 dark:prose-headings:text-white prose-p:text-gray-600 dark:prose-p:text-gray-300 prose-a:text-ocean prose-a:dark:text-ocean-light">
            <h2>1. Aceitação dos Termos</h2>
            <p>
              Ao acessar e utilizar o portal JornalK1, você concorda com estes Termos de Uso e com nossa Política de Privacidade. Se você não concordar com qualquer parte destes termos, solicitamos que não utilize nosso site.
            </p>

            <h2>2. Uso do Conteúdo</h2>
            <p>
              Todo o conteúdo publicado no JornalK1, incluindo textos, imagens, vídeos, áudios, logotipos e marcas, é protegido por direitos autorais e outras leis de propriedade intelectual. Você pode compartilhar nosso conteúdo em redes sociais e outras plataformas, desde que:
            </p>
            <ul>
              <li>Não modifique o conteúdo original;</li>
              <li>Cite claramente o JornalK1 como fonte, incluindo um link para o artigo original;</li>
              <li>Não utilize o conteúdo para fins comerciais sem autorização prévia;</li>
              <li>Não reproduza o conteúdo em outros sites de notícias ou blogs sem nossa permissão expressa.</li>
            </ul>

            <h2>3. Cadastro e Conta de Usuário</h2>
            <p>
              Para acessar determinadas funcionalidades do portal, como comentar em notícias ou receber nossa newsletter, pode ser necessário criar uma conta. Ao se cadastrar, você concorda em:
            </p>
            <ul>
              <li>Fornecer informações verdadeiras, precisas e completas;</li>
              <li>Manter suas informações de login confidenciais;</li>
              <li>Ser responsável por todas as atividades realizadas com sua conta;</li>
              <li>Notificar imediatamente o JornalK1 sobre qualquer uso não autorizado da sua conta.</li>
            </ul>

            <h2>4. Conduta do Usuário</h2>
            <p>
              Ao utilizar o JornalK1, você concorda em não:
            </p>
            <ul>
              <li>Publicar conteúdo ofensivo, difamatório, obsceno, discriminatório ou ilegal;</li>
              <li>Assediar, ameaçar ou intimidar outros usuários;</li>
              <li>Tentar acessar áreas restritas do site ou interferir em seus sistemas;</li>
              <li>Utilizar o site para distribuir spam, vírus ou qualquer conteúdo malicioso;</li>
              <li>Coletar informações de outros usuários sem seu consentimento.</li>
            </ul>

            <h2>5. Comentários e Interações</h2>
            <p>
              O JornalK1 oferece espaços para comentários e interações. Reservamo-nos o direito de moderar, editar ou remover comentários que violem estes termos ou que consideremos inadequados. Não nos responsabilizamos pelo conteúdo publicado por usuários.
            </p>

            <h2>6. Links para Sites de Terceiros</h2>
            <p>
              Nosso portal pode conter links para sites externos. Não temos controle sobre o conteúdo desses sites e não nos responsabilizamos por suas práticas de privacidade ou conteúdo. O acesso a esses links é por conta e risco do usuário.
            </p>

            <h2>7. Limitação de Responsabilidade</h2>
            <p>
              O JornalK1 se esforça para fornecer informações precisas e atualizadas, mas não garantimos a exatidão, integridade ou utilidade de qualquer conteúdo. Em nenhuma circunstância seremos responsáveis por danos diretos, indiretos, incidentais ou consequenciais resultantes do uso ou incapacidade de usar nosso portal.
            </p>

            <h2>8. Modificações nos Termos</h2>
            <p>
              Reservamo-nos o direito de modificar estes Termos de Uso a qualquer momento. As alterações entrarão em vigor imediatamente após sua publicação no site. É responsabilidade do usuário verificar periodicamente se houve atualizações.
            </p>

            <h2>9. Lei Aplicável</h2>
            <p>
              Estes termos são regidos pelas leis brasileiras. Qualquer disputa relacionada a estes termos será submetida à jurisdição exclusiva dos tribunais brasileiros.
            </p>

            <h2>10. Contato</h2>
            <p>
              Se você tiver dúvidas sobre estes Termos de Uso, entre em contato conosco pelo e-mail: <a href="mailto:contato@jornalk1.com.br">contato@jornalk1.com.br</a>.
            </p>

            <p className="text-sm text-gray-500 dark:text-gray-400 mt-8">
              Última atualização: 11 de maio de 2025
            </p>
          </div>
        </motion.div>

        {/* Call to Action */}
        <div className="flex flex-col md:flex-row items-center justify-between bg-gray-100 dark:bg-dark-600 rounded-xl p-6 mb-8 shadow-surf">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Ainda tem dúvidas?</h3>
            <p className="text-gray-600 dark:text-gray-300">Entre em contato com nossa equipe para esclarecimentos.</p>
          </div>
          <Link 
            href="/contato" 
            className="btn-ocean px-6 py-3 rounded-md inline-flex items-center hover-float"
          >
            Fale Conosco
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>

        {/* Related Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/privacidade" className="bg-white dark:bg-dark-700 rounded-xl shadow-surf p-6 hover:shadow-lg transition-all duration-200 flex flex-col hover-float glass">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Política de Privacidade</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">Saiba como tratamos seus dados pessoais e protegemos sua privacidade.</p>
            <span className="text-ocean dark:text-ocean-light mt-auto inline-flex items-center">
              Ler política
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </span>
          </Link>
          <Link href="/faq" className="bg-white dark:bg-dark-700 rounded-xl shadow-surf p-6 hover:shadow-lg transition-all duration-200 flex flex-col hover-float glass">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Perguntas Frequentes</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">Encontre respostas para as dúvidas mais comuns sobre nossos serviços.</p>
            <span className="text-ocean dark:text-ocean-light mt-auto inline-flex items-center">
              Ver FAQ
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
