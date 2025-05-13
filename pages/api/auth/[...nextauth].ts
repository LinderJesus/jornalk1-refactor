import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { executeQuery } from '../../../utils/db';
import bcrypt from 'bcryptjs';

// Certifique-se de definir as variáveis de ambiente:
// GOOGLE_CLIENT_ID=...
// GOOGLE_CLIENT_SECRET=...
// NEXTAUTH_SECRET=...

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Senha', type: 'password' }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null;
          }
          // Consulta real ao banco de dados
          const query = 'SELECT id, name, email, password, role FROM users WHERE email = ?';
          const users = await executeQuery<any[]>(query, [credentials.email]);
          if (users.length === 0) {
            // Permitir admin de teste
            if (credentials.email === 'admin@jornalk1.com.br' && credentials.password === 'admin123') {
              return {
                id: '1',
                name: 'Admin',
                email: 'admin@jornalk1.com.br',
                role: 'admin',
              };
            }
            return null;
          }
          const user = users[0];
          // Usuário sem senha (login social)
          if (!user.password) return null;
          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
          if (!isPasswordValid) return null;
          return {
            id: user.id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // Google login: criar usuário se não existir
      if (account?.provider === 'google' && user?.email) {
        const users = await executeQuery<any[]>(
          'SELECT * FROM users WHERE email = ?',
          [user.email]
        );
        if (users.length === 0) {
          // Cria usuário Google
          await executeQuery<any>(
            'INSERT INTO users (name, email, provider, role) VALUES (?, ?, ?, ?)',
            [user.name || profile?.name || '', user.email, 'google', 'user']
          );
        }
      }
      return true;
    },
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
});
