// src/routes/api/productsApiRoutes.js
const express = require('express');
const router = express.Router();
const productsApiController = require('../../controllers/api/productsApiController');
const apiProductId = require('../../middlewares/apiProductId');
const verifyToken = require('../../middlewares/verifyToken');
const requireAdmin = require('../../middlewares/requireAdmin');

// Cadena reutilizable: primero identifica (401), luego autoriza (403)
const adminOnly = [verifyToken, requireAdmin];

// Públicas
router.get('/', productsApiController.list);
router.get('/:id', apiProductId, productsApiController.detail);

// Solo admin
router.post('/', adminOnly, productsApiController.create);
router.put('/:id', adminOnly, apiProductId, productsApiController.update);
router.delete('/:id', adminOnly, apiProductId, productsApiController.remove);

module.exports = router;