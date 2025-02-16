const { Schema, model } = require('mongoose');

// Definición del esquema del modelo Usuario
const UsuarioSchema = new Schema({
    nombre: {
        type: String,
        required: true
    },
    cedula: {
        type: String,
        required: true
    },
    telefono: {
        type: String,
        required: false
    },
    estado: {
        type: Boolean,
        required: false
    },
    creado: {
        type: Date,
        default: Date.now
    },
    actualizado: {
        type: Date,
        default: Date.now
    }
});

// Exporta el modelo como 'Usuario'

module.exports = model('Usuario', UsuarioSchema);