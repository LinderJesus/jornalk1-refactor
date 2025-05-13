/**
 * Sistema de análise de desempenho
 * Monitora métricas de desempenho para ajudar a identificar gargalos e otimizar o site
 */

// Interface para métricas de desempenho
interface PerformanceMetrics {
  // Métricas de carregamento
  navigationStart?: number;
  loadTime?: number;
  domContentLoaded?: number;
  firstPaint?: number;
  firstContentfulPaint?: number;
  largestContentfulPaint?: number;
  timeToInteractive?: number;
  
  // Métricas de interatividade
  firstInputDelay?: number;
  cumulativeLayoutShift?: number;
  
  // Métricas de recursos
  resourceCount?: number;
  resourceLoadTime?: number;
  jsHeapSize?: number;
  
  // Métricas personalizadas
  customMetrics?: Record<string, number>;
}

// Interface para as opções de configuração
interface PerformanceMonitoringOptions {
  captureWebVitals?: boolean;
  captureResourceMetrics?: boolean;
  captureMemoryUsage?: boolean;
  sampleRate?: number; // Entre 0 e 1, para amostragem de métricas
  reportToAnalytics?: boolean;
  analyticsEndpoint?: string;
  logToConsole?: boolean;
}

class PerformanceMonitoring {
  private static instance: PerformanceMonitoring;
  private metrics: PerformanceMetrics = {};
  private marks: Record<string, number> = {};
  private measures: Record<string, { duration: number; start: number; end: number }> = {};
  private options: PerformanceMonitoringOptions = {
    captureWebVitals: true,
    captureResourceMetrics: true,
    captureMemoryUsage: true,
    sampleRate: 0.1, // Capturar apenas 10% das sessões por padrão
    reportToAnalytics: false,
    analyticsEndpoint: '/api/analytics/performance',
    logToConsole: false
  };
  private isInitialized = false;

  private constructor() {}

  // Padrão Singleton para garantir apenas uma instância
  public static getInstance(): PerformanceMonitoring {
    if (!PerformanceMonitoring.instance) {
      PerformanceMonitoring.instance = new PerformanceMonitoring();
    }
    return PerformanceMonitoring.instance;
  }

  // Inicializar o monitoramento de desempenho
  public init(options?: Partial<PerformanceMonitoringOptions>): void {
    if (this.isInitialized) return;
    
    // Verificar se estamos no navegador
    if (typeof window === 'undefined' || typeof performance === 'undefined') return;
    
    // Verificar amostragem
    const sampleRate = options?.sampleRate !== undefined ? options.sampleRate : this.options.sampleRate;
    if (Math.random() > (sampleRate || 0.1)) {
      return;
    }
    
    // Mesclar opções
    this.options = { ...this.options, ...options };
    
    // Capturar métricas de carregamento quando a página estiver totalmente carregada
    window.addEventListener('load', this.captureLoadMetrics);
    
    // Capturar métricas de Web Vitals
    if (this.options.captureWebVitals) {
      this.captureWebVitals();
    }
    
    // Capturar métricas de recursos
    if (this.options.captureResourceMetrics) {
      this.captureResourceMetrics();
    }
    
    // Capturar uso de memória periodicamente
    if (this.options.captureMemoryUsage) {
      this.captureMemoryUsage();
    }
    
    this.isInitialized = true;
    
    if (this.options.logToConsole) {
      console.info('[PerformanceMonitoring] Inicializado com sucesso');
    }
  }

  // Capturar métricas de carregamento
  private captureLoadMetrics = (): void => {
    const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    if (navEntry) {
      this.metrics.navigationStart = navEntry.startTime;
      this.metrics.loadTime = navEntry.loadEventEnd - navEntry.startTime;
      this.metrics.domContentLoaded = navEntry.domContentLoadedEventEnd - navEntry.startTime;
    }
    
    // Capturar First Paint e First Contentful Paint
    const paintEntries = performance.getEntriesByType('paint');
    for (const entry of paintEntries) {
      const paintEntry = entry as PerformancePaintTiming;
      if (paintEntry.name === 'first-paint') {
        this.metrics.firstPaint = paintEntry.startTime;
      } else if (paintEntry.name === 'first-contentful-paint') {
        this.metrics.firstContentfulPaint = paintEntry.startTime;
      }
    }
    
    // Enviar métricas para análise após o carregamento da página
    setTimeout(() => {
      this.reportMetrics();
    }, 1000);
  };

  // Capturar métricas de Web Vitals
  private captureWebVitals(): void {
    // Capturar Largest Contentful Paint (LCP)
    this.observeLCP();
    
    // Capturar First Input Delay (FID)
    this.observeFID();
    
    // Capturar Cumulative Layout Shift (CLS)
    this.observeCLS();
  }

  // Observar Largest Contentful Paint
  private observeLCP(): void {
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const lastEntry = entries[entries.length - 1];
          this.metrics.largestContentfulPaint = lastEntry.startTime;
        });
        
        lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
      } catch { 
        // Silenciar erros
      }
    }
  }

  // Observar First Input Delay
  private observeFID(): void {
    if ('PerformanceObserver' in window) {
      try {
        const fidObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const firstEntry = entries[0] as PerformanceEntry & { processingStart?: number; startTime?: number };
          if (firstEntry && typeof firstEntry.processingStart === 'number' && typeof firstEntry.startTime === 'number') {
            this.metrics.firstInputDelay = firstEntry.processingStart - firstEntry.startTime;
          }
        });
        
        fidObserver.observe({ type: 'first-input', buffered: true });
      } catch { 
        // Silenciar erros
      }
    }
  }

  // Observar Cumulative Layout Shift
  private observeCLS(): void {
    if ('PerformanceObserver' in window) {
      try {
        let clsValue = 0;
        const clsEntries: PerformanceEntry[] = [];
        
        const clsObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          
          for (const entry of entries) {
            // Ignorar se não for uma entrada de layout shift
            const entryTyped = entry as PerformanceEntry & { hadRecentInput?: boolean; value?: number };
            if (!entryTyped.hadRecentInput) {
              clsValue += entryTyped.value ?? 0;
              clsEntries.push(entryTyped);
            }
          }
          
          this.metrics.cumulativeLayoutShift = clsValue;
        });
        
        clsObserver.observe({ type: 'layout-shift', buffered: true });
      } catch { 
        // Silenciar erros
      }
    }
  }

  // Capturar métricas de recursos
  private captureResourceMetrics(): void {
    if ('PerformanceObserver' in window) {
      try {
        const resourceObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          
          this.metrics.resourceCount = entries.length;
          
          let totalResourceLoadTime = 0;
          for (const entry of entries) {
            totalResourceLoadTime += entry.duration;
          }
          
          this.metrics.resourceLoadTime = totalResourceLoadTime;
        });
        
        resourceObserver.observe({ type: 'resource', buffered: true });
      } catch { 
        // Silenciar erros
      }
    }
  }

  // Capturar uso de memória
  private captureMemoryUsage(): void {
    // Verificar se a API de memória está disponível
    const perfTyped = performance as Performance & { memory?: { usedJSHeapSize?: number } };
    if (perfTyped.memory) {
      // Capturar uso de memória a cada 10 segundos
      const captureMemory = () => {
        this.metrics.jsHeapSize = perfTyped.memory?.usedJSHeapSize ?? 0;
      };
      
      // Capturar imediatamente
      captureMemory();
      
      // Capturar periodicamente
      setInterval(captureMemory, 10000);
    }
  }

  // Marcar um ponto no tempo
  public mark(name: string): void {
    if (!this.isInitialized) return;
    
    this.marks[name] = performance.now();
    
    // Também usar a API de marcação do navegador se disponível
    if (performance.mark) {
      try {
        performance.mark(name);
      } catch { 
        // Silenciar erros
      }
    }
  }

  // Medir o tempo entre dois pontos
  public measure(name: string, startMark?: string, endMark?: string): number {
    if (!this.isInitialized) return 0;
    
    let start = 0;
    let end = performance.now();
    
    if (startMark && this.marks[startMark]) {
      start = this.marks[startMark];
    }
    
    if (endMark && this.marks[endMark]) {
      end = this.marks[endMark];
    }
    
    const duration = end - start;
    
    this.measures[name] = {
      duration,
      start,
      end
    };
    
    // Também usar a API de medição do navegador se disponível
    if (performance.measure) {
      try {
        if (startMark && endMark) {
          performance.measure(name, startMark, endMark);
        } else if (startMark) {
          performance.measure(name, startMark);
        } else {
          performance.measure(name);
        }
      } catch { 
        // Silenciar erros
      }
    }
    
    return duration;
  }

  // Adicionar uma métrica personalizada
  public addCustomMetric(name: string, value: number): void {
    if (!this.isInitialized) return;
    
    if (!this.metrics.customMetrics) {
      this.metrics.customMetrics = {};
    }
    
    this.metrics.customMetrics[name] = value;
  }

  // Reportar métricas para análise
  private reportMetrics(): void {
    if (!this.isInitialized || !this.options.reportToAnalytics) return;
    
    // Adicionar medições personalizadas às métricas
    for (const [name, measure] of Object.entries(this.measures)) {
      this.addCustomMetric(name, measure.duration);
    }
    
    // Enviar métricas para o endpoint de análise
    if (this.options.analyticsEndpoint) {
      try {
        const data = {
          metrics: this.metrics,
          url: window.location.href,
          userAgent: navigator.userAgent,
          timestamp: Date.now(),
          // Adicionar informações sobre o dispositivo
          deviceInfo: {
            screenWidth: window.screen.width,
            screenHeight: window.screen.height,
            devicePixelRatio: window.devicePixelRatio,
            connection: (navigator as Navigator & { connection?: { effectiveType?: string; downlink?: number; rtt?: number; saveData?: boolean } }).connection ? {
              effectiveType: (navigator as Navigator & { connection?: { effectiveType?: string } }).connection?.effectiveType,
              downlink: (navigator as Navigator & { connection?: { downlink?: number } }).connection?.downlink,
              rtt: (navigator as Navigator & { connection?: { rtt?: number } }).connection?.rtt,
              saveData: (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData
            } : null
          }
        };
        
        // Usar sendBeacon se disponível para garantir que os dados sejam enviados
        if (navigator.sendBeacon) {
          navigator.sendBeacon(this.options.analyticsEndpoint, JSON.stringify(data));
        } else {
          // Fallback para fetch
          fetch(this.options.analyticsEndpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
            keepalive: true
          }).catch(() => {
            // Silenciar erros
          });
        }
      } catch { 
        // Silenciar erros
      }
    }
    
    // Registrar métricas no console se configurado
    if (this.options.logToConsole) {
      console.info('[PerformanceMonitoring] Métricas de desempenho:', this.metrics);
    }
  }

  // Obter todas as métricas capturadas
  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  // Obter todas as medições personalizadas
  public getMeasures(): Record<string, { duration: number; start: number; end: number }> {
    return { ...this.measures };
  }

  // Limpar todas as métricas e medições
  public clearMetrics(): void {
    this.metrics = {};
    this.marks = {};
    this.measures = {};
  }

  // Destruir a instância
  public destroy(): void {
    if (!this.isInitialized) return;
    
    // Remover event listeners
    window.removeEventListener('load', this.captureLoadMetrics);
    
    this.isInitialized = false;
  }
}

// Exportar uma instância singleton
const performanceMonitoring = typeof window !== 'undefined' ? PerformanceMonitoring.getInstance() : null;

export default performanceMonitoring;
