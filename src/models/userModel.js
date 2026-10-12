// src/models/userModel.js
const db = require('../../db/database');

// Campos "públicos": nunca incluyen password_hash
const PUBLIC_FIELDS = 'id, name, email, role, created_at';

const userModel = {
  findById: (id) => {
    return db.prepare(`SELECT ${PUBLIC_FIELDS} FROM users WHERE id = ?`).get(id) || null;
  },

  // Incluye password_hash porque lo necesitará el login (próxima historia)
  findByEmail: (email) => {
    return db
      .prepare('SELECT id, name, email, password_hash, role, created_at FROM users WHERE email = ? COLLATE NOCASE')
      .get(email) || null;
  },

  // Inserta y devuelve el usuario SIN password_hash
  create: ({ name, email, passwordHash, role }) => {
    const info = db
      .prepare('INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)')
      .run(name, email, passwordHash, role);
    return userModel.findById(Number(info.lastInsertRowid));
  }
};

module.exports = userModel;