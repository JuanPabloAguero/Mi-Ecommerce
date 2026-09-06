const mainController = {
  index: (req, res) => {
    res.render('pages/index');
  },
  login: (req, res) => {
    res.render('pages/login');
  },
  register: (req, res) => {
    res.render('pages/register');
  }
};

module.exports = mainController;
