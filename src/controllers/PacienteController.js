const CreatePacienteService = require('../services/pacientes/CreatePacienteService');
const GetPacienteByIdService = require('../services/pacientes/GetPacienteByIdService');
const GetPacienteByDniService = require('../services/pacientes/GetPacienteByDniService'); // ✅ NUEVO
const ListPacienteService = require('../services/pacientes/ListPacienteService'); 
const UpdatePacienteService = require('../services/pacientes/UpdatePacienteService');
const DeletePacienteService = require('../services/pacientes/DeletePacienteService');
const { catchAsync } = require('../middleware/errorHandler');

const PacienteRepositoryClass = require('../repositories/PacienteRepository');
const pacienteRepository = new PacienteRepositoryClass();

class PacienteController {

    // Crear paciente
    create = catchAsync(async (req, res, next) => {
        console.log('🔄 [CREATE] Iniciando creación de paciente');
        console.log('🔄 [CREATE] Body recibido:', JSON.stringify(req.body, null, 2));
        
        const { nombre, apellido, dni, fechaNacimiento } = req.body;
        console.log('🔄 [CREATE] Datos extraídos:', { nombre, apellido, dni, fechaNacimiento });
        
        const service = new CreatePacienteService(pacienteRepository);
        const paciente = await service.execute({ nombre, apellido, dni, fechaNacimiento });
        
        console.log('🔄 [CREATE] Enviando respuesta...');
        return res.status(201).json({
            status: 'success',
            data: { paciente }
        });
    });

    // Obtener por ID
    getById = catchAsync(async (req, res, next) => {
        const { id } = req.params;
        const service = new GetPacienteByIdService(pacienteRepository);
        const paciente = await service.execute(id);
        
        return res.status(200).json(paciente);
    });

    // ✅ NUEVO: Obtener por DNI
    getByDni = catchAsync(async (req, res, next) => {
        const { dni } = req.params;
        const service = new GetPacienteByDniService(pacienteRepository);
        const paciente = await service.execute(dni);
        
        return res.status(200).json(paciente);
    });
    
    // Listar todos
    list = catchAsync(async (req, res, next) => {
        const service = new ListPacienteService(pacienteRepository);
        const pacientes = await service.execute();

        return res.status(200).json(pacientes);
    });

    // Actualizar
    update = catchAsync(async (req, res, next) => {
        const { id } = req.params;
        const updateData = req.body;
        const service = new UpdatePacienteService(pacienteRepository);
        const paciente = await service.execute(id, updateData);

        return res.status(200).json(paciente);
    });

    // Eliminar
    delete = catchAsync(async (req, res, next) => {
        const { id } = req.params;
        const service = new DeletePacienteService(pacienteRepository);
        const paciente = await service.execute(id);
        
        return res.status(200).json({
            message: 'Paciente eliminado exitosamente',
            data: paciente
        });
    });
}

module.exports = PacienteController;