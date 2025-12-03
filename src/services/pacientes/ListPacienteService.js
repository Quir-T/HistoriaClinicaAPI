const createError = require('../../utils/createError'); // ✅ NUEVO import

class ListPacienteService {
    constructor(pacienteRepository) {
        this.pacienteRepository = pacienteRepository;
    }

    async execute() {
        const pacientes = await this.pacienteRepository.findAll();
        
        // ✅ CAMBIO CRÍTICO: Lista vacía NO es error, es resultado válido
        // En una API REST, obtener una lista vacía es perfectamente normal
        return pacientes || [];
    }
}

module.exports = ListPacienteService;