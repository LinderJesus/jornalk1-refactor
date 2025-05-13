import { DefaultSeoProps } from 'next-seo';

const SEOConfig: DefaultSeoProps = {
  titleTemplate: '%s | JornalK1 Surf',
  defaultTitle: 'JornalK1 Surf - O Melhor Portal de Surf do Brasil',
  description: 'Tudo sobre o mundo do surf em um só lugar. Acompanhe competições, previsões de ondas, dicas e equipamentos para surfistas de todos os níveis.',
  canonical: 'https://jornalk1surf.com.br',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://jornalk1surf.com.br',
    siteName: 'JornalK1 Surf',
    title: 'JornalK1 Surf - O Melhor Portal de Surf do Brasil',
    description: 'Tudo sobre o mundo do surf em um só lugar. Acompanhe competições, previsões de ondas, dicas e equipamentos para surfistas de todos os níveis.',
    images: [
      {
        url: 'https://jornalk1surf.com.br/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'JornalK1 Surf - Portal de Notícias de Surf',
      },
    ],
  },
  twitter: {
    handle: '@jornalk1surf',
    site: '@jornalk1surf',
    cardType: 'summary_large_image',
  },
  additionalLinkTags: [
    {
      rel: 'icon',
      href: '/favicon.ico',
    },
    {
      rel: 'apple-touch-icon',
      href: '/apple-touch-icon.png',
      sizes: '180x180',
    },
    {
      rel: 'manifest',
      href: '/site.webmanifest',
    },
  ],
  additionalMetaTags: [
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1',
    },
    {
      name: 'theme-color',
      content: '#0080c7',
    },
  ],
};

export default SEOConfig;
