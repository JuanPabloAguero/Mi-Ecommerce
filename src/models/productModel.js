const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/products.json');

const productModel = {
  // Único método de acceso a datos directos del JSON
  findAll: () => {
    const fileContent = fs.readFileSync(productsFilePath, 'utf-8');
    return JSON.parse(fileContent);
  }
};

module.exports = productModel;
