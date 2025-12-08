# API CRUD - Gestión de Pacientes y Turnos

API REST completa para la gestión de pacientes y turnos médicos con arquitectura en capas, construida con Node.js y Express.js.

## Características

- **Arquitectura en capas**: Separación clara entre rutas, controladores, servicios y repositorios
- **Gestión completa**: Pacientes y turnos con operaciones CRUD
- **Validación robusta**: Validación de datos con Joi (DNI, fechas, UUIDs, estados)
- **Error handling avanzado**: Sistema de manejo de errores con códigos HTTP apropiados
- **Lógica de negocio**: Validación de conflictos horarios, transiciones de estado
- **Búsquedas especializadas**: Por DNI, fecha, estado, paciente
- **Almacenamiento en memoria**: Repositorios en memoria con Map (fácil migración a DB)
- **UUIDs**: Identificadores únicos para pacientes y turnos
- **Health check**: Endpoint de monitoreo del servicio

## Requisitos

- Node.js >= 14.0.0
- npm >= 6.0.0

## Instalación

```bash
# Clonar el repositorio
git clone <repository-url>
cd apiCRUD

# Instalar dependencias
npm install

# Copiar variables de entorno (opcional)
cp .env.dist .env
```

## Ejecución

```bash
# Desarrollo (con auto-restart)
npm run dev

# Producción
npm start
```

El servidor estará disponible en: `http://localhost:3000`

## API Endpoints Completos

### Base URL
```
http://localhost:3000
```

## Tabla de Endpoints

| Método | Endpoint | Descripción | Validaciones | Response |
|--------|----------|-------------|--------------|----------|
| **SISTEMA** |
| `GET` | `/health` | Health check del servicio | - | `200` Status OK |
| **PACIENTES** |
| `GET` | `/api/pacientes` | Listar todos los pacientes | - | `200` Array de pacientes |
| `GET` | `/api/pacientes/{id}` | Obtener paciente por UUID | UUID válido | `200` Paciente / `404` Not found |
| `GET` | `/api/pacientes/dni/{dni}` | Buscar por DNI | DNI 7-8 dígitos | `200` Paciente / `404` Not found |
| `POST` | `/api/pacientes` | Crear nuevo paciente | Body completo, DNI único | `201` Paciente creado / `409` DNI duplicado |
| `PATCH` | `/api/pacientes/{id}` | Actualizar paciente | UUID válido, DNI único | `200` Paciente actualizado / `404` Not found |
| `DELETE` | `/api/pacientes/{id}` | Eliminar paciente | UUID válido | `200` Paciente eliminado / `404` Not found |
| **TURNOS** |
| `GET` | `/api/turnos` | Listar todos + estadísticas | - | `200` Array + stats por estado |
| `GET` | `/api/turnos/{id}` | Obtener turno por UUID | UUID válido | `200` Turno / `404` Not found |
| `POST` | `/api/turnos` | Crear nuevo turno | Body completo, sin conflictos | `201` Turno creado / `409` Conflicto horario |
| `PATCH` | `/api/turnos/{id}` | Actualizar turno | UUID válido, transiciones válidas | `200` Turno actualizado / `400` Transición inválida |
| `DELETE` | `/api/turnos/{id}` | Eliminar turno | UUID válido, no completado | `200` Turno eliminado / `400` Turno completado |
| **BÚSQUEDAS TURNOS** |
| `GET` | `/api/turnos/paciente/{pacienteId}` | Turnos de un paciente | UUID válido, paciente existe | `200` Array + info paciente |
| `GET` | `/api/turnos/fecha/{fecha}` | Turnos de una fecha | Formato YYYY-MM-DD | `200` Array + resumen del día |
| `GET` | `/api/turnos/estado/{estado}` | Turnos por estado | Estado válido | `200` Array + estadísticas |

## Detalles de Request/Response

### Health Check
```http
GET /health
```
**Response:**
```json
{
  "status": "OK",
  "timestamp": "2025-12-07T10:30:00.000Z",
  "uptime": "2h 15m 30s"
}
```

### Crear Paciente
```http
POST /api/pacientes
Content-Type: application/json

{
  "nombre": "Juan",
  "apellido": "Pérez", 
  "dni": "12345678",
  "fechaNacimiento": "1990-05-15"
}
```

**Response 201:**
```json
{
  "status": "success",
  "data": {
    "paciente": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "nombre": "Juan",
      "apellido": "Pérez",
      "dni": "12345678",
      "fechaNacimiento": "1990-05-15T00:00:00.000Z",
      "createdAt": "2025-12-07T10:30:00.000Z",
      "updatedAt": "2025-12-07T10:30:00.000Z"
    }
  }
}
```

### Crear Turno
```http
POST /api/turnos
Content-Type: application/json

{
  "pacienteId": "123e4567-e89b-12d3-a456-426614174000",
  "fechaHora": "2025-12-15T10:30:00.000Z",
  "motivo": "Consulta general",
  "estado": "agendado"
}
```

### Listar Turnos con Estadísticas
```http
GET /api/turnos
```

**Response 200:**
```json
{
  "status": "success",
  "data": {
    "turnos": [
      {
        "id": "def-456",
        "pacienteId": "abc-123",
        "fechaHora": "2025-12-15T10:30:00.000Z",
        "motivo": "Consulta general",
        "estado": "agendado",
        "createdAt": "2025-12-07T10:30:00.000Z",
        "updatedAt": "2025-12-07T10:30:00.000Z"
      }
    ],
    "estadisticas": {
      "total": 5,
      "porEstado": {
        "agendado": 3,
        "cancelado": 1,
        "completado": 1
      }
    }
  }
}
```

### Turnos por Paciente
```http
GET /api/turnos/paciente/123e4567-e89b-12d3-a456-426614174000
```

**Response 200:**
```json
{
  "status": "success",
  "data": {
    "paciente": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "nombre": "Juan",
      "apellido": "Pérez",
      "dni": "12345678"
    },
    "turnos": [...],
    "total": 3
  }
}
```

### Turnos por Fecha
```http
GET /api/turnos/fecha/2025-12-15
```

**Response 200:**
```json
{
  "status": "success",
  "data": {
    "fecha": "2025-12-15",
    "descripcion": "Agenda del día 2025-12-15",
    "turnos": [...],
    "total": 4,
    "resumen": {
      "agendado": 3,
      "cancelado": 0, 
      "completado": 1
    },
    "agenda": {
      "agendado": [...],
      "cancelado": [...],
      "completado": [...]
    }
  }
}
```

### Turnos por Estado
```http
GET /api/turnos/estado/agendado
```

**Response 200:**
```json
{
  "status": "success",
  "data": {
    "estado": "agendado",
    "descripcion": "Turnos programados pendientes de atención", 
    "turnos": [...],
    "total": 3,
    "estadisticas": {
      "fechaMasAntigua": "2025-12-15T10:00:00.000Z",
      "fechaMasReciente": "2025-12-20T14:30:00.000Z",
      "pacientesUnicos": 2,
      "promedioPorPaciente": "1.5"
    }
  }
}
```

## Códigos de Respuesta

| Código | Descripción | Cuándo ocurre |
|--------|-------------|---------------|
| `200` | OK | Operación exitosa |
| `201` | Created | Recurso creado exitosamente |
| `400` | Bad Request | Datos inválidos o transición de estado inválida |
| `404` | Not Found | Recurso no encontrado |
| `409` | Conflict | DNI duplicado o conflicto de horarios |
| `500` | Internal Server Error | Error interno del servidor |

## Validaciones Implementadas

### Pacientes
- **DNI único**: No permite duplicados en creación/actualización
- **Fecha nacimiento**: Solo fechas pasadas
- **Campos requeridos**: Todos obligatorios en creación
- **Formatos**: DNI 7-8 dígitos, nombres 1-50 caracteres

### Turnos
- **Conflicto horarios**: No permite turnos simultáneos
- **Paciente existente**: Valida que el paciente exista
- **Fechas futuras**: Solo se permiten turnos futuros
- **Transiciones de estado**: Lógica de negocio estricta
- **Motivo**: Entre 3-200 caracteres
- **Estados válidos**: 'agendado', 'cancelado', 'completado'

## Lógica de Negocio

### Transiciones de Estado de Turnos
```
agendado → [cancelado, completado]
cancelado → [] (estado final)
completado → [] (estado final)
```

### Restricciones
- **No eliminar turnos completados**: Preserva historial médico
- **Un turno por horario**: Evita conflictos de agenda
- **DNI único**: Un paciente por documento
- **Fechas coherentes**: Nacimiento pasado, turnos futuros

## Estructura del Proyecto

```
src/
├── app.js                      # Configuración de Express
├── server.js                   # Punto de entrada y manejo de señales
├── controllers/
│   ├── PacienteController.js   # Controladores HTTP de pacientes
│   └── TurnoController.js      # Controladores HTTP de turnos
├── services/
│   ├── pacientes/              # Lógica de negocio pacientes
│   └── turnos/                 # Lógica de negocio turnos
├── repositories/
│   ├── PacienteRepository.js   # Acceso a datos pacientes
│   └── TurnoRepository.js      # Acceso a datos turnos
├── models/
│   ├── Paciente.js            # Modelo de paciente
│   └── Turno.js               # Modelo de turno
├── middleware/
│   ├── errorHandler.js         # Manejo global de errores
│   ├── validate.js            # Middleware de validación genérico
│   ├── pacienteValidation.js   # Validaciones específicas pacientes
│   └── turnoValidation.js     # Validaciones específicas turnos
├── schemas/
│   ├── pacienteSchemas.js     # Esquemas Joi para pacientes
│   └── turnoSchemas.js        # Esquemas Joi para turnos
├── routes/
│   ├── pacientes.js           # Rutas de pacientes
│   └── turnos.js              # Rutas de turnos
└── utils/
    └── createError.js         # Helper para crear errores
```

## Arquitectura en Capas

**Routes**: Define endpoints HTTP y aplica validaciones middleware  
**Controllers**: Coordina requests HTTP con servicios de negocio  
**Services**: Contiene lógica de negocio, reglas y validaciones complejas  
**Repositories**: Abstrae acceso a datos (memoria/DB), operaciones CRUD  
**Models**: Define estructura, comportamiento y métodos de entidades  

## Ejemplos de Uso Completos

### Flujo típico: Crear paciente y agendar turno

```bash
# 1. Crear paciente
curl -X POST http://localhost:3000/api/pacientes \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "María",
    "apellido": "García", 
    "dni": "87654321",
    "fechaNacimiento": "1985-03-20"
  }'

# 2. Agendar turno
curl -X POST http://localhost:3000/api/turnos \
  -H "Content-Type: application/json" \
  -d '{
    "pacienteId": "abc-123",
    "fechaHora": "2025-12-20T14:30:00.000Z",
    "motivo": "Control anual",
    "estado": "agendado"
  }'

# 3. Ver agenda del día
curl http://localhost:3000/api/turnos/fecha/2025-12-20

# 4. Completar el turno
curl -X PATCH http://localhost:3000/api/turnos/def-456 \
  -H "Content-Type: application/json" \
  -d '{"estado": "completado"}'
```

### Búsquedas y reportes

```bash
# Ver todos los turnos agendados
curl http://localhost:3000/api/turnos/estado/agendado

# Ver historial de un paciente 
curl http://localhost:3000/api/turnos/paciente/abc-123

# Ver agenda completa con estadísticas
curl http://localhost:3000/api/turnos
```

## Variables de Entorno

```bash
# .env
PORT=3000
NODE_ENV=development
LOG_LEVEL=info
CORS_ORIGIN=*
```

## Scripts Disponibles

```bash
npm start          # Producción
npm run dev        # Desarrollo con nodemon
npm run dev:babel  # Desarrollo con transpilación
npm run audit      # Auditoría de dependencias
```

## Dependencias Principales

```json
{
  "express": "^5.1.0",
  "joi": "^18.0.2", 
  "uuid": "^13.0.0",
  "dotenv": "^17.2.3",
  "winston": "^3.18.3",
  "compression": "^1.8.1",
  "cors": "^2.8.5",
  "helmet": "^7.2.0"
}
```

## Roadmap / Próximas Mejoras

- [ ] Implementación de base de datos (PostgreSQL/MongoDB)
- [ ] Sistema de autenticación y autorización
- [ ] Paginación en endpoints de listado
- [ ] Filtros avanzados y búsqueda por texto
- [ ] Notificaciones de turnos (email/SMS)
- [ ] Reportes y dashboard analítico
- [ ] Tests unitarios y de integración
- [ ] Documentación con Swagger/OpenAPI
- [ ] Dockerización del proyecto

## Licencia

Este proyecto está bajo la Licencia ISC. Ver el archivo `package.json` para más detalles.

---

**API completa para gestión médica con arquitectura escalable y buenas prácticas**
