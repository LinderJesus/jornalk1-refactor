import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { FaEnvelope, FaArrowLeft, FaSpinner, FaCheck } from 'react-icons/fa';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email) {
      setError('Por favor, informe seu e-mail');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulando envio de e-mail (substitua por chamada de API real)
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Erro ao enviar e-mail de recuperação');
      }
      
      setIsSent(true);
    } catch (err: any) {
      setError(err.message || 'Erro ao processar sua solicitação. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-dark-bg-primary p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/images/wave-pattern.svg')] opacity-10"></div>
      
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-dark-bg-secondary p-8 rounded-lg shadow-xl w-full max-w-md border border-blue-100 dark:border-blue-900/30 backdrop-blur-sm relative z-10"
      >
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Recuperar Senha</h2>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            {isSent 
              ? 'Verifique seu e-mail para continuar' 
              : 'Digite seu e-mail para receber um link de recuperação'}
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

        {isSent ? (
          <div className="text-center py-4">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/20 mb-4">
              <FaCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Enviamos um link de recuperação para <span className="font-medium">{email}</span>. 
              Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
            </p>
            <Link 
              href="/admin/login" 
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium inline-flex items-center"
            >
              Voltar para o login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-dark-card-bg dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="seu@email.com"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 flex items-center justify-center shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  <span>Enviando...</span>
                </>
              ) : (
                'Enviar Link de Recuperação'
              )}
            </button>
          </form>
        )}

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
