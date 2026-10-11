// src/routes/api/productsApiRoutes.js
const express = require('express');
const router = express.Router();
const productsApiController = require('../../controllers/api/productsApiController');
const apiProductId = require('../../middlewares/apiProductId');

router.get('/', productsApiController.list);
router.post('/', productsApiController.create);
router.get('/:id', apiProductId, productsApiController.detail);
router.put('/:id', apiProductId, productsApiController.update);
router.delete('/:id', apiProductId, productsApiController.remove);

module.exports = router;