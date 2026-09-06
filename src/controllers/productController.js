const productModel = require('../models/productModel');

const productController = {
  // Mostrar detalles de un producto específico
  detail: (req, res) => {
    const { id } = req.params;
    const product = productModel.findByPk(id);

    // Escenario 2 & BONUS: Producto inexistente -> renderizar vista 404
    if (!product) {
      return res.status(404).render('pages/404', { 
        message: 'El producto que buscas no existe o ha sido removido.' 
      });
    }

    // Obtener productos relacionados para la sección inferior
    const relatedProducts = productModel.getRelatedProducts(product, 4);

    // Escenario 1: Producto existente
    res.render('pages/product', { 
      product,
      relatedProducts
    });
  },

  // Mostrar productos de una categoría
  category: (req, res) => {
    const { category } = req.params;
    const products = productModel.findByCategory(category);

    res.render('pages/category', {
      categoryName: category,
      products
    });
  }
};

module.exports = productController;
