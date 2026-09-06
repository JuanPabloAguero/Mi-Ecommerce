const express = require('express');

const homeRoutes = require('./homeRoutes');
const productRoutes = require('./productRoutes');
const categoryRoutes = require('./categoryRoutes');
const cartRoutes = require('./cartRoutes');
const checkoutRoutes = require('./checkoutRoutes');
const authRoutes = require('./authRoutes');

const router = express.Router();

/**
 * Router principal de la aplicación.
 * Agrupa todas las rutas del ecommerce bajo sus prefijos correspondientes.
 */
router.use('/', homeRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/cart', cartRoutes);
router.use('/checkout', checkoutRoutes);
router.use('/', authRoutes);

module.exports = router;
