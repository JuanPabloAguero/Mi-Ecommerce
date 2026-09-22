-- db/schema.sql

-- Tabla de Categorías
CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

-- Precargar las categorías fijas con sus IDs del 1 al 8
INSERT OR IGNORE INTO categories (id, name) VALUES 
  (1, 'Electronica'),
  (2, 'Alimentos'),
  (3, 'Bebidas'),
  (4, 'Indumentaria'),
  (5, 'Juegos'),
  (6, 'Automotor'),
  (7, 'Hogar'),
  (8, 'Otros');

-- Tabla de Productos
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  price REAL NOT NULL,
  image TEXT,
  stock INTEGER NOT NULL DEFAULT 0,
  isMostOrdered INTEGER DEFAULT 0, -- Se usa INTEGER (0 o 1) para representar booleanos en SQLite
  category_id INTEGER,
  FOREIGN KEY (category_id) REFERENCES categories (id)
);

-- Tabla de Usuarios
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Órdenes
CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  total REAL NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id)
);

-- Tabla de Detalles de Órdenes
CREATE TABLE IF NOT EXISTS order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  price REAL NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders (id),
  FOREIGN KEY (product_id) REFERENCES products (id)
);
