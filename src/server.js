require('dotenv').config();

const app = require('./app');
const PORT = process.env.PORT || 3000;

// Variable para trackear el servidor
let server = null;

// Función de cierre limpio
function gracefulShutdown(signal) {
  console.log(`\n👋 ${signal} recibido, cerrando servidor...`);
  
  if (server) {
    server.close((err) => {
      if (err) {
        console.error('❌ Error cerrando servidor:', err);
        process.exit(1);
      }
      console.log('✅ Servidor cerrado correctamente');
      process.exit(0);
    });
    
    // Timeout de emergencia (5 segundos)
    setTimeout(() => {
      console.log('⚠️ Forzando cierre...');
      process.exit(1);
    }, 5000);
  } else {
    process.exit(0);
  }
}

// Iniciar servidor
server = app.listen(PORT, () => {
  console.log(`🚀 Servidor iniciado en puerto ${PORT}`);
  console.log(`📡 API disponible en: http://localhost:${PORT}`);
  console.log(`💚 Health check: http://localhost:${PORT}/health`);
});

// Manejar errores del servidor
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`💥 Puerto ${PORT} ya está en uso!`);
    console.log('💡 Ejecuta: sudo kill -9 $(sudo lsof -t -i:3000)');
    process.exit(1);
  } else {
    console.error('💥 Error del servidor:', error);
    process.exit(1);
  }
});

// Manejo de señales de cierre
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

// Manejo de errores no capturados
process.on('uncaughtException', (error) => {
  console.error('💥 Error no capturado:', error.message);
  gracefulShutdown('UNCAUGHT_EXCEPTION');
});

process.on('unhandledRejection', (reason) => {
  console.error('💥 Promise rechazada:', reason);
  gracefulShutdown('UNHANDLED_REJECTION');
});

console.log('✅ Servidor configurado correctamente');
