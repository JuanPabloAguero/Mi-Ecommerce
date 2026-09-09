const express = require('express');
const path = require('path');
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts');

const app = express();
const PORT = process.env.PORT || 3000;

// Motor de plantillas EJS y Express Layouts
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));
app.set('layout', 'layouts/main'); // Ruta relativa desde src/views
app.use(expressLayouts); // Usar express-ejs-layouts

// Archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de Middlewares
app.use(express.urlencoded({ extended: false })); // Para procesar envíos POST de formularios
app.use(express.json());

// Configurar express-session
app.use(
  session({
    secret: 'miEcommerceSecretKey',
    resave: false,
    saveUninitialized: true
  })
);

// Importar enrutador principal, middlewares de carrito y de error
const routes = require('./src/routes');
const cartLocals = require('./src/middlewares/cartLocals');
const errorHandler = require('./src/middlewares/errorHandler');

// Middleware para inicializar el carrito y exponer cartCount a EJS
app.use(cartLocals);

// Rutas de la aplicación agrupadas en el router principal
app.use('/', routes);

// Middlewares para manejo de errores
app.use(errorHandler.notFound);
app.use(errorHandler.serverError);

// Servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

module.exports = app;
