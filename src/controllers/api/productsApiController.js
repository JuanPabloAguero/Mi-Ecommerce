// src/controllers/api/productsApiController.js
const productService = require('../../services/productService');

const productsApiController = {
  // GET /api/products
  list: (req, res) => {
    res.status(200).json(productService.getAllProducts());
  },

  // GET /api/products/:id  (el middleware ya validó id y existencia)
  detail: (req, res) => {
    res.status(200).json(req.product);
  },

  // POST /api/products
  create: (req, res) => {
    const { errors, product } = productService.createProduct(req.body || {});

    if (errors) {
      return res.status(400).json({ error: 'Datos inválidos', details: errors });
    }

    res.status(201).json(product);
  },

  // PUT /api/products/:id
  update: (req, res) => {
    const { errors, product } = productService.updateProduct(req.product, req.body || {});

    if (errors) {
      return res.status(400).json({ error: 'Datos inválidos', details: errors });
    }

    res.status(200).json(product);
  },

  // DELETE /api/products/:id
  remove: (req, res) => {
    try {
      productService.deleteProduct(req.product.id);
      res.status(200).json({ message: 'Producto eliminado', id: req.product.id })
    } catch (error) {
      // Producto referenciado por order_items (clave foránea)
      if (error.code === 'SQLITE_CONSTRAINT_FOREIGNKEY') {
        return res.status(409).json({
          error: 'No se puede eliminar: el producto está asociado a órdenes'
        });
      }
      throw error; // cualquier otro error → 500
    }
  }
};

module.exports = productsApiController;