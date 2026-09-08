const errorHandler = {
  // Middleware para rutas no encontradas (404)
  notFound: (req, res, next) => {
    res.status(404).render('pages/404', { title: 'Página no encontrada' });
  },

  // Middleware global para errores del servidor (500)
  serverError: (err, req, res, next) => {
    console.error(err.stack); // Opcional: log en consola para depuración
    res.status(500).render('pages/500', { title: 'Error interno del servidor' });
  }
};

module.exports = errorHandler;
