// src/controllers/api/categoriesApiController.js
const categoryService = require('../../services/categoryService');

const categoriesApiController = {
  // GET /api/categories
  list: (req, res) => {
    res.status(200).json(categoryService.getAllCategories());
  },

  // GET /api/categories/:id
  detail: (req, res) => {
    res.status(200).json(req.category);
  },

  // POST /api/categories
  create: (req, res) => {
    const { errors, duplicate, category } = categoryService.createCategory(req.body || {});

    if (errors) {
      return res.status(400).json({ error: 'Datos inválidos', details: errors });
    }
    if (duplicate) {
      return res.status(409).json({ error: 'Ya existe una categoría con ese nombre' });
    }

    res.status(201).json(category);
  },

  // PUT /api/categories/:id
  update: (req, res) => {
    const { errors, duplicate, category } = categoryService.updateCategory(
      req.category.id,
      req.body || {}
    );

    if (errors) {
      return res.status(400).json({ error: 'Datos inválidos', details: errors });
    }
    if (duplicate) {
      return res.status(409).json({ error: 'Ya existe una categoría con ese nombre' });
    }

    res.status(200).json(category);
  },

  // DELETE /api/categories/:id
  remove: (req, res) => {
    try {
      categoryService.deleteCategory(req.category.id);
      res.status(200).json({ message: 'Categoría eliminada', category: req.category });
    } catch (error) {
      // La categoría todavía tiene productos asociados (clave foránea)
      if (error.code === 'SQLITE_CONSTRAINT_FOREIGNKEY') {
        return res.status(409).json({
          error: 'No se puede eliminar: la categoría tiene productos asociados'
        });
      }
      throw error; // cualquier otro error → 500
    }
  }
};

module.exports = categoriesApiController;