// user model

// Usamos esta ya que estamos trabajando con ES5
const mongoose = require('mongoose');

const { Schema } = mongoose;

let validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

// Se craa una instancia de la clase Schema, que definina
// la estructura de un documento en la coleccion usuario.
// Aqui se usan los SchemaTypes de Mongoose
const userSchema = new Schema({
    // Desde nuestra BD podemos hacer validacion de los datos
    // Mongoose genera IDs automaticos, por ello aqui no se definen IDs,
    // si se requiriera un ID particular, entonce lo genero yo
    name: {
        type: String,
        lowercase: true,
        required: 'User name is required', // true
        maxlength: 100,
        minlength: 1

    },
    email: {
        type: String,
        required: 'Email address is required', // true
        unique: true,
        maxlength: 100,
        // minlength: 10,
        trim: true, // elimina los espacio en blanco ingresados en la cadena email
        validate: [validateEmail, 'Please fill a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: true,
        // unique: true,
        // minlength: 6,
        maxlength: 100
    },
    state: {
        // Number y no Boolean puesto que tambien se podria tener los estados suspendido (2) o eliminado (3)
        type: Number,
        default: 1, // activado
        enum: [0, 1]
    },
    rol: {
        type: String,
        required: true,
        lowercase: true,
        // el ususario solo puede tener uno de estos roles, si se entrega otro rol, se tiene error en BD
        // y que pasa al modelo, luego al controlador y luego al front
        enum : ["gestor", "administrador"],
    },
    createdAt: {
        type: Date,
        default: Date.now, // Guarda la fecha de generacion del registro
        min: 11-10-2021,
    }
})

// Se crea el Schema, luego se hace la migracion del esquema a un modelo y del modelo a la BD

// Ahora se necesita convertirlo a un modelo y exportarlo
// Este es el nombre que tiene la coleccion de usuario en todo el resto del proyecto
// Se ejecuta de mongoose el metodo model el cual generara el modelo de documento Usuario en
// la coleccion 'usuario'; los datos para generarla se obtienen del userSchema.
const Usuario = mongoose.model('usuario', userSchema);


// Luego de creado solo necesitariamos exportarlo (ES5)
module.exports = Usuario; // Cuando se llama al archivo este se ejecuta y al final retorna Usuario
// Al parecer Usuario es un objeto tipo models (definido en Mongoose), que al momento de su
// creacion solo contiene la estructura o modelo de un documento

