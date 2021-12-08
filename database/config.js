const mongoose = require('mongoose');

mongoose.Promise = global.Promise; // Promesa en el contexto global
mongoose.connect(
    process.env.DB_CNN || 'mongodb://localhost:27017/portafolioBike', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('Database connected to Atlas!'))
    .catch((err) => console.log(err.message));
var dbConnection = mongoose.connection;

// const dbConnection = async () => {

//     try {
//         // Se busca una variable en el entorno que se llame DB_CNN
//         await mongoose.connect(process.env.DB_CNN, {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//         });

//         console.log('DB Online');


//     } catch (error) {
//         console.log(error);
//         throw new Error('Error a la hora de inicializar BD');
//     }


// }

module.exports = {
    dbConnection
}