// =====================================
// Importaciones Requeridas
// =====================================
var express = require('express');
var fileUpload = require('express-fileupload');
var app = express();

// Librerías de Node, NO necesitan instalación
const path = require('path');
var fs = require('fs');

//Default Options (Middleware)
app.use(fileUpload());


// Importacion Schemas
// var CentrosSalud = require('../schemas/CentroSalud.schema');
// var ProfesionalesSalud = require('../schemas/ProfesionalSalud.schema');
// var Usuarios = require('../schemas/Usuario.schema');


app.get('/:tipo/:img', (req, res, next) => {

    var tipoArchivo = req.params.tipo;
    var img = req.params.img;
    var pathImagen = path.resolve(__dirname, `../uploads/${tipoArchivo}/${img}`);

    //Valida Si existe archivo y devuelve la imágen
    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    } else {
        var pathNoImage = path.resolve(__dirname, '../assets/no-img.jpg');
        res.sendFile(pathNoImage);
    }

});


// GET con ruta /img
app.get('/img/:tipo/:img', (req, res, next) => {

    var tipoArchivo = req.params.tipo;
    var img = req.params.img;
    var pathImagen = path.resolve(__dirname, `../uploads/${tipoArchivo}/${img}`);

    //Valida Si existe archivo y devuelve la imágen
    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    } else {
        var pathNoImage = path.resolve(__dirname, '../assets/no-img.jpg');
        res.sendFile(pathNoImage);
    }

});


module.exports = app;