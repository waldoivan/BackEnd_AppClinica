// Requires (Importación de Librerías de Terceros para usar funcionalidades requeridas)(de este lado el código es Case Sensitive)
var express = require('express');
var mongoose = require('mongoose');
var colors = require('colors'); // activa uso de colores en consola de Node


// Inicializa Variables
var app = express();



// Conexion a la Base de Datos
mongoose.connect('mongodb://localhost:27017/DB_AppClinica', { useNewUrlParser: true }, (err, res) => {
    if (err) throw err;
    console.log('Base de Datos AppClinica: ', 'online'.green);
});



// Rutas
app.get('/', (request, response, next) => {
    response.status(200).json({
        ok: true,
        mensaje: 'Petición realizada al Servidor Recibida Correctamente'
    });

});



// Escuchar Peticiones
app.listen(3000, () => {
    console.log('Express Server Puerto 3000: ', 'online'.green);
});