const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Al usar /:id, Express captura cualquier ID (ej: /products/1, /products/2)
router.get('/:id', productController.detail);

module.exports = router;
