const createError = require('../../utils/createError'); // ← Import del helper

class CreatePacienteService {
    constructor(pacienteRepository) {
        console.log('🔄 [SERVICE] Inicializando CreatePacienteService');
        this.pacienteRepository = pacienteRepository;
    }

    async execute(pacienteData) {
        console.log('🔄 [SERVICE] Ejecutando creación con data:', pacienteData);
        
        // ✅ NUEVA: Validar DNI único
        const existingPaciente = await this.pacienteRepository.findByDni?.(pacienteData.dni);
        if (existingPaciente) {
            throw createError('El DNI ya está registrado en el sistema', 409, {
                field: 'dni',
                value: pacienteData.dni
            });
        }
        
        console.log('🔄 [SERVICE] Llamando al repositorio...');
        const paciente = await this.pacienteRepository.create(pacienteData);
        console.log('🔄 [SERVICE] Paciente creado en repositorio:', paciente);
        
        // ✅ NUEVA: Validar que se creó correctamente
        if (!paciente) {
            throw createError('Error al crear el paciente en el repositorio', 500);
        }
        
        console.log('🔄 [SERVICE] Convirtiendo a JSON...');
        const result = paciente.toJSON();
        console.log('🔄 [SERVICE] Resultado final:', result);
        
        return result;
    }
}

module.exports = CreatePacienteService;