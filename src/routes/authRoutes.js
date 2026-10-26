const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { requireLogin, redirectIfAuthenticated } = require('../middlewares/sessionAuth');

router.get('/login', redirectIfAuthenticated, authController.login);
router.post('/login', redirectIfAuthenticated, authController.processLogin);
router.get('/register', redirectIfAuthenticated, authController.register);
router.post('/register', redirectIfAuthenticated, authController.processRegister);
router.post('/logout', requireLogin, authController.logout);

module.exports = router;