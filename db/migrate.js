const fs = require('fs');
const path = require('path');
const db = require('./database');

function runMigration() {
  const jsonPath = path.join(__dirname, '../src/data/products.json');

  // 1. Verificar si el archivo JSON existe
  if (!fs.existsSync(jsonPath)) {
    console.log('El archivo products.json no existe o ya fue migrado.');
    return;
  }

  // 2. Leer datos del JSON
  const rawData = fs.readFileSync(jsonPath, 'utf-8');
  const products = JSON.parse(rawData);

  // 3. Preparar sentencias SQL preparadas (Prepared Statements)
  // Usamos INSERT OR IGNORE para categorías y productos para evitar duplicados al reejecutar
  const selectAllCategoriesStmt = db.prepare(`
    SELECT id, name FROM categories
  `);

  const insertProductStmt = db.prepare(`
    INSERT OR IGNORE INTO products (id, name, description, price, image, stock, isMostOrdered, category_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  // 4. Ejecutar la migración dentro de una transacción para mayor eficiencia e integridad
  const transaction = db.transaction((productList) => {
    // 1. Obtener las categorías precargadas por schema.sql
    const categoriesFromDb = selectAllCategoriesStmt.all();
    
    // 2. Crear un mapa para buscar el ID de la categoría por su nombre
    const categoryMap = {};
    for (const cat of categoriesFromDb) {
      categoryMap[cat.name] = cat.id;
    }

    // 3. Insertar cada producto con su category_id numérico
    for (const prod of productList) {
      const categoryId = categoryMap[prod.category] || null;

      insertProductStmt.run(
        prod.id,
        prod.name,
        prod.description,
        prod.price,
        prod.image,
        prod.stock,
        prod.isMostOrdered ? 1 : 0,
        categoryId
      );
    }
  });

  try {
    transaction(products);
    console.log('✅ Migración realizada con éxito.');

    // 5. Eliminar el archivo JSON tras la migración
    fs.unlinkSync(jsonPath);
    console.log('🗑️  products.json eliminado correctamente.');
  } catch (error) {
    console.error('❌ Error durante la migración:', error);
  }
}

module.exports = runMigration;
