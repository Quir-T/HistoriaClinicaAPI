const Joi = require('joi');

// Función helper para fecha pasada
const pastDate = (value, helpers) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Inicio del día actual
  
  const inputDate = new Date(value);
  inputDate.setHours(0, 0, 0, 0);
  
  if (inputDate >= today) {
    return helpers.error('date.past');
  }
  return value;
};

// Extraer validación de DNI como componente reutilizable
const dniValidation = Joi.string()
  .pattern(/^[0-9]{7,8}$/)
  .messages({
    'string.pattern.base': 'El DNI debe tener entre 7 y 8 números'
  });

// Schema para crear paciente
const createPacienteSchema = Joi.object({
  nombre: Joi.string()
    .trim()
    .min(1)
    .max(50)
    .required()
    .messages({
      'string.empty': 'El nombre es requerido',
      'string.min': 'El nombre debe tener al menos 1 caracter',
      'string.max': 'El nombre no puede tener más de 50 caracteres',
      'any.required': 'El nombre es requerido'
    }),
    
  apellido: Joi.string()
    .trim()
    .min(1)
    .max(50)
    .required()
    .messages({
      'string.empty': 'El apellido es requerido',
      'string.min': 'El apellido debe tener al menos 1 caracter',
      'string.max': 'El apellido no puede tener más de 50 caracteres',
      'any.required': 'El apellido es requerido'
    }),
    
  dni: dniValidation.required().messages({
    'any.required': 'El DNI es requerido'
  }),
    
  fechaNacimiento: Joi.date()
    .iso()
    .custom(pastDate, 'validación fecha pasada')
    .required()
    .messages({
      'date.format': 'La fecha debe estar en formato ISO (YYYY-MM-DD)',
      'date.past': 'La fecha de nacimiento no puede ser en el futuro',
      'any.required': 'La fecha de nacimiento es requerida'
    })
});

// Schema para actualizar paciente (todos opcionales pero al menos uno)
const updatePacienteSchema = Joi.object({
  nombre: Joi.string()
    .trim()
    .min(1)
    .max(50)
    .messages({
      'string.empty': 'El nombre no puede estar vacío',
      'string.min': 'El nombre debe tener al menos 1 caracter',
      'string.max': 'El nombre no puede tener más de 50 caracteres'
    }),
    
  apellido: Joi.string()
    .trim()
    .min(1)
    .max(50)
    .messages({
      'string.empty': 'El apellido no puede estar vacío',
      'string.min': 'El apellido debe tener al menos 1 caracter',
      'string.max': 'El apellido no puede tener más de 50 caracteres'
    }),
    
  dni: dniValidation, // ✅ Reutilizar la misma validación
    
  fechaNacimiento: Joi.date()
    .iso()
    .custom(pastDate, 'validación fecha pasada')
    .messages({
      'date.format': 'La fecha debe estar en formato ISO (YYYY-MM-DD)',
      'date.past': 'La fecha de nacimiento no puede ser en el futuro'
    })
})
.min(1)
.messages({
  'object.min': 'Debe proporcionar al menos un campo para actualizar'
});

// Schema para validar UUID en parámetros
const pacienteParamsSchema = Joi.object({
  id: Joi.string()
    .guid({ version: 'uuidv4' })
    .required()
    .messages({
      'string.guid': 'El ID debe ser un UUID válido',
      'any.required': 'ID requerido en la URL'
    })
});

//Reutilizar validación de DNI existente
const dniParamSchema = Joi.object({
  dni: dniValidation.required().messages({
    'any.required': 'DNI requerido en la URL'
  })
});

module.exports = {
  createPacienteSchema,
  updatePacienteSchema,
  pacienteParamsSchema,
  dniParamSchema
};