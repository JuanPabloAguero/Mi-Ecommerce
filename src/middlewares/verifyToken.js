// src/middlewares/verifyToken.js
const authService = require('../services/authService');

const verifyToken = (req, res, next) => {
  // 1. Leer la cabecera Authorization: "Bearer <token>"
  const authHeader = req.headers.authorization || '';
  const [scheme, token, ...extra] = authHeader.split(' ');

  // 2. Verificar el formato
  if (scheme !== 'Bearer' || !token || extra.length > 0) {
    return res.status(401).json({ error: 'Token no proporcionado o formato inválido' });
  }

  // 3. Validar autenticidad y expiración, y guardar el resultado en req.user
  try {
    req.user = authService.verifyAccessToken(token);
    return next();
  } catch (error) {
    if (error.code === 'TOKEN_EXPIRED') {
      return res.status(401).json({ error: 'Token expirado' });
    }
    if (error.code === 'INVALID_TOKEN') {
      return res.status(401).json({ error: 'Token inválido' });
    }
    return next(error);
  }
};

module.exports = verifyToken;