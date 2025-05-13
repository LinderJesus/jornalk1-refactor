import { NextApiRequest, NextApiResponse } from 'next';
import { dbService } from '../../../utils/db-service';
import { MOCK_MODE, DEBUG_MOCK } from '../mock-mode';
import { categories as mockCategories } from '../../../data/mockData';

/**
 * Manipulador de API para categorias
 * GET: Obtém lista de categorias com contagem de notícias
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Apenas o método GET é suportado para acesso público
    if (req.method !== 'GET') {
      return res.status(405).json({
        success: false,
        message: 'Método não permitido'
      });
    }
    
    // Verificar se estamos usando o modo mock
    if (MOCK_MODE) {
      if (DEBUG_MOCK) console.log('Usando dados mockados para a API de categorias');
      
      // Formatar as categorias mockadas para corresponder à estrutura retornada pelo DB
      const formattedCategories = mockCategories.map(cat => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description || '',
        news_count: cat.count || 0
      }));
      
      return res.status(200).json({
        success: true,
        data: formattedCategories
      });
    }
    
    try {
      // Buscar categorias com o serviço atualizado
      const categories = await dbService.getCategories();
      
      return res.status(200).json({
        success: true,
        data: categories
      });
    } catch (dbError) {
      console.error('Erro ao acessar o banco de dados para categorias:', dbError);
      
      // Fallback para modo mockado
      const formattedCategories = mockCategories.map(cat => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description || '',
        news_count: cat.count || 0
      }));
      
      return res.status(200).json({
        success: true,
        data: formattedCategories
      });
    }
  } catch (error) {
    console.error('Erro na API de categorias:', error);
    
    // Se estiver no modo mock, fornecer dados mockados mesmo em caso de erro
    if (MOCK_MODE) {
      console.warn('Fornecendo dados mockados de categorias devido a erro na API');
      
      const formattedCategories = mockCategories.map(cat => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description || '',
        news_count: cat.count || 0
      }));
      
      return res.status(200).json({
        success: true,
        data: formattedCategories
      });
    }
    
    // Tratar o erro de forma mais segura, com tipagem adequada
    const errorMessage = error instanceof Error ? error.message : 'Erro interno do servidor';
    const errorString = error instanceof Error ? error.toString() : 'Erro desconhecido';
    
    // Retornar mensagem de erro mais específica quando disponível
    return res.status(500).json({
      success: false,
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? errorString : undefined
    });
  }
}
