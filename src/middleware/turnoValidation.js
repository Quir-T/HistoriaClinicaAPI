const { validate } = require('./validate');
const {
  createTurnoSchema,
  updateTurnoSchema,
  turnoParamsSchema,
  pacienteIdParamsSchema,
  fechaParamsSchema,
  fechaHoraParamsSchema,
  estadoParamsSchema
} = require('../schemas/turnoSchemas');

// Validaciones para body (POST/PATCH)
const validateCreateTurno = validate(createTurnoSchema, 'body');
const validateUpdateTurno = validate(updateTurnoSchema, 'body');

// Validaciones para parámetros URL
const validateTurnoParams = validate(turnoParamsSchema, 'params');
const validatePacienteIdParams = validate(pacienteIdParamsSchema, 'params');
const validateFechaParams = validate(fechaParamsSchema, 'params');
const validateFechaHoraParams = validate(fechaHoraParamsSchema, 'params');
const validateEstadoParams = validate(estadoParamsSchema, 'params');

module.exports = {
  validateCreateTurno,
  validateUpdateTurno,
  validateTurnoParams,
  validatePacienteIdParams,
  validateFechaParams,
  validateFechaHoraParams,
  validateEstadoParams
};