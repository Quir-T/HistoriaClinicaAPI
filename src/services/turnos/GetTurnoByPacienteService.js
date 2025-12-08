const createError = require('../../utils/createError');

class GetTurnoByPacienteService {
    constructor(turnoRepository, pacienteRepository) {
        this.turnoRepository = turnoRepository;
        this.pacienteRepository = pacienteRepository;
    }

    async execute(pacienteId) {
        console.log('[GetTurnoByPaciente] Buscando turnos para paciente:', pacienteId);
        
        //  Verificar que el paciente existe
        const paciente = await this.pacienteRepository.findById(pacienteId);
        if (!paciente) {
            throw createError('Paciente no encontrado', 404, {
                field: 'pacienteId',
                value: pacienteId
            });
        }

        // Buscar todos los turnos del paciente
        const turnos = await this.turnoRepository.findByPacienteId(pacienteId);
        
        console.log(`[GetTurnoByPaciente] Se encontraron ${turnos.length} turnos para paciente:`, pacienteId);
        
        return {
            paciente: {
                id: paciente.id,
                nombre: paciente.nombre,
                apellido: paciente.apellido,
                dni: paciente.dni
            },
            turnos,
            total: turnos.length
        };
    }
}

module.exports = GetTurnoByPacienteService;