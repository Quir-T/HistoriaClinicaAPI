const { v4 : uuidv4 } = require('uuid');

class Turno {
    constructor({ pacienteId, fechaHora, motivo, estado, id = null }) {
        this.id = id || uuidv4();
        this.pacienteId = pacienteId;
        this.fechaHora = fechaHora;
        this.motivo = motivo;
        this.estado = estado || 'pendiente';

        this.createdAt = new Date().toISOString();
        this.updatedAt = new Date().toISOString();
    }

    update(data) {
        Object.assign(this, data);
        this.updatedAt = new Date().toISOString();
        return this;
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

