/**
 * Sistema de cache avançado para recursos estáticos
 * Melhora o desempenho do site armazenando recursos em cache
 */

// Tipos de recursos que podem ser armazenados em cache
type ResourceType = 'image' | 'json' | 'font' | 'css' | 'js' | 'html' | 'other';

// Interface para um item de cache
interface CacheItem {
  url: string;
  type: ResourceType;
  data: unknown;
  timestamp: number;
  expiresAt: number;
  size: number;
}

// Configurações do cache
interface CacheConfig {
  maxSize: number; // Tamanho máximo do cache em bytes
  defaultExpiration: number; // Tempo de expiração padrão em milissegundos
  expirations: Record<ResourceType, number>; // Tempo de expiração por tipo de recurso
}

class ResourceCache {
  private cache: Map<string, CacheItem>;
  private config: CacheConfig;
  private currentSize: number;
  private hits: number;
  private misses: number;

  constructor(config?: Partial<CacheConfig>) {
    this.cache = new Map();
    this.currentSize = 0;
    this.hits = 0;
    this.misses = 0;

    // Configurações padrão
    this.config = {
      maxSize: 50 * 1024 * 1024, // 50MB
      defaultExpiration: 24 * 60 * 60 * 1000, // 24 horas
      expirations: {
        image: 7 * 24 * 60 * 60 * 1000, // 7 dias
        json: 60 * 60 * 1000, // 1 hora
        font: 30 * 24 * 60 * 60 * 1000, // 30 dias
        css: 7 * 24 * 60 * 60 * 1000, // 7 dias
        js: 7 * 24 * 60 * 60 * 1000, // 7 dias
        html: 60 * 60 * 1000, // 1 hora
        other: 24 * 60 * 60 * 1000, // 24 horas
      },
      ...config
    };
  }

  /**
   * Determina o tipo de recurso com base na URL ou no tipo MIME
   */
  private getResourceType(url: string, contentType?: string): ResourceType {
    if (contentType) {
      if (contentType.includes('image')) return 'image';
      if (contentType.includes('json')) return 'json';
      if (contentType.includes('font')) return 'font';
      if (contentType.includes('css')) return 'css';
      if (contentType.includes('javascript')) return 'js';
      if (contentType.includes('html')) return 'html';
    }

    // Determinar pelo nome do arquivo se não tiver contentType
    const extension = url.split('.').pop()?.toLowerCase();
    if (!extension) return 'other';

    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'avif'].includes(extension)) return 'image';
    if (extension === 'json') return 'json';
    if (['woff', 'woff2', 'ttf', 'otf', 'eot'].includes(extension)) return 'font';
    if (extension === 'css') return 'css';
    if (extension === 'js') return 'js';
    if (extension === 'html') return 'html';

    return 'other';
  }

  /**
   * Adiciona um item ao cache
   */
  public set(url: string, data: unknown, options?: { 
    contentType?: string; 
    size?: number;
    expiration?: number;
  }): void {
    // Verificar se o item já existe no cache
    const existingItem = this.cache.get(url);
    if (existingItem) {
      // Atualizar o tamanho do cache
      this.currentSize -= existingItem.size;
    }

    // Determinar o tipo de recurso
    const type = this.getResourceType(url, options?.contentType);
    
    // Calcular o tamanho do item
    const size = options?.size || this.estimateSize(data);
    
    // Verificar se o item é maior que o tamanho máximo do cache
    if (size > this.config.maxSize) {
      console.warn(`Item ${url} é maior que o tamanho máximo do cache e não será armazenado.`);
      return;
    }

    // Liberar espaço se necessário
    this.ensureSpace(size);

    // Calcular o tempo de expiração
    const now = Date.now();
    const expiration = options?.expiration || this.config.expirations[type] || this.config.defaultExpiration;
    const expiresAt = now + expiration;

    // Adicionar o item ao cache
    const cacheItem: CacheItem = {
      url,
      type,
      data,
      timestamp: now,
      expiresAt,
      size
    };

    this.cache.set(url, cacheItem);
    this.currentSize += size;
  }

  /**
   * Recupera um item do cache
   */
  public get<T = unknown>(url: string): T | null {
    const item = this.cache.get(url);
    
    // Verificar se o item existe e não expirou
    if (item && item.expiresAt > Date.now()) {
      this.hits++;
      return item.data as T;
    }

    // Se o item expirou, removê-lo do cache
    if (item) {
      this.remove(url);
    }

    this.misses++;
    return null;
  }

  /**
   * Remove um item do cache
   */
  public remove(url: string): void {
    const item = this.cache.get(url);
    if (item) {
      this.currentSize -= item.size;
      this.cache.delete(url);
    }
  }

  /**
   * Limpa o cache inteiro
   */
  public clear(): void {
    this.cache.clear();
    this.currentSize = 0;
  }

  /**
   * Limpa itens expirados do cache
   */
  public clearExpired(): void {
    const now = Date.now();
    // Usar Array.from para evitar problemas com iteradores em ambientes ES5
    Array.from(this.cache.entries()).forEach(([url, item]) => {
      if (item.expiresAt <= now) {
        this.remove(url);
      }
    });
  }

  /**
   * Estima o tamanho de um item em bytes
   */
  private estimateSize(data: unknown): number {
    if (data === null || data === undefined) return 0;
    
    // Se for um Blob, File ou ArrayBuffer, usar o tamanho real
    if (typeof Blob !== 'undefined' && data instanceof Blob) return data.size;
    if (typeof File !== 'undefined' && data instanceof File) return data.size;
    if (typeof ArrayBuffer !== 'undefined' && data instanceof ArrayBuffer) return data.byteLength;
    
    // Se for uma string, usar o tamanho em bytes (aproximado)
    if (typeof data === 'string') return data.length * 2; // Cada caractere usa aproximadamente 2 bytes em UTF-16
    
    // Se for um objeto ou array, converter para JSON e calcular o tamanho
    if (typeof data === 'object') {
      try {
        const json = JSON.stringify(data);
        return json.length * 2;
      } catch { 
        // Se não for possível converter para JSON, usar um valor padrão
        return 1024; // 1KB
      }
    }
    
    // Para outros tipos, usar um valor padrão
    return 8; // 8 bytes (tamanho típico de um número)
  }

  /**
   * Garante que há espaço suficiente no cache para um novo item
   */
  private ensureSpace(requiredSize: number): void {
    if (this.currentSize + requiredSize <= this.config.maxSize) {
      return;
    }

    // Ordenar itens por tempo de expiração (mais próximos de expirar primeiro)
    const items = Array.from(this.cache.values())
      .sort((a, b) => a.expiresAt - b.expiresAt);

    // Remover itens até ter espaço suficiente
    for (const item of items) {
      if (this.currentSize + requiredSize <= this.config.maxSize) {
        break;
      }
      this.remove(item.url);
    }
  }

  /**
   * Retorna estatísticas do cache
   */
  public getStats() {
    return {
      itemCount: this.cache.size,
      currentSize: this.currentSize,
      maxSize: this.config.maxSize,
      usagePercentage: (this.currentSize / this.config.maxSize) * 100,
      hits: this.hits,
      misses: this.misses,
      hitRatio: this.hits / (this.hits + this.misses) || 0,
    };
  }
}

// Criar uma instância global do cache
const resourceCache = typeof window !== 'undefined' ? new ResourceCache() : null;

// Função para pré-carregar recursos
export const preloadResource = async (url: string, options?: { 
  contentType?: string; 
  expiration?: number;
}): Promise<unknown> => {
  if (!resourceCache) return null;

  // Verificar se o recurso já está em cache
  const cachedData = resourceCache.get(url);
  if (cachedData) return cachedData;

  try {
    // Buscar o recurso
    const response = await fetch(url);
    const contentType = response.headers.get('content-type') || options?.contentType;
    
    // Processar a resposta com base no tipo de conteúdo
    let data: unknown;
    if (contentType?.includes('image')) {
      // Para imagens, criar um blob URL
      const blob = await response.blob();
      data = URL.createObjectURL(blob);
      
      // Armazenar em cache
      resourceCache.set(url, data, { 
        contentType, 
        size: blob.size,
        expiration: options?.expiration 
      });
    } else if (contentType?.includes('json')) {
      // Para JSON, analisar a resposta
      data = await response.json();
      
      // Armazenar em cache
      resourceCache.set(url, data, { 
        contentType,
        expiration: options?.expiration 
      });
    } else {
      // Para outros tipos, armazenar o texto
      data = await response.text();
      
      // Armazenar em cache
      resourceCache.set(url, data, { 
        contentType,
        expiration: options?.expiration 
      });
    }

    return data;
  } catch (error) {
    console.error(`Erro ao pré-carregar recurso ${url}:`, error);
    return null;
  }
};

// Exportar o cache
export default resourceCache;
