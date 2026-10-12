// src/routes/api/categoriesApiRoutes.js
const express = require('express');
const router = express.Router();
const categoriesApiController = require('../../controllers/api/categoriesApiController');
const apiCategoryId = require('../../middlewares/apiCategoryId');
const verifyToken = require('../../middlewares/verifyToken');
const requireAdmin = require('../../middlewares/requireAdmin');

const adminOnly = [verifyToken, requireAdmin];

// Públicas 
router.get('/', categoriesApiController.list);
router.get('/:id', apiCategoryId, categoriesApiController.detail);

// Solo admin
router.post('/', adminOnly, categoriesApiController.create);
router.put('/:id', adminOnly, apiCategoryId, categoriesApiController.update);
router.delete('/:id', adminOnly, apiCategoryId, categoriesApiController.remove);

module.exports = router;