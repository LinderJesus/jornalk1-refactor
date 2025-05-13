import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useNetworkStatus } from '../hooks';

interface SmartLinkProps {
  href: string;
  children: React.ReactNode;
  prefetch?: boolean;
  className?: string;
  activeClassName?: string;
  exactMatch?: boolean;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  [key: string]: any; // Para permitir outros props do HTML
}

/**
 * Componente de link inteligente que implementa prefetch e detecção de hover
 * Melhora a experiência do usuário pré-carregando páginas quando o usuário passa o mouse sobre o link
 */
const SmartLink: React.FC<SmartLinkProps> = ({
  href,
  children,
  prefetch = true,
  className = '',
  activeClassName = '',
  exactMatch = false,
  onClick,
  ...props
}) => {
  const router = useRouter();
  const { isSlow } = useNetworkStatus();
  const [isHovering, setIsHovering] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const touchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Verificar se é uma URL externa
  const isExternal = href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:');

  // Verificar se o link está ativo
  const isActive = exactMatch 
    ? router.pathname === href
    : router.pathname.startsWith(href) && href !== '/';

  // Combinar classes
  const linkClassName = `${className} ${isActive ? activeClassName : ''}`.trim();

  // Detectar se é um dispositivo de toque
  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  // Função para pré-carregar a página
  const prefetchPage = () => {
    if (!isExternal && prefetch && !isSlow) {
      router.prefetch(href);
    }
  };

  // Manipuladores de eventos
  const handleMouseEnter = () => {
    if (isTouchDevice) return;
    
    setIsHovering(true);
    
    // Limpar timeout anterior se existir
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    
    // Definir um novo timeout para pré-carregar após um pequeno atraso
    hoverTimeoutRef.current = setTimeout(() => {
      prefetchPage();
    }, 100);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    
    // Limpar timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  };

  const handleTouchStart = () => {
    if (!isTouchDevice) return;
    
    // Limpar timeout anterior se existir
    if (touchTimeoutRef.current) {
      clearTimeout(touchTimeoutRef.current);
    }
    
    // Definir um novo timeout para pré-carregar após um pequeno atraso
    touchTimeoutRef.current = setTimeout(() => {
      prefetchPage();
    }, 100);
  };

  // Limpar timeouts ao desmontar
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      if (touchTimeoutRef.current) {
        clearTimeout(touchTimeoutRef.current);
      }
    };
  }, []);

  // Renderizar um link externo normal para URLs externas
  if (isExternal) {
    return (
      <a
        href={href}
        className={linkClassName}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onClick={onClick}
        {...props}
      >
        {children}
      </a>
    );
  }

  // Renderizar um Link do Next.js para URLs internas
  return (
    <Link
      href={href}
      className={linkClassName}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onClick={onClick}
      {...props}
    >
      {children}
    </Link>
  );
};

export default SmartLink;
