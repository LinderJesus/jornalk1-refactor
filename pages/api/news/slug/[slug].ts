import { NextApiRequest, NextApiResponse } from 'next';
import { dbService } from '../../../../utils/db-service';

/**
 * Manipulador de API para buscar notícia por slug
 * GET: Obtém detalhes de uma notícia por slug
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Apenas permitir método GET
    if (req.method !== 'GET') {
      return res.status(405).json({
        success: false,
        message: 'Método não permitido'
      });
    }

    // Obter o slug da notícia da rota
    const { slug } = req.query;
    
    if (!slug || Array.isArray(slug)) {
      return res.status(400).json({
        success: false,
        message: 'Slug de notícia inválido'
      });
    }
    
    // Buscar notícia pelo slug
    const news = await dbService.getNewsBySlug(slug);
    
    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'Notícia não encontrada'
      });
    }
    
    // Buscar notícias relacionadas (mesma categoria)
    const { news: relatedNews } = await dbService.getNewsList({
      limit: 4,
      categoryId: news.category_id,
    });
    
    // Remover a notícia atual das relacionadas
    const filteredRelatedNews = relatedNews.filter(item => item.id !== news.id);
    
    // Retornar dados da notícia e notícias relacionadas
    return res.status(200).json({
      success: true,
      data: news,
      relatedNews: filteredRelatedNews.slice(0, 3) // Limitar a 3 notícias relacionadas
    });
    
  } catch (error) {
    console.error('Erro ao buscar notícia por slug:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao buscar notícia'
    });
  }
}
