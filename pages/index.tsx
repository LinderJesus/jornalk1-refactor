import React from 'react';
import { NextSeo } from 'next-seo';
import dynamic from 'next/dynamic';

// Importação dinâmica do Layout para evitar problemas de compilação
const Layout = dynamic(() => import('../components/Layout'), {
  ssr: true
});

// Importação dinâmica da HomePage para evitar problemas de compilação
const HomePage = dynamic(() => import('../components/HomePage'), {
  ssr: true
});

/**
 * Página principal - Home
 * Implementa as correções solicitadas na planilha de melhorias
 */
export default function Home() {
  return (
    <Layout>
      <NextSeo
        title="JornalK1 Surf - As melhores notícias e conteúdos sobre o mundo do surf"
        description="Acompanhe as últimas notícias, previsões de ondas, competições e dicas de surf no JornalK1 Surf - seu portal definitivo para o mundo do surf."
        canonical="https://jornalk1surf.com.br/"
        openGraph={{
          type: 'website',
          locale: 'pt_BR',
          url: 'https://jornalk1surf.com.br/',
          title: 'JornalK1 Surf - Portal completo sobre o mundo do surf',
          description: 'Notícias, previsões, competições e mais conteúdos sobre surf.',
          images: [
            {
              url: 'https://jornalk1surf.com.br/images/og-image.jpg',
              width: 1200,
              height: 630,
              alt: 'JornalK1 Surf',
            },
          ],
          site_name: 'JornalK1 Surf',
        }}
        twitter={{
          handle: '@jornalk1surf',
          site: '@jornalk1surf',
          cardType: 'summary_large_image',
        }}
      />
      <HomePage />
    </Layout>
  );
}
