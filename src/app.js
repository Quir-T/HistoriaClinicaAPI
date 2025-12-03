const express = require('express');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler'); // ✅ NUEVO import

console.log('🔄 Iniciando configuración minimalista de Express...');

// Crear aplicación Express
const app = express();

console.log('🔄 Configurando middleware SOLO lo esencial...');

// Middleware de logging simple PRIMERO
app.use((req, res, next) => {
  console.log(`📥 REQUEST: ${req.method} ${req.url} - ${new Date().toISOString()}`);
  next();
});

// SOLO lo básico - sin helmet, cors, compression
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

console.log('🔄 Configurando rutas básicas...');

// Ruta de health check
app.get('/health', (req, res) => {
  console.log('🔄 Health check ejecutándose...');
  res.status(200).json({ 
    status: 'ok',
    timestamp: new Date().toISOString()
  });
  console.log('✅ Health check enviado');
});

// Ruta raíz  
app.get('/', (req, res) => {
  console.log('🔄 Ruta raíz ejecutándose...');
  res.status(200).json({
    message: 'API Minimalista funcionando',
    timestamp: new Date().toISOString()
  });
  console.log('✅ Ruta raíz enviada');
});

console.log('🔄 Configurando rutas de pacientes...');

// Rutas de pacientes
try {
  const pacientesRoutes = require('./routes/pacientes');
  app.use('/pacientes', pacientesRoutes);
  console.log('✅ Rutas de pacientes configuradas');
} catch (error) {
  console.error('❌ Error cargando rutas de pacientes:', error.message);
}

// ✅ NUEVO: Usar los nuevos error handlers
app.use(notFoundHandler);  // ← Para rutas no encontradas (404)
app.use(errorHandler);     // ← Error handler global

console.log('✅ App minimalista configurada con nuevo error handling');

module.exports = app;
