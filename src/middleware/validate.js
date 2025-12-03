const createError = require('../utils/createError'); // ✅ NUEVO import

const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errorMessage = error.details.map(d => d.message).join(', ');
      
      // ✅ NUEVO: Usar createError en lugar de respuesta directa
      return next(createError(errorMessage, 400, {
        validationErrors: error.details,
        field: property
      }));
    }

    req[property] = value;
    next();
  };
};

module.exports = validate;