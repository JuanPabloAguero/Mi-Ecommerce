// src/middlewares/sessionAuth.js

// Expone al usuario de la sesión: en req.user (igual que en la API) y en las vistas como currentUser
const sessionLocals = (req, res, next) => {
  const user = req.session.user || null;
  req.user = user;
  res.locals.currentUser = user;
  next();
};

// Exige estar autenticado; si no, redirige al login
const requireLogin = (req, res, next) => {
  if (!req.user) return res.redirect('/login');
  next();
};

// Exige rol admin (usar después de requireLogin)
const requireAdminPage = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).render('pages/403', { title: 'Acceso denegado' });
  }
  next();
};

// Para login y registro: un usuario ya autenticado no los necesita
const redirectIfAuthenticated = (req, res, next) => {
  if (req.user) return res.redirect('/');
  next();
};

module.exports = { sessionLocals, requireLogin, requireAdminPage, redirectIfAuthenticated };