// src/middlewares/cartLocals.js
const cartService = require('../services/cartService');

const cartLocals = (req, res, next) => {
  // Publica la cantidad total calculada en res.locals.cartCount
  res.locals.cartCount = cartService.getTotalQuantity(req);
  next();
};

module.exports = cartLocals;
