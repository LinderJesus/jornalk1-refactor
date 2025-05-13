import React, { Component, ErrorInfo, ReactNode } from 'react';
import { FaExclamationTriangle, FaHome, FaRedo } from 'react-icons/fa';
import Link from 'next/link';
import errorMonitoring from '../utils/errorMonitoring';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Componente que captura erros em componentes filhos e exibe uma UI de fallback
 * Melhora a experiência do usuário quando ocorrem erros inesperados
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Atualizar o estado para que a próxima renderização mostre a UI de fallback
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Registrar o erro
    console.error('ErrorBoundary capturou um erro:', error, errorInfo);
    
    // Atualizar o estado com as informações do erro
    this.setState({
      errorInfo
    });
    
    // Chamar o callback onError se fornecido
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
    
    // Enviar o erro para o sistema de monitoramento
    if (errorMonitoring) {
      errorMonitoring.captureReactError(error, errorInfo.componentStack || '', {
        source: 'ErrorBoundary',
        path: typeof window !== 'undefined' ? window.location.pathname : '/',
        timestamp: Date.now()
      });
    }
  }

  // Método para reiniciar o componente
  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Renderizar o fallback personalizado se fornecido
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Renderizar o fallback padrão
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-dark-700 p-4">
          <div className="bg-white dark:bg-dark-600 rounded-lg shadow-xl p-6 max-w-md w-full">
            <div className="flex flex-col items-center text-center">
              <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-full mb-4">
                <FaExclamationTriangle className="text-red-500 dark:text-red-400 text-3xl" />
              </div>
              
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                Oops! Algo deu errado
              </h1>
              
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Encontramos um problema ao carregar esta parte do site. Pedimos desculpas pelo inconveniente.
              </p>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="mb-6 w-full">
                  <details className="bg-gray-100 dark:bg-dark-700 p-4 rounded-md text-left overflow-auto max-h-60">
                    <summary className="font-medium text-red-500 dark:text-red-400 cursor-pointer mb-2">
                      Detalhes do erro (apenas em desenvolvimento)
                    </summary>
                    <p className="text-sm font-mono whitespace-pre-wrap break-words">
                      {this.state.error.toString()}
                    </p>
                    {this.state.errorInfo && (
                      <p className="text-sm font-mono whitespace-pre-wrap break-words mt-2">
                        {this.state.errorInfo.componentStack}
                      </p>
                    )}
                  </details>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={this.handleReset}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md transition-colors"
                >
                  <FaRedo />
                  <span>Tentar novamente</span>
                </button>
                
                <Link
                  href="/"
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 dark:bg-dark-500 hover:bg-gray-300 dark:hover:bg-dark-400 text-gray-800 dark:text-white rounded-md transition-colors"
                >
                  <FaHome />
                  <span>Voltar para a página inicial</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Renderizar os filhos normalmente se não houver erro
    return this.props.children;
  }
}

export default ErrorBoundary;
