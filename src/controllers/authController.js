const userService = require('../services/userService');

const authController = {
  login: (req, res) => {
    res.render('pages/login', { layout: false });
  },
  
  register: (req, res) => {
    res.render('pages/register', { layout: false, errors: [], oldData: {} });
  },

  // Procesar el registro tras pasar la validación
  processRegister: async (req, res) => {
    try {
      await userService.register(req.body);
      return res.redirect('/login');
    } catch (error) {
      const { firstName = '', lastName = '', email = '' } = req.body;
      const oldData = { firstName, lastName, email };

      if (error.code === 'VALIDATION_ERROR') {
        return res.status(400).render('pages/register', {
          layout: false, errors: error.details, oldData
        });
      }

      if (error.code === 'EMAIL_ALREADY_EXISTS') {
        return res.status(409).render('pages/register', {
          layout: false, errors: ['Ya existe una cuenta con ese email.'], oldData
        });
      }

      throw error; // Express 5 lo envía a errorHandler.serverError (500)
    }
  }
};

module.exports = authController;