const productService = require('../services/productService');

const homeController = {
  index: (req, res) => {
    const suggestedProducts = productService.getSuggestedProducts(5);
    const mostOrderedProducts = productService.getMostOrderedProducts(10);
    
    res.render('pages/index', { 
      title: 'Inicio',
      suggestedProducts,
      mostOrderedProducts
    });
  }
};

module.exports = homeController;
