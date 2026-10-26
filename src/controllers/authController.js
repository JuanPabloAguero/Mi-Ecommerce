const userService = require('../services/userService');
const authService = require('../services/authService');

const authController = {
  login: (req, res) => {
    res.render('pages/login', { layout: false, errors: [], oldData: {} });
  },

  processLogin: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      // Mismo servicio y misma validación bcrypt que usa la API
      const user = await authService.authenticate(email, password);

      // Nuevo id de sesión al autenticarse (evita session fixation)
      req.session.regenerate((err) => {
        if (err) return next(err);
        req.session.user = user; // { id, name, email, role }, sin password_hash
        req.session.save((err) => {
          if (err) return next(err);
          res.redirect('/');
        });
      });
    } catch (error) {
      if (error.code === 'INVALID_CREDENTIALS') {
        const email = typeof req.body.email === 'string' ? req.body.email : '';
        return res.status(401).render('pages/login', {
          layout: false, errors: ['Credenciales inválidas'], oldData: { email }
        });
      }
      throw error;
    }
  },

  logout: (req, res, next) => {
    // Elimina la sesión completa (usuario y carrito) del servidor
    req.session.destroy((err) => {
      if (err) return next(err);
      res.clearCookie('connect.sid');
      res.redirect('/');
    });
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