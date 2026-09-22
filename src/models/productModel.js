const db = require('../../db/database');

const productModel = {
  // Obtener todos los productos mediante SQL
  findAll: () => {
    const query = `
      SELECT 
        p.id,
        p.name,
        p.description,
        p.price,
        p.image,
        p.stock,
        p.isMostOrdered,
        c.name AS category
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
    `;
    const products = db.prepare(query).all();

    // Convertir 0/1 de SQLite a booleanos para mantener la estructura original y lógica existente en el service
    return products.map(product => ({
      ...product,
      isMostOrdered: Boolean(product.isMostOrdered)
    }));
  },

  // Obtener un solo producto por ID mediante SQL
  findById: (id) => {
    const query = `
      SELECT 
        p.id,
        p.name,
        p.description,
        p.price,
        p.image,
        p.stock,
        p.isMostOrdered,
        c.name AS category
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
    `;
    const product = db.prepare(query).get(id);

    if (!product) return null;

    return {
      ...product,
      isMostOrdered: Boolean(product.isMostOrdered)
    };
  }
};

module.exports = productModel;
