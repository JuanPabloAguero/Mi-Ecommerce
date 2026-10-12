// src/middlewares/requireAdmin.js
const requireAdmin = (req, res, next) => {
  // Si se usó sin verifyToken antes, no hay identidad: es un 401, no un 403
  if (!req.user) {
    return res.status(401).json({ error: 'Autenticación requerida' });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acceso denegado: se requieren permisos de administrador' });
  }

  next();
};

module.exports = requireAdmin;