const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Importar rutas
const mainRoutes = require('./routes/main');

// Configuración del motor de plantillas
app.set('view engine', 'ejs');
app.set('views', './views');

// Configuración de archivos estáticos
app.use(express.static('assets'));

// Usar el enrutador principal
app.use('/', mainRoutes);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
