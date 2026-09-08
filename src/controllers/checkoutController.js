const checkoutController = {
  showCheckout: (req, res) => {
    res.render('pages/checkout', { 
      title: 'Finalizar Compra' 
    });
  }
};

module.exports = checkoutController;
