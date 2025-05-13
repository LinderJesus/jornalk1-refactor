module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'next/core-web-vitals',
  ],
  plugins: ['@typescript-eslint', 'react', 'jsx-a11y'],
  rules: {
    // React
    'react/react-in-jsx-scope': 'off', // Next.js não precisa importar React
    'react/prop-types': 'off', // Não precisamos de prop-types quando usamos TypeScript
    'react/display-name': 'off', // Desligamos isso para componentes anônimos
    
    // TypeScript
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': ['warn', { 
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_' // Ignora variáveis que começam com underscore
    }],
    
    // Acessibilidade 
    'jsx-a11y/anchor-is-valid': 'warn',
    
    // Formato
    'semi': ['error', 'always'],
    'quotes': ['error', 'single'],
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  env: {
    browser: true,
    node: true,
    es6: true,
  },
};
