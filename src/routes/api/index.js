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

// Rutas protegidas: exigen un JWT válido
router.use('/products', verifyToken, productsApiRoutes);
router.use('/categories', verifyToken, categoriesApiRoutes);
router.use('/stats', verifyToken, statsApiRoutes);

module.exports = router;