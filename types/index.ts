// Definição dos tipos para o site JornalK1

export interface Article {
  id: number;
  title: string;
  excerpt: string;
  imageUrl: string;
  date: string;
  author: string;
  category: string;
  slug: string;
  viewCount?: number;
  tags?: string[];
  content?: string;
  featured?: boolean;
  categoryId?: number;
}

// Alias para Article para manter consistência com o código já existente
export type NewsArticle = Article;

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  count: number;
  icon?: string;
  color?: string;
  imageUrl?: string;
}

export interface VideoContent {
  videoId: string;
  title: string;
  description: string;
  thumbnail?: string;
}

export interface Comment {
  id: number;
  author: string;
  authorImage?: string;
  content: string;
  date: string;
  likes: number;
  replies?: Comment[];
}

export interface SearchResult {
  id: number;
  title: string;
  category: string;
  slug: string;
  type: 'article' | 'category' | 'tag';
}

export interface StatItem {
  id: number;
  value: number;
  label: string;
  icon: string;
  color: string;
}
