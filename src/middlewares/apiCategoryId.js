// src/middlewares/apiCategoryId.js
const categoryService = require('../services/categoryService');

const apiCategoryId = (req, res, next) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'El id debe ser un número entero válido' });
  }

  const category = categoryService.getCategoryById(id);
  if (!category) {
    return res.status(404).json({ error: 'Categoría no encontrada' });
  }

  req.category = category;
  next();
};

module.exports = apiCategoryId;