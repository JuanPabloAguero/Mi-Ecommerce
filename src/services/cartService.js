// src/services/cartService.js
const productService = require('./productService');

const cartService = {
  // Inicializar y obtener el array simple de la sesión [{ productId, quantity }]
  getCart: (session) => {
    if (!session || !session.cart) {
      if (session) session.cart = [];
      return [];
    }
    return session.cart;
  },

  // Obtener la cantidad total de ítems (para el badge del carrito en el header)
  getTotalQuantity: (reqOrSession) => {
    const session = reqOrSession.session || reqOrSession;
    const cart = cartService.getCart(session);
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  },

  // Obtener los productos detallados con subtotal y el total del monto (para la vista del carrito) (desde SQLite mediante productService)
  getCartDetail: (session) => {
    const sessionCart = cartService.getCart(session);

    const cartItems = sessionCart
      .map(item => {
        // Validar y obtener los datos reales del producto directamente desde la DB mediante productService
        const product = productService.getProductById(item.productId);
        if (!product) return null;

        return {
          ...product,
          quantity: item.quantity,
          subtotal: product.price * item.quantity
        };
      })
      .filter(item => item !== null);

    // Calcular total acumulado con datos reales
    const total = cartItems.reduce((acc, item) => acc + item.subtotal, 0);

    return { cartItems, total };
  },

  // Agregar producto
  addItem: (session, productId) => {
    const product = productService.getProductById(productId);
    if (!product || product.stock <= 0) return false;

    cartService.getCart(session);

    const existingIndex = session.cart.findIndex(item => Number(item.productId) === Number(productId));

    if (existingIndex !== -1) {
      if (session.cart[existingIndex].quantity < product.stock) {
        session.cart[existingIndex].quantity += 1;
      }
    } else {
      session.cart.push({ productId: Number(productId), quantity: 1 });
    }

    return true;
  },

  // Modificar cantidad (increase / decrease)
  updateQuantity: (session, productId, action) => {
    const cart = cartService.getCart(session);
    const index = cart.findIndex(item => Number(item.productId) === Number(productId));

    if (index !== -1) {
      const product = productService.getProductById(productId);

      if (action === 'increase') {
        if (product && session.cart[index].quantity < product.stock) {
          session.cart[index].quantity += 1;
        }
      } else if (action === 'decrease') {
        session.cart[index].quantity -= 1;
        if (session.cart[index].quantity <= 0) {
          session.cart.splice(index, 1);
        }
      }
    }
  },

  // Quitar producto
  removeItem: (session, productId) => {
    if (!session || !session.cart) return;
    session.cart = session.cart.filter(item => Number(item.productId) !== Number(productId));
  },

  // Vaciar carrito
  clearCart: (session) => {
    if (session) session.cart = [];
  }
};

module.exports = cartService;
