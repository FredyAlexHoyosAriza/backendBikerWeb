// Este es el manejador para las rutas de categoria
// Aqui '/categoria' es el factor comun

// Se crea un objeto router para almacenar todas las rutas de accion
const express = require('express');
const router = express.Router();

// const router = require('express').Router();

// Ahora se requiera llamar al controlador de categoria, para referenciar
// cada uno de sus metodos a diferentes rutas
const ArticleController = require('../controllers/ArticleController')

// A continuacion las diferentes rutas son guardadas en el objeto router.
// .post: Enruta las solicitudes HTTP POST a la ruta especificada con las
// funciones de devolución de llamada especificadas.

// private
// Metodos privados; se requieren permisos para usarlos

// public
// Metodos publicos, no se requieren permisos para usarlos

// A continuacion se definen los metodos de la ruta /categoria
router.post('/add', ArticleController.add)
// Los campos que se exportan en el archivo ArticleController, estan disponibles
// para ser usados en los archivos donde se importe el archivo ArticleController

router.get('/list', ArticleController.list)
router.put('/update', ArticleController.update)
router.put('/activate', ArticleController.activate)
router.put('/deactivate', ArticleController.deactivate)
router.delete('/delete', ArticleController.delete)

// Ahora se exporta el objeto router, para que las diferentes rutas almacenadas en este  
// sean accesibles desde otros sitios del proyecto
module.exports = router; // este archivo retorna router