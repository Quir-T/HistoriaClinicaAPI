class ListTurnoService {
    constructor(turnoRepository) {
        this.turnoRepository = turnoRepository;
    }

    async execute() {
        console.log('[ListTurnos] Obteniendo lista completa de turnos...');
        
        const turnos = await this.turnoRepository.findAll();
        
        // Agregar estadísticas básicas para el listado
        const estadisticas = {
            total: turnos.length,
            porEstado: {
                agendado: turnos.filter(t => t.estado === 'agendado').length,
                cancelado: turnos.filter(t => t.estado === 'cancelado').length,
                completado: turnos.filter(t => t.estado === 'completado').length
            }
        };

        console.log(`[ListTurnos] Se encontraron ${turnos.length} turnos en total`);
        console.log('[ListTurnos] Estadísticas:', estadisticas.porEstado);
        
        return {
            turnos,
            estadisticas
        };
    }
}

module.exports = ListTurnoService;