const productModel = require('../models/productModel');

const productService = {
  // Obtener todos los productos
  getAllProducts: () => {
    return productModel.findAll();
  },

  // Obtener producto por su ID
  getProductById: (id) => {
    const products = productModel.findAll();
    return products.find(product => product.id === Number(id));
  },

  // Obtener productos por categoría
  getProductsByCategory: (category) => {
    const products = productModel.findAll();
    return products.filter(
      p => p.category && p.category.toLowerCase() === category.toLowerCase()
    );
  },

  // Obtener productos relacionados por categoría
  getRelatedProducts: (currentProduct, limit = 4) => {
    if (!currentProduct || !currentProduct.category) {
      return [];
    }

    const products = productModel.findAll();
    const related = products.filter(
      product => product.category === currentProduct.category && product.id !== currentProduct.id
    );

    const shuffled = [...related].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, limit);
  },

  // Obtener productos sugeridos para la Home
  getSuggestedProducts: (limit = 5) => {
    const products = productModel.findAll();
    const shuffled = [...products].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, limit);
  },

  // Obtener productos más pedidos
  getMostOrderedProducts: (limit = 10) => {
    const products = productModel.findAll();
    let mostOrdered = products.filter(p => p.isMostOrdered === true);

    if (mostOrdered.length < limit) {
      const remaining = products.filter(p => !p.isMostOrdered);
      const shuffledRemaining = [...remaining].sort(() => 0.5 - Math.random());
      mostOrdered = [...mostOrdered, ...shuffledRemaining];
    }

    return mostOrdered.slice(0, limit);
  },

  // Ordenar productos por precio
  sortProductsByPrice: (products, sortType) => {
    const productsCopy = [...products];

    if (sortType === 'asc') {
      return productsCopy.sort((a, b) => a.price - b.price);
    } else if (sortType === 'desc') {
      return productsCopy.sort((a, b) => b.price - a.price);
    }

    return productsCopy;
  },

  // Buscar productos por coincidencia parcial en nombre
  searchProducts: (query = '') => {
    const allProducts = productModel.findAll();
    const cleanQuery = query.trim().toLowerCase();

    if (!cleanQuery) return [];

    return allProducts.filter(product => 
      product.name.toLowerCase().includes(cleanQuery)
    );
  }
};

module.exports = productService;
