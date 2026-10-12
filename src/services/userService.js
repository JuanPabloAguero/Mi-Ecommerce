// src/services/userService.js
const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');

const SALT_ROUNDS = 10;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SPECIAL_CHAR_REGEX = /[!@#$%^&*(),.?"':{}|<>]/;

// Error con código para que cada controlador decida la respuesta
function serviceError(code, details = []) {
  const error = new Error(code);
  error.code = code;
  error.details = details;
  return error;
}

// Evita que .trim() falle si la API recibe un número, null u objeto
const asString = (value) => (typeof value === 'string' ? value : '');

function validateRegistration(data = {}) {
  const firstName = asString(data.firstName).trim();
  const lastName = asString(data.lastName).trim();
  const email = asString(data.email).trim().toLowerCase();
  const password = asString(data.password);
  const errors = [];

  if (!firstName) errors.push('El campo Nombre es obligatorio.');
  if (!lastName) errors.push('El campo Apellido es obligatorio.');
  if (!email) errors.push('El campo Email es obligatorio.');
  if (!password.trim()) errors.push('El campo Contraseña es obligatorio.');

  if (email && !EMAIL_REGEX.test(email)) {
    errors.push('El email ingresado no es válido.');
  }

  if (password) {
    if (password.length < 8) errors.push('La contraseña debe tener al menos 8 caracteres.');
    if (!/[a-zA-Z]/.test(password)) errors.push('La contraseña debe incluir al menos una letra.');
    if (!/[0-9]/.test(password)) errors.push('La contraseña debe incluir al menos un número.');
    if (!SPECIAL_CHAR_REGEX.test(password)) {
      errors.push('La contraseña debe incluir al menos un carácter especial.');
    }

    const lowerPass = password.toLowerCase();
    const forbiddenStrings = ['password', '1234', 'qwerty', 'miecommerce'];
    if (firstName) forbiddenStrings.push(firstName.toLowerCase());

    for (const forbidden of forbiddenStrings) {
      if (lowerPass.includes(forbidden)) {
        errors.push(`La contraseña no debe contener la cadena prohibida: "${forbidden}".`);
        break;
      }
    }

    if (email && lowerPass === email) {
      errors.push('La contraseña no puede ser igual al correo electrónico.');
    }
  }

  return { errors, clean: { firstName, lastName, email, password } };
}

async function register(data) {
  const { errors, clean } = validateRegistration(data);
  if (errors.length > 0) {
    throw serviceError('VALIDATION_ERROR', errors);
  }

  if (userModel.findByEmail(clean.email)) {
    throw serviceError('EMAIL_ALREADY_EXISTS');
  }

  const passwordHash = await bcrypt.hash(clean.password, SALT_ROUNDS);

  try {
    return userModel.create({
      name: `${clean.firstName} ${clean.lastName}`,
      email: clean.email,
      passwordHash,
      role: 'consumer' // siempre consumer: el rol nunca se toma del request
    });
  } catch (error) {
    // Respaldo ante dos registros simultáneos con el mismo email
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      throw serviceError('EMAIL_ALREADY_EXISTS');
    }
    throw error;
  }
}

module.exports = {
  validateRegistration,
  register
};