import React from 'react';
import { NextSeo } from 'next-seo';
import Link from 'next/link';
import { motion } from 'framer-motion';

const PrivacyPage = () => {
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="bg-gray-50 dark:bg-dark-800 min-h-screen transition-colors duration-200">
      <NextSeo
        title="Política de Privacidade | JornalK1 Surf"
        description="Política de privacidade do portal de notícias JornalK1 Surf. Saiba como tratamos seus dados pessoais."
        canonical="https://jornalk1surf.com.br/privacidade"
        openGraph={{
          title: 'Política de Privacidade | JornalK1 Surf',
          description: 'Política de privacidade do portal de notícias JornalK1 Surf.',
          url: 'https://jornalk1surf.com.br/privacidade',
        }}
      />

      {/* Header */}
      <div className="bg-primary-600 dark:bg-primary-700 text-white">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-4xl">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Política de Privacidade</h1>
            <p className="text-lg text-white/90 max-w-3xl">
              Saiba como coletamos, usamos e protegemos suas informações pessoais.
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
            <span className="text-gray-700 dark:text-gray-300">Política de Privacidade</span>
          </nav>
        </div>

        {/* Content */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="bg-white dark:bg-dark-700 rounded-xl shadow-md p-6 md:p-8 lg:p-10 mb-8 transition-colors duration-200"
        >
          <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-gray-800 dark:prose-headings:text-white prose-p:text-gray-600 dark:prose-p:text-gray-300 prose-a:text-primary-600 dark:prose-a:text-primary-400">
            <h2>1. Introdução</h2>
            <p>
              O JornalK1 está comprometido em proteger sua privacidade. Esta Política de Privacidade explica como coletamos, usamos, divulgamos e protegemos suas informações pessoais quando você utiliza nosso site e serviços.
            </p>
            <p>
              Ao acessar ou utilizar o JornalK1, você concorda com as práticas descritas nesta política. Se você não concordar com esta política, por favor, não utilize nosso site.
            </p>

            <h2>2. Informações que Coletamos</h2>
            <p>
              Podemos coletar os seguintes tipos de informações:
            </p>
            <h3>2.1. Informações fornecidas por você</h3>
            <ul>
              <li>Informações de cadastro: nome, e-mail, senha, quando você cria uma conta;</li>
              <li>Informações de perfil: foto, biografia, interesses, quando você personaliza seu perfil;</li>
              <li>Conteúdo gerado pelo usuário: comentários, avaliações, participações em enquetes;</li>
              <li>Informações de contato: mensagens enviadas através de nossos formulários.</li>
            </ul>

            <h3>2.2. Informações coletadas automaticamente</h3>
            <ul>
              <li>Dados de uso: páginas visitadas, tempo gasto no site, links clicados;</li>
              <li>Informações do dispositivo: tipo de dispositivo, sistema operacional, navegador;</li>
              <li>Dados de localização: país, cidade, com base no seu endereço IP;</li>
              <li>Cookies e tecnologias similares: para melhorar sua experiência no site.</li>
            </ul>

            <h2>3. Como Usamos Suas Informações</h2>
            <p>
              Utilizamos suas informações para:
            </p>
            <ul>
              <li>Fornecer, manter e melhorar nossos serviços;</li>
              <li>Personalizar sua experiência e mostrar conteúdo relevante;</li>
              <li>Processar e gerenciar sua conta e assinaturas;</li>
              <li>Enviar notificações, atualizações e newsletters que você solicitou;</li>
              <li>Analisar tendências de uso e otimizar nosso site;</li>
              <li>Detectar, prevenir e resolver problemas técnicos ou de segurança;</li>
              <li>Cumprir obrigações legais.</li>
            </ul>

            <h2>4. Compartilhamento de Informações</h2>
            <p>
              Podemos compartilhar suas informações com:
            </p>
            <ul>
              <li>Prestadores de serviços: empresas que nos ajudam a operar o site e fornecer serviços (hospedagem, análise de dados, processamento de pagamentos);</li>
              <li>Parceiros de negócios: quando necessário para fornecer serviços solicitados por você;</li>
              <li>Autoridades legais: quando exigido por lei ou para proteger nossos direitos;</li>
              <li>Com seu consentimento: em outros casos, após obter sua permissão explícita.</li>
            </ul>

            <h2>5. Cookies e Tecnologias Similares</h2>
            <p>
              Utilizamos cookies e tecnologias similares para coletar informações sobre suas atividades no site. Você pode gerenciar suas preferências de cookies através das configurações do seu navegador.
            </p>
            <p>
              Tipos de cookies que utilizamos:
            </p>
            <ul>
              <li>Cookies essenciais: necessários para o funcionamento básico do site;</li>
              <li>Cookies de preferências: permitem lembrar suas preferências e configurações;</li>
              <li>Cookies analíticos: nos ajudam a entender como os usuários interagem com o site;</li>
              <li>Cookies de publicidade: utilizados para exibir anúncios relevantes.</li>
            </ul>

            <h2>6. Segurança das Informações</h2>
            <p>
              Implementamos medidas de segurança técnicas e organizacionais para proteger suas informações contra acesso não autorizado, perda, alteração ou destruição. No entanto, nenhum método de transmissão pela internet ou armazenamento eletrônico é 100% seguro, e não podemos garantir segurança absoluta.
            </p>

            <h2>7. Seus Direitos</h2>
            <p>
              Dependendo da sua localização, você pode ter os seguintes direitos em relação aos seus dados pessoais:
            </p>
            <ul>
              <li>Acesso: solicitar uma cópia das informações que temos sobre você;</li>
              <li>Retificação: corrigir informações imprecisas ou incompletas;</li>
              <li>Exclusão: solicitar a remoção de suas informações;</li>
              <li>Restrição: limitar o processamento de suas informações;</li>
              <li>Portabilidade: receber suas informações em formato estruturado;</li>
              <li>Objeção: opor-se ao processamento de suas informações;</li>
              <li>Retirada de consentimento: para processamentos baseados em consentimento.</li>
            </ul>
            <p>
              Para exercer esses direitos, entre em contato conosco através do e-mail <a href="mailto:privacidade@jornalk1.com.br">privacidade@jornalk1.com.br</a>.
            </p>

            <h2>8. Retenção de Dados</h2>
            <p>
              Mantemos suas informações pessoais pelo tempo necessário para cumprir as finalidades descritas nesta política, a menos que um período de retenção mais longo seja exigido ou permitido por lei.
            </p>

            <h2>9. Crianças</h2>
            <p>
              Nossos serviços não são direcionados a menores de 13 anos, e não coletamos intencionalmente informações pessoais de crianças. Se você acredita que coletamos informações de uma criança, entre em contato conosco imediatamente.
            </p>

            <h2>10. Alterações nesta Política</h2>
            <p>
              Podemos atualizar esta política periodicamente. A versão mais recente estará sempre disponível em nosso site, com a data da última atualização. Recomendamos que você revise esta política regularmente.
            </p>

            <h2>11. Contato</h2>
            <p>
              Se você tiver dúvidas ou preocupações sobre esta Política de Privacidade ou nossas práticas de dados, entre em contato conosco pelo e-mail: <a href="mailto:privacidade@jornalk1.com.br">privacidade@jornalk1.com.br</a>.
            </p>

            <p className="text-sm text-gray-500 dark:text-gray-400 mt-8">
              Última atualização: 11 de maio de 2025
            </p>
          </div>
        </motion.div>

        {/* Call to Action */}
        <div className="flex flex-col md:flex-row items-center justify-between bg-gray-100 dark:bg-dark-600 rounded-xl p-6 mb-8">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Tem dúvidas sobre seus dados?</h3>
            <p className="text-gray-600 dark:text-gray-300">Nossa equipe está pronta para ajudar com questões relacionadas à privacidade.</p>
          </div>
          <Link 
            href="/contato" 
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-md transition-colors duration-200 inline-flex items-center"
          >
            Fale Conosco
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>

        {/* Related Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/termos" className="bg-white dark:bg-dark-700 rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-200 flex flex-col">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Termos de Uso</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">Conheça as regras e condições para utilização do nosso portal.</p>
            <span className="text-primary-600 dark:text-primary-400 mt-auto inline-flex items-center">
              Ler termos
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </span>
          </Link>
          <Link href="/cookies" className="bg-white dark:bg-dark-700 rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-200 flex flex-col">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Política de Cookies</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">Entenda como utilizamos cookies e outras tecnologias em nosso site.</p>
            <span className="text-primary-600 dark:text-primary-400 mt-auto inline-flex items-center">
              Saiba mais
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

export default PrivacyPage;
