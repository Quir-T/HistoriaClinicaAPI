const Joi = require('joi');

// helper para validar fecha futura
const fechaFutura = (value, helpers) => {
    const now = new Date();
    const inputFechaHora = new Date(value);

    if (inputFechaHora <= now) {
        return helpers.error('datetime.future');
    }
    return value;
};

// estados válidos para turnos
const estadosValidos = ['pendiente', 'confirmado', 'cancelado', 'completado'];

// esquema para crear turno
const createTurnoSchema = Joi.object({
    pacienteId: Joi.string()
        .guid({ version: 'uuidv4' })
        .required()
        .messages({
            'string.guid': 'El ID del paciente debe ser un UUID válido',
            'any.required': 'El ID del paciente es obligatorio'
        }),
    fechaHora: Joi.date()
        .iso()
        .custom(fechaFutura, 'validación de fecha futura')
        .required()
        .messages({
            'date.format': 'La fecha debe estar en formato ISO (YYYY-MM-DDTHH:MM:SS)',
            'datetime.future': 'El turno debe ser programado para una fecha y hora futura',
            'any.required': 'La fecha y hora son requeridas'
        }),
    motivo: Joi.string()
        .trim()
        .min(3)
        .max(200)
        .required()
        .messages({
            'string.empty': 'El motivo es requerido',
            'string.min': 'El motivo debe tener al menos 3 caracteres',
            'string.max': 'El motivo no puede tener más de 200 caracteres',
            'any.required': 'El motivo es requerido'
        }),
    estado: Joi.string()
        .valid(...estadosValidos)
        .default('pendiente')
        .messages({
            'any.only': `El estado debe ser uno de los siguientes: ${estadosValidos.join(', ')}`
        })
});

// esquema para actualizar turno
const updateTurnoSchema = Joi.object({
    pacienteId: Joi.string()
        .guid({ version: 'uuidv4' })
        .messages({
            'string.guid': 'El ID del paciente debe ser un UUID válido'
        }),
    fechaHora: Joi.date()
        .iso()
        .custom(fechaFutura, 'validación de fecha futura')
        .messages({
            'date.format': 'La fecha debe estar en formato ISO (YYYY-MM-DDTHH:MM:SS)',
            'datetime.future': 'El turno debe ser programado para una fecha y hora futura'
        }),
    motivo: Joi.string()
        .trim()
        .min(3)
        .max(200)
        .messages({
            'string.empty': 'El motivo no puede estar vacío',
            'string.min': 'El motivo debe tener al menos 3 caracteres',
            'string.max': 'El motivo no puede tener más de 200 caracteres'
        }),
    estado: Joi.string()
        .valid(...estadosValidos)
        .messages({
            'any.only': `El estado debe ser uno de los siguientes: ${estadosValidos.join(', ')}`
        })
})
.min(1)
.messages({
    'object.min': 'Se debe proporcionar al menos un campo para actualizar'
});

// esquema para validar UUID en parámetros de turno
const turnoParamsSchema = Joi.object({
    id: Joi.string()
        .guid({ version: 'uuidv4' })
        .required()
        .messages({
            'string.guid': 'El ID del turno debe ser un UUID válido',
            'any.required': 'ID del turno requerido en la URL'
        })
});

// esquema para validar UUID de paciente en parámetros
const pacienteIdParamsSchema = Joi.object({
    pacienteId: Joi.string()
        .guid({ version: 'uuidv4' })
        .required()
        .messages({
            'string.guid': 'El ID del paciente debe ser un UUID válido',
            'any.required': 'ID del paciente requerido en la URL'
        })
});

// esquema para validar fecha en parámetros (YYYY-MM-DD) - para agenda del día
const fechaParamsSchema = Joi.object({
    fecha: Joi.string()
        .isoDate()
        .required()
        .messages({
            'string.isoDate': 'La fecha debe estar en formato ISO (YYYY-MM-DD)',
            'any.required': 'Fecha requerida en la URL'
        })
});

// esquema para validar fechaHora completa en parámetros (YYYY-MM-DDTHH:MM:SS) - para búsqueda exacta
const fechaHoraParamsSchema = Joi.object({
    fechaHora: Joi.string()
        .isoDate()
        .required()
        .messages({
            'string.isoDate': 'La fechaHora debe estar en formato ISO (YYYY-MM-DDTHH:MM:SS)',
            'any.required': 'FechaHora requerida en la URL'
        })
});

// esquema para validar estado en parámetros
const estadoParamsSchema = Joi.object({
    estado: Joi.string()
        .valid(...estadosValidos)
        .required()
        .messages({
            'any.only': `El estado debe ser uno de los siguientes: ${estadosValidos.join(', ')}`,
            'any.required': 'Estado requerido en la URL'
        })
});

module.exports = {
    createTurnoSchema,
    updateTurnoSchema,
    turnoParamsSchema,
    pacienteIdParamsSchema,
    fechaParamsSchema,
    fechaHoraParamsSchema,
    estadoParamsSchema
};
