const express = require('express')
var morgan = require('morgan')
var cors = require('cors')
require('dotenv').config()
const { dbConnection } = require('./database/config');

const apiRouter = require('./routes');

const app = express();

app.use(morgan('dev'));
app.use(cors())

// Se configura el servidor app para permitir enviar y recibir respuestas tipo JSON y tipo urlencoded
// El parametro {extended: true} permite que la data de las peticiones pueda ser grande
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Se crea conexion con la BD
dbConnection;
// .use: Monta la función o funciones de middleware especificadas en la ruta especificada: la función de
// middleware se ejecuta cuando la base de la ruta solicitada coincide con la ruta.

// La peticion '/api' es recibida por el servidor principal app que la procesa
// con apiRouter
// Si en el servidor se encuentra la ruta '/api', entonces, usese el Router apiRouter
app.use('/api', apiRouter);
// Si se requiriera implementar, ademas de /api, otros manejadores se agregan de
// igual menera; agrupando en forma de factor comun, igual que hace el manejador /api

// Se activa la deteccion el el puerto PORT (4000) y se imprime en consola
app.listen(process.env.PORT, () => {
    console.log(`Running on http://localhost:${ process.env.PORT }`)
})