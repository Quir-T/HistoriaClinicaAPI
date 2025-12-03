const express = require('express');
const PacienteController = require('../controllers/PacienteController');
const {
  validateCreatePaciente,
  validateUpdatePaciente,
  validatePacienteParams,
  validateDniParams
} = require('../middleware/pacienteValidation');

const router = express.Router();
const pacienteController = new PacienteController();

// Listar todos los pacientes
router.get('/', (req, res, next) => pacienteController.list(req, res, next));

// Buscar paciente por DNI - ANTES que /:id para evitar conflictos
router.get('/dni/:dni', 
  validateDniParams,
  (req, res, next) => pacienteController.getByDni(req, res, next)
);

// Obtener un paciente por ID
router.get('/:id', 
  validatePacienteParams,
  (req, res, next) => pacienteController.getById(req, res, next)
);

// Crear un nuevo paciente
router.post('/', 
  validateCreatePaciente,
  (req, res, next) => pacienteController.create(req, res, next)
);

// Actualizar un paciente
router.patch('/:id', 
  validatePacienteParams,
  validateUpdatePaciente,
  (req, res, next) => pacienteController.update(req, res, next)
);

// Eliminar un paciente
router.delete('/:id', 
  validatePacienteParams,
  (req, res, next) => pacienteController.delete(req, res, next)
);

module.exports = router;