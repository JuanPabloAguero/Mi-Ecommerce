// src/routes/api/statsApiRoutes.js
const express = require('express');
const router = express.Router();
const statsApiController = require('../../controllers/api/statsApiController');

router.get('/', statsApiController.summary);

module.exports = router;