document.addEventListener('DOMContentLoaded', () => {
  const statusText = document.getElementById('ws-status-text');
  const statusDot = document.getElementById('ws-status-dot');
  const cartBadge = document.getElementById('cart-badge');
  const toastElem = document.getElementById('cart-toast-notification');

  let toastTimeout = null;

  // Función para mostrar la notificación visual del Carrito Vacío
  function showCartEmptyNotification() {
    if (!toastElem) return;

    toastElem.classList.remove('hidden');

    // Cancelar temporizador previo si existía
    if (toastTimeout) {
      clearTimeout(toastTimeout);
    }

    // Desaparece automáticamente después de 3.5 segundos
    toastTimeout = setTimeout(() => {
      toastElem.classList.add('hidden');
    }, 3500);
  }

  function updateCartView(cartItems, total) {
    const wrapper = document.getElementById('cart-content-wrapper');
    if (!wrapper) return; // No estamos en la página /cart

    // 1. Si el carrito está vacío
    if (!cartItems || cartItems.length === 0) {
      wrapper.innerHTML = `
        <section style="text-align: center; padding: 40px 0;">
          <p style="font-size: 18px; color: #666; margin-bottom: 20px;">Tu carrito de compras está vacío.</p>
          <a href="/" class="btn-checkout" style="display: inline-block;">Explorar productos</a>
        </section>
      `;
      return;
    }

    // Si pasa de estar vacío a tener items, asegurarse de que existan el listado y el resumen
    let itemsList = document.getElementById('cart-items-list');
    if (!itemsList) {
      wrapper.innerHTML = `
        <form action="/cart/clear" method="POST" style="text-align: right; margin-bottom: 15px;">
          <button type="submit" class="btn-remove">Vaciar carrito</button>
        </form>
        <section class="cart-list" id="cart-items-list"></section>
        <section class="cart-summary">
          <div class="total-points">
            <span>Total General</span>
            <strong id="cart-total">$${total.toLocaleString('es-AR')}</strong>
          </div>
          <a href="/checkout" class="btn-checkout">Ir a Pagar</a>
        </section>
      `;
      itemsList = document.getElementById('cart-items-list');
    }

    // 2. Actualizar el Total General
    const totalElem = document.getElementById('cart-total');
    if (totalElem) {
      totalElem.textContent = `$${total.toLocaleString('es-AR')}`;
    }

    // 3. Crear o actualizar cada producto recibido
    cartItems.forEach(item => {
      let article = document.querySelector(`.cart-item[data-id="${item.id}"]`);

      if (article) {
        // Si el producto ya existe en la vista, actualizamos sus valores
        const quantityElem = document.getElementById(`quantity-${item.id}`);
        const subtotalElem = document.getElementById(`subtotal-${item.id}`);

        if (quantityElem) quantityElem.textContent = item.quantity;
        if (subtotalElem) subtotalElem.textContent = `$${item.subtotal.toLocaleString('es-AR')}`;
      } else {
        // Si es un PRODUCTO NUEVO, creamos el elemento del DOM y lo agregamos
        const newArticle = document.createElement('article');
        newArticle.className = 'cart-item';
        newArticle.setAttribute('data-id', item.id);

        const isMaxStock = item.quantity >= item.stock;

        newArticle.innerHTML = `
          <div class="cart-item-info">
            <img src="${item.image}" alt="${item.name}" style="width:50px; height:50px; object-fit:cover;">
            <span class="cart-item-title">${item.name}</span>
            <small style="color: #666; font-size: 12px; margin-top: 3px;">
              Stock disponible: <strong>${item.stock}</strong>
            </small>
          </div>

          <div class="cart-item-controls">
            <form action="/cart/remove" method="POST" style="display:inline;">
              <input type="hidden" name="productId" value="${item.id}">
              <button type="submit" class="btn-remove">Quitar</button>
            </form>

            <div class="quantity-picker" style="display:flex; align-items:center; gap:5px;">
              <form action="/cart/update" method="POST" style="display:inline;">
                <input type="hidden" name="productId" value="${item.id}">
                <input type="hidden" name="action" value="decrease">
                <button type="submit" class="quantity-btn">-</button>
              </form>

              <span class="quantity-value" id="quantity-${item.id}">${item.quantity}</span>

              <form action="/cart/update" method="POST" style="display:inline;">
                <input type="hidden" name="productId" value="${item.id}">
                <input type="hidden" name="action" value="increase">
                ${isMaxStock 
                  ? `<button type="button" class="quantity-btn disabled" disabled title="Límite de stock alcanzado">+</button>`
                  : `<button type="submit" class="quantity-btn">+</button>`
                }
              </form>
            </div>

            <span class="cart-item-price" id="subtotal-${item.id}">$${item.subtotal.toLocaleString('es-AR')}</span>
          </div>
        `;

        itemsList.appendChild(newArticle);
      }
    });

    // 4. Eliminar del DOM los productos que hayan sido quitados en otra pestaña
    const currentArticles = document.querySelectorAll('.cart-item');
    currentArticles.forEach(article => {
      const itemId = Number(article.getAttribute('data-id'));
      const exists = cartItems.some(i => Number(i.id) === itemId);
      if (!exists) {
        article.remove();
      }
    });
  }

  let reconnectTimer = null;

  function connect() {
    // Cancelar cualquier temporizador de reconexión pendiente para evitar llamadas duplicadas
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}`;
    let ws = new WebSocket(wsUrl);

    // Cambio de estado al establecer la conexión
    ws.onopen = () => {
      if (statusText) statusText.textContent = 'Conectado';
      if (statusDot) {
        statusDot.classList.remove('disconnected');
        statusDot.classList.add('connected');
      }
    };

    // Escuchar mensajes entrantes del servidor
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        // Validación del protocolo estandarizado
        if (data.type === 'cartUpdated' && data.payload) {
          const { cartCount, cartItems, total } = data.payload;
          
          const previousCount = cartBadge ? Number(cartBadge.textContent) || 0 : 0;

          // 1. Actualizar badge del header
          if (cartBadge) {
            cartBadge.textContent = cartCount;
          }

          // 2. Disparar la notificación si el carrito tenía productos y pasó a 0
          if (previousCount > 0 && cartCount === 0) {
            showCartEmptyNotification();
          }

          // 3. Actualizar la vista dinámica si estamos en /cart
          if (cartItems !== undefined) {
            updateCartView(cartItems, total);
          }
        }
      } catch (err) {
        console.error('Error al procesar mensaje WebSocket:', err);
      }
    };

    // Cambio de estado y reintento automático al perder la conexión
    ws.onclose = () => {
      if (statusText) statusText.textContent = 'Desconectado';
      if (statusDot) {
        statusDot.classList.remove('connected');
        statusDot.classList.add('disconnected');
      }

      // Desvincular eventos del socket viejo
      ws.onopen = null;
      ws.onmessage = null;
      ws.onerror = null;
      ws.onclose = null;
      ws = null;

      // Intentar reconectar automáticamente en 3 segundos
      reconnectTimer = setTimeout(() => {
        connect();
      }, 3000);
    };

    ws.onerror = (error) => {
      console.error('[WebSocket] Error en la conexión:', error);
      // Forzar el cierre para que se gatille onclose de manera controlada
      ws.close();
    };
  }

  // Mostrar el toast si el servidor indicó que esta carga viene de vaciar el carrito
  if (toastElem && toastElem.dataset.showOnLoad === 'true') {
    showCartEmptyNotification();
  }

  connect();
});
