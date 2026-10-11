// src/routes/api/categoriesApiRoutes.js
const express = require('express');
const router = express.Router();
const categoriesApiController = require('../../controllers/api/categoriesApiController');
const apiCategoryId = require('../../middlewares/apiCategoryId');

router.get('/', categoriesApiController.list);
router.post('/', categoriesApiController.create);
router.get('/:id', apiCategoryId, categoriesApiController.detail);
router.put('/:id', apiCategoryId, categoriesApiController.update);
router.delete('/:id', apiCategoryId, categoriesApiController.remove);

module.exports = router;