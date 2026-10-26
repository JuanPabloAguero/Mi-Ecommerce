const express = require('express');
const router = express.Router();
const panelController = require('../controllers/panelController');

router.get('/', panelController.showAdmin);

module.exports = router;