const express = require('express');
const http = require("http");
const WebSocket = require("ws");
const path = require('path');
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts');
const runMigration = require('./db/migrate');
const eventService = require('./src/services/eventService');

const app = express();
const PORT = process.env.PORT || 3000;

// Ejecutar migración inicial si products.json existe
// Gracias a la instrucción INSERT OR IGNORE, la migración no duplicará registros ni fallará aunque se ejecute múltiples veces
runMigration();

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

// Configurar WebSocket
const server = http.createServer(app); // 1. Crear el servidor HTTP wrapping Express

const wss = new WebSocket.Server({ server }); // 2. Instanciar el servidor WebSocket ligado al servidor HTTP

// Delegar registro y eliminación de sockets al EventService
wss.on("connection", (ws, req) => {
  eventService.addClient(ws);

  ws.on("close", () => {
    eventService.removeClient(ws);
  });

  ws.on("error", (error) => {
    console.error("[WebSocket] Error en la conexión:", error);
  });
});

// Adjuntar el método broadcast del servicio a app si los controladores lo consumen desde req.app
app.set('broadcast', (type, payload) => {
  eventService.broadcast(type, payload);
});

// Servidor
server.listen(PORT, () => {
  console.log(`Servidor HTTP y WebSocket escuchando en el puerto ${PORT}`);
});

module.exports = app;
