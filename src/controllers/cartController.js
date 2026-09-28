// src/controllers/cartController.js
const cartService = require('../services/cartService');
const eventService = require('../services/eventService'); // Importar el servicio centralizado

// Función auxiliar para emitir el evento WebSocket con el protocolo estandarizado
const notifyCartUpdate = (req) => {
  const { cartItems, total } = cartService.getCartDetail(req.session);
  const cartCount = cartService.getTotalQuantity(req.session);

  // Delegar la emisión al servicio de eventos pasando el tipo y el payload
  eventService.broadcast('cartUpdated', {
    cartCount,
    cartItems,
    total
  });
};

// Marca en sesión si la acción dejó el carrito vacío (tenía productos antes)
const flagIfEmptied = (req, countBefore) => {
  if (countBefore > 0 && cartService.getTotalQuantity(req.session) === 0) {
    req.session.cartEmptied = true;
  }
};

const cartController = {
  // Ver carrito con detalle de productos y monto total
  showCart: (req, res) => {
    const { cartItems, total } = cartService.getCartDetail(req.session);

    // Flash: se lee una sola vez y se elimina
    const showEmptyToast = Boolean(req.session.cartEmptied);
    delete req.session.cartEmptied;

    res.render('pages/cart', {
      title: 'Carrito de Compras',
      cartItems,
      total,
      showEmptyToast
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

    const before = cartService.getTotalQuantity(req.session);

    cartService.updateQuantity(req.session, productId, action);

    flagIfEmptied(req, before);

    notifyCartUpdate(req); // Emitir evento WebSocket

    res.redirect('/cart');
  },

  // Quitar ítem completo
  remove: (req, res) => {
    const { productId } = req.body;

    const before = cartService.getTotalQuantity(req.session);

    cartService.removeItem(req.session, productId);

    flagIfEmptied(req, before);

    notifyCartUpdate(req); // Emitir evento WebSocket

    res.redirect('/cart');
  },

  // Vaciar carrito
  clear: (req, res) => {
    const before = cartService.getTotalQuantity(req.session);

    cartService.clearCart(req.session);

    flagIfEmptied(req, before);

    notifyCartUpdate(req); // Emitir evento WebSocket

    res.redirect('/cart');
  }
};

module.exports = cartController;
