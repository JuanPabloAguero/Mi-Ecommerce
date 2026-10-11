const productModel = require('../models/productModel');

const productService = {
  // Obtener todos los productos desde la base de datos
  getAllProducts: () => {
    return productModel.findAll();
  },

  // Obtener producto por su ID directamente desde la base de datos
  getProductById: (id) => {
    return productModel.findById(id);
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
  },

  // Valida los datos de un producto. Devuelve un array de mensajes (vacío = válido)
  validateProductData: (data) => {
    const errors = [];

    if (typeof data.name !== 'string' || data.name.trim() === '') {
      errors.push('name es obligatorio y debe ser un texto');
    }
    if (typeof data.price !== 'number' || !Number.isFinite(data.price) || data.price < 0) {
      errors.push('price es obligatorio y debe ser un número mayor o igual a 0');
    }
    if (!Number.isInteger(data.stock) || data.stock < 0) {
      errors.push('stock debe ser un entero mayor o igual a 0');
    }
    if (data.category && productModel.findCategoryIdByName(data.category) === null) {
      errors.push('category no corresponde a una categoría existente');
    }

    return errors;
  },

  // Crear producto. Devuelve { errors } o { product }
  createProduct: (data = {}) => {
    const candidate = {
      name: typeof data.name === 'string' ? data.name.trim() : data.name,
      description: data.description ?? null,
      price: data.price,
      image: data.image ?? null,
      stock: data.stock ?? 0,
      isMostOrdered: Boolean(data.isMostOrdered),
      category: data.category ?? null
    };

    const errors = productService.validateProductData(candidate);
    if (errors.length > 0) return { errors };

    return { product: productModel.create(candidate) };
  },

  // Actualizar producto existente. Los campos no enviados conservan su valor actual
  updateProduct: (existing, data = {}) => {
    const fields = ['name', 'description', 'price', 'image', 'stock', 'isMostOrdered', 'category'];
    const candidate = { ...existing };

    for (const field of fields) {
      if (data[field] !== undefined) candidate[field] = data[field];
    }
    if (typeof candidate.name === 'string') candidate.name = candidate.name.trim();
    candidate.isMostOrdered = Boolean(candidate.isMostOrdered);

    const errors = productService.validateProductData(candidate);
    if (errors.length > 0) return { errors };

    return { product: productModel.update(existing.id, candidate) };
  },

  // Eliminar producto. Devuelve true si se eliminó
  deleteProduct: (id) => {
    return productModel.remove(id);
  },

  // Cantidad total de productos
  countProducts: () => productModel.count(),
};

module.exports = productService;