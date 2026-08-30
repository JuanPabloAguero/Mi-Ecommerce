const express = require('express');
const router = express.Router();

// Home / Inicio
router.get('/', (req, res) => {
    res.render('pages/index');
});

// Detalle de producto
router.get('/products', (req, res) => {
    res.render('pages/product');
});

// Carrito de compras
router.get('/cart', (req, res) => {
    res.render('pages/cart');
});

// Checkout / Pago
router.get('/checkout', (req, res) => {
    res.render('pages/checkout');
});

// Registro de usuario
router.get('/register', (req, res) => {
    res.render('pages/register');
});

// Inicio de sesión
router.get('/login', (req, res) => {
    res.render('pages/login');
});

module.exports = router;
