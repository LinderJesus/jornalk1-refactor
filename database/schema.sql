-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS jornalk1;
USE jornalk1;

-- Users table for admin and authors
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'author', 'editor') NOT NULL DEFAULT 'author',
  avatar_url VARCHAR(255),
  bio TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- News articles table
CREATE TABLE IF NOT EXISTS news (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt TEXT,
  image_url VARCHAR(255),
  category_id INT NOT NULL,
  author_id INT NOT NULL,
  status ENUM('draft', 'published', 'archived') NOT NULL DEFAULT 'draft',
  is_featured BOOLEAN DEFAULT 0,
  view_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id),
  FOREIGN KEY (author_id) REFERENCES users(id)
);

-- Tags table
CREATE TABLE IF NOT EXISTS tags (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  slug VARCHAR(50) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- News-Tags relationship (many-to-many)
CREATE TABLE IF NOT EXISTS news_tags (
  news_id INT NOT NULL,
  tag_id INT NOT NULL,
  PRIMARY KEY (news_id, tag_id),
  FOREIGN KEY (news_id) REFERENCES news(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  news_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  content TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (news_id) REFERENCES news(id) ON DELETE CASCADE
);

-- Partners table
CREATE TABLE IF NOT EXISTS partners (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  logo_url VARCHAR(255),
  description TEXT,
  website VARCHAR(255),
  category VARCHAR(100),
  is_active BOOLEAN DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert sample data for categories related to surf
INSERT INTO categories (name, slug, description) VALUES
('Competições', 'competicoes', 'Acompanhe as disputas mundiais de surf'),
('Equipamentos', 'equipamentos', 'Pranchas, wetsuits e acessórios para surfistas'),
('Destinos', 'destinos', 'Melhores praias para surf pelo mundo'),
('Técnicas', 'tecnicas', 'Aprenda novas manobras e aprimore seu surf'),
('Sustentabilidade', 'sustentabilidade', 'Proteção dos oceanos e praias'),
('Cultura', 'cultura', 'A história e o estilo de vida do surf');

-- Insert sample admin user (password: admin123)
INSERT INTO users (name, email, password, role) VALUES
('Admin', 'admin@jornalk1surf.com.br', '$2a$10$GQT6NmT6.GbHQve1Yh9GlOBsW6UxRxwxj1JZhSW9GIiTJ/ulmJPmi', 'admin');
