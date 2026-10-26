const express = require('express');
const router = express.Router();
const homeRoutes = require('./homeRoutes');
const productRoutes = require('./productRoutes');
const categoryRoutes = require('./categoryRoutes');
const cartRoutes = require('./cartRoutes');
const checkoutRoutes = require('./checkoutRoutes');
const authRoutes = require('./authRoutes');
const searchRoutes = require('./searchRoutes');
const orderRoutes = require('./orderRoutes');
const adminRoutes = require('./adminRoutes');
const { requireLogin, requireAdminPage } = require('../middlewares/sessionAuth');

// Router principal de la aplicación, agrupa todas las rutas bajo sus prefijos correspondientes
router.use('/', homeRoutes);                                  // público
router.use('/products', productRoutes);                       // público
router.use('/categories', categoryRoutes);                    // público
router.use('/cart', requireLogin, cartRoutes);                // autenticados
router.use('/checkout', requireLogin, checkoutRoutes);        // autenticados
router.use('/orders', requireLogin, orderRoutes);             // autenticados
router.use('/admin', requireLogin, requireAdminPage, adminRoutes); // solo admin
router.use('/', authRoutes);
router.use('/search', searchRoutes);                          // público

module.exports = router;