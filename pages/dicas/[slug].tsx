import React from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { NextSeo } from 'next-seo';
import { motion } from 'framer-motion';
import Layout from '../../components/Layout';
import { OptimizedImage, SmartLink } from '../../components';
import { FaCalendarAlt, FaUser, FaEye, FaComment, FaShare, FaFacebook, FaTwitter, FaLinkedin, FaWhatsapp } from 'react-icons/fa';

// Dados de exemplo para dicas
const dicas = [
  {
    id: 1,
    titulo: 'Métodos de estudo eficazes para concursos públicos',
    slug: 'metodos-estudo-concursos',
    resumo: 'Confira as melhores técnicas para otimizar seu tempo de estudo e aumentar suas chances de aprovação.',
    conteudo: `
      <p>Preparar-se para concursos públicos exige disciplina, organização e métodos de estudo eficientes. Neste artigo, apresentamos estratégias comprovadas que podem ajudar você a maximizar seu aprendizado e aumentar suas chances de aprovação.</p>
      
      <h2>1. Planejamento estratégico</h2>
      <p>Antes de iniciar os estudos, é fundamental conhecer bem o edital e elaborar um cronograma realista. Divida o conteúdo programático de acordo com o peso das matérias e o tempo disponível até a prova. Estabeleça metas diárias e semanais, mas seja flexível para ajustes quando necessário.</p>
      
      <h2>2. Técnica Pomodoro</h2>
      <p>Este método consiste em dividir o tempo de estudo em blocos de 25 minutos (chamados "pomodoros"), seguidos por intervalos curtos de 5 minutos. Após completar quatro pomodoros, faça uma pausa mais longa de 15 a 30 minutos. Esta técnica ajuda a manter o foco e evita a fadiga mental.</p>
      
      <h2>3. Revisões espaçadas</h2>
      <p>Estudos científicos mostram que revisões periódicas são essenciais para a retenção de informações a longo prazo. Uma estratégia eficaz é revisar o conteúdo 24 horas após o primeiro contato, depois em uma semana, em um mês e, finalmente, antes da prova.</p>
      
      <h2>4. Mapas mentais</h2>
      <p>Mapas mentais são ferramentas poderosas para organizar informações complexas de forma visual. Eles ajudam a estabelecer conexões entre diferentes conceitos e facilitam a memorização. Use cores diferentes e imagens para tornar seus mapas mentais mais efetivos.</p>
      
      <h2>5. Resolução de questões</h2>
      <p>Praticar com questões de provas anteriores é fundamental. Isso familiariza você com o estilo das perguntas, ajuda a identificar padrões e reforça o aprendizado. Dedique pelo menos 30% do seu tempo de estudo à resolução de questões.</p>
      
      <h2>6. Técnica Feynman</h2>
      <p>Desenvolvida pelo físico Richard Feynman, esta técnica consiste em explicar o conteúdo estudado em linguagem simples, como se estivesse ensinando a uma criança. Isso ajuda a identificar lacunas no seu entendimento e consolida o conhecimento.</p>
      
      <h2>7. Grupos de estudo</h2>
      <p>Estudar em grupo pode ser muito produtivo, desde que bem organizado. Discutir temas complexos, explicar conceitos aos colegas e ouvir diferentes perspectivas enriquece o aprendizado. Considere formar um grupo pequeno com pessoas comprometidas.</p>
      
      <h2>8. Cuidados com a saúde</h2>
      <p>Não negligencie sua saúde física e mental. Mantenha uma alimentação balanceada, pratique atividades físicas regularmente e garanta um sono de qualidade. Um corpo saudável contribui significativamente para o desempenho cognitivo.</p>
      
      <p>Lembre-se que cada pessoa tem um estilo de aprendizagem único. Experimente diferentes métodos e adapte-os às suas necessidades. A consistência é mais importante que a intensidade - estudar um pouco todos os dias é mais eficaz que maratonas esporádicas.</p>
      
      <p>Com dedicação, estratégia e os métodos adequados, você estará no caminho certo para alcançar a aprovação desejada. Boa sorte!</p>
    `,
    imagem: '/images/news-1.jpg',
    data: '2025-05-01',
    visualizacoes: 1243,
    comentarios: 18,
    autor: 'Carlos Silva',
    autorImagem: '/images/autor-1.jpg',
    autorBio: 'Especialista em preparação para concursos públicos, com mais de 10 anos de experiência como professor e mentor.'
  },
  {
    id: 2,
    titulo: 'Como economizar na hora de fazer compras no supermercado',
    slug: 'economia-supermercado',
    resumo: 'Dicas práticas para reduzir seus gastos mensais com alimentação sem abrir mão da qualidade.',
    conteudo: `
      <p>As compras no supermercado representam uma parte significativa do orçamento familiar. Com algumas estratégias simples, é possível reduzir consideravelmente esses gastos sem comprometer a qualidade da alimentação.</p>
      
      <h2>1. Planeje suas compras</h2>
      <p>Antes de ir ao supermercado, faça um inventário do que já tem em casa e elabore uma lista de compras baseada em um cardápio semanal. Isso evita compras por impulso e reduz o desperdício de alimentos.</p>
      
      <h2>2. Compare preços</h2>
      <p>Pesquise preços em diferentes estabelecimentos e aproveite promoções. Aplicativos de comparação de preços podem ser grandes aliados nessa tarefa. Lembre-se que nem sempre o supermercado mais próximo é o mais econômico.</p>
      
      <h2>3. Prefira produtos da estação</h2>
      <p>Frutas, legumes e verduras da estação são geralmente mais baratos e nutritivos. Além de economizar, você estará consumindo alimentos mais frescos e saborosos.</p>
      
      <h2>4. Evite ir às compras com fome</h2>
      <p>Fazer compras com fome aumenta a tendência de comprar por impulso, especialmente alimentos processados e menos saudáveis. Alimente-se adequadamente antes de ir ao supermercado.</p>
      
      <h2>5. Avalie o custo-benefício</h2>
      <p>Compare o preço por unidade de medida (kg, litro, etc.) e não apenas o preço final do produto. Muitas vezes, embalagens maiores oferecem melhor custo-benefício, mas apenas se você realmente consumir todo o produto antes do vencimento.</p>
      
      <h2>6. Considere marcas próprias</h2>
      <p>Produtos de marca própria dos supermercados geralmente têm qualidade similar às marcas conhecidas, mas com preços significativamente menores. Vale a pena experimentar e comparar.</p>
      
      <h2>7. Aproveite programas de fidelidade</h2>
      <p>Muitas redes de supermercados oferecem programas de pontos ou descontos para clientes frequentes. Aproveite esses benefícios, mas não compre algo apenas para acumular pontos.</p>
      
      <h2>8. Evite desperdícios</h2>
      <p>Armazene adequadamente os alimentos para prolongar sua vida útil. Aproveite sobras para criar novas refeições e congele alimentos que não serão consumidos imediatamente.</p>
      
      <p>Implementando essas estratégias, é possível reduzir em até 30% os gastos mensais com alimentação. O segredo está no planejamento e na consciência de que pequenas economias, quando somadas, fazem grande diferença no orçamento familiar.</p>
    `,
    imagem: '/images/news-2.jpg',
    data: '2025-04-28',
    visualizacoes: 2156,
    comentarios: 32,
    autor: 'Ana Oliveira',
    autorImagem: '/images/autor-2.jpg',
    autorBio: 'Economista e consultora financeira especializada em finanças pessoais e educação financeira para famílias.'
  },
  {
    id: 3,
    titulo: 'Cuidados essenciais com a saúde mental durante períodos de estresse',
    slug: 'saude-mental-estresse',
    resumo: 'Saiba como manter o equilíbrio emocional e prevenir problemas de ansiedade em momentos desafiadores.',
    conteudo: `
      <p>Em períodos de grande estresse, cuidar da saúde mental torna-se tão importante quanto atender às necessidades físicas. Neste artigo, apresentamos estratégias eficazes para manter o equilíbrio emocional em momentos desafiadores.</p>
      
      <h2>1. Reconheça seus limites</h2>
      <p>O primeiro passo para cuidar da saúde mental é reconhecer quando você está sobrecarregado. Preste atenção aos sinais de alerta como irritabilidade constante, alterações no sono, dificuldade de concentração ou mudanças no apetite.</p>
      
      <h2>2. Pratique técnicas de respiração</h2>
      <p>A respiração consciente é uma ferramenta poderosa para acalmar o sistema nervoso. Dedique alguns minutos diários para respirar profundamente: inspire pelo nariz contando até 4, segure por 2 segundos e expire lentamente pela boca contando até 6.</p>
      
      <h2>3. Mantenha uma rotina</h2>
      <p>Mesmo em períodos turbulentos, manter uma rotina proporciona sensação de normalidade e controle. Estabeleça horários regulares para dormir, acordar, se alimentar e realizar atividades importantes.</p>
      
      <h2>4. Pratique atividade física</h2>
      <p>O exercício físico libera endorfinas, conhecidas como "hormônios da felicidade". Mesmo atividades leves como caminhadas de 20 minutos podem reduzir significativamente os níveis de ansiedade e melhorar o humor.</p>
      
      <h2>5. Limite o consumo de notícias</h2>
      <p>Estar constantemente exposto a notícias negativas pode aumentar a ansiedade. Defina horários específicos para se informar e evite checagens compulsivas de noticiários, especialmente antes de dormir.</p>
      
      <h2>6. Mantenha conexões sociais</h2>
      <p>O isolamento tende a agravar problemas emocionais. Mesmo que remotamente, mantenha contato com amigos e familiares. Compartilhar preocupações com pessoas de confiança pode aliviar a carga emocional.</p>
      
      <h2>7. Pratique mindfulness</h2>
      <p>A atenção plena ao momento presente ajuda a reduzir ruminações sobre o passado ou preocupações com o futuro. Dedique alguns minutos diários para observar seus pensamentos sem julgamento e ancorar-se no aqui e agora.</p>
      
      <h2>8. Busque ajuda profissional quando necessário</h2>
      <p>Se os sintomas de estresse, ansiedade ou depressão persistirem ou interferirem significativamente na sua vida, não hesite em buscar ajuda profissional. Psicólogos e psiquiatras dispõem de ferramentas eficazes para auxiliar no tratamento.</p>
      
      <p>Lembre-se que cuidar da saúde mental não é luxo, mas necessidade. Assim como mantemos hábitos para preservar a saúde física, devemos adotar práticas regulares para nutrir nosso bem-estar emocional, especialmente em períodos desafiadores.</p>
    `,
    imagem: '/images/news-3.jpg',
    data: '2025-04-25',
    visualizacoes: 1876,
    comentarios: 27,
    autor: 'Dra. Mariana Santos',
    autorImagem: '/images/autor-3.jpg',
    autorBio: 'Psicóloga clínica com especialização em terapia cognitivo-comportamental e manejo do estresse. Autora de diversos artigos sobre saúde mental.'
  },
  {
    id: 4,
    titulo: 'Investimentos para iniciantes: por onde começar',
    slug: 'investimentos-iniciantes',
    resumo: 'Um guia completo para quem deseja começar a investir com segurança e construir um patrimônio sólido.',
    conteudo: '<p>Conteúdo em breve</p>',
    imagem: '/images/news-4.jpg',
    data: '2025-04-22',
    visualizacoes: 3421,
    comentarios: 45,
    autor: 'Ricardo Almeida',
    autorImagem: '/images/autor-4.jpg',
    autorBio: 'Consultor financeiro e especialista em investimentos para pessoas físicas.'
  },
  {
    id: 5,
    titulo: 'Receitas práticas e saudáveis para o dia a dia',
    slug: 'receitas-praticas-saudaveis',
    resumo: 'Opções rápidas e nutritivas para quem tem pouco tempo para cozinhar mas não quer abrir mão da alimentação saudável.',
    conteudo: '<p>Conteúdo em breve</p>',
    imagem: '/images/news-5.jpg',
    data: '2025-04-19',
    visualizacoes: 1987,
    comentarios: 29,
    autor: 'Juliana Costa',
    autorImagem: '/images/autor-5.jpg',
    autorBio: 'Nutricionista especializada em alimentação funcional e autora de livros de culinária saudável.'
  },
  {
    id: 6,
    titulo: 'Como organizar sua rotina de trabalho para aumentar a produtividade',
    slug: 'organizacao-produtividade',
    resumo: 'Estratégias eficientes para gerenciar melhor seu tempo e alcançar melhores resultados no trabalho.',
    conteudo: '<p>Conteúdo em breve</p>',
    imagem: '/images/news-6.jpg',
    data: '2025-04-15',
    visualizacoes: 2543,
    comentarios: 36,
    autor: 'Fernando Mendes',
    autorImagem: '/images/autor-6.jpg',
    autorBio: 'Coach executivo e consultor em produtividade e gestão do tempo para profissionais e empresas.'
  }
];

// Sugestões de dicas relacionadas
const dicasRelacionadas = (dicaAtual: any) => {
  return dicas
    .filter(dica => dica.id !== dicaAtual.id)
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);
};

const formatarData = (dataString: string) => {
  const data = new Date(dataString);
  return data.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

interface DicaProps {
  dica: typeof dicas[0];
  relacionadas: typeof dicas;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = dicas.map(dica => ({
    params: { slug: dica.slug }
  }));

  return {
    paths,
    fallback: false
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;
  const dica = dicas.find(d => d.slug === slug);

  if (!dica) {
    return {
      notFound: true
    };
  }

  const relacionadas = dicasRelacionadas(dica);

  return {
    props: {
      dica,
      relacionadas
    }
  };
};

const DicaDetalhePage: React.FC<DicaProps> = ({ dica, relacionadas }) => {
  return (
    <Layout>
      <NextSeo
        title={`${dica.titulo} | JornalK1`}
        description={dica.resumo}
        openGraph={{
          title: `${dica.titulo} | JornalK1`,
          description: dica.resumo,
          images: [
            {
              url: `https://jornalk1.com.br${dica.imagem}`,
              width: 1200,
              height: 630,
              alt: dica.titulo,
            },
          ],
          type: 'article',
          article: {
            publishedTime: dica.data,
            authors: [dica.autor],
            tags: ['dicas', 'jornalk1'],
          },
        }}
      />

      <article className="container mx-auto px-4 py-8">
        {/* Cabeçalho */}
        <div className="max-w-4xl mx-auto">
          <motion.h1 
            className="text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {dica.titulo}
          </motion.h1>
          
          <motion.div
            className="flex flex-wrap items-center text-sm text-gray-500 dark:text-gray-400 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center mr-4 mb-2">
              <FaCalendarAlt className="mr-1" />
              <span>{formatarData(dica.data)}</span>
            </div>
            <div className="flex items-center mr-4 mb-2">
              <FaUser className="mr-1" />
              <span>{dica.autor}</span>
            </div>
            <div className="flex items-center mr-4 mb-2">
              <FaEye className="mr-1" />
              <span>{dica.visualizacoes.toLocaleString()} visualizações</span>
            </div>
            <div className="flex items-center mb-2">
              <FaComment className="mr-1" />
              <span>{dica.comentarios} comentários</span>
            </div>
          </motion.div>
        </div>

        {/* Imagem principal */}
        <motion.div 
          className="max-w-4xl mx-auto mb-8 relative rounded-lg overflow-hidden"
          style={{ height: '400px' }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <OptimizedImage
            src={dica.imagem}
            alt={dica.titulo}
            fill
            className="object-cover"
            priority
          />
        </motion.div>

        {/* Conteúdo */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
          <motion.div 
            className="lg:col-span-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div 
              className="prose prose-lg dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: dica.conteudo }}
            />

            {/* Compartilhar */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <FaShare className="mr-2" /> Compartilhar
              </h3>
              <div className="flex space-x-4">
                <a href="#" className="text-blue-600 hover:text-blue-800 text-xl">
                  <FaFacebook />
                </a>
                <a href="#" className="text-blue-400 hover:text-blue-600 text-xl">
                  <FaTwitter />
                </a>
                <a href="#" className="text-blue-700 hover:text-blue-900 text-xl">
                  <FaLinkedin />
                </a>
                <a href="#" className="text-green-600 hover:text-green-800 text-xl">
                  <FaWhatsapp />
                </a>
              </div>
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.aside 
            className="lg:col-span-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            {/* Autor */}
            <div className="bg-white dark:bg-dark-800 rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Sobre o Autor</h3>
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 rounded-full overflow-hidden mr-4 relative">
                  <OptimizedImage
                    src={dica.autorImagem}
                    alt={dica.autor}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold">{dica.autor}</h4>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-sm">{dica.autorBio}</p>
            </div>

            {/* Dicas relacionadas */}
            <div className="bg-white dark:bg-dark-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Dicas Relacionadas</h3>
              <div className="space-y-4">
                {relacionadas.map(relacionada => (
                  <div key={relacionada.id} className="flex items-start">
                    <div className="w-20 h-20 relative rounded overflow-hidden flex-shrink-0 mr-3">
                      <OptimizedImage
                        src={relacionada.imagem}
                        alt={relacionada.titulo}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <SmartLink 
                        href={`/dicas/${relacionada.slug}`}
                        className="font-medium hover:text-primary-600 transition-colors line-clamp-2"
                      >
                        {relacionada.titulo}
                      </SmartLink>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {formatarData(relacionada.data)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.aside>
        </div>
      </article>
    </Layout>
  );
};

export default DicaDetalhePage;
