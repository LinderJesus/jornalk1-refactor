import { GetServerSideProps } from 'next';

// Esta é uma página de redirecionamento temporário
// para padronizar as URLs do site, redirecionando /categoria/[slug] para /categorias/[slug]
export default function CategoryRedirect() {
  // Esta função nunca será renderizada no cliente porque
  // o redirecionamento ocorrerá durante o SSR
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ params, res }) => {
  const { slug } = params as { slug: string };
  
  // Redirecionar permanentemente para o novo formato de URL
  if (res) {
    res.setHeader('Location', `/categorias/${slug}`);
    res.statusCode = 301; // Redirecionamento permanente
    res.end();
  }
  
  return { props: {} };
};
