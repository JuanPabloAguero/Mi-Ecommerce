// src/controllers/cartController.js
const cartService = require('../services/cartService');

const cartController = {
  // Ver carrito con detalle de productos y monto total
  showCart: (req, res) => {
    const { cartItems, total } = cartService.getCartDetail(req.session);

    res.render('pages/cart', { 
      title: 'Carrito de Compras', 
      cartItems, 
      total 
    });
  },

  // Agregar producto
  add: (req, res) => {
    const { productId } = req.body;
    const added = cartService.addItem(req.session, productId);

    if (!added) {
      return res.redirect(`/products/${productId}`);
    }

    res.redirect('/cart');
  },

  // Aumentar / Disminuir cantidad
  updateQuantity: (req, res) => {
    const { productId, action } = req.body;
    cartService.updateQuantity(req.session, productId, action);

    res.redirect('/cart');
  },

  // Quitar ítem completo
  remove: (req, res) => {
    const { productId } = req.body;
    cartService.removeItem(req.session, productId);

    res.redirect('/cart');
  },

  // Vaciar carrito
  clear: (req, res) => {
    cartService.clearCart(req.session);

    res.redirect('/cart');
  }
};

module.exports = cartController;
