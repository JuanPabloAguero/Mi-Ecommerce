const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

router.get('/cart', cartController.cart);
router.post('/cart/add', cartController.add);
router.post('/cart/update', cartController.updateQuantity);
router.post('/cart/remove', cartController.remove);
router.post('/cart/clear', cartController.clear);
router.get('/checkout', cartController.checkout);

module.exports = router;
