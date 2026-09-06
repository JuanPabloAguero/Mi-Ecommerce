const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/products.json');

const productModel = {
  // Obtener todos los productos del JSON
  findAll: () => {
    const fileContent = fs.readFileSync(productsFilePath, 'utf-8');
    return JSON.parse(fileContent);
  },

  // Buscar producto por ID
  findByPk: (id) => {
    const products = productModel.findAll();
    return products.find(product => product.id === Number(id));
  },

  // Filtrar productos por categoría
  findByCategory: (category) => {
    const products = productModel.findAll();
    return products.filter(
      p => p.category && p.category.toLowerCase() === category.toLowerCase()
    );
  },

  // Obtener hasta 4 productos relacionados por categoría
  getRelatedProducts: (currentProduct, limit = 4) => {
    if (!currentProduct || !currentProduct.category) {
      return [];
    }

    const products = productModel.findAll();

    // Filtrar por la misma categoría excluyendo el producto que se está viendo
    const related = products.filter(
      product => product.category === currentProduct.category && product.id !== currentProduct.id
    );

    // Mezclar aleatoriamente si supera el límite requerido
    const shuffled = [...related].sort(() => 0.5 - Math.random());

    return shuffled.slice(0, limit);
  },

  // Obtener hasta 5 productos aleatorios
  getSuggestedProducts: (limit = 5) => {
    const products = productModel.findAll();

    // Mezclar aleatoriamente el array (Fisher-Yates Shuffle)
    const shuffled = [...products].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, limit);
  },

  // Obtener hasta 10 productos más pedidos
  getMostOrderedProducts: (limit = 10) => {
    const products = productModel.findAll();

    // 1. Filtrar los productos marcados con el flag "isMostOrdered"
    let mostOrdered = products.filter(p => p.isMostOrdered === true);

    // 2. Si hay menos del límite, rellenar de forma aleatoria con los restantes
    if (mostOrdered.length < limit) {
      const remaining = products.filter(p => !p.isMostOrdered);
      const shuffledRemaining = [...remaining].sort(() => 0.5 - Math.random());
      mostOrdered = [...mostOrdered, ...shuffledRemaining];
    }

    // 3. Retornar solo hasta la cantidad máxima requerida (10)
    return mostOrdered.slice(0, limit);
  }
};

module.exports = productModel;
