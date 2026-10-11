// src/middlewares/apiProductId.js
const productService = require('../services/productService');

const apiProductId = (req, res, next) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'El id debe ser un número entero válido' });
  }

  const product = productService.getProductById(id);
  if (!product) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }

  req.product = product; // disponible para el controlador
  next();
};

module.exports = apiProductId;