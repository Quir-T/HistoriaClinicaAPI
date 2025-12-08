const createError = require('../../utils/createError');

class GetTurnoByFechaService {
    constructor(turnoRepository) {
        this.turnoRepository = turnoRepository;
    }

    async execute(fecha) {
        console.log('[GetTurnoByFecha] Fecha recibida:', fecha, typeof fecha);
        
        // Normalizar fecha - puede llegar como string o Date
        let fechaString = fecha;
        
        if (fecha instanceof Date) {
            fechaString = fecha.toISOString().split('T')[0];
        } else if (typeof fecha === 'string' && fecha.includes('T')) {
            fechaString = fecha.split('T')[0];
        }
        
        console.log('[GetTurnoByFecha] Fecha normalizada:', fechaString);
        
        // Validar formato final YYYY-MM-DD
        const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!fechaRegex.test(fechaString)) {
            throw createError('Formato de fecha inválido. Use YYYY-MM-DD', 400, {
                field: 'fecha',
                value: fecha,
                expectedFormat: 'YYYY-MM-DD'
            });
        }

        // Buscar turnos por fecha
        const turnos = await this.turnoRepository.findByFecha(fechaString);
        
        console.log(`[GetTurnoByFecha] Se encontraron ${turnos.length} turnos para fecha:`, fechaString);
        
        // Agrupar por estado para mejor visualización
        const turnosPorEstado = {
            agendado: turnos.filter(t => t.estado === 'agendado'),
            cancelado: turnos.filter(t => t.estado === 'cancelado'), 
            completado: turnos.filter(t => t.estado === 'completado')
        };

        return {
            fecha: fechaString,
            descripcion: `Agenda del día ${fechaString}`,
            turnos,
            total: turnos.length,
            resumen: {
                agendado: turnosPorEstado.agendado.length,
                cancelado: turnosPorEstado.cancelado.length,
                completado: turnosPorEstado.completado.length
            },
            agenda: turnosPorEstado
        };
    }
}

module.exports = GetTurnoByFechaService;