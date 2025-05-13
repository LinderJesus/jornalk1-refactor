import mysql from 'mysql2/promise';

// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'jornalk1',
};

// Create a connection pool
const pool = mysql.createPool(dbConfig);

// Helper function to execute SQL queries
type QueryParams = string | number | boolean | null | Buffer;

interface NewsArticle {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  image_url: string;
  category_id: number;
  category_name: string;
  author_id: number;
  status: string;
  is_featured: number;
  created_at: string;
  updated_at: string;
}

export async function executeQuery<T>(query: string, params: QueryParams[] = []): Promise<T> {
  try {
    const [results] = await pool.execute(query, params);
    return results as T;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// Helper function to get a single news article by slug
export async function getNewsBySlug(slug: string) {
  const query = `
    SELECT n.*, c.name as category_name 
    FROM news n
    JOIN categories c ON n.category_id = c.id
    WHERE n.slug = ? AND n.status = 'published'
  `;
  
  const results = await executeQuery<NewsArticle[]>(query, [slug]);
  return results.length > 0 ? results[0] : null;
}

// Helper function to get all published news articles
export async function getAllNews(limit = 10, offset = 0, categoryId?: number) {
  let query = `
    SELECT n.*, c.name as category_name 
    FROM news n
    JOIN categories c ON n.category_id = c.id
    WHERE n.status = 'published'
  `;
  
  const params: QueryParams[] = [];
  
  if (categoryId) {
    query += ' AND n.category_id = ?';
    params.push(categoryId);
  }
  
  query += ' ORDER BY n.created_at DESC LIMIT ? OFFSET ?';
  params.push(limit, offset);
  
  return executeQuery<NewsArticle[]>(query, params);
}

// Helper function to get featured news articles
export async function getFeaturedNews(limit = 5) {
  const query = `
    SELECT n.*, c.name as category_name 
    FROM news n
    JOIN categories c ON n.category_id = c.id
    WHERE n.status = 'published' AND n.is_featured = 1
    ORDER BY n.created_at DESC
    LIMIT ?
  `;
  
  return executeQuery<NewsArticle[]>(query, [limit]);
}

// Helper function to get all categories
export async function getAllCategories() {
  const query = `
    SELECT c.*, COUNT(n.id) as news_count
    FROM categories c
    LEFT JOIN news n ON c.id = n.category_id AND n.status = 'published'
    GROUP BY c.id
    ORDER BY c.name
  `;
  
  interface Category {
    id: number;
    name: string;
    slug: string;
    description: string;
    news_count: number;
  }

  return executeQuery<Category[]>(query, []);
}

// Helper function to create a new news article
interface NewsData {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  imageUrl: string;
  categoryId: number;
  authorId: number;
  status: string;
  isFeatured: boolean;
}

export async function createNews(newsData: NewsData) {
  const query = `
    INSERT INTO news (
      title, slug, content, excerpt, image_url, 
      category_id, author_id, status, is_featured, 
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
  `;
  
  const params = [
    newsData.title,
    newsData.slug,
    newsData.content,
    newsData.excerpt,
    newsData.imageUrl,
    newsData.categoryId,
    newsData.authorId,
    newsData.status,
    newsData.isFeatured ? 1 : 0
  ];
  
  interface InsertResult {
    insertId: number;
    affectedRows: number;
  }

  const result = await executeQuery<InsertResult>(query, params);
  return result.insertId;
}

// Helper function to update an existing news article
export async function updateNews(id: number, newsData: NewsData) {
  const query = `
    UPDATE news SET
      title = ?,
      slug = ?,
      content = ?,
      excerpt = ?,
      image_url = ?,
      category_id = ?,
      status = ?,
      is_featured = ?,
      updated_at = NOW()
    WHERE id = ?
  `;
  
  const params = [
    newsData.title,
    newsData.slug,
    newsData.content,
    newsData.excerpt,
    newsData.imageUrl,
    newsData.categoryId,
    newsData.status,
    newsData.isFeatured ? 1 : 0,
    id
  ];
  
  interface UpdateResult {
    affectedRows: number;
    changedRows: number;
  }

  return executeQuery<UpdateResult>(query, params);
}

// Helper function to delete a news article
export async function deleteNews(id: number) {
  const query = 'DELETE FROM news WHERE id = ?';
  interface DeleteResult {
    affectedRows: number;
  }

  return executeQuery<DeleteResult>(query, [id]);
}
