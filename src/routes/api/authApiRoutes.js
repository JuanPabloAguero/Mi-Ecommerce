// src/routes/api/authApiRoutes.js
const express = require('express');
const router = express.Router();
const authApiController = require('../../controllers/api/authApiController');

router.post('/register', authApiController.register);
router.post('/login', authApiController.login);

module.exports = router;