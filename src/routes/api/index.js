// src/routes/api/index.js
const express = require('express');
const router = express.Router();
const productsApiRoutes = require('./productsApiRoutes');
const categoriesApiRoutes = require('./categoriesApiRoutes');
const statsApiRoutes = require('./statsApiRoutes');
const authApiRoutes = require('./authApiRoutes');
const verifyToken = require('../../middlewares/verifyToken');

// Rutas públicas
// Ruta de verificación: confirma que la API está levantada
router.get('/', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API de Mi Ecommerce' });
});
// Ruta de registro y login
router.use('/auth', authApiRoutes);

// La protección de estos recursos se define dentro de cada archivo de rutas
router.use('/products', productsApiRoutes);
router.use('/categories', categoriesApiRoutes);

// Solo requiere estar autenticado
router.use('/stats', verifyToken, statsApiRoutes);

module.exports = router;