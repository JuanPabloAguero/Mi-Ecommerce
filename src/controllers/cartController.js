const cartController = {
  cart: (req, res) => {
    res.render('pages/cart');
  },
  checkout: (req, res) => {
    res.render('pages/checkout');
  }
};

module.exports = cartController;
