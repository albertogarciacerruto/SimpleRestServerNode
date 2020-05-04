require('./config/config');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

//Parse para aplicacion de JSON
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//Habilitar la carpeta public para ser accesible desde cualquier lugar
app.use(express.static(path.resolve(__dirname, '../public')));
//Configuracion global de rutas
app.use(require('./routes/index'))

mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true }, (err, res) => {
    if (err) throw err;
    console.log('Base de Datos Activa');
})

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT);
});