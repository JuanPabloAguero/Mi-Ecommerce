// src/config/env.js
require('dotenv').config();

['JWT_SECRET', 'SESSION_SECRET'].forEach((name) => {
  if (!process.env[name]) {
    throw new Error(`Falta la variable de entorno ${name} (revisa tu archivo .env)`);
  }
});

module.exports = {
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1h',
  SESSION_SECRET: process.env.SESSION_SECRET,
  IS_PRODUCTION: process.env.NODE_ENV === 'production'
};