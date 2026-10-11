// src/services/statsService.js
const productService = require('./productService');
const categoryService = require('./categoryService');

const statsService = {
  getGeneralStats: () => {
    return {
      totalProducts: productService.countProducts(),
      totalCategories: categoryService.countCategories()
    };
  }
};

module.exports = statsService;