const Paciente = require('../models/Paciente');

class PacienteRepository {
    constructor() {
        this.pacientes = new Map();
    }
    
    async findAll() {
        return Array.from(this.pacientes.values());
    }

    async findById(id) {
        return this.pacientes.get(id) || null;
    }

    // Buscar paciente por DNI
    async findByDni(dni) {
        for (const paciente of this.pacientes.values()) {
            if (paciente.dni === dni) {
                return paciente;
            }
        }
        return null;
    }

    async create(pacienteData) {
        const paciente = new Paciente(pacienteData);
        this.pacientes.set(paciente.id, paciente);
        return paciente;
    }

    async update(id, updateData) {
        const paciente = this.pacientes.get(id);
        if (!paciente) {
            return null;
        }

        paciente.update(updateData);
        this.pacientes.set(id, paciente);
        return paciente;
    }

    async delete(id) {
        const paciente = this.pacientes.get(id);
        if (!paciente) {
            return null;
        }

        this.pacientes.delete(id);
        return paciente;
    }

    async exists(id) {
        return this.pacientes.has(id);
    }

    async count() {
        return this.pacientes.size;
    }
    
    async clear() {
        this.pacientes.clear();
    }
}

module.exports = PacienteRepository;