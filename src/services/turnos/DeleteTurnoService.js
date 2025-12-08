const createError = require('../../utils/createError');

class DeleteTurnoService {
    constructor(turnoRepository) {
        this.turnoRepository = turnoRepository;
    }

    async execute(id) {
        console.log('[DeleteTurno] Eliminando turno:', id);
        
        //Verificar que el turno existe
        const turno = await this.turnoRepository.findById(id);
        if (!turno) {
            throw createError('Turno no encontrado', 404, {
                field: 'id',
                value: id
            });
        }

        //Validar lógica de negocio: ¿Se puede eliminar?
        if (turno.estado === 'completado') {
            throw createError(
                'No se puede eliminar un turno que ya fue completado',
                400,
                {
                    field: 'estado',
                    value: turno.estado,
                    reason: 'Los turnos completados deben conservarse por historial médico'
                }
            );
        }

        //Eliminar el turno
        console.log('[DeleteTurno] Eliminando turno...');
        const turnoEliminado = await this.turnoRepository.delete(id);
        
        console.log('[DeleteTurno] Turno eliminado exitosamente:', turnoEliminado.id);
        return turnoEliminado;
    }
}

module.exports = DeleteTurnoService;