import axios from 'axios';

/**
 * Cliente para consumo da API interna
 * Implementa métodos para buscar dados do backend
 */
const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Tipos para as notícias
export interface NewsItem {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  image_url: string;
  category_id: number;
  category_name: string;
  author_id: number;
  author_name?: string;
  status: string;
  is_featured: number;
  view_count: number;
  created_at: string;
  updated_at: string;
}

export interface NewsListResponse {
  success: boolean;
  data: NewsItem[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

export interface NewsResponse {
  success: boolean;
  data: NewsItem;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  news_count: number;
}

export interface CategoriesResponse {
  success: boolean;
  data: Category[];
}

/**
 * Obter lista de notícias com filtros
 */
export const getNewsList = async (params: {
  limit?: number;
  offset?: number;
  categoryId?: number;
  featured?: boolean;
  search?: string;
}): Promise<NewsListResponse> => {
  try {
    const response = await apiClient.get('/news', { params });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar notícias:', error);
    return {
      success: false,
      data: [],
      meta: {
        total: 0,
        page: 1,
        pageSize: 10,
        totalPages: 0
      }
    };
  }
};

/**
 * Obter detalhes de uma notícia por slug
 */
export const getNewsBySlug = async (slug: string): Promise<NewsResponse> => {
  try {
    const response = await apiClient.get(`/news/${slug}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar notícia com slug ${slug}:`, error);
    // Criando uma resposta vazia com a estrutura correta
    const emptyNews: NewsItem = {
      id: 0,
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      image_url: '',
      category_id: 0,
      category_name: '',
      author_id: 0,
      status: '',
      is_featured: 0,
      view_count: 0,
      created_at: '',
      updated_at: ''
    };
    return {
      success: false,
      data: emptyNews
    };
  }
};

/**
 * Obter lista de categorias
 */
export const getCategories = async (): Promise<CategoriesResponse> => {
  try {
    const response = await apiClient.get('/categories');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    return {
      success: false,
      data: []
    };
  }
};

/**
 * Criar uma nova notícia (requer autenticação)
 */
export const createNews = async (data: {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  imageUrl?: string;
  categoryId: number;
  status?: string;
  isFeatured?: boolean;
}): Promise<{ success: boolean; data?: { id: number }; message?: string }> => {
  try {
    const response = await apiClient.post('/news', data);
    return response.data;
  } catch (error: unknown) {
    console.error('Erro ao criar notícia:', error);
    const err = error as Error & { response?: { data?: { message?: string } } };
    return {
      success: false,
      message: err.response?.data?.message || 'Erro ao criar notícia'
    };
  }
};

/**
 * Atualizar uma notícia existente (requer autenticação)
 */
export const updateNews = async (
  id: number,
  data: {
    title: string;
    slug: string;
    content: string;
    excerpt?: string;
    imageUrl?: string;
    categoryId: number;
    status?: string;
    isFeatured?: boolean;
  }
): Promise<{ success: boolean; message?: string }> => {
  try {
    const response = await apiClient.put(`/news/${id}`, data);
    return response.data;
  } catch (error: unknown) {
    console.error(`Erro ao atualizar notícia ${id}:`, error);
    const err = error as Error & { response?: { data?: { message?: string } } };
    return {
      success: false,
      message: err.response?.data?.message || 'Erro ao atualizar notícia'
    };
  }
};

/**
 * Excluir uma notícia (requer autenticação de administrador)
 */
export const deleteNews = async (id: number): Promise<{ success: boolean; message?: string }> => {
  try {
    const response = await apiClient.delete(`/news/${id}`);
    return response.data;
  } catch (error: unknown) {
    console.error(`Erro ao excluir notícia ${id}:`, error);
    const err = error as Error & { response?: { data?: { message?: string } } };
    return {
      success: false,
      message: err.response?.data?.message || 'Erro ao excluir notícia'
    };
  }
};

// Exportar o cliente para uso direto quando necessário
export default apiClient;
