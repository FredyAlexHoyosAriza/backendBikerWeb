// Lo primero que se requiere es la libreria
const mongoose = require('mongoose');
const { Schema } = mongoose;

// Se craa una instancia de la clase Schema
// Aqui se usan los SchemaTypes de Mongoose
const articleSchema = new Schema({
    // Desde nuestra BD podemos hacer validacion de los datos
    // Mongoose genera IDs automaticos
    categoria: {
        type: Schema.ObjectId,
        ref: "categoria", // relacion por reerencia con la coleccion category
    },
    code: {
        type: String,
        required: true,
        unique: true,
        maxlength: 64,
    },
    name: {
        type: String,
        required: true, //'article name is required'
        lowercase: true,
    },
    description: {
        type: String,
        required: true,
        maxlength: 255
    },
    state: {
        type: Number,
        default: 1, // activado
        enum: [0, 1, 2]
    },
    createdAt: {
        type: Date,
        default: Date.now, // Guarda la fecha de generacion del registro
    }
})

// Se crea el Schema, luego se hace la migracion del esquema a un modelo y del modelo a la BD

// Ahora se necesita convertirlo a un modelo y exportarlo
// Este es el nombre que tiene la coleccion de usuario en todo el resto del proyecto
// Se ejecuta de mongoose el metodo model el cual generara el modelo de documento Categoria en
// la coleccion 'categoria'; los datos para generarla se obtienen del userSchema.
const Articulo = mongoose.model('articulo', articleSchema);

// Nos permite usarlo en cualquier parte del proyecto
module.exports = Articulo;