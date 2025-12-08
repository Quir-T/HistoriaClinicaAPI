const express = require('express');
const router = express.Router();

// Controller
const turnoController = require('../controllers/TurnoController');

// Validations
const {
    validateCreateTurno,
    validateUpdateTurno,
    validateTurnoParams,
    validatePacienteIdParams,
    validateFechaParams,
    validateEstadoParams
} = require('../middleware/turnoValidation');

// CRUD básico
router.post('/',
    validateCreateTurno,
    turnoController.create
);

router.get('/',
    turnoController.list
);

router.get('/:id',
    validateTurnoParams,
    turnoController.getById
);

router.patch('/:id',
    validateTurnoParams,
    validateUpdateTurno,
    turnoController.update
);

router.delete('/:id',
    validateTurnoParams,
    turnoController.delete
);

// Búsquedas específicas

router.get('/paciente/:pacienteId',
    validatePacienteIdParams,
    turnoController.getByPaciente
);

router.get('/fecha/:fecha',
    validateFechaParams,
    turnoController.getByFecha
);

router.get('/estado/:estado',
    validateEstadoParams,
    turnoController.getByEstado
);

module.exports = router;