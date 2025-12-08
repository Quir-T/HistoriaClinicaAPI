/**
 * Crea un error personalizado con un mensaje, código de estado HTTP y detalles adicionales.
 * 
 * @param {string} message - Mensaje del error
 * @param {number} status - Código HTTP (400, 404, 409, 500, etc.)
 * @param {object} details - Detalles adicionales opcionales
 * @returns {Error} Error con propiedades status y details
 */
function createError(message, status = 500, details = null) {
  const error = new Error(message);
  error.status = status;
  error.isOperational = true; // Para distinguir errores operacionales de bugs
  
  if (details) {
    error.details = details;
  }
  
  return error;
}

module.exports = createError;