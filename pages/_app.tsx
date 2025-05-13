import '../styles/globals.css';
import '../styles/variables.css';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { DefaultSeo } from 'next-seo';
import { inter, montserrat } from '../utils/fonts';
import { Layout, ErrorBoundary } from '../components';
import SEOConfig from '../utils/seo-config';
import { Analytics } from '@vercel/analytics/react';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { preloadCriticalImages } from '../utils/imagePreloader';
import errorMonitoring from '../utils/errorMonitoring';
import performanceMonitoring from '../utils/performanceMonitoring';
import { AuthProvider } from '../context/AuthContext';

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  // Verificar se a página atual tem um layout personalizado
  const getLayout = (Component as unknown).getLayout || ((page: React.ReactNode) => page);
  
  // Verificar se a página atual deve usar o layout padrão
  const useDefaultLayout = (Component as unknown).useDefaultLayout !== false;
  
  // Pré-carregar imagens críticas e inicializar sistemas de monitoramento
  useEffect(() => {
    // Apenas executar no cliente
    if (typeof window !== 'undefined') {
      // Marcar o início da inicialização
      if (performanceMonitoring) {
        performanceMonitoring.mark('app_init_start');
      }
      
      // Pré-carregar imagens críticas
      preloadCriticalImages();
      
      // Inicializar o sistema de monitoramento de erros
      if (errorMonitoring) {
        errorMonitoring.init({
          captureUnhandledRejections: true,
          captureConsoleErrors: process.env.NODE_ENV === 'production',
          shouldSendToServer: process.env.NODE_ENV === 'production',
          sampleRate: process.env.NODE_ENV === 'production' ? 0.9 : 1.0,
        });
      }
      
      // Inicializar o sistema de análise de desempenho
      if (performanceMonitoring) {
        performanceMonitoring.init({
          captureWebVitals: true,
          captureResourceMetrics: true,
          captureMemoryUsage: true,
          sampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
          reportToAnalytics: process.env.NODE_ENV === 'production',
          logToConsole: process.env.NODE_ENV !== 'production'
        });
        
        // Marcar o fim da inicialização e medir o tempo
        performanceMonitoring.mark('app_init_end');
        performanceMonitoring.measure('app_initialization', 'app_init_start', 'app_init_end');
      }
    }
  }, []);
  
  return (
    <>
      <style jsx global>{`
        :root {
          --font-inter: ${inter.style.fontFamily};
          --font-montserrat: ${montserrat.style.fontFamily};
        }
      `}</style>
      <DefaultSeo {...SEOConfig} />
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <SessionProvider session={session}>
          <AuthProvider>
            <div className={`${inter.variable} ${montserrat.variable} font-sans`}>
              <ErrorBoundary>
                {useDefaultLayout ? (
                  <Layout>
                    {getLayout(<Component {...pageProps} />)}
                  </Layout>
                ) : (
                  getLayout(<Component {...pageProps} />)
                )}
              </ErrorBoundary>
            </div>
            <Toaster position="bottom-right" />
          </AuthProvider>
        </SessionProvider>
      </ThemeProvider>
      <Analytics />
    </>
  );
}

export default MyApp;