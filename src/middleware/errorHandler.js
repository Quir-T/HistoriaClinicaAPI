
function errorHandler(err, req, res, next) {
  // Log del error para debugging
  console.error('[ERROR]:', {
    message: err.message,
    status: err.status,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString(),
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });

  // Status por defecto si no está definido
  const status = err.status || 500;
  
  // Mensaje por defecto para errores 500
  const message = status === 500 ? 'Error interno del servidor' : err.message;

  // Respuesta consistente
  const response = {
    error: message,
    status: status >= 400 && status < 500 ? 'fail' : 'error'
  };

  // detalles adicionales
  if (process.env.NODE_ENV === 'development') {
    if (err.details) response.details = err.details;
    if (err.stack) response.stack = err.stack;
  }

  res.status(status).json(response);
}

/**
 * Handler para rutas no encontradas
 */
function notFoundHandler(req, res, next) {
  const error = new Error(`Ruta ${req.originalUrl} no encontrada`);
  error.status = 404;
  error.isOperational = true;
  next(error);
}

/**
 * Wrapper para funciones async - evita try/catch repetitivo
 */
function catchAsync(fn) {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
}

module.exports = {
  errorHandler,
  notFoundHandler,
  catchAsync
};
