const productModel = require('../models/productModel');

const cartController = {
  // Escenario 2, 5 y 6: Ver carrito y calcular total
  cart: (req, res) => {
    const sessionCart = req.session.cart || [];

    // Obtener todos los productos reales del JSON
    const allProducts = productModel.findAll();
    
    // Mapear combinando la sesión con los datos del JSON
    const cartItems = sessionCart.map(item => {
      const product = allProducts.find(p => Number(p.id) === Number(item.productId));
      if (!product) return null;
      
      return {
        ...product,
        quantity: item.quantity,
        subtotal: product.price * item.quantity
      };
    }).filter(item => item !== null); // Eliminar posibles nulos

    const total = cartItems.reduce((acc, item) => acc + item.subtotal, 0);

    res.render('pages/cart', { cartItems, total });
  },

  // Escenario 1: Agregar producto
  add: (req, res) => {
    const { productId } = req.body;
    const product = productModel.findByPk(productId);

    // Si no existe o no tiene stock, rechazar
    if (!product || product.stock <= 0) {
      return res.redirect(`/products/${productId}`);
    }

    const cart = req.session.cart || [];
    const existingIndex = cart.findIndex(item => Number(item.productId) === Number(productId));

    if (existingIndex !== -1) {
      // Validar que al sumar 1 no supere el stock disponible
      if (cart[existingIndex].quantity < product.stock) {
        cart[existingIndex].quantity += 1;
      }
    } else {
      cart.push({ productId: Number(productId), quantity: 1 });
    }

    req.session.cart = cart;
    res.redirect('/cart');
  },

  // Escenario 3: Aumentar / Disminuir
  updateQuantity: (req, res) => {
    const { productId, action } = req.body;
    let cart = req.session.cart || [];

    const index = cart.findIndex(item => item.productId == productId);
    
    if (index !== -1) {
      const product = productModel.findByPk(productId);

      if (action === 'increase') {
        // Solo incrementa si la cantidad en carrito es menor que el stock
        if (product && cart[index].quantity < product.stock) {
          cart[index].quantity += 1;
        }
      } else if (action === 'decrease') {
        cart[index].quantity -= 1;
        if (cart[index].quantity <= 0) {
          cart.splice(index, 1);
        }
      }
    }

    req.session.cart = cart;
    res.redirect('/cart');
  },

  // Escenario 3: Quitar ítem completo
  remove: (req, res) => {
    const { productId } = req.body;
    req.session.cart = (req.session.cart || []).filter(item => item.productId != productId);
    res.redirect('/cart');
  },

  // Escenario 4: Vaciar carrito
  clear: (req, res) => {
    req.session.cart = [];
    res.redirect('/cart');
  },

  checkout: (req, res) => {
    res.render('pages/checkout');
  }
};

module.exports = cartController;
