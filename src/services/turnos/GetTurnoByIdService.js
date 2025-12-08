const createError = require('../../utils/createError');

class GetTurnoByIdService {
    constructor(turnoRepository) {
        this.turnoRepository = turnoRepository;
    }

    async execute(id) {
        console.log('[GetTurnoById] Buscando turno:', id);
        
        const turno = await this.turnoRepository.findById(id);
        
        if (!turno) {
            console.log('[GetTurnoById] Turno no encontrado:', id);
            throw createError('Turno no encontrado', 404, {
                field: 'id',
                value: id
            });
        }

        console.log('[GetTurnoById] Turno encontrado:', turno.id);
        return turno;
    }
}

module.exports = GetTurnoByIdService;