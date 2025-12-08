const CreatePacienteService = require('../services/pacientes/CreatePacienteService');
const GetPacienteByIdService = require('../services/pacientes/GetPacienteByIdService');
const GetPacienteByDniService = require('../services/pacientes/GetPacienteByDniService');
const ListPacienteService = require('../services/pacientes/ListPacienteService'); 
const UpdatePacienteService = require('../services/pacientes/UpdatePacienteService');
const DeletePacienteService = require('../services/pacientes/DeletePacienteService');
const { catchAsync } = require('../middleware/errorHandler');

class PacienteController {
    // Crear paciente
    create = catchAsync(async (req, res, next) => {
        console.log('[CREATE] Iniciando creacion de paciente');
        console.log('[CREATE] Body recibido:', req.body);
        
        const { nombre, apellido, dni, fechaNacimiento } = req.body;
        const data = { nombre, apellido, dni, fechaNacimiento };
        
        console.log('[CREATE] Datos extraidos:', data);
        console.log('[CREATE] Usando repositorio:', !!req.pacienteRepository);
        
        const service = new CreatePacienteService(req.pacienteRepository);
        const paciente = await service.execute(data);
        
        console.log('[CREATE] Enviando respuesta...');
        return res.status(201).json({
            status: 'success',
            data: { paciente }
        });
    });

    // Obtener paciente por ID
    getById = catchAsync(async (req, res, next) => {
        console.log('[GET_BY_ID] Buscando paciente ID:', req.params.id);
        
        const { id } = req.params;
        const service = new GetPacienteByIdService(req.pacienteRepository);
        const paciente = await service.execute(id);
        
        return res.status(200).json(paciente);
    });

    // Obtener paciente por DNI
    getByDni = catchAsync(async (req, res, next) => {
        console.log('[GET_BY_DNI] Buscando paciente DNI:', req.params.dni);
        
        const { dni } = req.params;
        const service = new GetPacienteByDniService(req.pacienteRepository);
        const paciente = await service.execute(dni);
        
        return res.status(200).json(paciente);
    });
    
    // Listar todos los pacientes
    list = catchAsync(async (req, res, next) => {
        console.log('[LIST] Obteniendo lista de pacientes...');
        
        const service = new ListPacienteService(req.pacienteRepository);
        const pacientes = await service.execute();

        return res.status(200).json(pacientes);
    });

    // Actualizar paciente
    update = catchAsync(async (req, res, next) => {
        console.log('[UPDATE] Actualizando paciente ID:', req.params.id);
        console.log('[UPDATE] Datos a actualizar:', req.body);
        
        const { id } = req.params;
        const updateData = req.body;
        const service = new UpdatePacienteService(req.pacienteRepository);
        const paciente = await service.execute(id, updateData);

        return res.status(200).json(paciente);
    });

    // Eliminar paciente
    delete = catchAsync(async (req, res, next) => {
        console.log('[DELETE] Eliminando paciente ID:', req.params.id);
        
        const { id } = req.params;
        const service = new DeletePacienteService(req.pacienteRepository);
        const paciente = await service.execute(id);
        
        return res.status(200).json({
            message: 'Paciente eliminado exitosamente',
            data: paciente
        });
    });
}

module.exports = PacienteController;