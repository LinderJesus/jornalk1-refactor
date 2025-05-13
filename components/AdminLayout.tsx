import React, { ReactNode, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { 
  FaNewspaper, 
  FaUsers, 
  FaImage, 
  FaCog, 
  FaBars, 
  FaTimes, 
  FaSignOutAlt,
  FaWater,
  FaTachometerAlt,
  FaCalendarAlt,
  FaComments,
  FaChartLine,
  
  FaSwimmer,
  FaTrophy,
  FaMapMarkedAlt,
  
} from 'react-icons/fa';
import { signOut, useSession } from 'next-auth/react';

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title = 'Admin' }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  // Verificar se é um dispositivo móvel
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Redirecionamento se não estiver autenticado
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  const menuItems = [
    { icon: <FaTachometerAlt size={20} />, name: 'Dashboard', path: '/admin' },
    { icon: <FaNewspaper size={20} />, name: 'Notícias', path: '/admin/noticias', subItems: [
      { name: 'Lista de Notícias', path: '/admin/noticias' },
      { name: 'Adicionar Notícia', path: '/admin/noticias/criar' },
      { name: 'Categorias', path: '/admin/noticias/categorias' },
    ]},
    { icon: <FaTrophy size={20} />, name: 'Competições', path: '/admin/competicoes' },
    { icon: <FaSwimmer size={20} />, name: 'Equipamentos', path: '/admin/equipamentos' },
    { icon: <FaMapMarkedAlt size={20} />, name: 'Destinos', path: '/admin/destinos' },
    { icon: <FaImage size={20} />, name: 'Galeria', path: '/admin/galeria' },
    { icon: <FaCalendarAlt size={20} />, name: 'Eventos', path: '/admin/eventos' },
    { icon: <FaComments size={20} />, name: 'Comentários', path: '/admin/comentarios' },
    { icon: <FaChartLine size={20} />, name: 'Analytics', path: '/admin/analytics' },
    { icon: <FaUsers size={20} />, name: 'Usuários', path: '/admin/usuarios' },
    { icon: <FaCog size={20} />, name: 'Configurações', path: '/admin/configuracoes' },
  ];

  const isActive = (path: string) => {
    return router.pathname === path || router.pathname.startsWith(path + '/');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-12 h-12 border-4 border-blue-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Head>
        <title>{`${title} | JornalK1 Admin`}</title>
      </Head>

      {/* Sidebar (navegação lateral) */}
      <motion.div 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-blue-900 to-dark-bg-primary text-white transition-all duration-300 lg:relative shadow-xl ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:w-20 lg:translate-x-0'}`}
        initial={false}
        animate={{ width: isSidebarOpen && !isMobile ? '16rem' : (isMobile ? '0' : '5rem') }}
      >
        {/* Logo e botão de toggle */}
        <div className="flex items-center justify-between p-4 border-b border-blue-700/30">
          <Link href="/admin" className="flex items-center">
            <FaWater className={`text-blue-300 text-2xl ${!isSidebarOpen && !isMobile ? 'mx-auto' : 'mr-2'}`} />
            {(isSidebarOpen || isMobile) && (
              <span className="font-bold text-lg text-white">JornalK1 <span className="text-blue-300">Surf</span></span>
            )}
          </Link>
          {!isMobile && (
            <button 
              onClick={toggleSidebar} 
              className="text-white hover:text-blue-accent focus:outline-none transition-colors"
            >
              {isSidebarOpen ? <FaTimes /> : <FaBars />}
            </button>
          )}
        </div>

        {/* Lista de navegação */}
        <nav className="py-4">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.name}>
                <Link 
                  href={item.path}
                  className={`flex items-center px-4 py-3 hover:bg-blue-800/30 transition-colors ${
                    isActive(item.path) ? 'border-l-4 border-blue-300 bg-blue-800/40' : ''
                  }`}
                >
                  <span className={`${!isSidebarOpen && !isMobile ? 'mx-auto' : 'mr-3'} text-gray-300 ${isActive(item.path) ? 'text-blue-300' : ''}`}>
                    {item.icon}
                  </span>
                  {(isSidebarOpen || isMobile) && (
                    <span className={`${isActive(item.path) ? 'text-blue-300' : ''}`}>{item.name}</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Botão de sair */}
        <div className="absolute bottom-0 w-full border-t border-blue-700/30 p-4">
          <button
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className="flex items-center w-full px-4 py-2 text-white hover:bg-blue-800/30 transition-colors rounded"
          >
            <span className={`${!isSidebarOpen && !isMobile ? 'mx-auto' : 'mr-3'} text-gray-300`}>
              <FaSignOutAlt />
            </span>
            {(isSidebarOpen || isMobile) && (
              <span>Sair</span>
            )}
          </button>
        </div>
      </motion.div>

      {/* Overlay para dispositivos móveis */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsSidebarOpen(false)}
          onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setIsSidebarOpen(false); }}
          role="button"
          tabIndex={0}
          aria-label="Fechar menu lateral"
        ></div>
      )}

      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            {isMobile && (
              <button 
                onClick={toggleSidebar}
                className="text-gray-500 hover:text-blue-600 focus:outline-none transition-colors mr-3"
              >
                <FaBars size={24} />
              </button>
            )}
            <h1 className="text-xl font-semibold text-gray-800 flex items-center">
              {title === 'Dashboard' && <FaTachometerAlt className="mr-2 text-blue-600" size={20} />}
              {title}
            </h1>
          </div>
          
          <div className="flex items-center">
            {session?.user?.image ? (
              <Image src={session.user.image} alt="Perfil" width={32} height={32} className="h-8 w-8 rounded-full border-2 border-blue-100" />
            ) : (
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-sm">
                {session?.user?.name?.charAt(0) || 'A'}
              </div>
            )}
            <span className="ml-2 text-sm font-medium text-gray-700">
              {session?.user?.name || 'Administrador'}
            </span>
          </div>
        </header>

        {/* Conteúdo da página */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
