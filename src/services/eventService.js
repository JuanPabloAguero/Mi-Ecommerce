class EventService {
  constructor() {
    // Set privado para almacenar las conexiones WebSocket activas
    this.clients = new Set();
  }

  /**
   * Registrar una nueva conexión WebSocket activa
   * @param {WebSocket} ws 
   * @param {string|null} sessionId ID de la sesión autenticada dueña del socket (null si es anónimo)
   */
  addClient(ws, sessionId = null) {
    ws.sessionId = sessionId; // asocia el socket a su sesión para enviarle solo sus propios eventos
    this.clients.add(ws);
    console.log(`[EventService] Cliente conectado. Total activos: ${this.clients.size}`);
  }

  /**
   * Eliminar una conexión cerrada de la colección
   * @param {WebSocket} ws 
   */
  removeClient(ws) {
    this.clients.delete(ws);
    console.log(`[EventService] Cliente desconectado. Total activos: ${this.clients.size}`);
  }

  /**
   * Serializa el mensaje respetando el protocolo estandarizado
   * @param {string} type 
   * @param {Object} payload 
   * @returns {string} Mensaje JSON encriptado/serializado
   */
  serialize(type, payload = {}) {
    return JSON.stringify({ type, payload });
  }

  /**
   * Emitir un evento a una conexión WebSocket específica
   * @param {WebSocket} ws 
   * @param {string} type 
   * @param {Object} payload 
   */
  emitTo(ws, type, payload) {
    if (ws && ws.readyState === 1) { // 1 === WebSocket.OPEN
      const message = this.serialize(type, payload);
      ws.send(message);
    }
  }

  /**
   * Emitir un evento solo a las conexiones que pertenecen a una sesión
   * (por ejemplo, todas las pestañas abiertas por la misma persona)
   * @param {string} sessionId 
   * @param {string} type 
   * @param {Object} payload 
   */
  emitToSession(sessionId, type, payload) {
    if (!sessionId) return; // sin sesión no hay destinatario: nunca se envía a sockets anónimos

    this.clients.forEach((client) => {
      if (client.sessionId === sessionId) {
        this.emitTo(client, type, payload); // reutiliza emitTo, que verifica que el socket esté abierto
      }
    });
  }

  /**
   * Realizar broadcast de un evento a todas las conexiones activas
   * @param {string} type 
   * @param {Object} payload 
   */
  broadcast(type, payload) {
    const message = this.serialize(type, payload);
    this.clients.forEach((client) => {
      if (client.readyState === 1) { // WebSocket.OPEN
        client.send(message);
      }
    });
  }
}

// Exportar una única instancia (Singleton) para toda la aplicación
module.exports = new EventService();
