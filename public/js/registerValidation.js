document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');
  const firstNameInput = document.getElementById('firstName');
  const lastNameInput = document.getElementById('lastName');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    let errors = [];

    // Obtener valores sin espacios al principio ni al final
    const firstName = firstNameInput ? firstNameInput.value.trim() : '';
    const lastName = lastNameInput ? lastNameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const password = passwordInput ? passwordInput.value : ''; // Sin trim para evaluar espacios exactos

    // 1. Campos obligatorios no vacíos
    if (!firstName) errors.push('El nombre es obligatorio.');
    if (!lastName) errors.push('El apellido es obligatorio.');
    if (!email) errors.push('El email es obligatorio.');
    if (!password.trim()) errors.push('La contraseña es obligatoria.');

    // 2. Email válido
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      errors.push('El email ingresado no es válido.');
    }

    // 3. Validaciones de Contraseña
    if (password) {
      if (password.length < 8) {
        errors.push('La contraseña debe tener al menos 8 caracteres.');
      }
      if (!/[a-zA-Z]/.test(password)) {
        errors.push('La contraseña debe incluir al menos una letra.');
      }
      if (!/[0-9]/.test(password)) {
        errors.push('La contraseña debe incluir al menos un número.');
      }
      const specialCharRegex = /[!@#$%^&*(),.?"':{}|<>]/;
      if (!specialCharRegex.test(password)) {
        errors.push('La contraseña debe incluir al menos un carácter especial.');
      }

      // Cadenas prohibidas
      const lowerPass = password.toLowerCase();
      const forbiddenStrings = ['password', '1234', 'qwerty', 'miecommerce']; // Incluye nombre del sitio
      if (firstName) forbiddenStrings.push(firstName.toLowerCase());

      for (const forbidden of forbiddenStrings) {
        if (forbidden && lowerPass.includes(forbidden)) {
          errors.push(`La contraseña no puede contener la palabra o secuencia prohibida: "${forbidden}".`);
          break;
        }
      }

      // Contraseña no igual al email
      if (email && password === email) {
        errors.push('La contraseña no puede ser igual al correo electrónico.');
      }
    }

    // Si existen errores, se previene el envío y se muestran
    if (errors.length > 0) {
      e.preventDefault();
      
      let errorContainer = document.getElementById('error-list');
      if (!errorContainer) {
        errorContainer = document.createElement('div');
        errorContainer.id = 'error-list';
        errorContainer.style.color = '#e74c3c';
        errorContainer.style.marginBottom = '15px';
        form.prepend(errorContainer);
      }
      
      errorContainer.innerHTML = '<ul>' + errors.map(err => `<li>${err}</li>`).join('') + '</ul>';
    }
  });
});
