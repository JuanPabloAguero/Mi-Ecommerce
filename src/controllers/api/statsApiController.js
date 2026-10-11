// src/controllers/api/statsApiController.js
const statsService = require('../../services/statsService');

const statsApiController = {
  // GET /api/stats
  summary: (req, res) => {
    res.status(200).json(statsService.getGeneralStats());
  }
};

module.exports = statsApiController;