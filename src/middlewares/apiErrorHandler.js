// src/middlewares/apiErrorHandler.js
const apiErrorHandler = {
  // Cualquier ruta /api/... que no exista
  notFound: (req, res) => {
    res.status(404).json({ error: 'Recurso no encontrado' });
  },

  // Errores internos y JSON malformado en el body
  serverError: (err, req, res, next) => {
    if (err.type === 'entity.parse.failed') {
      return res.status(400).json({ error: 'El body no es un JSON válido' });
    }

    console.error('[API] Error:', err);
    res.status(err.status || 500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = apiErrorHandler;