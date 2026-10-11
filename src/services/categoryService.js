// src/services/categoryService.js
const categoryModel = require('../models/categoryModel');

const categoryService = {
  getAllCategories: () => categoryModel.findAll(),

  getCategoryById: (id) => categoryModel.findById(id),

  // Devuelve un array de mensajes (vacío = válido)
  validateCategoryData: (data = {}) => {
    const errors = [];

    if (typeof data.name !== 'string' || data.name.trim() === '') {
      errors.push('name es obligatorio y debe ser un texto');
    } else if (data.name.trim().length > 50) {
      errors.push('name no puede superar los 50 caracteres');
    }

    return errors;
  },

  // Devuelve { errors } | { duplicate: true } | { category }
  createCategory: (data = {}) => {
    const errors = categoryService.validateCategoryData(data);
    if (errors.length > 0) return { errors };

    const name = data.name.trim();
    if (categoryModel.findByName(name)) return { duplicate: true };

    return { category: categoryModel.create(name) };
  },

  // Devuelve { errors } | { duplicate: true } | { category }
  updateCategory: (id, data = {}) => {
    const errors = categoryService.validateCategoryData(data);
    if (errors.length > 0) return { errors };

    const name = data.name.trim();
    const sameName = categoryModel.findByName(name);
    if (sameName && sameName.id !== id) return { duplicate: true };

    return { category: categoryModel.update(id, name) };
  },

  deleteCategory: (id) => categoryModel.remove(id),

  // Cantidad total de categorías
  countCategories: () => categoryModel.count(),
};

module.exports = categoryService;