const panelController = {
  showOrders: (req, res) => res.render('pages/orders', { title: 'Mis Pedidos' }),
  showAdmin: (req, res) => res.render('pages/admin', { title: 'Administración' })
};

module.exports = panelController;