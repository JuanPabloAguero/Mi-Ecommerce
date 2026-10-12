// src/controllers/api/authApiController.js
const userService = require('../../services/userService');
const authService = require('../../services/authService');

const authApiController = {
  // POST /api/auth/register
  register: async (req, res) => {
    try {
      const user = await userService.register(req.body || {});
      return res.status(201).json(user);
    } catch (error) {
      if (error.code === 'VALIDATION_ERROR') {
        return res.status(400).json({ error: 'Datos inválidos', details: error.details });
      }
      if (error.code === 'EMAIL_ALREADY_EXISTS') {
        return res.status(409).json({ error: 'Ya existe una cuenta con ese email' });
      }
      throw error; // → apiErrorHandler.serverError (500)
    }
  },

  // POST /api/auth/login
  login: async (req, res) => {
    try {
      const { email, password } = req.body || {};
      const result = await authService.login(email, password);
      return res.status(200).json(result);
    } catch (error) {
      if (error.code === 'INVALID_CREDENTIALS') {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }
      throw error; // → apiErrorHandler.serverError (500)
    }
  }
};

module.exports = authApiController;