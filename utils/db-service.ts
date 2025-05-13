import { executeQuery, NewsArticle, NewsData } from './db';

/**
 * Interface para categorias com contagem de notícias
 */
interface CategoryWithCount {
  id: number;
  name: string;
  slug: string;
  description?: string;
  news_count: number;
}

/**
 * Serviço para manipulação de dados do banco
 * Implementa cache e tratamento de erros
 */
class DatabaseService {
  private cache: Record<string, {
    data: unknown;
    timestamp: number;
  }> = {};
  
  private CACHE_TTL = 1000 * 60 * 5; // 5 minutos
  
  /**
   * Verifica se o cache é válido
   */
  private isCacheValid(cacheKey: string): boolean {
    if (!this.cache[cacheKey]) return false;
    const now = Date.now();
    return (now - this.cache[cacheKey].timestamp) < this.CACHE_TTL;
  }
  
  /**
   * Obtém notícia por slug com cache
   */
  async getNewsBySlug(slug: string): Promise<NewsArticle | null> {
    const cacheKey = `news_${slug}`;
    
    if (this.isCacheValid(cacheKey)) {
      return this.cache[cacheKey].data;
    }
    
    try {
      const result = await executeQuery<NewsArticle[]>(
        `SELECT n.*, c.name as category_name, u.name as author_name
         FROM news n
         JOIN categories c ON n.category_id = c.id
         JOIN users u ON n.author_id = u.id
         WHERE n.slug = ? AND n.status = 'published'`,
        [slug]
      );
      
      const news = result.length > 0 ? result[0] : null;
      
      // Atualiza o cache
      this.cache[cacheKey] = {
        data: news,
        timestamp: Date.now()
      };
      
      // Incrementa visualizações
      if (news) {
        await this.incrementViewCount(news.id);
      }
      
      return news;
    } catch (error) {
      console.error(`Erro ao buscar notícia com slug ${slug}:`, error);
      return null;
    }
  }
  
  /**
   * Incrementa contador de visualizações de uma notícia
   */
  private async incrementViewCount(newsId: number): Promise<void> {
    try {
      await executeQuery(
        'UPDATE news SET view_count = view_count + 1 WHERE id = ?',
        [newsId]
      );
    } catch (error) {
      console.error(`Erro ao incrementar visualizações para notícia ${newsId}:`, error);
    }
  }
  
  /**
   * Obtém lista de notícias com filtros
   */
  async getNewsList(options: {
    limit?: number;
    offset?: number;
    categoryId?: number;
    featured?: boolean;
    searchQuery?: string;
  }): Promise<{ news: NewsArticle[]; total: number }> {
    const { 
      limit = 10, 
      offset = 0, 
      categoryId, 
      featured = false,
      searchQuery
    } = options;
    
    const cacheKey = `news_list_${limit}_${offset}_${categoryId}_${featured}_${searchQuery}`;
    
    if (this.isCacheValid(cacheKey)) {
      return this.cache[cacheKey].data as { news: NewsArticle[]; total: number };
    }
    
    try {
      // Construção da query base
      let query = `
        SELECT n.*, c.name as category_name, u.name as author_name
        FROM news n
        JOIN categories c ON n.category_id = c.id
        JOIN users u ON n.author_id = u.id
        WHERE n.status = 'published'
      `;
      
      // Construção da query para total
      let countQuery = `
        SELECT COUNT(*) as total
        FROM news n
        WHERE n.status = 'published'
      `;
      
      const params: (string | number)[] = [];
      const countParams: (string | number)[] = [];
      
      // Adiciona filtro de categoria
      if (categoryId !== undefined && categoryId !== null) {
        query += ' AND n.category_id = ?';
        countQuery += ' AND n.category_id = ?';
        params.push(categoryId);
        countParams.push(categoryId);
      }
      
      // Adiciona filtro de featured
      if (featured) {
        query += ' AND n.is_featured = 1';
        countQuery += ' AND n.is_featured = 1';
      }
      
      // Adiciona filtro de busca
      if (searchQuery) {
        query += ' AND (n.title LIKE ? OR n.content LIKE ? OR n.excerpt LIKE ?)';
        countQuery += ' AND (n.title LIKE ? OR n.content LIKE ? OR n.excerpt LIKE ?)';
        const searchParam = `%${searchQuery}%`;
        params.push(searchParam, searchParam, searchParam);
        countParams.push(searchParam, searchParam, searchParam);
      }
      
      // Finaliza queries
      query += ' ORDER BY n.created_at DESC LIMIT ? OFFSET ?';
      params.push(limit, offset);
      
      // Executa queries
      const news = await executeQuery<NewsArticle[]>(query, params);
      const totalResult = await executeQuery<{total: number}[]>(countQuery, countParams);
      const total = totalResult[0]?.total || 0;
      
      const result = { news, total };
      
      // Atualiza cache
      this.cache[cacheKey] = {
        data: result,
        timestamp: Date.now()
      };
      
      return result;
    } catch (error) {
      console.error('Erro ao buscar lista de notícias:', error);
      return { news: [], total: 0 };
    }
  }
  
  /**
   * Obtém categorias com contagem de notícias
   */
  async getCategories(): Promise<CategoryWithCount[]> {
    const cacheKey = 'categories';
    
    if (this.isCacheValid(cacheKey)) {
      return this.cache[cacheKey].data as CategoryWithCount[];
    }
    
    try {
      const categories = await executeQuery<CategoryWithCount[]>(`
        SELECT c.*, COUNT(n.id) as news_count
        FROM categories c
        LEFT JOIN news n ON c.id = n.category_id AND n.status = 'published'
        GROUP BY c.id
        ORDER BY c.name
      `);
      
      this.cache[cacheKey] = {
        data: categories,
        timestamp: Date.now()
      };
      
      return categories;
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      return [];
    }
  }
  
  /**
   * Limpa o cache quando há modificações no banco
   */
  clearCache(): void {
    this.cache = {};
  }
  
  /**
   * Cria uma nova notícia
   */
  async createNews(newsData: NewsData): Promise<number> {
    try {
      const result = await executeQuery<{insertId: number}>(
        `INSERT INTO news (
          title, slug, content, excerpt, image_url, 
          category_id, author_id, status, is_featured,
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          newsData.title,
          newsData.slug,
          newsData.content,
          newsData.excerpt,
          newsData.imageUrl,
          newsData.categoryId,
          newsData.authorId,
          newsData.status,
          newsData.isFeatured ? 1 : 0
        ]
      );
      
      this.clearCache();
      return result.insertId;
    } catch (error) {
      console.error('Erro ao criar notícia:', error);
      throw error;
    }
  }
  
  /**
   * Atualiza uma notícia existente
   */
  async updateNews(id: number, newsData: NewsData): Promise<boolean> {
    try {
      const result = await executeQuery<{affectedRows: number}>(
        `UPDATE news SET
          title = ?,
          slug = ?,
          content = ?,
          excerpt = ?,
          image_url = ?,
          category_id = ?,
          status = ?,
          is_featured = ?,
          updated_at = NOW()
        WHERE id = ?`,
        [
          newsData.title,
          newsData.slug,
          newsData.content,
          newsData.excerpt,
          newsData.imageUrl,
          newsData.categoryId,
          newsData.status,
          newsData.isFeatured ? 1 : 0,
          id
        ]
      );
      
      this.clearCache();
      return result.affectedRows > 0;
    } catch (error) {
      console.error(`Erro ao atualizar notícia ${id}:`, error);
      throw error;
    }
  }
  
  /**
   * Exclui uma notícia
   */
  async deleteNews(id: number): Promise<boolean> {
    try {
      const result = await executeQuery<{affectedRows: number}>(
        'DELETE FROM news WHERE id = ?',
        [id]
      );
      
      this.clearCache();
      return result.affectedRows > 0;
    } catch (error) {
      console.error(`Erro ao excluir notícia ${id}:`, error);
      throw error;
    }
  }
}

// Exporta uma instância única do serviço
export const dbService = new DatabaseService();
