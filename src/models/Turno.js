const { v4 : uuidv4 } = require('uuid');

class Turno {
    constructor({ pacienteId, fechaHora, motivo, estado = 'agendado', id = null }) {
        this.id = id || uuidv4();
        this.pacienteId = pacienteId;
        this.fechaHora = fechaHora;
        this.motivo = motivo;
        this.estado = estado || 'agendado';

        this.createdAt = new Date().toISOString();
        this.updatedAt = new Date().toISOString();
    }

    update(data) {
        Object.assign(this, data);
        this.updatedAt = new Date().toISOString();
        return this;
    }

    sePuedeCancelar() {
        return this.estado === 'agendado';  // Solo se puede cancelar si está agendado
    }

    sePuedeCompletar() {
        return this.estado === 'agendado';  // Solo se puede completar si está agendado
    }

    toJSON() {
        return {
            id: this.id,
            pacienteId: this.pacienteId,
            fechaHora: this.fechaHora,
            motivo: this.motivo,
            estado: this.estado,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
}

module.exports = Turno;

