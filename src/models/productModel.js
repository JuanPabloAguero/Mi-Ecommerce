const db = require('../../db/database');

const productModel = {
  // Único punto de acceso a la base de datos SQLite
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
  }
};

module.exports = productModel;
