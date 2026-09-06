const express = require('express');
const router = express.Router();
const mainController = require('../controllers/mainController');

// Navegación principal
router.get('/', mainController.index);
router.get('/login', mainController.login);
router.get('/register', mainController.register);

module.exports = router;
