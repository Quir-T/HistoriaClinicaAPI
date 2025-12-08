const { catchAsync } = require('../middleware/errorHandler');

// Services
const CreateTurnoService = require('../services/turnos/CreateTurnoService');
const GetTurnoByIdService = require('../services/turnos/GetTurnoByIdService');
const ListTurnoService = require('../services/turnos/ListTurnoService');
const UpdateTurnoService = require('../services/turnos/UpdateTurnoService');
const DeleteTurnoService = require('../services/turnos/DeleteTurnoService');
const GetTurnoByPacienteService = require('../services/turnos/GetTurnoByPacienteService');
const GetTurnoByFechaService = require('../services/turnos/GetTurnoByFechaService');
const GetTurnoByEstadoService = require('../services/turnos/GetTurnoByEstadoService');

class TurnoController {
    // Crear turno
    create = catchAsync(async (req, res) => {
        console.log('[TurnoController] POST /turnos');
        console.log('[CREATE] Body recibido:', req.body);
        console.log('[CREATE] Repositorios disponibles:', {
            turno: !!req.turnoRepository,
            paciente: !!req.pacienteRepository
        });
        
        const service = new CreateTurnoService(req.turnoRepository, req.pacienteRepository);
        const turno = await service.execute(req.body);
        
        console.log('[CREATE] Turno creado exitosamente');
        return res.status(201).json({
            status: 'success',
            data: { turno }
        });
    });

    // Obtener turno por ID
    getById = catchAsync(async (req, res) => {
        console.log('[GET_BY_ID] Buscando turno ID:', req.params.id);
        
        const { id } = req.params;
        const service = new GetTurnoByIdService(req.turnoRepository);
        const turno = await service.execute(id);
        
        return res.status(200).json({
            status: 'success',
            data: { turno }
        });
    });

    // Listar todos los turnos
    list = catchAsync(async (req, res) => {
        console.log('[TurnoController] GET /turnos');
        
        const service = new ListTurnoService(req.turnoRepository);
        const result = await service.execute();
        
        return res.status(200).json({
            status: 'success',
            data: result
        });
    });

    // Actualizar turno
    update = catchAsync(async (req, res) => {
        console.log('[UPDATE] Actualizando turno ID:', req.params.id);
        console.log('[UPDATE] Datos a actualizar:', req.body);
        
        const { id } = req.params;
        const service = new UpdateTurnoService(req.turnoRepository, req.pacienteRepository);
        const turno = await service.execute(id, req.body);
        
        return res.status(200).json({
            status: 'success',
            data: { turno }
        });
    });

    // Eliminar turno
    delete = catchAsync(async (req, res) => {
        console.log('[DELETE] Eliminando turno ID:', req.params.id);
        
        const { id } = req.params;
        const service = new DeleteTurnoService(req.turnoRepository);
        const turno = await service.execute(id);
        
        return res.status(200).json({
            status: 'success',
            data: { turno }
        });
    });

    // Obtener turnos por paciente
    getByPaciente = catchAsync(async (req, res) => {
        console.log('[GET_BY_PACIENTE] Buscando turnos del paciente:', req.params.pacienteId);
        
        const { pacienteId } = req.params;
        const service = new GetTurnoByPacienteService(req.turnoRepository, req.pacienteRepository);
        const result = await service.execute(pacienteId);
        
        return res.status(200).json({
            status: 'success',
            data: result
        });
    });

    // Obtener turnos por fecha
    getByFecha = catchAsync(async (req, res) => {
        console.log('[GET_BY_FECHA] Buscando turnos del dia:', req.params.fecha);
        
        const { fecha } = req.params;
        const service = new GetTurnoByFechaService(req.turnoRepository);
        const result = await service.execute(fecha);
        
        return res.status(200).json({
            status: 'success',
            data: result
        });
    });

    // Obtener turnos por estado
    getByEstado = catchAsync(async (req, res) => {
        console.log('[GET_BY_ESTADO] Buscando turnos con estado:', req.params.estado);
        
        const { estado } = req.params;
        const service = new GetTurnoByEstadoService(req.turnoRepository);
        const result = await service.execute(estado);
        
        return res.status(200).json({
            status: 'success',
            data: result
        });
    });
}

module.exports = new TurnoController();