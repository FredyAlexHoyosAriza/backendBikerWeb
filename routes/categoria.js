// Este es el manejador para las rutas de categoria
// Aqui '/categoria' es el factor comun

// Se crea un objeto router para almacenar todas las rutas de accion
const express = require('express');
const router = express.Router();

// const router = require('express').Router();

// Ahora se requiera llamar al controlador de categoria, para referenciar
// cada uno de sus metodos a diferentes rutas
const CategoryController = require('../controllers/CategoryController')

// A continuacion las diferentes rutas son guardadas en el objeto router.
// .post: Enruta las solicitudes HTTP POST a la ruta especificada con las
// funciones de devolución de llamada especificadas.

// private
// Metodos privados; se requieren permisos para usarlos

// public
// Metodos publicos, no se requieren permisos para usarlos

// A continuacion se definen los metodos de la ruta /categoria
router.post('/add', CategoryController.add)
// Los campos que se exportan en el archivo CategoryController, estan disponibles
// para ser usados en los archivos donde se importe el archivo CategoryController

router.get('/list', CategoryController.list)
router.put('/update', CategoryController.update)
router.put('/activate', CategoryController.activate)
router.put('/deactivate', CategoryController.deactivate)
router.delete('/delete', CategoryController.delete)

// Ahora se exporta el objeto router, para que las diferentes rutas almacenadas en este  
// sean accesibles desde otros sitios del proyecto
module.exports = router; // este archivo retorna router