document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');
  if (!form) return;

  const firstNameInput = document.getElementById('firstName');
  const lastNameInput = document.getElementById('lastName');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');

  form.addEventListener('submit', (e) => {
    const errors = [];

    const firstName = firstNameInput ? firstNameInput.value.trim() : '';
    const lastName = lastNameInput ? lastNameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const password = passwordInput ? passwordInput.value : '';

    if (!firstName) errors.push('El nombre no puede estar en blanco.');
    if (!lastName) errors.push('El apellido no puede estar en blanco.');
    if (!email) errors.push('El email no puede estar en blanco.');
    if (!password.trim()) errors.push('La contraseña no puede estar en blanco.');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      errors.push('El email no es válido.');
    }

    if (password) {
      if (password.length < 8) errors.push('La contraseña debe tener al menos 8 caracteres.');
      if (!/[a-zA-Z]/.test(password)) errors.push('La contraseña debe incluir al menos una letra.');
      if (!/[0-9]/.test(password)) errors.push('La contraseña debe incluir al menos un número.');
      if (!/[!@#$%^&*(),.?"':{}|<>]/?.test(password)) {
        errors.push('La contraseña debe incluir al menos un carácter especial.');
      }

      const forbidden = ['password', '1234', 'qwerty', 'miecommerce'];
      if (firstName) forbidden.push(firstName.toLowerCase());

      for (const str of forbidden) {
        if (password.toLowerCase().includes(str)) {
          errors.push(`La contraseña no puede contener la cadena prohibida: "${str}".`);
          break;
        }
      }

      if (email && password === email) {
        errors.push('La contraseña no puede ser igual al email.');
      }
    }

    if (errors.length > 0) {
      e.preventDefault(); // Prevenir envío del formulario
      
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
