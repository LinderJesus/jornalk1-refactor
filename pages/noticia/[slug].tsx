import { useRouter } from 'next/router';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import OptimizedImage from '../../components/OptimizedImage';
import { NextSeo } from 'next-seo';
import { FaClock, FaUser, FaFacebook, FaTwitter, FaLinkedin, FaWhatsapp, FaBookmark, FaShare, FaEye, FaEnvelope } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { Layout, LoadingSpinner, ErrorMessage } from '../../components';
import { getNewsBySlug, getNewsList } from '../../utils/api-client';

// Interface para o artigo de notícias
interface ArticleData {
  id: number;
  title: string;
  slug: string;
  location?: string;
  content: string;
  excerpt: string;
  imageUrl: string;
  date: string;
  author: string;
  category: string;
  categoryId: number;
  tags: string[];
  viewCount: number;
  relatedNews?: ArticleData[];
}

// Definição do tipo NewsItem para corresponder ao tipo retornado pela API
interface NewsItem {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  image_url: string;
  created_at: string;
  author_name?: string;
  category_name: string;
  category_id: number;
  view_count?: number;
}

// Converte NewsItem da API para o formato usado pelo frontend
const formatArticleData = (item: NewsItem): ArticleData => ({
  id: item.id,
  title: item.title,
  slug: item.slug,
  location: item.category_name === 'Destinos' ? item.excerpt.split(',')[0] : '',
  content: item.content,
  excerpt: item.excerpt,
  imageUrl: item.image_url || '/images/default-news.jpg',
  date: new Date(item.created_at).toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }),
  author: item.author_name || 'Editor JornalK1',
  category: item.category_name,
  categoryId: item.category_id,
  tags: item.content.split(' ').filter((word: string) => word.startsWith('#')).map((tag: string) => tag.substring(1)) || [],
  viewCount: item.view_count || 0
});

const NewsDetailPage = () => {
  const router = useRouter();
  const { slug } = router.query;
  
  const [article, setArticle] = useState<ArticleData | null>(null);
  const [relatedNews, setRelatedNews] = useState<ArticleData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSharingOpen, setIsSharingOpen] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const articleRef = useRef<HTMLDivElement>(null);

  // Buscar dados do artigo
  useEffect(() => {
    const fetchData = async () => {
      if (!slug || typeof slug !== 'string') return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Usar a função de utilidade importada para buscar notícia por slug
        const result = await getNewsBySlug(slug);
        
        if (!result || !result.data) {
          setError('Artigo não encontrado');
          return;
        }
        
        // Converter o item da API para o formato usado pelo frontend
        const newsItem = result.data as NewsItem;
        const formattedArticle = formatArticleData(newsItem);
        
        setArticle(formattedArticle);
        
        // Buscar notícias relacionadas usando a função importada
        if (formattedArticle.categoryId) {
          const relatedResult = await getNewsList({
            categoryId: formattedArticle.categoryId,
            limit: 3,
            exclude: formattedArticle.id
          });
          
          if (relatedResult && relatedResult.data && Array.isArray(relatedResult.data.news)) {
            const relatedItems = relatedResult.data.news.map((item: NewsItem) => formatArticleData(item));
            setRelatedNews(relatedItems);
          }
        }
      } catch (err) {
        console.error('Erro ao buscar artigo:', err);
        setError('Não foi possível carregar o artigo. Por favor, tente novamente mais tarde.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [slug]);

  // Verificar se o artigo está nos favoritos
  useEffect(() => {
    if (!article) return;
    
    // Verificar nos favoritos armazenados localmente
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    const isInBookmarks = bookmarks.some((bookmark: ArticleData) => bookmark.id === article.id);
    setIsBookmarked(isInBookmarks);
  }, [article]);

  // Funções de interação
  const toggleBookmark = () => {
    if (!article) return;
    
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    
    if (isBookmarked) {
      // Remover dos favoritos
      const updatedBookmarks = bookmarks.filter((bookmark: ArticleData) => bookmark.id !== article.id);
      localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
      setIsBookmarked(false);
      toast.success('Artigo removido dos favoritos');
    } else {
      // Adicionar aos favoritos
      const newBookmark = {
        id: article.id,
        title: article.title,
        slug: article.slug,
        imageUrl: article.imageUrl,
        category: article.category,
        date: article.date
      };
      localStorage.setItem('bookmarks', JSON.stringify([...bookmarks, newBookmark]));
      setIsBookmarked(true);
      toast.success('Artigo adicionado aos favoritos');
    }
  };

  // Função para compartilhar artigo
  const shareArticle = (platform: string) => {
    if (!article) return;
    
    const articleUrl = `${window.location.origin}/noticia/${article.slug}`;
    const text = `Confira este artigo: ${article.title}`;
    
    let shareUrl = '';
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(articleUrl)}&text=${encodeURIComponent(text)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(articleUrl)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + articleUrl)}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${encodeURIComponent('Artigo interessante: ' + article.title)}&body=${encodeURIComponent(text + '\n\n' + articleUrl)}`;
        break;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank');
  };

  // Mostrar/ocultar opções de compartilhamento
  const toggleShareOptions = () => {
    setIsSharingOpen(!isSharingOpen);
  };

  // SEO props
  const seoProps = article ? {
    title: `${article.title} | JornalK1`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [
        {
          url: article.imageUrl,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
      type: 'article',
      article: {
        publishedTime: article.date,
        authors: [article.author],
        tags: article.tags,
      },
    },
  } : {
    title: 'Carregando artigo | JornalK1',
    description: 'Carregando conteúdo do artigo...',
  };

  // Renderizar estado de carregamento
  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 min-h-screen flex justify-center items-center">
          <LoadingSpinner size="large" color="primary" />
        </div>
      </Layout>
    );
  }

  // Renderizar estado de erro
  if (error || !article) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 min-h-screen">
          <ErrorMessage
            message={error || 'Artigo não encontrado'}
            variant="alert"
            onRetry={() => window.location.reload()}
          />
          <div className="mt-8 text-center">
            <Link href="/" className="text-primary-600 hover:underline">
              Voltar para a página inicial
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <NextSeo {...seoProps} />
      <div className="bg-gray-50 dark:bg-dark-900 transition-colors duration-200">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumbs */}
          <nav className="mb-8 text-sm">
            <ol className="flex items-center text-gray-500 dark:text-gray-400">
              <li>
                <Link href="/" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  Início
                </Link>
              </li>
              <li className="mx-2">
                <span>/</span>
              </li>
              <li>
                <Link href="/noticias" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  Notícias
                </Link>
              </li>
              <li className="mx-2">
                <span>/</span>
              </li>
              <li>
                <Link 
                  href={`/categoria/${article.category.toLowerCase().replace(/\s+/g, '-')}`}
                  className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  {article.category}
                </Link>
              </li>
              <li className="mx-2">
                <span>/</span>
              </li>
              <li className="text-primary-600 dark:text-primary-400 truncate max-w-xs">
                {article.title}
              </li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Article Content */}
            <main className="lg:col-span-8">
              <article ref={articleRef} className="bg-white dark:bg-dark-800 rounded-xl shadow-md overflow-hidden transition-colors duration-200">
                {/* Header image */}
                <div className="relative aspect-video w-full overflow-hidden">
                  <Image
                    src={article.imageUrl}
                    alt={article.title}
                    fill
                    priority
                    className="object-cover"
                  />
                </div>

                <div className="p-6 md:p-8">
                  {/* Title and category */}
                  <header>
                    <div className="mb-4">
                      <Link
                        href={`/categoria/${article.category.toLowerCase().replace(/\s+/g, '-')}`}
                        className="inline-block bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-full px-3 py-1 text-sm font-medium"
                      >
                        {article.category}
                      </Link>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                      {article.title}
                    </h1>

                    {/* Meta information */}
                    <div className="flex flex-wrap items-center text-sm text-gray-500 dark:text-gray-400 mb-6">
                      <div className="flex items-center mr-4 mb-2">
                        <FaUser className="mr-1" />
                        <span>{article.author}</span>
                      </div>
                      <div className="flex items-center mr-4 mb-2">
                        <FaClock className="mr-1" />
                        <span>{article.date}</span>
                      </div>
                      <div className="flex items-center mb-2">
                        <FaEye className="mr-1" />
                        <span>{article.viewCount} visualizações</span>
                      </div>
                    </div>
                  </header>

                  {/* Share and bookmark buttons */}
                  <div className="flex justify-between items-center p-4 mb-6 bg-gray-50 dark:bg-dark-700 rounded-lg transition-colors">
                    <div className="relative">
                      <button
                        onClick={toggleShareOptions}
                        className="flex items-center text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                      >
                        <FaShare className="mr-2" />
                        <span className="font-medium">Compartilhar</span>
                      </button>

                      {/* Share options dropdown */}
                      {isSharingOpen && (
                        <div className="absolute top-10 left-0 z-10 bg-white dark:bg-dark-700 rounded-lg shadow-lg p-2 w-48 transition-colors">
                          <button
                            onClick={() => shareArticle('facebook')}
                            className="flex items-center w-full p-2 hover:bg-gray-100 dark:hover:bg-dark-600 rounded text-left transition-colors"
                          >
                            <FaFacebook className="mr-2 text-blue-600" />
                            <span>Facebook</span>
                          </button>
                          <button
                            onClick={() => shareArticle('twitter')}
                            className="flex items-center w-full p-2 hover:bg-gray-100 dark:hover:bg-dark-600 rounded text-left transition-colors"
                          >
                            <FaTwitter className="mr-2 text-blue-400" />
                            <span>Twitter</span>
                          </button>
                          <button
                            onClick={() => shareArticle('linkedin')}
                            className="flex items-center w-full p-2 hover:bg-gray-100 dark:hover:bg-dark-600 rounded text-left transition-colors"
                          >
                            <FaLinkedin className="mr-2 text-blue-700" />
                            <span>LinkedIn</span>
                          </button>
                          <button
                            onClick={() => shareArticle('whatsapp')}
                            className="flex items-center w-full p-2 hover:bg-gray-100 dark:hover:bg-dark-600 rounded text-left transition-colors"
                          >
                            <FaWhatsapp className="mr-2 text-green-500" />
                            <span>WhatsApp</span>
                          </button>
                          <button
                            onClick={() => shareArticle('email')}
                            className="flex items-center w-full p-2 hover:bg-gray-100 dark:hover:bg-dark-600 rounded text-left transition-colors"
                          >
                            <FaEnvelope className="mr-2 text-gray-600 dark:text-gray-400" />
                            <span>Email</span>
                          </button>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={toggleBookmark}
                      className={`flex items-center font-medium transition-colors ${
                        isBookmarked
                          ? 'text-primary-600 dark:text-primary-400'
                          : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400'
                      }`}
                    >
                      <FaBookmark className={`mr-2 ${isBookmarked ? 'animate-pulse' : ''}`} />
                      <span>{isBookmarked ? 'Salvo' : 'Salvar'}</span>
                    </button>
                  </div>

                  {/* Article content */}
                  <div className="prose prose-lg dark:prose-invert max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: article.content }} />
                  </div>

                  {/* Tags */}
                  {article.tags.length > 0 && (
                    <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Tags:</h3>
                      <div className="flex flex-wrap gap-2">
                        {article.tags.map((tag, index) => (
                          <Link
                            key={index}
                            href={`/tag/${tag.toLowerCase().replace(/\s+/g, '-')}`}
                            className="bg-gray-100 dark:bg-dark-700 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-dark-600 transition-colors"
                          >
                            #{tag}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </article>

              {/* Related articles for mobile */}
              <div className="mt-8 lg:hidden">
                <div className="bg-white dark:bg-dark-800 rounded-xl shadow-md p-6 transition-colors duration-200">
                  <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
                    Artigos Relacionados
                  </h3>
                  <div className="space-y-6">
                    {relatedNews.map((news) => (
                      <div key={news.id} className="flex space-x-4 group">
                        <div className="flex-shrink-0 relative w-20 h-20 rounded-lg overflow-hidden">
                          <OptimizedImage
                            src={news.imageUrl}
                            alt={news.title}
                            fill
                            objectFit="cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800 dark:text-gray-200 line-clamp-2 mb-1 group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors">
                            <Link href={`/noticia/${news.slug}`}>
                              {news.title}
                            </Link>
                          </h4>
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <FaClock className="mr-1 text-xs" />
                            <span>{news.date}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </main>

            {/* Sidebar */}
            <div className="lg:col-span-4 space-y-8">
              {/* Tags Cloud */}
              <div className="bg-white dark:bg-dark-700 rounded-xl shadow-md p-6 transition-colors duration-200">
                <h3 className="text-xl font-bold mb-4 pb-2 border-b border-gray-100 dark:border-gray-700 text-gray-800 dark:text-white">
                  Tags Populares
                </h3>
                <div className="flex flex-wrap gap-2">
                  {['Política', 'Economia', 'Tecnologia', 'Saúde', 'Educação', 'Esportes', 'Cultura', 'Meio Ambiente', 'Internacional', 'Ciência'].map((tag, index) => (
                    <Link
                      key={index}
                      href={`/tag/${tag.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-')}`}
                      className={`bg-gray-100 dark:bg-dark-600 px-3 py-1 rounded-full text-sm transition-colors ${
                        index % 3 === 0 
                          ? 'text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20' 
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-500'
                      }`}
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Related Articles */}
              <div className="hidden lg:block bg-white dark:bg-dark-700 rounded-xl shadow-md p-6 transition-colors duration-200">
                <h3 className="text-xl font-bold mb-4 pb-2 border-b border-gray-100 dark:border-gray-700 text-gray-800 dark:text-white">
                  Artigos Relacionados
                </h3>
                <div className="space-y-6">
                  {relatedNews.map((news) => (
                    <div key={news.id} className="flex space-x-4 group">
                      <div className="flex-shrink-0 relative w-20 h-20 rounded-lg overflow-hidden">
                        <Image
                          src={news.imageUrl}
                          alt={news.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800 dark:text-gray-200 line-clamp-2 mb-1 group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors">
                          <Link href={`/noticia/${news.slug}`}>
                            {news.title}
                          </Link>
                        </h4>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <FaClock className="mr-1 text-xs" />
                          <span>{news.date}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 text-center">
                  <Link 
                    href="/noticias" 
                    className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors"
                  >
                    Ver todas as notícias
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NewsDetailPage;