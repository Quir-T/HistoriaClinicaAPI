const Turno = require('../models/Turno');

class TurnoRepository {
    constructor() {
        this.turnos = new Map();
    }

    // Crear nuevo turno
    async create(turnoData) {
        const turno = new Turno(turnoData);
        this.turnos.set(turno.id, turno);
        return turno;
    }

    // Buscar por ID
    async findById(id) {
        return this.turnos.get(id) || null; // ✅ Solo retorna null, no error
    }

    // Buscar turnos por paciente ID
    async findByPacienteId(pacienteId) {
        const turnosPaciente = [];
        
        for (const turno of this.turnos.values()) {
            if (turno.pacienteId === pacienteId) {
                turnosPaciente.push(turno);
            }
        }
        
        return turnosPaciente.sort((a, b) => {
            return new Date(a.fechaHora) - new Date(b.fechaHora);
        });
    }

    // Buscar turnos por fecha
    async findByFecha(fecha) {
        const turnosFecha = [];
        
        for (const turno of this.turnos.values()) {
            const turnoFecha = turno.fechaHora.split('T')[0];
            if (turnoFecha === fecha) {
                turnosFecha.push(turno);
            }
        }
        
        return turnosFecha.sort((a, b) => {
            return new Date(a.fechaHora) - new Date(b.fechaHora);
        });
    }

    // Buscar turnos por estado
    async findByEstado(estado) {
        const turnosEstado = [];
        
        for (const turno of this.turnos.values()) {
            if (turno.estado === estado) {
                turnosEstado.push(turno);
            }
        }
        
        return turnosEstado.sort((a, b) => {
            return new Date(a.fechaHora) - new Date(b.fechaHora);
        });
    }

    // Verificar si existe conflicto de horario
    async existeConflictoHorario(fechaHora, excludeId = null) {
        for (const turno of this.turnos.values()) {
            if (excludeId && turno.id === excludeId) {
                continue;
            }
            
            if (turno.fechaHora === fechaHora) {
                return turno; // Retorna el turno conflictivo o null
            }
        }
        return null;
    }

    // Listar todos
    async findAll() {
        const allTurnos = Array.from(this.turnos.values());
        return allTurnos.sort((a, b) => {
            return new Date(a.fechaHora) - new Date(b.fechaHora);
        });
    }

    // Actualizar
    async update(id, updateData) {
        const turno = this.turnos.get(id);
        if (!turno) {
            return null; // Solo retorna null
        }
        
        turno.update(updateData);
        this.turnos.set(id, turno);
        return turno;
    }

    // Eliminar
    async delete(id) {
        const turno = this.turnos.get(id);
        if (!turno) {
            return null; // Solo retorna null
        }
        
        this.turnos.delete(id);
        return turno;
    }

    // Estadísticas
    async getEstadisticas() {
        const stats = {
            total: this.turnos.size,
            porEstado: {
                agendado: 0,      // ✅ Cambiar 'pendiente' por 'agendado'
                cancelado: 0,
                completado: 0
                // ❌ Remover 'confirmado'
            }
        };

        for (const turno of this.turnos.values()) {
            if (stats.porEstado[turno.estado] !== undefined) {
                stats.porEstado[turno.estado]++;
            }
        }

        return stats;
    }
}

module.exports = TurnoRepository;