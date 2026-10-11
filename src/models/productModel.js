const db = require('../../db/database');
const categoryModel = require('./categoryModel');

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
  },

  // Buscar el id de una categoría por su nombre (delega a categoryModel)
  findCategoryIdByName: (name) => {
    const category = categoryModel.findByName(name);
    return category ? category.id : null;
  },

  // Insertar un producto y devolverlo ya con el formato de findById
  create: (data) => {
    const categoryId = data.category
      ? productModel.findCategoryIdByName(data.category)
      : null;

    const info = db.prepare(`
      INSERT INTO products (name, description, price, image, stock, isMostOrdered, category_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      data.name,
      data.description,
      data.price,
      data.image,
      data.stock,
      data.isMostOrdered ? 1 : 0,
      categoryId
    );

    return productModel.findById(Number(info.lastInsertRowid));
  },

  // Actualizar un producto y devolverlo actualizado
  update: (id, data) => {
    const categoryId = data.category
      ? productModel.findCategoryIdByName(data.category)
      : null;

    db.prepare(`
      UPDATE products
      SET name = ?, description = ?, price = ?, image = ?,
          stock = ?, isMostOrdered = ?, category_id = ?
      WHERE id = ?
    `).run(
      data.name,
      data.description,
      data.price,
      data.image,
      data.stock,
      data.isMostOrdered ? 1 : 0,
      categoryId,
      id
    );

    return productModel.findById(id);
  },

  // Eliminar un producto. Devuelve true si se borró algo
  remove: (id) => {
    const info = db.prepare('DELETE FROM products WHERE id = ?').run(id);
    return info.changes > 0;
  },

  // Cantidad total de productos
  count: () => {
    return db.prepare('SELECT COUNT(*) AS total FROM products').get().total;
  }
};

module.exports = productModel;