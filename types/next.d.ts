import { NextPage } from 'next';
import { ReactElement, ReactNode } from 'react';
import { AppProps } from 'next/app';

/**
 * Extensão de tipos para páginas Next.js com layouts personalizados
 */

export type NextPageWithLayout<P = Record<string, unknown>, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
  useDefaultLayout?: boolean;
};

export type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};
