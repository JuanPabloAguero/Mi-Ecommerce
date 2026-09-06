const authController = {
  login: (req, res) => {
    res.render('pages/login', { layout: false }); // Desactiva el layout global
  },
  register: (req, res) => {
    res.render('pages/register', { layout: false }); // Desactiva el layout global
  }
};

module.exports = authController;
