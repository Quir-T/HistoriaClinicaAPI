const { v4 : uuidv4 } = require('uuid');

class Paciente {
    constructor({ nombre, apellido, dni, fechaNacimiento, id = null }) {
        this.id = id || uuidv4();
        this.nombre = nombre;
        this.apellido = apellido;
        this.dni = dni;
        this.fechaNacimiento = fechaNacimiento; // Almacenamos fecha de nacimiento en lugar de edad

        this.createdAt = new Date().toISOString();
        this.updatedAt = new Date().toISOString();
    }

    update(data) {
        Object.assign(this, data);  //El método Object.assign() copia todas las propiedades enumerables de uno o más objetos fuente a un objeto destino. Devuelve el objeto destino.
        this.updatedAt = new Date().toISOString();
        return this; // ahorra tener que asignar los valores manualmente con this...
    }


    toJSON() {
        return {
            id: this.id,
            nombre: this.nombre,
            apellido: this.apellido,
            dni: this.dni,
            fechaNacimiento: this.fechaNacimiento,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };  
    }

    

   
}

module.exports = Paciente;