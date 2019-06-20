// Main Route (app)
var express = require('express');
var app = express();

app.get('/', (req, res, next) => {
    res.status(200).json({
        ok: true,
        mensaje: 'Petición Ruta Raiz-App realizada al Servidor Recibida Correctamente'
    });

});


module.exports = app;