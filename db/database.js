// db/database.js
const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Ruta del archivo de base de datos dentro de la carpeta /db
const dbPath = path.join(__dirname, 'database.db');
const db = new Database(dbPath);

// Habilitar claves foráneas en SQLite
db.pragma('foreign_keys = ON');

// Leer y ejecutar el esquema SQL inicial
const schemaPath = path.join(__dirname, 'schema.sql');
const schemaSql = fs.readFileSync(schemaPath, 'utf8');

// Ejecutar todas las sentencias DDL (CREATE TABLE...)
db.exec(schemaSql);

module.exports = db;
