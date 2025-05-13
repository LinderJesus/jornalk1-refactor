import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { NextSeo } from 'next-seo';
import { motion } from 'framer-motion';
import { 
  FaClock, 
  FaUser, 
  FaFacebook, 
  FaTwitter, 
  FaLinkedin, 
  FaWhatsapp, 
  FaBookmark, 
  FaShare, 
  FaEye, 
  FaEnvelope, 
  FaRegNewspaper 
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import { Layout, LoadingSpinner, ErrorMessage } from '../../components';
import axios from 'axios';

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

const NewsDetailPage = () => {
  const router = useRouter();
  const { slug } = router.query;
  
  const [article, setArticle] = useState<ArticleData | null>(null);
  const [relatedNews, setRelatedNews] = useState<ArticleData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSharingOpen, setIsSharingOpen] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Buscar dados do artigo
  useEffect(() => {
    const fetchData = async () => {
      if (!slug) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await axios.get(`/api/news/slug/${slug}`);
        const articleData = response.data;
        
        if (articleData.success && articleData.data) {
          setArticle(articleData.data);
          setRelatedNews(articleData.relatedNews || []);
        } else {
          setError('Notícia não encontrada');
        }
        
        if (articleData.categoryId) {
          const relatedResponse = await axios.get('/api/news', {
            params: {
              categoryId: articleData.categoryId,
              limit: 3,
              exclude: articleData.data.id
            }
          });
          
          setRelatedNews(relatedResponse.data);
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
    const isInBookmarks = bookmarks.some((bookmark: any) => bookmark.id === article.id);
    setIsBookmarked(isInBookmarks);
  }, [article]);

  // Funções de interação
  const toggleBookmark = () => {
    if (!article) return;
    
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    
    if (isBookmarked) {
      // Remover dos favoritos
      const updatedBookmarks = bookmarks.filter((bookmark: any) => bookmark.id !== article.id);
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
        date: article.date,
        category: article.category
      };
      
      const updatedBookmarks = [...bookmarks, newBookmark];
      localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
      setIsBookmarked(true);
      toast.success('Artigo salvo nos favoritos');
    }
  };
  
  const shareArticle = (platform: string) => {
    if (!article) return;
    
    const url = `https://jornalk1surf.com.br/noticia/${article.slug}`;
    const title = article.title;
    
    let shareUrl = '';
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' ' + url)}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`;
        break;
      default:
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank');
    }
    
    setIsSharingOpen(false);
  };

  // Preparando metadata para SEO
  const seoProps = {
    title: article ? `${article.title} | JornalK1 Surf` : 'Carregando... | JornalK1 Surf',
    description: article ? article.excerpt : 'Carregando artigo...',
    url: article ? `https://jornalk1surf.com.br/noticia/${article.slug}` : '',
    imageUrl: article ? `https://jornalk1surf.com.br${article.imageUrl}` : ''
  };

  // Estado de carregamento
  if (isLoading) {
    return (
      <Layout>
        <NextSeo title="Carregando..." description="Carregando artigo..." />
        <div className="container mx-auto px-4 py-16 min-h-[60vh] flex items-center justify-center">
          <div className="flex flex-col items-center justify-center min-h-[40vh]">
            <div className="relative w-16 h-16">
              <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>
              <div className="absolute top-0 left-0 w-full h-full border-4 border-t-primary-500 dark:border-t-primary-400 rounded-full animate-spin"></div>
            </div>
            <p className="mt-6 text-lg text-gray-600 dark:text-gray-400 font-medium">Carregando artigo...</p>
          </div>
        </div>
      </Layout>
    );
  }
  
  // Exibe mensagem de erro se houver
  if (error) {
    return (
      <Layout>
        <NextSeo 
          title="Erro | JornalK1 Surf" 
          description="Ocorreu um erro ao carregar o artigo."
        />
        <div className="container mx-auto px-4 py-16 min-h-[60vh] flex items-center justify-center">
          <ErrorMessage 
            message={error} 
            variant="alert" 
            onRetry={() => window.location.reload()} 
          />
        </div>
      </Layout>
    );
  }

  // Artigo não encontrado
  if (!article) {
    return (
      <Layout>
        <NextSeo 
          title="Artigo não encontrado | JornalK1 Surf" 
          description="O artigo que você está procurando não existe ou foi removido."
        />
        <div className="bg-gray-50 dark:bg-dark-800 min-h-screen flex items-center justify-center transition-colors duration-200">
          <div className="text-center max-w-lg px-6">
            <div className="mb-8">
              <FaRegNewspaper className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-700" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Artigo não encontrado</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">O artigo que você está procurando não existe ou foi removido. Verifique o endereço ou tente novamente mais tarde.</p>
            <Link href="/" className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-md transition-colors duration-200 inline-flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Voltar para a página inicial
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  // Renderiza o artigo
  return (
    <Layout>
      <div className="bg-gray-50 dark:bg-dark-800 min-h-screen transition-colors duration-200">
        <NextSeo 
          title={seoProps.title} 
          description={seoProps.description} 
          canonical={seoProps.url} 
          openGraph={{
            title: article.title,
            description: article.excerpt,
            url: seoProps.url,
            type: 'article',
            article: {
              publishedTime: article.date,
              tags: article.tags
            },
            images: [
              {
                url: seoProps.imageUrl,
                width: 1200,
                height: 630,
                alt: article.title,
              },
            ],
          }}
        />
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumbs */}
          <div className="mb-8">
            <nav className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
              <Link href="/" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                Home
              </Link>
              <span className="mx-2 text-gray-400 dark:text-gray-600">/</span>
              <Link href="/noticias" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                Notícias
              </Link>
              <span className="mx-2 text-gray-400 dark:text-gray-600">/</span>
              <span className="text-gray-700 dark:text-gray-300 line-clamp-1">{article.title}</span>
            </nav>
          </div>
        
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Artigo principal */}
            <div className="lg:col-span-8">
              <article className="bg-white dark:bg-dark-700 rounded-xl shadow-md overflow-hidden transition-colors duration-200">
                {/* Imagem do artigo */}
                <div className="relative h-[300px] md:h-[400px] lg:h-[480px]">
                  <Image 
                    src={article.imageUrl}
                    alt={article.title}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 65vw"
                    priority
                  />
                </div>
                
                {/* Conteúdo */}
                <div className="p-6 lg:p-8">
                  {/* Categoria e data */}
                  <div className="flex flex-wrap items-center mb-4 text-sm">
                    <Link 
                      href={`/noticias?categoria=${article.category}`}
                      className="bg-primary-500/10 text-primary-600 dark:text-primary-400 px-3 py-1 rounded-full font-medium"
                    >
                      {article.category}
                    </Link>
                    <div className="flex items-center ml-4 text-gray-500 dark:text-gray-400">
                      <FaClock className="mr-1 text-xs" />
                      <span>{article.date}</span>
                    </div>
                  </div>
                  
                  {/* Título */}
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                    {article.title}
                  </h1>
                  
                  {/* Autor e estatísticas */}
                  <div className="flex flex-wrap items-center gap-4 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 mr-3 flex items-center justify-center">
                        <FaUser className="text-gray-500 dark:text-gray-400" />
                      </div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">{article.author}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <FaEye className="mr-1" />
                      <span>{article.viewCount} visualizações</span>
                    </div>
                    
                    {/* Ações */}
                    <div className="flex items-center ml-auto gap-2">
                      <button 
                        onClick={toggleBookmark}
                        className={`p-2 rounded-full transition-colors ${
                          isBookmarked 
                            ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400' 
                            : 'bg-gray-100 text-gray-600 dark:bg-dark-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-dark-500'
                        }`}
                        aria-label={isBookmarked ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                      >
                        <FaBookmark />
                      </button>
                      
                      <div className="relative">
                        <button 
                          onClick={() => setIsSharingOpen(!isSharingOpen)}
                          className="p-2 bg-gray-100 dark:bg-dark-600 text-gray-600 dark:text-gray-400 rounded-full hover:bg-gray-200 dark:hover:bg-dark-500 transition-colors"
                          aria-label="Compartilhar"
                        >
                          <FaShare />
                        </button>
                        
                        {isSharingOpen && (
                          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-600 rounded-lg shadow-lg z-10 p-2">
                            <div className="flex justify-between items-center">
                              <button 
                                onClick={() => shareArticle('facebook')} 
                                className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full"
                                aria-label="Compartilhar no Facebook"
                              >
                                <FaFacebook size={20} />
                              </button>
                              <button 
                                onClick={() => shareArticle('twitter')} 
                                className="p-2 text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full"
                                aria-label="Compartilhar no Twitter"
                              >
                                <FaTwitter size={20} />
                              </button>
                              <button 
                                onClick={() => shareArticle('linkedin')} 
                                className="p-2 text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full"
                                aria-label="Compartilhar no LinkedIn"
                              >
                                <FaLinkedin size={20} />
                              </button>
                              <button 
                                onClick={() => shareArticle('whatsapp')} 
                                className="p-2 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-full"
                                aria-label="Compartilhar no WhatsApp"
                              >
                                <FaWhatsapp size={20} />
                              </button>
                              <button 
                                onClick={() => shareArticle('email')} 
                                className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-500 rounded-full"
                                aria-label="Compartilhar por email"
                              >
                                <FaEnvelope size={20} />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Conteúdo do artigo */}
                  <div 
                    className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-gray-800 dark:prose-headings:text-white prose-p:text-gray-600 dark:prose-p:text-gray-300 prose-a:text-primary-600 dark:prose-a:text-primary-400 prose-img:rounded-lg"
                    dangerouslySetInnerHTML={{ __html: article.content }}
                  />
                  
                  {/* Tags */}
                  {article.tags && article.tags.length > 0 && (
                    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {article.tags.map((tag, index) => (
                          <Link 
                            key={index}
                            href={`/noticias?tag=${tag}`}
                            className="bg-gray-100 dark:bg-dark-600 text-gray-600 dark:text-gray-400 px-3 py-1 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-dark-500 transition-colors"
                          >
                            {tag}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </article>
              
              {/* Comentários - pode ser implementado posteriormente */}
              <div className="mt-8 bg-white dark:bg-dark-700 rounded-xl shadow-md p-6 transition-colors duration-200">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Comentários</h3>
                <div className="text-center py-8">
                  <p className="text-gray-600 dark:text-gray-400">Sistema de comentários em desenvolvimento.</p>
                </div>
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="lg:col-span-4">
              {/* Artigos relacionados */}
              <div className="bg-white dark:bg-dark-700 rounded-xl shadow-md overflow-hidden transition-colors duration-200">
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Notícias relacionadas</h3>
                  
                  {relatedNews.length > 0 ? (
                    <div className="space-y-4">
                      {relatedNews.map((news) => (
                        <div key={news.id} className="group flex gap-3">
                          <div className="w-20 h-20 relative flex-shrink-0 rounded-md overflow-hidden">
                            <Image
                              src={news.imageUrl}
                              alt={news.title}
                              fill
                              style={{ objectFit: 'cover' }}
                              sizes="80px"
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
                  ) : (
                    <p className="text-gray-600 dark:text-gray-400 py-4">Não há notícias relacionadas.</p>
                  )}
                  
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
      </div>
    </Layout>
  );
};

export default NewsDetailPage;
