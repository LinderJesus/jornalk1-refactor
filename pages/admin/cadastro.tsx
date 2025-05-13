import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';

import { motion } from 'framer-motion';
import { FaUser, FaLock, FaEnvelope, FaArrowLeft, FaSpinner } from 'react-icons/fa';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('As senhas não conferem');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulando cadastro (substitua por chamada de API real)
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Erro ao cadastrar');
      }
      
      // Login automático após cadastro
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });
      
      if (result?.error) {
        setError('Conta criada! Faça login para continuar.');
        setSuccess(true);
      } else {
        router.push('/');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Erro ao cadastrar. Tente novamente.');
      } else {
        setError('Erro ao cadastrar. Tente novamente.');
      }
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
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Criar Conta</h2>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Preencha os dados para se cadastrar</p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className={`mb-6 p-4 rounded-md flex items-start ${success ? 'bg-green-100 border-l-4 border-green-500 text-green-700' : 'bg-red-100 border-l-4 border-red-500 text-red-700'}`}
          >
            <div className="flex-shrink-0 mr-2">
              {success ? (
                <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <span>{error}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaUser className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-dark-card-bg dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="Seu nome"
              required
            />
          </div>

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
              placeholder="Seu email"
              required
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaLock className="h-5 w-5 text-gray-400" />
            </div>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-dark-card-bg dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-accent focus:border-blue-accent transition"
                placeholder="Senha"
                required
                aria-label="Senha"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600 focus:outline-none"
                tabIndex={0}
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
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
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-dark-card-bg dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-accent focus:border-blue-accent transition"
                placeholder="Confirme a senha"
                required
                aria-label="Confirme a senha"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600 focus:outline-none"
                tabIndex={0}
                aria-label={showConfirmPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 flex items-center justify-center shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                <span>Cadastrando...</span>
              </>
            ) : (
              'Cadastrar'
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <p className="text-gray-600 dark:text-gray-400">
            Já tem uma conta?{' '}
            <Link href="/admin/login" className="text-blue-500 hover:underline">
              Faça login
            </Link>
          </p>
          <Link href="/" className="text-blue-600 hover:text-blue-700 transition-colors inline-flex items-center justify-center mt-4">
            <FaArrowLeft className="w-3 h-3 mr-1" />
            <span>Voltar para o site</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
