// src/middlewares/cartLocals.js
const cartService = require('../services/cartService');

const cartLocals = (req, res, next) => {
  // Publica la cantidad total calculada en res.locals.cartCount
  // Solo los usuarios autenticados tienen carrito
  res.locals.cartCount = req.user ? cartService.getTotalQuantity(req) : 0;
  next();
};

module.exports = cartLocals;