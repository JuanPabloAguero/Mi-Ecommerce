// src/models/categoryModel.js
const db = require('../../db/database');

const categoryModel = {
  findAll: () => {
    return db.prepare('SELECT id, name FROM categories ORDER BY id').all();
  },

  findById: (id) => {
    return db.prepare('SELECT id, name FROM categories WHERE id = ?').get(id) || null;
  },

  // Búsqueda por nombre sin distinguir mayúsculas (sirve para detectar duplicados)
  findByName: (name) => {
    return db
      .prepare('SELECT id, name FROM categories WHERE name = ? COLLATE NOCASE')
      .get(name) || null;
  },

  create: (name) => {
    const info = db.prepare('INSERT INTO categories (name) VALUES (?)').run(name);
    return categoryModel.findById(Number(info.lastInsertRowid));
  },

  update: (id, name) => {
    db.prepare('UPDATE categories SET name = ? WHERE id = ?').run(name, id);
    return categoryModel.findById(id);
  },

  // Devuelve true si se eliminó una fila
  remove: (id) => {
    const info = db.prepare('DELETE FROM categories WHERE id = ?').run(id);
    return info.changes > 0;
  },

  // Cantidad total de categorías
  count: () => {
    return db.prepare('SELECT COUNT(*) AS total FROM categories').get().total;
  }
};

module.exports = categoryModel;