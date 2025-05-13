import { NextApiRequest, NextApiResponse } from 'next';
import { dbService } from '../../../utils/db-service';
import { getSession } from 'next-auth/react';

/**
 * Manipulador de API para uma notícia específica
 * GET: Obtém detalhes de uma notícia por ID ou slug
 * PUT: Atualiza uma notícia existente (requer autenticação)
 * DELETE: Remove uma notícia (requer autenticação)
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Obter o ID ou slug da notícia da rota
    const { id } = req.query;
    
    if (!id || Array.isArray(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID ou slug de notícia inválido'
      });
    }
    
    // Verificar se o id é numérico ou um slug
    const isNumeric = /^\d+$/.test(id);
    
    // Obter sessão para verificação de autenticação quando necessário
    const session = await getSession({ req });
    
    // Tratar diferentes métodos HTTP
    switch (req.method) {
      case 'GET': {
        let news;
        
        if (isNumeric) {
          // Implementar busca por ID (não implementado no serviço atual)
          // Para maior compatibilidade, vamos redirecionar para o endpoint correto
          return res.status(404).json({
            success: false,
            message: 'Busca por ID numérico não implementada. Use o slug da notícia.'
          });
        } else {
          // Buscar por slug usando o serviço
          news = await dbService.getNewsBySlug(id);
        }
        
        if (!news) {
          return res.status(404).json({
            success: false,
            message: 'Notícia não encontrada'
          });
        }
        
        return res.status(200).json({
          success: true,
          data: news
        });
      }
      
      case 'PUT': {
        // Verificar autenticação
        if (!session || !session.user) {
          return res.status(401).json({
            success: false,
            message: 'Você precisa estar autenticado para atualizar uma notícia'
          });
        }
        
        // Verificar se o ID é numérico
        if (!isNumeric) {
          return res.status(400).json({
            success: false,
            message: 'ID inválido. É necessário fornecer um ID numérico para atualização.'
          });
        }
        
        // Validar dados da requisição
        const { title, slug, content, excerpt, imageUrl, categoryId, status, isFeatured } = req.body;
        
        if (!title || !slug || !content || !categoryId) {
          return res.status(400).json({
            success: false,
            message: 'Dados incompletos. Título, slug, conteúdo e categoria são obrigatórios'
          });
        }
        
        // Definir interface para o usuário da sessão
        interface SessionUser {
          id: number;
          name: string;
          email: string;
          role: string;
        }
        
        // Atualizar notícia
        const updated = await dbService.updateNews(parseInt(id), {
          title,
          slug,
          content,
          excerpt: excerpt || '',
          imageUrl: imageUrl || '',
          categoryId: Number(categoryId),
          authorId: (session.user as SessionUser).id,
          status: status || 'draft',
          isFeatured: isFeatured || false
        });
        
        if (!updated) {
          return res.status(404).json({
            success: false,
            message: 'Notícia não encontrada ou não foi possível atualizá-la'
          });
        }
        
        return res.status(200).json({
          success: true,
          message: 'Notícia atualizada com sucesso'
        });
      }
      
      case 'DELETE': {
        // Verificar autenticação
        interface SessionUser {
          id: number;
          name: string;
          email: string;
          role: string;
        }
        
        if (!session || !session.user || (session.user as SessionUser).role !== 'admin') {
          return res.status(401).json({
            success: false,
            message: 'Você precisa ser administrador para excluir uma notícia'
          });
        }
        
        // Verificar se o ID é numérico
        if (!isNumeric) {
          return res.status(400).json({
            success: false,
            message: 'ID inválido. É necessário fornecer um ID numérico para exclusão.'
          });
        }
        
        // Excluir notícia
        const deleted = await dbService.deleteNews(parseInt(id));
        
        if (!deleted) {
          return res.status(404).json({
            success: false,
            message: 'Notícia não encontrada ou não foi possível excluí-la'
          });
        }
        
        return res.status(200).json({
          success: true,
          message: 'Notícia excluída com sucesso'
        });
      }
      
      default:
        return res.status(405).json({
          success: false,
          message: 'Método não permitido'
        });
    }
  } catch (error: any) {
    console.error('Erro na API de notícia específica:', error);
    
    // Retornar mensagem de erro mais específica quando disponível
    return res.status(500).json({
      success: false,
      message: error.message || 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? error.toString() : undefined
    });
  }
}
