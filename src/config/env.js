// src/config/env.js
require('dotenv').config();

if (!process.env.JWT_SECRET) {
  throw new Error('Falta la variable de entorno JWT_SECRET (revisa tu archivo .env)');
}

module.exports = {
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1h'
};