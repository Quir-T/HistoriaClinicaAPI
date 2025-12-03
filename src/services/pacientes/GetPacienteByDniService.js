const createError = require('../../utils/createError');

class GetPacienteByDniService {
    constructor(pacienteRepository) {
        this.pacienteRepository = pacienteRepository;
    }
    
    async execute(dni) {
        // ✅ Validar que se proporcionó DNI
        if (!dni) {
            throw createError('DNI requerido para la búsqueda', 400, { field: 'dni' });
        }

        // ✅ Validar formato de DNI (opcional, Joi ya valida pero doble check)
        if (!/^[0-9]{7,8}$/.test(dni)) {
            throw createError('Formato de DNI inválido', 400, { 
                field: 'dni', 
                value: dni,
                expected: '7-8 dígitos numéricos'
            });
        }
        
        // ✅ Buscar paciente por DNI
        const paciente = await this.pacienteRepository.findByDni(dni);
        
        // ✅ Validar que existe
        if (!paciente) {
            throw createError('Paciente no encontrado con ese DNI', 404, { 
                field: 'dni', 
                value: dni 
            });
        }
        
        return paciente;
    }
}

module.exports = GetPacienteByDniService;