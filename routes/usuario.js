// Este es el manejador para las rutas de usuario
// Aqui '/usuario' es el factor comun

// Se crea un objeto router para almacenar todas las rutas de accion

// Aqui se requiere el router de Express
const express = require('express');
// EL metodo Router devuelve un objeto tipo Router
const router = express.Router();

// Simplificando en una sola linea se tiene:
// const router = require('express').Router();

// Ahora se requiera llamar al controlador de usuario, para referenciar
// cada uno de sus metodos a diferentes rutas
const UserController = require('../controllers/UserController')

// A continuacion las diferentes rutas son guardadas en el objeto router 

// .post: Enruta las solicitudes HTTP POST a la ruta especificada con las funciones de devolución
// de llamada especificadas.

// private
// Metodos privados; se requieren permisos para usarlos

// A continuacion se define el metodo de la ruta
router.post('/add', UserController.add)
// Los campos que se exportan en el archivo UserController, estan disponibles para ser usados
// en los archivos donde se importe el archivo UserController

router.get('/list', UserController.list)
router.put('/update', UserController.update)
router.put('/activate', UserController.activate)
router.put('/deactivate', UserController.deactivate)

// public
// Metodos publicos, no se requieren permisos para usarlos

router.post('/login', UserController.login) // post se usa para escribir en router

// Ahora se exporta el objeto router, para que las diferentes rutas almacenadas en este  
// sean accesibles desde otros sitios del proyecto
module.exports = router; // este archivo retorna router