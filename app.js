require('dotenv').config();

const express = require('express');
const http = require("http");
const WebSocket = require("ws");
const path = require('path');
const session = require('express-session');
const { SESSION_SECRET, IS_PRODUCTION } = require('./src/config/env');
const expressLayouts = require('express-ejs-layouts');
const runMigration = require('./db/migrate');
const eventService = require('./src/services/eventService');
const cors = require('cors');
const apiRoutes = require('./src/routes/api');
const apiErrorHandler = require('./src/middlewares/apiErrorHandler');

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

// CORS solo para la API (también responde los preflight OPTIONS)
app.use('/api', cors());

// Configuración de Middlewares
app.use(express.urlencoded({ extended: false })); // Para procesar envíos POST de formularios
app.use(express.json());

// Rutas de la API (JSON) + sus manejadores de error
app.use('/api', apiRoutes);
app.use('/api', apiErrorHandler.notFound);
app.use('/api', apiErrorHandler.serverError);

// Configurar express-session (solo las vistas EJS; la API usa JWT)
// Se guarda en una constante para reutilizarlo también en las conexiones WebSocket
const sessionMiddleware = session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false, // no crea sesión para visitantes que no guardan nada
  cookie: {
    httpOnly: true,                 // la cookie no es legible desde JavaScript
    sameSite: 'lax',                // mitiga CSRF
    secure: IS_PRODUCTION,          // solo por HTTPS en producción
    maxAge: 1000 * 60 * 60          // 1 hora
  }
});

app.use(sessionMiddleware); // Se registra la misma instancia que usará el WebSocket

// Importar enrutador principal, middlewares de carrito y de error
const routes = require('./src/routes');
const { sessionLocals } = require('./src/middlewares/sessionAuth');
const cartLocals = require('./src/middlewares/cartLocals');
const errorHandler = require('./src/middlewares/errorHandler');

app.use(sessionLocals); // identifica al usuario de la sesión
app.use(cartLocals); // middleware para inicializar el carrito y exponer cartCount a EJS

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
  // Se ejecuta el middleware de sesión sobre la petición de upgrade para leer la cookie
  // y recuperar la sesión de quien abrió el socket (se pasa un objeto vacío como "res" porque
  // en un upgrade no hay respuesta HTTP normal)
  sessionMiddleware(req, {}, (err) => {
    // El socket solo se asocia a una sesión si hay un usuario autenticado;
    // Si hubo un error o es un visitante anónimo, queda sin sesión (null) y no recibe eventos del carrito
    const sessionId = !err && req.session && req.session.user ? req.sessionID : null;

    // La lectura de la sesión es asíncrona; si el socket ya se cerró mientras tanto, no se registra
    if (ws.readyState !== WebSocket.OPEN) return;

    eventService.addClient(ws, sessionId); // Rcibe el ID de sesión del socket
  });

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