const { v4 : uuidv4 } = require('uuid');

class Turno {
    constructor({ pacienteId, fechaHora, motivo, estado = 'agendado', id = null }) {
        this.id = id || uuidv4();
        this.pacienteId = pacienteId;
        
        // Siempre guardar como string ISO
        if (fechaHora instanceof Date) {
            this.fechaHora = fechaHora.toISOString();
        } else if (typeof fechaHora === 'string') {
            // Si es string, asegurar que sea ISO válido
            const date = new Date(fechaHora);
            this.fechaHora = date.toISOString();
        } else {
            throw new Error('fechaHora debe ser Date o string válido');
        }
        
        this.motivo = motivo;
        this.estado = estado || 'agendado';
        this.createdAt = new Date().toISOString();
        this.updatedAt = new Date().toISOString();
    }

    // Método para actualizar datos
    update(data) {
        if (data.fechaHora) {
            if (data.fechaHora instanceof Date) {
                this.fechaHora = data.fechaHora.toISOString();
            } else if (typeof data.fechaHora === 'string') {
                const date = new Date(data.fechaHora);
                this.fechaHora = date.toISOString();
            }
        }
        
        if (data.motivo !== undefined) {
            this.motivo = data.motivo;
        }
        
        if (data.estado !== undefined) {
            this.estado = data.estado;
        }
        
        this.updatedAt = new Date().toISOString();
        return this;
    }

    sePuedeCancelar() {
        return this.estado === 'agendado';
    }

    sePuedeCompletar() {
        return this.estado === 'agendado';
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

