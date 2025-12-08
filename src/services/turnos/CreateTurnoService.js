const createError = require('../../utils/createError');

class CreateTurnoService {
    constructor(turnoRepository, pacienteRepository) {
        this.turnoRepository = turnoRepository;
        this.pacienteRepository = pacienteRepository;
    }

    async execute(turnoData) {
        const { pacienteId, fechaHora, motivo, estado } = turnoData;

        // Validar que existe el paciente
        console.log('[CreateTurno] Verificando paciente:', pacienteId);
        const paciente = await this.pacienteRepository.findById(pacienteId);
        
        if (!paciente) {
            throw createError('Paciente no encontrado', 404, {
                field: 'pacienteId',
                value: pacienteId
            });
        }

        //  Verificar conflicto de horario
        console.log('[CreateTurno] Verificando conflicto horario:', fechaHora);
        const conflicto = await this.turnoRepository.existeConflictoHorario(fechaHora);
        
        if (conflicto) {
            throw createError('Ya existe un turno programado en esa fecha y hora', 409, {
                field: 'fechaHora',
                value: fechaHora,
                conflictWith: {
                    turnoId: conflicto.id,
                    pacienteId: conflicto.pacienteId
                }
            });
        }

        // Crear el turno
        console.log('[CreateTurno] Creando turno...');
        const turno = await this.turnoRepository.create({
            pacienteId,
            fechaHora,
            motivo,
            estado: estado || 'agendado'
        });

        console.log('[CreateTurno] Turno creado exitosamente:', turno.id);
        return turno;
    }
}

module.exports = CreateTurnoService;