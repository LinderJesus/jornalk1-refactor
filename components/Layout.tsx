import React, { ReactNode } from 'react';
import Head from 'next/head';
import { 
  OptimizedHeader, 
  Footer, 
  OfflineDetector, 
  NavigationProgress, 
  ScrollToTop,
  PerformanceOptimizer,
  CookieConsent,
  FontOptimizer
} from './';

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

const Layout = ({ children, title = 'JornalK1 Surf - Notícias' }: LayoutProps) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <FontOptimizer />
      <div className="flex flex-col min-h-screen">
        <NavigationProgress />
        <OfflineDetector />
        <OptimizedHeader />
        <main className="flex-grow pt-16">{children}</main>
        <Footer />
        <ScrollToTop showAfter={400} position="right" offset={30} />
        <PerformanceOptimizer />
        <CookieConsent />
      </div>
    </>
  );
};

export default Layout;
