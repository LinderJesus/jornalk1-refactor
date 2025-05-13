import React from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { FaHome, FaSearch } from 'react-icons/fa';
import { SmartLink } from '../components';

/**
 * Página 404 personalizada
 * Melhora a experiência do usuário quando uma página não é encontrada
 */
const NotFoundPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Página não encontrada | JornalK1</title>
        <meta name="description" content="A página que você está procurando não foi encontrada." />
      </Head>

      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-800 p-4">
        <div className="max-w-lg w-full">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-9xl font-bold text-primary-600 dark:text-primary-500">404</h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mt-4 mb-2">
                Página não encontrada
              </h2>
              
              <p className="text-gray-600 dark:text-gray-300 mb-8">
                A página que você está procurando pode ter sido removida, renomeada ou está temporariamente indisponível.
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
              
              <SmartLink
                href="/busca"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 dark:bg-dark-600 hover:bg-gray-300 dark:hover:bg-dark-500 text-gray-800 dark:text-white rounded-md transition-colors"
              >
                <FaSearch />
                <span>Buscar no site</span>
              </SmartLink>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-12 bg-white dark:bg-dark-700 p-6 rounded-lg shadow-md"
          >
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Você pode estar procurando por:
            </h3>
            
            <ul className="space-y-3">
              <li>
                <SmartLink
                  href="/noticias"
                  className="text-primary-600 dark:text-primary-400 hover:underline"
                >
                  Últimas notícias
                </SmartLink>
              </li>
              <li>
                <SmartLink
                  href="/categorias/politica"
                  className="text-primary-600 dark:text-primary-400 hover:underline"
                >
                  Notícias de política
                </SmartLink>
              </li>
              <li>
                <SmartLink
                  href="/categorias/economia"
                  className="text-primary-600 dark:text-primary-400 hover:underline"
                >
                  Notícias de economia
                </SmartLink>
              </li>
              <li>
                <SmartLink
                  href="/categorias/esportes"
                  className="text-primary-600 dark:text-primary-400 hover:underline"
                >
                  Notícias de esportes
                </SmartLink>
              </li>
              <li>
                <SmartLink
                  href="/contato"
                  className="text-primary-600 dark:text-primary-400 hover:underline"
                >
                  Entre em contato conosco
                </SmartLink>
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
const CustomNotFoundPage = NotFoundPage as CustomFunctionComponent;
CustomNotFoundPage.useDefaultLayout = true;

export default CustomNotFoundPage;
