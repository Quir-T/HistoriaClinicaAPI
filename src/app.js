const express = require('express');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

// Crear repositorios 
const PacienteRepository = require('./repositories/PacienteRepository');
const TurnoRepository = require('./repositories/TurnoRepository');

const pacienteRepository = new PacienteRepository();
const turnoRepository = new TurnoRepository();

console.log('Repositorios compartidos creados');
console.log('Estado inicial - Pacientes:', pacienteRepository.findAll().length);
console.log('Estado inicial - Turnos:', turnoRepository.findAll().length);

const app = express();

// Middleware de logging
app.use((req, res, next) => {
  console.log(`REQUEST: ${req.method} ${req.url} - ${new Date().toISOString()}`);
  next();
});

// Middleware básico
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  console.log('Health check ejecutandose...');
  res.status(200).json({ 
    status: 'ok',
    timestamp: new Date().toISOString()
  });
  console.log('Health check enviado');
});

// Ruta raíz  
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'API CRUD - Gestión de Pacientes y Turnos',
    endpoints: {
      health: '/health',
      pacientes: '/api/pacientes',
      turnos: '/api/turnos'
    },
    timestamp: new Date().toISOString()
  });
});

// Rutas con inyección de repositorios
try {
  const pacientesRoutes = require('./routes/pacientes');
  app.use('/api/pacientes', (req, res, next) => {
    console.log('Inyectando repositorio de pacientes...');
    req.pacienteRepository = pacienteRepository;
    next();
  }, pacientesRoutes);
  console.log('Rutas de pacientes configuradas');
} catch (error) {
  console.error('Error cargando rutas de pacientes:', error.message);
}

try {
  const turnosRoutes = require('./routes/turnos');
  app.use('/api/turnos', (req, res, next) => {
    console.log('Inyectando repositorios de turnos...');
    req.turnoRepository = turnoRepository;
    req.pacienteRepository = pacienteRepository;
    next();
  }, turnosRoutes);
  console.log('Rutas de turnos configuradas');
} catch (error) {
  console.error('Error cargando rutas de turnos:', error.message);
}

// Error handlers
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
