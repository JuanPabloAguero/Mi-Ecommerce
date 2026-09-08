const productService = require('../services/productService');

const productController = {
  // Función para listar todos los productos con soporte de ordenamiento
  list: (req, res) => {
    const { sort } = req.query;
    const allProducts = productService.getAllProducts();
    
    // Delegar el ordenamiento al servicio
    const products = productService.sortProductsByPrice(allProducts, sort);

    res.render('pages/products', {
      title: 'Todos los Productos',
      products,
      currentSort: sort || ''
    });
  },

  // Mostrar detalles de un producto específico
  detail: (req, res) => {
    // Tomar el producto ya validado por el middleware
    const product = req.product;
    const relatedProducts = productService.getRelatedProducts(product, 4);

    res.render('pages/product', { 
      title: product.name,
      product,
      relatedProducts
    });
  },

  // Mostrar productos de una categoría
  category: (req, res) => {
    const { category } = req.params;
    const products = productService.getProductsByCategory(category);

    res.render('pages/category', {
      title: `Categoría: ${category}`,
      categoryName: category,
      products
    });
  },

  // Buscar productos
  search: (req, res) => {
    const { query } = req.query;
    const products = productService.searchProducts(query);

    res.render('pages/search', {
      title: query ? `Resultados para "${query}"` : 'Búsqueda de productos',
      products,
      query: query || ''
    });
  }
};

module.exports = productController;
