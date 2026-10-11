// src/routes/api/index.js
const express = require('express');
const router = express.Router();
const productsApiRoutes = require('./productsApiRoutes');
const categoriesApiRoutes = require('./categoriesApiRoutes');
const statsApiRoutes = require('./statsApiRoutes');

// Ruta de verificación: confirma que la API está levantada
router.get('/', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API de Mi Ecommerce' });
});

router.use('/products', productsApiRoutes);
router.use('/categories', categoriesApiRoutes);
router.use('/stats', statsApiRoutes);

module.exports = router;