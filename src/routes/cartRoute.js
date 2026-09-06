const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

router.get('/cart', cartController.cart);
router.get('/checkout', cartController.checkout);

module.exports = router;
