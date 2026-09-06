const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Importar enrutadores
const mainRoutes = require('./src/routes/main');
const productRoutes = require('./src/routes/productRoute');
const cartRoutes = require('./src/routes/cartRoute');

// Motor de plantillas EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

// Archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Declaración de rutas
app.use('/', mainRoutes);
app.use('/', productRoutes);
app.use('/', cartRoutes);

// Middleware 404 (Debe ir AL FINAL de todas las rutas, "como si fuera un default de switch")
app.use((req, res, next) => {
    res.status(404).render('pages/404');
});

// Servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
