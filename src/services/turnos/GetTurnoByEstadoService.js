const createError = require('../../utils/createError');

class GetTurnoByEstadoService {
    constructor(turnoRepository) {
        this.turnoRepository = turnoRepository;
    }

    async execute(estado) {
        console.log('[GetTurnoByEstado] Buscando turnos por estado:', estado);
        
        //Validar que el estado es válido
        const estadosValidos = ['agendado', 'cancelado', 'completado'];
        if (!estadosValidos.includes(estado)) {
            throw createError(`Estado inválido. Estados válidos: ${estadosValidos.join(', ')}`, 400, {
                field: 'estado',
                value: estado,
                validStates: estadosValidos
            });
        }

        // Buscar turnos por estado
        const turnos = await this.turnoRepository.findByEstado(estado);
        
        console.log(`[GetTurnoByEstado] Se encontraron ${turnos.length} turnos con estado:`, estado);
        
        // Agregar información contextual según el estado
        let descripcion = '';
        
        switch (estado) {
            case 'agendado':
                descripcion = 'Turnos programados pendientes de atención';
                break;
            case 'cancelado':
                descripcion = 'Turnos que fueron cancelados';
                break;
            case 'completado':
                descripcion = 'Consultas ya realizadas';
                break;
        }

        // Estadísticas adicionales
        const estadisticas = this._calcularEstadisticas(turnos);

        return {
            estado,
            descripcion,
            turnos,
            total: turnos.length,
            estadisticas
        };
    }

    _calcularEstadisticas(turnos) {
        if (turnos.length === 0) {
            return { sinTurnos: true };
        }

        const stats = {
            fechaMasAntigua: null,
            fechaMasReciente: null,
            pacientesUnicos: new Set()
        };

        // Procesar turnos para estadísticas
        turnos.forEach(turno => {
            const fechaTurno = new Date(turno.fechaHora);
            
            // Fecha más antigua y reciente
            if (!stats.fechaMasAntigua || fechaTurno < new Date(stats.fechaMasAntigua)) {
                stats.fechaMasAntigua = turno.fechaHora;
            }
            if (!stats.fechaMasReciente || fechaTurno > new Date(stats.fechaMasReciente)) {
                stats.fechaMasReciente = turno.fechaHora;
            }
            
            // Pacientes únicos
            stats.pacientesUnicos.add(turno.pacienteId);
        });

        return {
            fechaMasAntigua: stats.fechaMasAntigua,
            fechaMasReciente: stats.fechaMasReciente,
            pacientesUnicos: stats.pacientesUnicos.size,
            promedioPorPaciente: (turnos.length / stats.pacientesUnicos.size).toFixed(1)
        };
    }
}

module.exports = GetTurnoByEstadoService;