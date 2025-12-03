# API CRUD - Gestión de Pacientes

API REST para la gestión de pacientes con arquitectura en capas, construida con Node.js y Express.js.

## Características

- Arquitectura en capas: Separación clara entre rutas, controladores, servicios y repositorios
- Validación robusta: Validación de datos con Joi (DNI, fechas, campos requeridos)
- Error handling avanzado: Sistema de manejo de errores con códigos HTTP apropiados
- DNI único: Validación de DNI único en creación y actualización
- Búsqueda por DNI: Endpoint específico para buscar pacientes por DNI
- Almacenamiento en memoria: Repositorio en memoria con Map (fácil migración a DB)
- UUIDs: Identificadores únicos para los pacientes
- Health check: Endpoint de monitoreo del servicio

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

## API Endpoints

### Base URL
```
http://localhost:3000
```

### Endpoints Disponibles

#### Health Check
```http
GET /health
```

#### Pacientes

##### Listar todos los pacientes
```http
GET /pacientes
```

**Respuesta exitosa (200):**
```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "nombre": "Juan",
    "apellido": "Pérez",
    "dni": "12345678",
    "fechaNacimiento": "1990-05-15",
    "createdAt": "2025-12-03T01:30:00.000Z",
    "updatedAt": "2025-12-03T01:30:00.000Z"
  }
]
```

##### Obtener paciente por ID
```http
GET /pacientes/{id}
```

##### Buscar paciente por DNI
```http
GET /pacientes/dni/{dni}
```

**Ejemplo:**
```http
GET /pacientes/dni/12345678
```

##### Crear nuevo paciente
```http
POST /pacientes
Content-Type: application/json

{
  "nombre": "Juan",
  "apellido": "Pérez", 
  "dni": "12345678",
  "fechaNacimiento": "1990-05-15"
}
```

**Validaciones:**
- `nombre`: Requerido, 1-50 caracteres
- `apellido`: Requerido, 1-50 caracteres  
- `dni`: Requerido, 7-8 dígitos, único en el sistema
- `fechaNacimiento`: Requerida, formato YYYY-MM-DD, fecha pasada

##### Actualizar paciente
```http
PATCH /pacientes/{id}
Content-Type: application/json

{
  "nombre": "Juan Carlos",
  "dni": "87654321"
}
```

##### Eliminar paciente
```http
DELETE /pacientes/{id}
```

### Códigos de Respuesta

| Código | Descripción |
|--------|-------------|
| 200 | OK - Operación exitosa |
| 201 | Created - Paciente creado |
| 400 | Bad Request - Datos inválidos |
| 404 | Not Found - Paciente no encontrado |
| 409 | Conflict - DNI ya existe |
| 500 | Internal Server Error |

**Formato de error:**
```json
{
  "error": "El DNI ya está registrado en el sistema",
  "status": "fail",
  "details": {
    "field": "dni",
    "value": "12345678"
  }
}
```

## Estructura del Proyecto

```
src/
├── app.js                  # Configuración de Express
├── server.js              # Punto de entrada
├── controllers/
│   └── PacienteController.js    # Controladores HTTP
├── services/
│   └── pacientes/              # Lógica de negocio
│       ├── CreatePacienteService.js
│       ├── GetPacienteByIdService.js
│       ├── GetPacienteByDniService.js
│       ├── ListPacienteService.js
│       ├── UpdatePacienteService.js
│       └── DeletePacienteService.js
├── repositories/
│   └── PacienteRepository.js    # Acceso a datos
├── models/
│   └── Paciente.js             # Modelo de datos
├── middleware/
│   ├── errorHandler.js         # Manejo de errores global
│   ├── validate.js            # Middleware de validación
│   └── pacienteValidation.js   # Validaciones específicas
├── schemas/
│   └── pacienteSchemas.js      # Esquemas de validación Joi
├── routes/
│   └── pacientes.js           # Definición de rutas
└── utils/
    ├── createError.js         # Helper de errores
    └── errors.js              # Clases de error (legacy)
```

### Arquitectura en Capas

**Routes**: Define endpoints HTTP y aplica validaciones  
**Controllers**: Coordina requests HTTP con servicios  
**Services**: Contiene lógica de negocio y reglas  
**Repositories**: Abstrae acceso a datos (memoria/DB)  
**Models**: Define estructura y comportamiento de entidades

## Ejemplos de Uso

```bash
# Crear paciente
curl -X POST http://localhost:3000/pacientes \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "María",
    "apellido": "García", 
    "dni": "87654321",
    "fechaNacimiento": "1985-03-20"
  }'

# Buscar por DNI
curl http://localhost:3000/pacientes/dni/87654321

# Listar todos
curl http://localhost:3000/pacientes

# Actualizar datos
curl -X PATCH http://localhost:3000/pacientes/{id} \
  -H "Content-Type: application/json" \
  -d '{"nombre": "María Elena"}'
```

## Validaciones Implementadas

### DNI Único
- Validación en creación: No permite DNI duplicados
- Validación en actualización: Permite cambiar DNI si no existe en otro paciente
- Formato: 7-8 dígitos numéricos

### Fechas
- Solo fechas pasadas (no futuras)  
- Formato ISO: YYYY-MM-DD
- Se almacena como string sin timestamp

### Campos Requeridos
- Todos los campos son requeridos en creación
- Actualizaciones permiten campos opcionales
- Validación de longitud en nombres y apellidos

## Configuración

### Variables de Entorno (.env)

```bash
PORT=3000
NODE_ENV=development
```

### Dependencies

```json
{
  "express": "^5.1.0",
  "joi": "^18.0.2", 
  "uuid": "^13.0.0",
  "dotenv": "^17.2.3"
}
```


## Scripts Disponibles

```bash
npm start          # Producción
npm run dev        # Desarrollo con nodemon
npm run dev:babel  # Desarrollo con transpilación
```

## Licencia

Este proyecto está bajo la Licencia ISC. Ver el archivo `package.json` para más detalles.

---

**Proyecto inicial para aprendizaje de API REST con Node.js**
