/**
 * Sistema de cache de imagens para melhorar o desempenho
 * 
 * Este módulo implementa um cache de imagens que armazena URLs de imagens
 * já carregadas para evitar o recarregamento desnecessário e melhorar
 * o desempenho do site.
 */

// Cache de imagens
interface ImageCacheItem {
  url: string;
  timestamp: number;
  loaded: boolean;
}

class ImageCache {
  private cache: Map<string, ImageCacheItem>;
  private maxCacheSize: number;
  private cacheExpirationTime: number; // em milissegundos

  constructor(maxCacheSize = 100, cacheExpirationTime = 3600000) { // 1 hora por padrão
    this.cache = new Map();
    this.maxCacheSize = maxCacheSize;
    this.cacheExpirationTime = cacheExpirationTime;
  }

  /**
   * Adiciona uma URL de imagem ao cache
   */
  addToCache(url: string, loaded = true): void {
    // Se o cache estiver cheio, remova o item mais antigo
    if (this.cache.size >= this.maxCacheSize) {
      this.removeOldestItem();
    }

    // Adicionar a nova URL ao cache
    this.cache.set(url, {
      url,
      timestamp: Date.now(),
      loaded
    });
  }

  /**
   * Verifica se uma URL de imagem está no cache
   */
  isInCache(url: string): boolean {
    if (!this.cache.has(url)) {
      return false;
    }

    const cacheItem = this.cache.get(url);
    if (!cacheItem) return false;

    // Verificar se o cache expirou
    const now = Date.now();
    if (now - cacheItem.timestamp > this.cacheExpirationTime) {
      this.cache.delete(url);
      return false;
    }

    return cacheItem.loaded;
  }

  /**
   * Remove o item mais antigo do cache
   */
  private removeOldestItem(): void {
    let oldestKey: string | null = null;
    let oldestTimestamp = Infinity;

    // Encontrar o item mais antigo
    this.cache.forEach((item, key) => {
      if (item.timestamp < oldestTimestamp) {
        oldestTimestamp = item.timestamp;
        oldestKey = key;
      }
    });

    // Remover o item mais antigo
    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }

  /**
   * Limpa o cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Pré-carrega uma lista de URLs de imagens
   */
  preloadImages(urls: string[]): void {
    if (typeof window === 'undefined') return;

    urls.forEach(url => {
      // Verificar se a URL já está no cache
      if (this.isInCache(url)) return;

      // Adicionar a URL ao cache como não carregada
      this.addToCache(url, false);

      // Criar um elemento de imagem para pré-carregar
      const img = new Image();
      img.onload = () => {
        // Marcar a imagem como carregada no cache
        this.addToCache(url, true);
      };
      img.onerror = () => {
        // Remover a imagem do cache se ocorrer um erro
        this.cache.delete(url);
      };
      img.src = url;
    });
  }
}

// Exportar uma instância singleton do cache de imagens
export const imageCache = new ImageCache();

// Função auxiliar para pré-carregar imagens
export const preloadImages = (urls: string[]): void => {
  imageCache.preloadImages(urls);
};

// Função auxiliar para verificar se uma imagem está no cache
export const isImageCached = (url: string): boolean => {
  return imageCache.isInCache(url);
};

// Função auxiliar para adicionar uma imagem ao cache
export const cacheImage = (url: string): void => {
  imageCache.addToCache(url);
};

export default imageCache;
