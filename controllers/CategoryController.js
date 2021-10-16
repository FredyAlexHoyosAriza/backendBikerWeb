const models = require('../models');

// En el controlador se tienen 2 secciones; una privada y otra publica, para este
// controlador no se requiere la parte privada

// private

// public

// Exportar todo lo que este dentro de las llaves
module.exports = {

    add: async (req, res, next) => {

        try {

            let checkName = await models.Categoria.findOne({ name: req.body.name });
            if (checkName) {
                res.status(406).send({
                    message: 'La categoria ya existe!'
                });
            } else {
                const reg = await models.Categoria.create(req.body);
                res.status(200).json(reg);
            }

        } catch (error) {

            res.status(500).send({
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
            const docs = await models.Categoria.find({
                $or: [
                    // Ahora searchValue solo debe tener coincidencias paraciales en los campos name, name y rol
                    // RegExp no permite argumentos de tipo Number
                    { name: new RegExp(searchValue, 'i') },
                    { description: new RegExp(searchValue, 'i') },

                ]
            }).sort({ creatredAt: -1 }); // Ahora que se establecio que puede llegar un filtro
            // de busqueda que se usa en cualquiera de los campos: name, name, rol, si esto no
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


    listActive: async (req, res, next) => {
        // Regresa todas las docs en categoria cuyo estado es 1
        // y que se retornen orden descendente
        try {
            // Al ser un metodo asinccrono por precaucion debe
            // ir en un bloque try-catch
            const docs = await models.Categoria.find({ state: 1 })
                .sort({ createdAt: 1 }); // orden: -1 del el utlimo guardado al primero, 1 al contrario
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
            // Si se intenta dar un nuevo nombre a la categoria,
            // se verfica que este nombre no exista en la BD
            let check = await models.Categoria.findOne({ name: req.body.name });
            if (check) {
                if (check.description === req.body.description) {
                    res.status(406).send({
                        message: 'La categoria ya existe!'
                    });
                } else {
                    const doc = await models.Categoria.findByIdAndUpdate(
                        { _id: req.body._id },
                        { description: req.body.description },
                        { new: true }
                    );

                    if (doc) {
                        res.status(200).json(doc);
                    } else {
                        res.status(406).send({
                            message: 'La categoria no existe!'
                        });
                    }
                }

            } else {
                const doc = await models.Categoria.findByIdAndUpdate(
                    { _id: req.body._id },
                    { name: req.body.name, description: req.body.description },
                    { new: true }
                );

                if (doc) {
                    res.status(200).json(doc);
                } else {
                    res.status(406).send({
                        message: 'La categoria no existe!'
                    });
                }
            }

        } catch (error) {
            res.status(500).send({
                message: 'Ocurrio un error interno!'
            });
            next(error);
        }
    },

    activate: async (req, res, next) => {
        try {
            // Solo el _id es un campo unico de los docs en la coleccion categoria
            // Nota: por defecto findOneAndUpdate retorna el documento previo a la actualizacion
            const doc = await models.Categoria.findByIdAndUpdate(
                { _id: req.body._id },
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
            const doc = await models.Categoria.findByIdAndUpdate(
                { _id: req.body._id },
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
    },

    delete: async (req, res, next) => {
        try {
            const doc = await models.Categoria.findByIdAndDelete(
                req.body._id,
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