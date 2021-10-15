// Aqui vendra toda la logica de validacion de los datos de usuario
// Abra conexion con la BD con los servicios y con el resto de paquetes
// que se requieran para poder generar correctamente un usuario

// Solo se requiere llamar a la carpeta models ya que esta cuenta con un
// index y el proyecto entiende que en este index esta la configuracion,
// sino se hubiese hecho de esta forma, entonces tendria que hacer 3 llamados:
// const usuario = require('../models/usuario')
// const categoria = require('../models/categoria')
// const articulo = require('../models/articulo')
// De esta forma asi se tuviesen 100 modelos solo se requerira llamar a models

const models = require('../models');
// bcriptjs es un paquete instaldo que permite encriptacion
const bcrypt = require('bcryptjs');

const token = require('../services/token')

// En el controlador se tienen 2 secciones; una privada y otra publica, para este
// controlador no se requiere la parte privada

// private

// public

// Exportar todo lo que este dentro de las llaves
module.exports = {
    // Para poder trabajar desde Postman se crean 2 metodos: add que agrega un usuario
    // y el metodo login para que un usuario se pueda autenticar. Estas funciones deben
    // ser asincronas, puesto que las consultas a la BD no son inmediatas y al tratarse
    // de un sistema externo se desconoce el tiempo de respuesta. Por ende, tarde un
    // tiempo, mientras el controlador pregunta a la BD si un usuario existe y esta
    // entrega una respuesta. Ademas todas las funciones de busqueda tendran un await
    // para que se espera mientres se busca al usuario. Asincrona que no entrega respuesta
    // inmediata y por ende la ejecucion de la aplicacion podria continuar, await para que
    // no continue y espere una respuesta. Normalmente los metodos asincronos se trabaja
    // con un try-catch
    // Al igual que con el manejador de rutas, los metodos asincronos tambien tienen:
    // request, response, y un metodo next, el cual permite avanzar en caso de error, o si
    // resolvemo nosotros, simplemente podemos hacer next para que la ejecucion continue
    add: async (req, res, next) => {
        // Para crear un usuario se necesita recibir la contraseña y encriptarla, para
        // esto se requiere el paquete bcriptjs, el cual permite generar una encriptacion
        // a traves de un hash, es decir que podremo encriptar los passwords
        try {
            // Debe existir un formulario de donde se envien los datos de usuario, las cuales
            // llegaran a traves del req (request). En el aplicativo se debe definir a traves
            // de que parte del request se deben enviar los datos del usuario. EL request tiene
            // 3 partes basicas: los params, los headers y el body. Los params se componen de:
            // el verbo o metodo, la ruta y la version http, ej. GET /background.png HTTP/1.0,
            // los datos no se envian puesto que quedarian publicos. Los headers se usan para
            // configuracion. El body o cuerpo de la peticion, es la parte mas razonable para
            // datos. Las peticiones llegan en el request, por ello para enviar los crear un
            // usuario se tienen diferentes opciones
            // 1) Revisar si el correo ya existe en BD, realizando una consulta.

            // Metodos de objetos models se encuentran en la documentacion de Mongoose:
            // https://mongoosejs.com/docs/queries.html
            // Cada una de estos o metodos o funciones retornan un objeto query de Mongoose
            // y reciben un objeto
            let checkEmail = await models.Usuario.findOne({ email: req.body.email });
            if (checkEmail) {
                res.status(406).send({
                    message: 'El ususario ya existe!'
                });
            } else {
                // Luego de verificar que el email no esta en BD, lo primero en realizar la
                // encriptacion de la contraseña. Se usa await puesto que el metodo de
                // encriptacion .hash del bcrypt tarda un poco.
                // Aparentemente el 10 corresponde a los ciclos de encriptacion
                req.body.password = await bcrypt.hash(req.body.password, 10);

                // Se guarda el contenido de req.body en un modelo (ducumento) de usuario
                // en la colleccion 'usuario' (BD). Ademas la promesa es guardada en reg.
                const reg = await models.Usuario.create(req.body);
                // Asumiendo que todo fue bien se envia codigo de peticion exitosa;
                // Este codigo viajaria de aqui al routes/usuario, luego al routes/index,
                // luego al index y hacia al front
                res.status(200).json(reg);
            }


        } catch (error) {
            // Codigo 500 -> error en el servidor: se intento hacer escritura en BD pero
            // ocurrio un error 
            res.status(500).send({ // tambien se podria enviar un archivo json
                // la informacion no debe ser muy delatora, Ej: 'Error en escritura a la BD'
                // es muy delator
                message: 'Ocurrio un error interno!'
            });
            // res.status(500).json(req.body);
            next(error); // Continua la ejecucion y nos muestra el error en consola
        }

    },

    login: async (req, res, next) => {
        // Inicialmente se verifica en la BD si el usuario existe
        // y ademas que tiene su estado activo
        try {
            // Se retorna el documento en la coleccion usuario cuyos atributos
            // conincidan con los especificados, en caso contrario se retorna null
            let checkUser = await models.Usuario.findOne({
                email: req.body.email,
                state: 1
            });
            // Nunca se debe ser muy explicito en cuanto a los errores para evitar
            // dar demasiada informacion a posibles atacantes
            if (checkUser) {
                let match = await bcrypt.compare(req.body.password, checkUser.password)
                if (match) {
                    // EL primer argumento es la data a encriptarse, el segundo es la llave de encriptacion.
                    // Encode puede tardar por ello se requiere el await. Un token no debe guardar contraseñas
                    // En un token informacion que puede ser requerida en el Front (Hola Fredy Bienvenido!!!)
                    // y tambien en validacion p. ej. de rol
                    let tokenReturn = await token.encode(checkUser);
                    res.status(200).json({ checkUser, tokenReturn })
                    // res.status(200).json({checkUser})
                } else {
                    res.status(401).send({
                        message: 'Usuario no autorizado!'
                    })
                }
            } else {
                res.status(404).send({
                    message: 'Usuario no encontrado o inactivo!'
                })
            }

        } catch (error) {
            res.status(500).send({ // tambien se podria enviar un archivo json
                // la informacion no debe ser muy delatora, Ej: 'Error en lectura a la BD'
                // es muy delator
                message: 'Ocurrio un error interno!'
            });
            next(error);
        }

    },

    list: async (req, res, next) => {
        try {
            // searchValue contendra el criterio de filtrado de los docs en la coleccion
            let searchValue = req.query.searchFilter;
            // .find retorna los documentos en la coleccion usuario cuyos atributos
            // conincidan con los especificados, sino existe ninguno se retorna null
            // .sort nos permite definir por que campo en el documento se hara la query.
            // En .find se puede agregar un filtro para traer o no un campo, p. ej. si no
            // deseo fechas: .find({creatredAt: 0, _id: 0}) asi los ducmentos traidos no
            // tendriann el campo createdAt ni el campo _id. Los docs pueden ser devuelto
            // con cierto con repecto al campo de organizacion en .sort, p. ej.
            // sort({creatredAt: -1}) devolveria docs en orden desc con respecto a la fecha,
            // 1 para orden asc (ver documentacion oficial). Tambien podriamos traer los docs
            // como esten y en el front realizar el ordenamiento, ya que el front se ejecuta
            // en el navegador de un equipo y posiblemente alli alla mas recursos de computo
            // que el servidor
            const docs = await models.Usuario.find({
                $or: [
                    // Ahora searchValue solo debe tener coincidencias paraciales en los campos email, name y rol
                    { name: new RegExp(searchValue, 'i') },
                    { email: new RegExp(searchValue, 'i') },
                    { rol: new RegExp(searchValue, 'i') }
                ]
            }).sort({ creatredAt: -1 }); // Ahora que se establecio que puede llegar un filtro
            // de busqueda que se usa en cualquiera de los campos: email, name, rol, si esto no
            // se envia, entonces la funcion no retorna nada puesto que queda esperando. Vale
            // decir que de esta forma find solo retorna coincidencias exactas, por ello se usa
            // la clase RegExp (expresion regular) que permite obtener resultados para coincidencias
            // parciales. Su constructor tiene 2 parametros de entrada: una cadena de busqueda y un tipo
            // de bandera que se aplica en la coincidencia, p. ej. 'i' es para coincidencias por inclusion,
            // esto permite que se encuentre la cadena de forma exacta o que esta este incluida en una
            // cadena mas grande. Pero si se le entrega un undefined (o null) en searchValue, implicaria
            // que no hay criterio de busqueda y se debe retornar toda la coleccion
            // Aqui no se filtra si los usuarios estan activos o inactivos, ya que la idea es
            // que esat gestion se realice desde el front.
            // Si todo va bien, devolvemos nuestro res.status junto con un array de objetos,
            // siendo estos el conjunto de docs de la consulta en formato json
            res.status(200).json(docs);

        } catch (error) {
            res.status(500).send({
                message: 'Ocurrio un error interno!'
            });
            next(error);
        }
    },

    update: async (req, res, next) => {
        try {
            // Se debe definir cuales seran los campos que pueden actualizarse
            // Puesto que el correo es unico, este no podra ser actualizado,
            // por ende podra cambiarse: name, password, rol

            // Se necesita obtener el usuario puesto que es necesario realizar
            // validacion del password

            // No se hacer una comparacion usando bcrypt match, pueto que bcrypt no permite comparar 2
            // cadenas encriptadas; bcrypt valida un string que el encripta contra una password encriptado,
            // y revisa si con el string que el eccripta se obtiene el mismos hash del password encriptado;
            // bcrypt.compare('passwordSinEncriptar', passwordEncriptadoBaseDeDatos), para comparar,
            // primero se encripta 'passwordSinEncriptar'

            let userPassword = req.body.password;
            const currentDoc = await models.Usuario.findOne({ email: req.body.email });
            // Si req.password !=== doc.password es por que se esta intentando cambiar
            // el password de usuario y por ende, iniclamente se debe realizar una
            // encriptacion sobre el nuevo password
            if (userPassword !== currentDoc.password) {
                req.body.password = await bcrypt.hash(req.body.password, 10);
                // Con el nuevo password ya encriptado se procede a actualizar el usuarrio
            }

            const doc = await models.Usuario.updateOne({ email: req.body.email }, {
                name: req.body.name,
                rol: req.body.rol,
                password: req.body.password,
                // email: req.body.email,  // No deberia cambiar al ser un campo unico al igul que _id
                // state: req.body.state, // hay metodos especifico para cambiar el state
            });

            // no se envie req.body como actualizacion, ya que se correria el riesgo de reemplazar
            // incluso los valores de los campos unicos como email y _id

            res.status(200).json(doc);

        } catch (error) {
            res.status(500).send({
                message: 'Ocurrio un error interno!'
            });
            next(error);
        }
    },

    activate: async (req, res, next) => {
        try {

            // Tanto el _id como el email con compaos unicos de los docs en usuario

            // findByIdAndUpdate encuentre el doc con el id especificado y acutaliza
            // el o los campos especificados. Este metodo require el parametro de busqueda
            // y ademas el parametro de acutalizacion
            // Nota: findOneAndUpdate retorna el documento previo a la actualizacion
            const doc = await models.Usuario.findByIdAndUpdate(
                {_id: req.body._id},
                { state: 1 },
                { new: true }
            );
            res.status(200).json(doc);

        } catch (error) {
            res.status(500).send({
                message: 'Ocurrio un error interno!'
            });
            next(error);
        }
    },

    deactivate: async (req, res, next) => {
        try {
            // findByIdAndUpdate({_id: req.body._id}, {state: 0}, {new: true});
            const doc = await models.Usuario.findByIdAndUpdate(
                {_id: req.body._id},
                { state: 0 },
                { new: true }
            );
            res.status(200).json(doc);

        } catch (error) {
            res.status(500).send({
                message: 'Ocurrio un error interno!'
            });
            next(error);
        }
    }
}