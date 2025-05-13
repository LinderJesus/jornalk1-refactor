import { useState, useEffect } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useRouter } from 'next/router';
import Link from 'next/link';

import { motion } from 'framer-motion';
import { FaLock, FaCheck, FaExclamationTriangle, FaArrowLeft } from 'react-icons/fa';

export default function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const { token } = router.query;
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);

  // Verifica se o token é válido ao carregar a página
  useEffect(() => {
    if (token) {
      verifyToken();
    }
  }, [token]);

  const verifyToken = async () => {
    try {
      const response = await fetch('/api/auth/verify-reset-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Token inválido ou expirado');
      }
      
      setTokenValid(true);
    } catch (err: any) {
      setError(err.message || 'Link inválido ou expirado');
      setTokenValid(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!password || !confirmPassword) {
      setError('Por favor, preencha todos os campos');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }
    
    if (password.length < 8) {
      setError('A senha deve ter pelo menos 8 caracteres');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Erro ao redefinir senha');
      }
      
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Erro ao processar sua solicitação. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  if (tokenValid === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-dark-bg-primary p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-700 dark:text-gray-300">Verificando link de redefinição...</p>
        </div>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-dark-bg-primary p-4">
        <div className="bg-white dark:bg-dark-card-bg p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <div className="text-red-500 text-5xl mb-4">
            <FaExclamationTriangle className="inline-block" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Link inválido ou expirado</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            O link de redefinição de senha é inválido ou expirou. Por favor, solicite um novo link.
          </p>
          <Link 
            href="/admin/recuperar-senha" 
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Solicitar novo link
          </Link>
          <div className="mt-4">
            <Link 
              href="/admin/login" 
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
            >
              <FaArrowLeft className="inline-block mr-1" /> Voltar para o login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-dark-bg-primary p-4">
        <div className="bg-white dark:bg-dark-card-bg p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <div className="text-green-500 text-5xl mb-4">
            <FaCheck className="inline-block" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Senha redefinida com sucesso!</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Sua senha foi atualizada com sucesso. Agora você pode fazer login com sua nova senha.
          </p>
          <Link 
            href="/admin/login" 
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Ir para o login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-dark-bg-primary p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/images/wave-pattern.svg')] opacity-10"></div>
      
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-dark-bg-secondary p-8 rounded-lg shadow-xl w-full max-w-md border border-blue-100 dark:border-blue-900/30 backdrop-blur-sm relative z-10"
      >
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Criar nova senha</h2>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Digite sua nova senha abaixo
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-md flex items-start"
          >
            <div className="flex-shrink-0 mr-2">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <span>{error}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaLock className="h-5 w-5 text-gray-400" />
            </div>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-dark-card-bg dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-accent focus:border-blue-accent transition"
                placeholder="Nova senha"
                minLength={8}
                required
                aria-label="Nova senha"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600 focus:outline-none"
                tabIndex={0}
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaLock className="h-5 w-5 text-gray-400" />
            </div>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-dark-card-bg dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-accent focus:border-blue-accent transition"
                placeholder="Confirme a nova senha"
                minLength={8}
                required
                aria-label="Confirme a nova senha"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600 focus:outline-none"
                tabIndex={0}
                aria-label={showConfirmPassword ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="text-sm text-gray-600 dark:text-gray-400">
            <p>A senha deve conter pelo menos 8 caracteres.</p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 flex items-center justify-center shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Redefinindo...</span>
              </>
            ) : (
              'Redefinir Senha'
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <Link href="/admin/login" className="text-blue-600 hover:text-blue-700 transition-colors inline-flex items-center justify-center">
            <FaArrowLeft className="w-3 h-3 mr-1" />
            <span>Voltar para o login</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
