// Este es el manejador principal, que se conoce como el middleware de ruta, y se
// usara para poder hacer la gestion de p. ej.  la peticion '/api/user/login'

const express = require('express') // Esta instancia de express se mantiene virgen
var morgan = require('morgan')
var cors = require('cors')
const mongoose = require('mongoose')
const apiRouter = require('./routes'); // En routes por default se busca al index.js

const app = express(); // Esta instancia de express se modificara

app.use(morgan('dev'));
app.use(cors())

// Para peticiones tipo put y tipo post:

// Se configura el servidor app para permitir enviar y recibir respuestas tipo JSON y tipo urlencoded
// El parametro {extended: true} permite que la data de las peticiones pueda ser grande
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Se establece la conexion a la BD
// Una BD funciona como una promesa, es decir una funcion que en un momento indefinido dara una respuesta.
// Para no crear una async await, usaremos una promesa y le diremos a Mongo que funcionara como una promesa
mongoose.Promise = global.Promise; // Promesa en el contexto global
const urlDB = 'mongodb+srv://Fredy:susy10@cluster0.srszy.mongodb.net/BikerDB?retryWrites=true&w=majority';
mongoose.connect(urlDB || 'mongodb://localhost:27017/portafolioBike')
.then(mongoose => console.log('DB access in the 27017 port'))
.catch(err => console.log(err.message));

// mongoose.connection.on('connected', () => {
//     console.log('Mongoose is conected!!!!')
// });

// .use: Monta la función o funciones de middleware especificadas en la ruta especificada: la función de
// middleware se ejecuta cuando la base de la ruta solicitada coincide con la ruta.

// La peticion '/api' es recibida por el servidor principal app que la procesa
// con apiRouter
// Si en el servidor se encuentra la ruta '/api', entonces, usese el Router apiRouter
app.use('/api', apiRouter);
// Si se requiriera implementar, ademas de /api, otros manejadores se agregan de
// igual menera; agrupando en forma de factor comun, igual que hace el manejador /api

app.set('PORT', process.env.PORT || 3000)

// Se activacion la deteccion el el puerto PORT (3000) y se imprime en consola
app.listen(app.get('PORT'), () => {
    console.log(`Running on http://localhost:${app.get('PORT')}`)
} )

// module.exports = index;

// Para lanzar el servido ejecutamos node index.js, posteriormente damos click
// en el link para abrir el home o ruta raiz en la cual se tiene un manejador
// que imprime 'Hello Wonderfull World!'