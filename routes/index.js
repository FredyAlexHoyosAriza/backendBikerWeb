// Este es el manejador de rutas
// Que agrupa todas las rutas que existen en la peticion '/api'
// Por ende el '/api' seria en factor comun

// Aqui se requiere de un objeto router
// const router = require('express').Router();
// Aqui se requiere el router de Express
const express = require('express');
// EL metodo Router devuelve un objeto tipo Router
const router = express.Router();

// A continaucion se importa el archivo de rutas de usuario
const userRouter = require('./usuario');
const categoryRouter = require('./categoria');
const articleRouter = require('./articulo');



// Ahora se genera un manejador de rutas que permitira determinar
// una accion dependiendo de la ruta en el request, es decir, que
// si la ruta incluye '/usuario' se llama al manejador de rutas de
// de usuario, en el cual se llama al controlador de usuario. De
// forma equivalente si la ruta incluye '/categoria', etonces, se
// llama al manejador de rutas de categoria en el cual se llama al
// controlador de categoria...

// Solamente peticiones a /usuario se enviaran a userRouter
// Para la ruta '/usuario' usese el Router userRouter
router.use('/usuario', userRouter);
router.use('/categoria', categoryRouter);
router.use('/articulo', articleRouter);


// El router se exporta para que este disponible en todo el proyecto
module.exports = router; // Este archivo retorna este router