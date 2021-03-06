// ========================================================================
// Importaciones Requeridas
// ========================================================================
var express = require('express');
var app = express();

var CentrosSalud = require('../schemas/CentroSalud.schema');
var ProfesionalesSalud = require('../schemas/ProfesionalSalud.schema');
var Usuarios = require('../schemas/Usuario.schema');


// ========================================================================
// Búsqueda General
// ========================================================================
app.get('/todo/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');

    //Gestiona las promesas (ES6)
    Promise.all([
            buscarCentrosSalud(busqueda, regex),
            buscarProfesionalesSalud(busqueda, regex),
            buscarUsuarios(busqueda, regex)
        ])
        .then(respuestas => {
            res.status(200).json({
                ok: true,
                mensaje: 'Búsqueda realizada con Éxito',
                centros: respuestas[0],
                profesionalessalud: respuestas[1],
                usuarios: respuestas[2]
            });
        });

});


// ========================================================================
// Búsqueda por Colección
// ========================================================================
app.get('/coleccion/:tabla/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda;
    var tabla = req.params.tabla;
    var regex = new RegExp(busqueda, 'i');
    var promesa;

    switch (tabla) {
        case 'centrossalud':
            promesa = buscarCentrosSalud(busqueda, regex);
            break;

        case 'profesionalessalud':
            promesa = buscarProfesionalesSalud(busqueda, regex);
            break;

        case 'usuarios':
            promesa = buscarUsuarios(busqueda, regex);
            break;

        default:
            return res.status(400).json({
                ok: false,
                mensaje: 'Las búsquedas habilitadas son: usuarios, profesionales de salud y centros de salud',
                error: { message: 'Criterios de Búsqueda No válidos' }
            });
    }
    promesa.then(data => {
        res.status(200).json({
            ok: true,
            mensaje: 'Búsqueda por Colección realizada con Éxito',
            [tabla]: data // entre llaves cuadradas es PROPIEDADES DE OBJETO COMPUTADAS
        });
    });

});

// ========================================
// Buscar Centros de Salud (retorna Promesa)
// ========================================
// function buscarCentrosSalud(busqueda, regex) {
//     return new Promise((resolve, reject) => {

//         CentrosSalud.find({ nombre_fantasia: regex })
//             .populate('fk_usuario', 'nombre appaterno apmaterno')
//             .exec((err, centros) => {
//                 if (!err) {
//                     resolve(centros);
//                 } else {
//                     reject('Error al cargar Centros de Salud', err);
//                 }
//             });

//     });
// }


function buscarCentrosSalud(busqueda, regex) {
    return new Promise((resolve, reject) => {

        CentrosSalud.find({ nombrefantasia: regex })
            .populate('fk_usuario', 'nombre appaterno apmaterno')
            .exec((err, centros) => {
                if (!err) {
                    resolve(centros);
                } else {
                    reject('Error al cargar Centros de Salud', err);
                }
            });

    });
}

// ========================================
// Buscar Usuarios en 2 columnas simultáneas (retorna Promesa)
// ========================================
function buscarUsuarios(busqueda, regex) {
    return new Promise((resolve, reject) => {

        Usuarios.find({}, 'nombre appaterno apmaterno email')
            .or([{ 'nombre': regex }, { 'appaterno': regex }, { 'apmaterno': regex }, { 'email': regex }])
            .exec((err, usuarios) => {
                if (!err) {
                    resolve(usuarios);
                } else {
                    reject('Error al cargar Usuarios', err);
                }
            });

    });
}


// ========================================
// Buscar Profesionales Salud (retorna Promesa)
// ========================================
function buscarProfesionalesSalud(busqueda, regex) {
    return new Promise((resolve, reject) => {

        ProfesionalesSalud.find({ nombre: regex }, (err, profesionalessalud) => {
            if (!err) {
                resolve(profesionalessalud);
            } else {
                reject('Error al cargar Profesionales de Salud', err);
            }
        });

    });
}

module.exports = app;