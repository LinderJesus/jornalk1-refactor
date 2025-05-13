/**
 * Sistema de monitoramento de erros
 * Captura e registra erros para ajudar a identificar e corrigir problemas rapidamente
 */

// Interface para um erro capturado
interface CapturedError {
  message: string;
  stack?: string;
  componentStack?: string;
  url: string;
  timestamp: number;
  userAgent: string;
  additionalData?: Record<string, unknown>;
}

// Interface para as opções de configuração
interface ErrorMonitoringOptions {
  captureUnhandledRejections?: boolean;
  captureConsoleErrors?: boolean;
  maxErrorsStored?: number;
  shouldSendToServer?: boolean;
  errorEndpoint?: string;
  sampleRate?: number; // Entre 0 e 1, para amostragem de erros
  ignoredErrors?: RegExp[];
}

class ErrorMonitoring {
  private static instance: ErrorMonitoring;
  private errors: CapturedError[] = [];
  private options: ErrorMonitoringOptions = {
    captureUnhandledRejections: true,
    captureConsoleErrors: true,
    maxErrorsStored: 50,
    shouldSendToServer: false,
    errorEndpoint: '/api/errors',
    sampleRate: 1.0,
    ignoredErrors: [
      /ResizeObserver loop limit exceeded/,
      /Loading chunk \d+ failed/,
      /Network request failed/,
      /Script error/,
    ]
  };
  private isInitialized = false;

  private constructor() {}

  // Padrão Singleton para garantir apenas uma instância
  public static getInstance(): ErrorMonitoring {
    if (!ErrorMonitoring.instance) {
      ErrorMonitoring.instance = new ErrorMonitoring();
    }
    return ErrorMonitoring.instance;
  }

  // Inicializar o monitoramento de erros
  public init(options?: Partial<ErrorMonitoringOptions>): void {
    if (this.isInitialized) return;
    
    // Verificar se estamos no navegador
    if (typeof window === 'undefined') return;
    
    // Mesclar opções
    this.options = { ...this.options, ...options };
    
    // Capturar erros não tratados
    window.addEventListener('error', this.handleWindowError);
    
    // Capturar rejeições de promessas não tratadas
    if (this.options.captureUnhandledRejections) {
      window.addEventListener('unhandledrejection', this.handleUnhandledRejection);
    }
    
    // Substituir console.error para capturar erros do console
    if (this.options.captureConsoleErrors) {
      this.overrideConsoleError();
    }
    
    this.isInitialized = true;
    
    // Registrar inicialização bem-sucedida
    console.info('[ErrorMonitoring] Inicializado com sucesso');
  }

  // Capturar um erro manualmente
  public captureError(error: Error, additionalData?: Record<string, unknown>): void {
    this.processError(error, additionalData);
  }

  // Capturar um erro de componente React
  public captureReactError(error: Error, componentStack: string, additionalData?: Record<string, unknown>): void {
    this.processError(error, { ...additionalData, componentStack });
  }

  // Processar um erro
  private processError(error: Error, additionalData?: Record<string, unknown>): void {
    // Verificar se o erro deve ser ignorado
    if (this.shouldIgnoreError(error)) {
      return;
    }
    
    // Verificar amostragem de erros
    if (Math.random() > this.options.sampleRate!) {
      return;
    }
    
    // Criar objeto de erro capturado
    const capturedError: CapturedError = {
      message: error.message,
      stack: error.stack,
      url: typeof window !== 'undefined' ? window.location.href : '',
      timestamp: Date.now(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      additionalData
    };
    
    // Adicionar à lista de erros
    this.addError(capturedError);
    
    // Enviar para o servidor, se configurado
    if (this.options.shouldSendToServer) {
      this.sendErrorToServer(capturedError);
    }
  }

  // Manipulador de erros de janela
  private handleWindowError = (event: ErrorEvent): void => {
    // Prevenir duplicação de erros
    if (event.error) {
      this.processError(event.error);
    } else {
      // Para erros sem objeto Error (ex: erros de script entre domínios)
      const error = new Error(event.message);
      error.stack = `at ${event.filename}:${event.lineno}:${event.colno}`;
      this.processError(error);
    }
  };

  // Manipulador de rejeições de promessas não tratadas
  private handleUnhandledRejection = (event: PromiseRejectionEvent): void => {
    const reason = event.reason;
    if (reason instanceof Error) {
      this.processError(reason, { type: 'unhandledrejection' });
    } else {
      // Para rejeições que não são instâncias de Error
      const error = new Error(String(reason));
      this.processError(error, { type: 'unhandledrejection', originalReason: reason });
    }
  };

  // Substituir console.error para capturar erros do console
  private overrideConsoleError(): void {
    const originalConsoleError = console.error;
    
    console.error = (...args: unknown[]) => {
      // Chamar a implementação original
      originalConsoleError.apply(console, args);
      
      // Capturar o primeiro argumento se for um erro
      const firstArg = args[0];
      if (firstArg instanceof Error) {
        this.processError(firstArg, { source: 'console.error' });
      } else if (typeof firstArg === 'string') {
        // Para mensagens de erro de string
        const error = new Error(firstArg);
        this.processError(error, { source: 'console.error', args: args.slice(1) });
      }
    };
  }

  // Adicionar um erro à lista
  private addError(error: CapturedError): void {
    this.errors.push(error);
    
    // Limitar o número de erros armazenados
    if (this.errors.length > this.options.maxErrorsStored!) {
      this.errors.shift(); // Remover o erro mais antigo
    }
  }

  // Enviar um erro para o servidor
  private sendErrorToServer(error: CapturedError): void {
    if (!this.options.errorEndpoint) return;
    
    // Usar sendBeacon se disponível para garantir que os dados sejam enviados
    // mesmo se a página estiver sendo fechada
    if (navigator.sendBeacon) {
      try {
        navigator.sendBeacon(
          this.options.errorEndpoint,
          JSON.stringify(error)
        );
        return;
      } catch { 
        // Fallback para fetch se sendBeacon falhar
      }
    }
    
    // Usar fetch como fallback
    fetch(this.options.errorEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(error),
      // Usar keepalive para garantir que a solicitação seja concluída
      // mesmo se a página estiver sendo fechada
      keepalive: true
    }).catch(() => {
      // Silenciar erros de fetch para evitar loops
    });
  }

  // Verificar se um erro deve ser ignorado
  private shouldIgnoreError(error: Error): boolean {
    if (!this.options.ignoredErrors || this.options.ignoredErrors.length === 0) {
      return false;
    }
    
    const errorString = error.message + (error.stack || '');
    
    return this.options.ignoredErrors.some(pattern => pattern.test(errorString));
  }

  // Obter todos os erros capturados
  public getErrors(): CapturedError[] {
    return [...this.errors];
  }

  // Limpar todos os erros
  public clearErrors(): void {
    this.errors = [];
  }

  // Destruir a instância
  public destroy(): void {
    if (!this.isInitialized) return;
    
    // Remover event listeners
    window.removeEventListener('error', this.handleWindowError);
    window.removeEventListener('unhandledrejection', this.handleUnhandledRejection);
    
    // Restaurar console.error original
    if (this.options.captureConsoleErrors) {
      // Não é possível restaurar completamente, mas podemos limpar
    }
    
    this.isInitialized = false;
  }
}

// Exportar uma instância singleton
const errorMonitoring = typeof window !== 'undefined' ? ErrorMonitoring.getInstance() : null;

export default errorMonitoring;
