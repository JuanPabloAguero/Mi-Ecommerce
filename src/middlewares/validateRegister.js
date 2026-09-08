const validateRegister = (req, res, next) => {
  const { firstName = '', lastName = '', email = '', password = '' } = req.body;
  const errors = [];

  // Limpiar espacios al inicio y al final
  const cleanFirstName = firstName.trim();
  const cleanLastName = lastName.trim();
  const cleanEmail = email.trim();

  // 1. Campos obligatorios no vacíos
  if (!cleanFirstName) errors.push('El campo Nombre es obligatorio.');
  if (!cleanLastName) errors.push('El campo Apellido es obligatorio.');
  if (!cleanEmail) errors.push('El campo Email es obligatorio.');
  if (!password.trim()) errors.push('El campo Contraseña es obligatorio.');

  // 2. Email válido
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (cleanEmail && !emailRegex.test(cleanEmail)) {
    errors.push('El email ingresado no es válido.');
  }

  // 3. Validaciones de la Contraseña
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
    
    // Caracteres especiales permitidos: ! @ # $ % ^ & * ( ) , . ? " : { } | < >
    const specialCharRegex = /[!@#$%^&*(),.?"':{}|<>]/;
    if (!specialCharRegex.test(password)) {
      errors.push('La contraseña debe incluir al menos un carácter especial.');
    }

    // Cadenas prohibidas
    const lowerPass = password.toLowerCase();
    const forbiddenStrings = ['password', '1234', 'qwerty', 'miecommerce']; // Incluye el nombre del sitio
    if (cleanFirstName) forbiddenStrings.push(cleanFirstName.toLowerCase());

    for (const forbidden of forbiddenStrings) {
      if (forbidden && lowerPass.includes(forbidden)) {
        errors.push(`La contraseña no debe contener la cadena prohibida: "${forbidden}".`);
        break;
      }
    }

    // Contraseña no es igual al email
    if (cleanEmail && password === cleanEmail) {
      errors.push('La contraseña no puede ser igual al correo electrónico.');
    }
  }

  // Si existen errores, se vuelve a renderizar la vista con los mensajes
  if (errors.length > 0) {
    return res.render('pages/register', {
      layout: false,
      errors,
      oldData: { firstName: cleanFirstName, lastName: cleanLastName, email: cleanEmail }
    });
  }

  next();
};

module.exports = validateRegister;
