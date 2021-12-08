// Lo primero que se requiere es la libreria
const mongoose = require('mongoose');
const { Schema } = mongoose;

// Se craa una instancia de la clase Schema
// Aqui se usan los SchemaTypes de Mongoose
const categorySchema = new Schema({
    // Desde nuestra BD podemos hacer validacion de los datos
    // Mongoose genera IDs automaticos
    name: {
        type: String,
        required: true, //'Category name is required'
        unique: true,
        lowercase: true,
        enum: ["herramientas", "deportes", "construcción", "plomería", "eléctricos", 'electrodomésticos', "hogar", "juguetería"] // enum ya que las categorias son fijas
        // ["ciclomotor", "cruiser", "scooter", "motocroos", "enduro", "chopper", "trial", 'super bike']
    },
    description: {
        type: String,
        required: true,
        maxlength: 255
    },
    state: {
        type: Number,
        default: 1, // activado
        enum: [0, 1]
    },
    createdAt: {
        type: Date,
        default: Date.now, // Guarda la fecha de generacion del registro
    }
})

// Se crea el Schema, luego se hace la migracion del esquema a un modelo y del modelo a la BD

// Ahora se necesita convertirlo a un modelo y exportarlo
// Este es el nombre que tiene la coleccion de categoria en todo el resto del proyecto
// Se ejecuta de mongoose el metodo model el cual generara el modelo de documento Categoria en
// la coleccion 'categoria'; los datos para generarla se obtienen del categorySchema.
const Categoria = mongoose.model('categoria', categorySchema);

// Nos permite usarlo en cualquier parte del proyecto
module.exports = Categoria;

