const createError = require('../../utils/createError'); // ✅ NUEVO import

class ListPacienteService {
    constructor(pacienteRepository) {
        this.pacienteRepository = pacienteRepository;
    }

    async execute() {
        const pacientes = await this.pacienteRepository.findAll();
        
        
        return pacientes || [];
    }
}

module.exports = ListPacienteService;