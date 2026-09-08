const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const normalizeId = require('../middlewares/normalizeId');

// Ruta principal del catálogo: GET /products
router.get('/', productController.list);

// Ruta detalle del producto: GET /products/:id
router.get('/:id', normalizeId, productController.detail);

module.exports = router;
