// src/controllers/cartController.js
const cartService = require('../services/cartService');

// Función auxiliar para emitir el evento WebSocket con el protocolo estandarizado
const notifyCartUpdate = (req) => {
  const broadcast = req.app.get('broadcast');
  if (broadcast) {
    const { cartItems, total } = cartService.getCartDetail(req.session);
    const cartCount = cartService.getTotalQuantity(req.session);

    // Protocolo de eventos
    broadcast({
      type: 'cartUpdated',
      payload: {
        cartCount,
        cartItems,
        total
      }
    });
  }
};

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

    if (added) {
      notifyCartUpdate(req); // Emitir evento WebSocket
    }

    res.redirect(req.get('referer') || '/cart');
  },

  // Aumentar / Disminuir cantidad
  updateQuantity: (req, res) => {
    const { productId, action } = req.body;
    cartService.updateQuantity(req.session, productId, action);

    notifyCartUpdate(req); // Emitir evento WebSocket

    res.redirect('/cart');
  },

  // Quitar ítem completo
  remove: (req, res) => {
    const { productId } = req.body;
    cartService.removeItem(req.session, productId);

    notifyCartUpdate(req); // Emitir evento WebSocket

    res.redirect('/cart');
  },

  // Vaciar carrito
  clear: (req, res) => {
    cartService.clearCart(req.session);

    notifyCartUpdate(req); // Emitir evento WebSocket

    res.redirect('/cart');
  }
};

module.exports = cartController;
