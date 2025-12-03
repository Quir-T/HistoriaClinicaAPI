const createError = require('../../utils/createError');

class UpdatePacienteService {
    constructor(pacienteRepository) {
        this.pacienteRepository = pacienteRepository;
    }

    async execute(id, updateData) {
        // ✅ NUEVO: Verificar que el paciente existe ANTES de actualizar
        const existingPaciente = await this.pacienteRepository.findById(id);
        if (!existingPaciente) {
            throw createError('Paciente no encontrado para actualizar', 404, {
                field: 'id',
                value: id
            });
        }

        // ✅ NUEVO: Si se está actualizando el DNI, verificar que no exista en otro paciente
        if (updateData.dni && updateData.dni !== existingPaciente.dni) {
            const pacienteWithDni = await this.pacienteRepository.findByDni(updateData.dni);
            if (pacienteWithDni) {
                throw createError('El DNI ya está registrado por otro paciente', 409, {
                    field: 'dni',
                    value: updateData.dni,
                    existingPatientId: pacienteWithDni.id
                });
            }
        }

        // ✅ NUEVO: Hacer la actualización
        const paciente = await this.pacienteRepository.update(id, updateData);
        
        // ✅ NUEVO: Verificar que se actualizó correctamente
        if (!paciente) {
            throw createError('Error al actualizar el paciente', 500, {
                operation: 'update',
                id: id
            });
        }
        
        return paciente;
    }
}

module.exports = UpdatePacienteService;