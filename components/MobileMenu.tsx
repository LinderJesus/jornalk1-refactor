import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaSearch, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useSession, signOut } from 'next-auth/react';
import { useAuth } from '../context/AuthContext';

interface MobileMenuProps {
  isOpen: boolean;
  navLinks: {
    href: string;
    label: string;
    icon: React.ReactNode;
  }[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: (e: React.FormEvent) => void;
  isActive: (path: string) => boolean;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  navLinks,
  searchQuery,
  setSearchQuery,
  handleSearch,
  isActive,
}) => {
  const { data: session } = useSession();
  // const router = useRouter(); // Removido por não ser utilizado
  const auth = useAuth();

  return (
    <motion.div 
      initial={{ opacity: 0, height: 0 }}
      animate={{ 
        opacity: isOpen ? 1 : 0,
        height: isOpen ? 'auto' : 0
      }}
      transition={{ duration: 0.3 }}
      className="lg:hidden bg-white dark:bg-dark-bg-primary border-t border-gray-200 dark:border-gray-700 shadow-surf overflow-hidden z-40"
    >
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <form onSubmit={handleSearch} className="flex">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar..."
                className="w-full bg-gray-50 dark:bg-dark-card-bg border border-gray-300 dark:border-gray-600 rounded-l-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white"
              />
            </div>
            <button 
              type="submit" 
              className="btn-ocean px-4 py-2 rounded-r-full"
            >
              <FaSearch />
            </button>
          </form>
        </div>
        
        <nav className="space-y-2">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href} 
              className={`flex items-center px-4 py-3 rounded-lg font-medium ${isActive(link.href) 
                ? 'text-ocean bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400 shadow-surf' 
                : 'text-gray-700 dark:text-gray-300 hover:text-ocean dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-dark-bg-secondary hover-float'}`}
            >
              {link.icon}
              <span className="ml-2">{link.label}</span>
            </Link>
          ))}
        </nav>
        
        {session ? (
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Link 
              href="/admin" 
              className="flex items-center px-4 py-3 rounded-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-ocean dark:hover:text-blue-400 mb-2 hover-float"
            >
              <FaUser className="text-blue-600 mr-2" />
              <span>Dashboard</span>
            </Link>
            <button 
              onClick={() => signOut({ callbackUrl: '/' })}
              className="flex items-center w-full px-4 py-3 rounded-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-600"
            >
              <FaSignOutAlt className="text-red-500 mr-2" />
              <span>Sair</span>
            </button>
          </div>
        ) : (
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button 
              onClick={() => auth.handleLoginClick()}
              className="flex items-center justify-center w-full px-4 py-3 rounded-full btn-ocean shadow-surf font-medium"
            >
              <FaUser className="h-4 w-4 mr-2" />
              <span>Entrar</span>
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MobileMenu;
