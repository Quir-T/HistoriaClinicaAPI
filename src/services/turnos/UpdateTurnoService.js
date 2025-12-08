const createError = require('../../utils/createError');

class UpdateTurnoService {
    constructor(turnoRepository, pacienteRepository) {
        this.turnoRepository = turnoRepository;
        this.pacienteRepository = pacienteRepository;
    }

    async execute(id, updateData) {
        console.log('[UpdateTurno] Actualizando turno:', id, updateData);
        
        // 1. Verificar que el turno existe
        const turno = await this.turnoRepository.findById(id);
        if (!turno) {
            throw createError('Turno no encontrado', 404, {
                field: 'id',
                value: id
            });
        }

        // Si se está actualizando el pacienteId, verificar que existe
        if (updateData.pacienteId) {
            console.log('[UpdateTurno] Verificando paciente:', updateData.pacienteId);
            const paciente = await this.pacienteRepository.findById(updateData.pacienteId);
            
            if (!paciente) {
                throw createError('Paciente no encontrado', 404, {
                    field: 'pacienteId',
                    value: updateData.pacienteId
                });
            }
        }

        // Si se está actualizando fechaHora, verificar conflictos
        if (updateData.fechaHora) {
            console.log('[UpdateTurno] Verificando conflicto horario:', updateData.fechaHora);
            const conflicto = await this.turnoRepository.existeConflictoHorario(
                updateData.fechaHora,
                id  // Excluir el turno actual
            );
            
            if (conflicto) {
                throw createError('Ya existe un turno programado en esa fecha y hora', 409, {
                    field: 'fechaHora',
                    value: updateData.fechaHora,
                    conflictWith: {
                        turnoId: conflicto.id,
                        pacienteId: conflicto.pacienteId
                    }
                });
            }
        }

        // Validar lógica de negocio según el estado actual
        if (updateData.estado) {
            const estadosPermitidos = this._getEstadosPermitidos(turno.estado);
            if (!estadosPermitidos.includes(updateData.estado)) {
                throw createError(
                    `No se puede cambiar de estado '${turno.estado}' a '${updateData.estado}'`, 
                    400,
                    {
                        field: 'estado',
                        currentState: turno.estado,
                        requestedState: updateData.estado,
                        allowedStates: estadosPermitidos
                    }
                );
            }
        }

        // Método update del modelo para manejar fechas correctamente
        turno.update(updateData);
        
        const turnoActualizado = await this.turnoRepository.update(id, turno);
        
        console.log('[UpdateTurno] Turno actualizado exitosamente:', turnoActualizado.id);
        return turnoActualizado;
    }

    // Lógica de transiciones de estado permitidas
    _getEstadosPermitidos(estadoActual) {
        const transiciones = {
            'agendado': ['cancelado', 'completado'],
            'cancelado': [], // No se puede cambiar desde cancelado
            'completado': [] // No se puede cambiar desde completado
        };

        return transiciones[estadoActual] || [];
    }
}

module.exports = UpdateTurnoService;