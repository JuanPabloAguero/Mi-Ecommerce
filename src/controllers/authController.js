const authController = {
  login: (req, res) => {
    res.render('pages/login', { layout: false });
  },
  
  register: (req, res) => {
    res.render('pages/register', { layout: false, errors: [], oldData: {} });
  },

  // Procesar el registro tras pasar la validación
  processRegister: (req, res) => {
    // Redirige al login tras un registro exitoso
    res.redirect('/login');
  }
};

module.exports = authController;
