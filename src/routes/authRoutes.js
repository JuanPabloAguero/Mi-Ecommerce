const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const validateRegister = require('../middlewares/validateRegister');

router.get('/login', authController.login);
router.get('/register', authController.register);
router.post('/register', validateRegister, authController.processRegister); // Ruta POST para procesar el registro con middleware de validación

module.exports = router;
