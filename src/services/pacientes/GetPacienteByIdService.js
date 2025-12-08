const createError = require('../../utils/createError');

class GetPacienteByIdService {
    constructor(pacienteRepository) {
        this.pacienteRepository = pacienteRepository;
    }
    
    async execute(id) {
        // Validar que se proporcionó ID
        if (!id) {
            throw createError('ID de paciente requerido', 400, { field: 'id' });
        }
        
        // Buscar paciente
        const paciente = await this.pacienteRepository.findById(id);
        
        // Validar que existe
        if (!paciente) {
            throw createError('Paciente no encontrado', 404, { 
                field: 'id', 
                value: id 
            });
        }
        
        return paciente;
    }
}

module.exports = GetPacienteByIdService;