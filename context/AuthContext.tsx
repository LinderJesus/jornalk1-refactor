import React, { createContext, useContext, ReactNode } from 'react';
import { useRouter } from 'next/router';

interface AuthContextType {
  handleLoginClick: () => void;
}

// Criar o contexto com um valor padrão que não lançará erro
const AuthContext = createContext<AuthContextType>({
  handleLoginClick: () => {
    console.warn('AuthContext não foi inicializado corretamente');
  }
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const router = useRouter();

  const handleLoginClick = () => {
    // Salvar a URL atual no localStorage para redirecionamento após o login
    if (typeof window !== 'undefined') {
      localStorage.setItem('callbackUrl', router.asPath);
    }
    
    // Navegar para a página de login
    router.push('/admin/login');
  };

  const value = { handleLoginClick };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar o contexto
export const useAuth = () => useContext(AuthContext);
