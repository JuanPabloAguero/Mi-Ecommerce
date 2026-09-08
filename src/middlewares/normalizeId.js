// src/middlewares/normalizeId.js
const productService = require('../services/productService');

const normalizeId = (req, res, next) => {
  const { id } = req.params;

  // Escenario 1: ID no numérico -> Status 400
  if (isNaN(id) || isNaN(Number(id))) {
    return res.status(400).render('pages/404', { 
      title: 'Petición Inválida',
      message: 'El identificador del producto debe ser un número válido.' 
    });
  }

  const numericId = Number(id);
  const product = productService.getProductById(numericId);

  // Escenario 2: ID numérico pero inexistente -> Status 404
  if (!product) {
    return res.status(404).render('pages/404', { 
      title: 'Producto No Encontrado',
      message: 'El producto solicitado no existe o ha sido removido.' 
    });
  }

  // Guardar el producto normalizado para uso directo en el controlador
  req.product = product;
  next();
};

module.exports = normalizeId;
