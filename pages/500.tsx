import React from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { FaHome, FaRedo } from 'react-icons/fa';
import { SmartLink } from '../components';

/**
 * Página 500 personalizada
 * Melhora a experiência do usuário quando ocorre um erro no servidor
 */
const ServerErrorPage: React.FC = () => {
  // Função para recarregar a página
  const handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  return (
    <>
      <Head>
        <title>Erro no servidor | JornalK1</title>
        <meta name="description" content="Ocorreu um erro no servidor. Pedimos desculpas pelo inconveniente." />
      </Head>

      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-800 p-4">
        <div className="max-w-lg w-full">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-9xl font-bold text-red-500 dark:text-red-400">500</h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mt-4 mb-2">
                Erro no servidor
              </h2>
              
              <p className="text-gray-600 dark:text-gray-300 mb-8">
                Ocorreu um erro no servidor. Estamos trabalhando para resolver o problema o mais rápido possível. Pedimos desculpas pelo inconveniente.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <SmartLink
                href="/"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-md transition-colors"
              >
                <FaHome />
                <span>Voltar para a página inicial</span>
              </SmartLink>
              
              <button
                onClick={handleReload}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 dark:bg-dark-600 hover:bg-gray-300 dark:hover:bg-dark-500 text-gray-800 dark:text-white rounded-md transition-colors"
              >
                <FaRedo />
                <span>Tentar novamente</span>
              </button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-12 bg-white dark:bg-dark-700 p-6 rounded-lg shadow-md"
          >
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              O que você pode fazer:
            </h3>
            
            <ul className="space-y-3 list-disc pl-5 text-gray-600 dark:text-gray-300">
              <li>Recarregar a página</li>
              <li>Limpar o cache do navegador</li>
              <li>Tentar novamente mais tarde</li>
              <li>
                <SmartLink
                  href="/contato"
                  className="text-primary-600 dark:text-primary-400 hover:underline"
                >
                  Entrar em contato conosco
                </SmartLink>{' '}
                se o problema persistir
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </>
  );
};

interface CustomPageProps {
  useDefaultLayout?: boolean;
}

type CustomFunctionComponent = React.FC & CustomPageProps;

// Desativar o layout padrão para esta página
const CustomServerErrorPage = ServerErrorPage as CustomFunctionComponent;
CustomServerErrorPage.useDefaultLayout = true;

export default CustomServerErrorPage;
