const checkoutController = {
  checkout: (req, res) => {
    res.render('pages/checkout', { 
      title: 'Finalizar Compra' 
    });
  }
};

module.exports = checkoutController;
