const createError = require('../../utils/createError');

class DeletePacienteService {
    constructor(pacienteRepository) {
        this.pacienteRepository = pacienteRepository;
    }
    
    async execute(id) {
        //Verificar que el paciente existe antes de eliminar
        const existingPaciente = await this.pacienteRepository.findById(id);
        if (!existingPaciente) {
            throw createError('Paciente no encontrado para eliminar', 404, {
                field: 'id',
                value: id
            });
        }

        // Eliminar paciente
        const paciente = await this.pacienteRepository.delete(id);
        
        // Verificar que se eliminó correctamente
        if (!paciente) {
            throw createError('Error al eliminar el paciente', 500, {
                operation: 'delete',
                id: id
            });
        }
        
        return paciente;
    }
}

module.exports = DeletePacienteService;