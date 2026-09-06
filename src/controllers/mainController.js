const productModel = require('../models/productModel');

const mainController = {
  index: (req, res) => {
    const suggestedProducts = productModel.getSuggestedProducts(5);
    const mostOrderedProducts = productModel.getMostOrderedProducts(10);
    
    res.render('pages/index', { 
      suggestedProducts,
      mostOrderedProducts
    });
  },
  login: (req, res) => {
    res.render('pages/login');
  },
  register: (req, res) => {
    res.render('pages/register');
  }
};

module.exports = mainController;
