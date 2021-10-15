const models = require('../models');

// En el controlador se tienen 2 secciones; una privada y otra publica, para este
// controlador no se requiere la parte privada

// private

// public

// Exportar todo lo que este dentro de las llaves
module.exports = {

    add: async (req, res, next) => {

        try {

            let checkCode = await models.Articulo.findOne({ code: req.body.code });
            if (checkCode) {
                res.status(406).send({
                    message: 'El articulo ya habia sido registrado!'
                });
            } else {
                const reg = await models.Articulo.create(req.body);
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
            // El metodo populate se usa para poblar los datos de una coleccion con datos
            // de otra coleccion Aqui populate se usa para incluir en los filtros de
            // busqueda la categoria la cual por si misma ya es una coleccion
            // { categoria: new RegExp(searchValue, 'i') },
            const docs = await models.Articulo.find({
                $or: [
                    // Ahora searchValue solo debe tener coincidencias paraciales en los campos name, name y rol
                    // RegExp no permite argumentos de tipo Number
                    { name: new RegExp(searchValue, 'i') },
                    { description: new RegExp(searchValue, 'i') },
                    { code: new RegExp(searchValue, 'i') },
                ]
            })
            .populate('categoria', { name: 1, description: 1 })
            .sort({ creatredAt: -1 });
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

            const doc = await models.Articulo.findByIdAndUpdate(
                { _id: req.body._id },
                { description: req.body.description, code: req.body.code, categoria: req.body.categoria },
                { new: true }
            );

            if (doc) {
                res.status(200).json(doc);
            } else {
                res.status(406).send({
                    message: 'La categoria no existe!'
                });
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
            const doc = await models.Articulo.findByIdAndUpdate(
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
            const doc = await models.Articulo.findByIdAndUpdate(
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
            const doc = await models.Articulo.findByIdAndDelete(
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