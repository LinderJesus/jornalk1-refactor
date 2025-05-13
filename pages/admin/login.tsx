import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { FaWater, FaUser, FaLock, FaSpinner, FaSwimmer, FaArrowLeft, FaUserShield, FaUserFriends, FaGoogle, FaEye, FaEyeSlash } from 'react-icons/fa';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { status } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'admin' | 'user'>('user');

  useEffect(() => {
    // Verificar se existe uma URL de retorno no localStorage
    const storedCallbackUrl = typeof window !== 'undefined' ? localStorage.getItem('callbackUrl') : null;
    
    if (status === 'authenticated') {
      // Redirecionar para a URL armazenada ou para a página padrão baseada no tipo de usuário
      const redirectUrl = storedCallbackUrl || (activeTab === 'admin' ? '/admin' : '/');
      
      // Limpar o localStorage após usar
      if (typeof window !== 'undefined' && storedCallbackUrl) {
        localStorage.removeItem('callbackUrl');
      }
      
      router.push(redirectUrl);
    }
  }, [status, router, activeTab]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Determinar a URL de redirecionamento com base no tipo de usuário
      const redirectUrl = activeTab === 'admin' ? '/admin' : '/';
      
      // Usar diferentes credenciais dependendo da aba selecionada
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
        userType: activeTab // Passar o tipo de usuário para o backend
      });

      if (result?.error) {
        setError('Credenciais inválidas. Por favor, verifique seu email e senha.');
      } else {
        // Redirecionar após login bem-sucedido
        setTimeout(() => {
          // Verificar se existe uma URL de retorno no localStorage
          const storedCallbackUrl = typeof window !== 'undefined' ? localStorage.getItem('callbackUrl') : null;
          
          // Usar a URL armazenada ou a URL padrão baseada no tipo de usuário
          const finalRedirectUrl = storedCallbackUrl || redirectUrl;
          
          // Limpar o localStorage após usar
          if (typeof window !== 'undefined' && storedCallbackUrl) {
            localStorage.removeItem('callbackUrl');
          }
          
          router.push(finalRedirectUrl);
        }, 500);
      }
    } catch (error) {
      setError('Ocorreu um erro ao fazer login. Por favor, tente novamente mais tarde.');
      console.error('Erro de login:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Login Administrativo | JornalK1 Surf</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-dark-bg-primary p-4 relative overflow-hidden">
        {/* Padrão de ondas no fundo */}
        <div className="absolute inset-0 bg-[url('/images/wave-pattern.svg')] opacity-10"></div>
        
        {/* Elementos decorativos */}
        <motion.div 
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 0.2 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="absolute top-10 right-10 text-white text-opacity-20"
        >
          <FaSwimmer size={60} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-dark-bg-secondary p-8 rounded-lg shadow-xl w-full max-w-md border border-blue-100 dark:border-blue-900/30 backdrop-blur-sm relative z-10"
        >
          <div className="text-center mb-6">
            <Link href="/" className="inline-flex items-center justify-center mb-4">
              <FaWater className="text-4xl text-blue-600 mr-2" />
              <span className="text-2xl font-bold text-gray-800 dark:text-white">
                JornalK1 <span className="text-blue-600">Surf</span>
              </span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Login</h1>
            <p className="text-gray-600 dark:text-gray-400">Entre com suas credenciais para acessar sua conta</p>
          </div>
          
          {/* Abas de login */}
          <div className="flex mb-6 border-b border-gray-200 dark:border-gray-700">
            <button
              className={`flex-1 py-3 px-4 flex items-center justify-center space-x-2 ${activeTab === 'user' 
                ? 'text-blue-600 border-b-2 border-blue-600 font-medium' 
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
              onClick={() => setActiveTab('user')}
            >
              <FaUserFriends className={activeTab === 'user' ? 'text-blue-600' : 'text-gray-400'} />
              <span>Usuário</span>
            </button>
            <button
              className={`flex-1 py-3 px-4 flex items-center justify-center space-x-2 ${activeTab === 'admin' 
                ? 'text-blue-600 border-b-2 border-blue-600 font-medium' 
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
              onClick={() => setActiveTab('admin')}
            >
              <FaUserShield className={activeTab === 'admin' ? 'text-blue-600' : 'text-gray-400'} />
              <span>Administrador</span>
            </button>
          </div>

          {/* Login Social Google */}
          <div className="mb-6">
            <button
              type="button"
              onClick={() => signIn('google')}
              className="w-full flex items-center justify-center py-3 px-4 rounded-lg bg-white border border-gray-300 dark:bg-dark-card-bg dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-white font-medium shadow transition-colors mb-2"
            >
              <FaGoogle className="mr-2 text-red-500" />
              Entrar com Google
            </button>
            <div className="text-xs text-center text-gray-400 dark:text-gray-500">Você também pode entrar com sua conta Google</div>
          </div>

          {/* Login Manual */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-dark-card-bg dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-accent focus:border-blue-accent transition"
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

            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-md flex items-start"
              >
                <div className="flex-shrink-0 mr-2">
                  <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12zm0-9a1 1 0 011 1v4a1 1 0 11-2 0V8a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>{error}</span>
              </motion.div>
            )}

            <div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 flex items-center justify-center shadow-md"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    <span>Entrando...</span>
                  </>
                ) : (
                  'Entrar'
                )}
              </button>
            </div>
          </form>
          
          <div className="mt-8 text-center text-sm space-y-2">
            <Link href="/" className="text-blue-600 hover:text-blue-700 transition-colors inline-flex items-center">
              <FaArrowLeft className="w-4 h-4 mr-1" />
              <span>Voltar para o site</span>
            </Link>
            <div>
              <Link href="/admin/recuperar-senha" className="text-blue-500 hover:underline mx-2">Esqueceu a senha?</Link>
              <span className="text-gray-400">|</span>
              <Link href="/admin/cadastro" className="text-blue-500 hover:underline mx-2">Criar conta</Link>
            </div>
          </div>
          

          
          <p className="mt-8 text-center text-xs text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} JornalK1 Surf. Todos os direitos reservados.
          </p>
        </motion.div>
      </div>
    </>
  );
};

export default LoginPage;
