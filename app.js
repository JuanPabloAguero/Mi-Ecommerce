const express = require('express');
const path = require('path');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de Middlewares
app.use(express.urlencoded({ extended: false })); // Para procesar envíos POST de formularios
app.use(express.json());

// Configurar express-session
app.use(session({
  secret: 'miEcommerceSecretKey',
  resave: false,
  saveUninitialized: true
}));

// Motor de plantillas EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

// Archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para inicializar el carrito en la sesión si no existe y calcular la cantidad total para el badge
app.use((req, res, next) => {
  if (!req.session.cart) {
    req.session.cart = []; // req.session.cart iniciará como array vacío []
  }

  // Sumar la propiedad "quantity" de todos los ítems agregados
  const totalItems = req.session.cart.reduce((sum, item) => sum + item.quantity, 0);

  // res.locals hace que la variable esté disponible en TODAS las plantillas EJS automáticamente
  res.locals.cartCount = totalItems;

  next();
});

// Importar enrutadores
const mainRoutes = require('./src/routes/main');
const productRoutes = require('./src/routes/productRoute');
const cartRoutes = require('./src/routes/cartRoute');
const categoryRoutes = require('./src/routes/categoryRoute');

// Declaración de rutas
app.use('/', mainRoutes);
app.use('/products', productRoutes);
app.use('/', cartRoutes);
app.use('/categories', categoryRoutes);

// Middleware 404 (Debe ir AL FINAL de todas las rutas, "como si fuera un default de switch")
app.use((req, res, next) => {
    res.status(404).render('pages/404');
});

// Servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
