const express = require('express'); //se indica que se requiere express
const app = express(); // se inicia express y se instancia en una constante de nombre app.
const morgan = require('morgan'); //se indica que se requiere morgan
var cors = require('cors') //es necesario hacer uso de cors para evitar problemas con los datos que lleguen de un lado para otro
app.use(cors())
    // settings
app.set('port', 3000); //se define el puerto en el cual va a funcionar el servidor
// Utilities
app.use(morgan('dev')); //se indica que se va a usar morgan en modo dev
app.use(express.json()); //se indica que se va a usar la funcionalidad para manejo de json de express
//Routes 

app.use(require('./rutas/control_quemas'));
app.use(require('./rutas/horario_quemas'));
app.use(require('./rutas/usuarios'));
app.use(require('./rutas/datosnodo'));

//Start server
app.listen(app.get('port'), () => {
    console.log("Servidor funcionando");
}); //se inicia el servidor en el puerto definido y se pone un mensaje en la consola.