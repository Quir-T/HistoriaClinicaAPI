const validate = require('./validate');
const { 
  createPacienteSchema, 
  updatePacienteSchema, 
  pacienteParamsSchema,
  dniParamSchema  // ✅ Ahora reutiliza la misma validación
} = require('../schemas/pacienteSchemas');

// Validaciones para el body
const validateCreatePaciente = validate(createPacienteSchema, 'body');
const validateUpdatePaciente = validate(updatePacienteSchema, 'body');

// Validaciones para parámetros de URL
const validatePacienteParams = validate(pacienteParamsSchema, 'params');
const validateDniParams = validate(dniParamSchema, 'params');

module.exports = {
  validateCreatePaciente,
  validateUpdatePaciente,
  validatePacienteParams,
  validateDniParams
};