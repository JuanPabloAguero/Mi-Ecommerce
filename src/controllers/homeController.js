const productModel = require('../models/productModel');

const homeController = {
  index: (req, res) => {
    const suggestedProducts = productModel.getSuggestedProducts(5);
    const mostOrderedProducts = productModel.getMostOrderedProducts(10);
    
    res.render('pages/index', { 
      title: 'Inicio',
      suggestedProducts,
      mostOrderedProducts
    });
  }
};

module.exports = homeController;
