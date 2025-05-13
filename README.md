# JornalK1 - Sistema de Portal de Notícias

Um portal de notícias moderno e responsivo desenvolvido com Next.js, TypeScript, Tailwind CSS e MySQL.

## Tecnologias Utilizadas

- **Frontend**: Next.js, TypeScript, Tailwind CSS
- **Backend**: Node.js (API Routes do Next.js)
- **Banco de Dados**: MySQL
- **Hospedagem**: Vercel ou Render (recomendado)

## Funcionalidades

- 📰 Portal de notícias completo com categorias
- 👨‍💼 Painel administrativo para gerenciamento de conteúdo
- 📝 Sistema de criação e edição de notícias
- 🔍 Busca integrada
- 🤝 Seção de parceiros
- 📱 Design responsivo para todos os dispositivos

## Requisitos

- Node.js 14.x ou superior
- MySQL 5.7 ou superior
- XAMPP (para ambiente de desenvolvimento local)

## Instalação

1. Clone o repositório:

```bash
git clone https://github.com/seu-usuario/jornalk1.git
cd jornalk1
```

2. Instale as dependências:

```bash
npm install
```

3. Configure o banco de dados:

- Inicie o MySQL através do XAMPP
- Importe o esquema do banco de dados:

```bash
mysql -u root -p < database/schema.sql
```

4. Configure as variáveis de ambiente:

Crie um arquivo `.env.local` na raiz do projeto com o seguinte conteúdo:

```
# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=jornalk1

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=seu-segredo-aqui

# Outros
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

5. Execute o projeto em modo de desenvolvimento:

```bash
npm run dev
```

6. Acesse o site em [http://localhost:3000](http://localhost:3000)

## Estrutura do Projeto

```
jornalk1/
├── components/         # Componentes reutilizáveis
├── database/           # Esquema e scripts do banco de dados
├── pages/              # Páginas e rotas da aplicação
│   ├── admin/          # Painel administrativo
│   ├── api/            # API Routes
│   ├── noticia/        # Páginas de notícias individuais
│   └── ...
├── public/             # Arquivos estáticos
│   └── images/         # Imagens do site
├── styles/             # Estilos globais
└── utils/              # Utilitários e funções auxiliares
```

## Painel Administrativo

O painel administrativo está disponível em [http://localhost:3000/admin](http://localhost:3000/admin)

Credenciais padrão:
- Email: admin@jornalk1.com.br
- Senha: admin123

## Personalização

### Cores e Tema

As cores principais do site podem ser personalizadas no arquivo `tailwind.config.js`:

```js
theme: {
  extend: {
    colors: {
      primary: "#0066cc",    // Cor principal
      secondary: "#ff6600",  // Cor secundária
      // ...
    }
  }
}
```

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE para detalhes.

## Suporte

Para suporte, entre em contato pelo email contato@jornalk1.com.br
