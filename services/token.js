var jwt = require('jsonwebtoken');
require('dotenv').config()

// Para que los metodos del modulo sean publicos
module.exports = {
    encode: async (user) => {
        // El objeto que se quiere La frase secreta es el string, el parametro que le sigue es el tiempo de expiracion o vigencia
        const token = jwt.sign({
            // id, name, id y rol se extraen de user, y conforman
            // el Payload por convencion se usan las mismas en user
            _id: user._id,
            name: user.name,
            email: user.email,
            rol: user.rol


        }, process.env.SECRET_JWT_SEED, { expiresIn: 86400});
        return token;
    }

    // 'llaveSecretaParaCodificarUsuario'

    // encode:,

    // relogin:,
    // Se genera un nuevo token sin necesidad de nueva autenticacion
}