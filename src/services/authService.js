// src/services/authService.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/env');

function authError(code) {
  const error = new Error(code);
  error.code = code;
  return error;
}

// Valida credenciales y devuelve el usuario SIN password_hash.
// Lo reutilizarán el login por JWT (API) y el login por sesión (EJS).
async function authenticate(email, password) {
  const cleanEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';

  if (!cleanEmail || typeof password !== 'string' || !password) {
    throw authError('INVALID_CREDENTIALS');
  }

  const user = userModel.findByEmail(cleanEmail);
  if (!user) {
    throw authError('INVALID_CREDENTIALS');
  }

  const validPassword = await bcrypt.compare(password, user.password_hash);
  if (!validPassword) {
    throw authError('INVALID_CREDENTIALS');
  }

  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

// Firma el JWT con los datos mínimos para identificar al usuario
function generateToken(user) {
  return jwt.sign(
    { sub: String(user.id), email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

// Flujo completo para la API: credenciales → usuario + token
async function login(email, password) {
  const user = await authenticate(email, password);
  const token = generateToken(user);
  return { token, user };
}

// Verifica la firma y la expiración del JWT. Devuelve el usuario identificado.
function verifyAccessToken(token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] });

    return {
      id: Number(decoded.sub), // sub viaja como string
      email: decoded.email,
      role: decoded.role
    };
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw authError('TOKEN_EXPIRED');
    }
    throw authError('INVALID_TOKEN');
  }
}

module.exports = {
  authenticate,
  generateToken,
  login,
  verifyAccessToken
};